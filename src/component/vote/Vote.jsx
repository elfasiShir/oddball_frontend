import { useState, useEffect, use } from "react";
import { getWebSocket } from "../../utils/webSocket";
import { apiCall } from "../../utils/api.js";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { showCustomAlert } from "../../utils/customAlert.jsx";
import { phases } from "../../const";
import "./Vote.css";

export function Vote({ setState, playerGuid, gameRound }) {
  const [mostAskedQuestion, setMostAskedQuestion] = useState("");
  const [players, setPlayers] = useState([]);
  const [showClock, setShowClock] = useState(true);
  const [enableVoting, setEnableVoting] = useState(true);

  useEffect(() => {
    FetchMostAskedQuestion(setMostAskedQuestion, playerGuid);
    FetchVotingPlayers(setPlayers, playerGuid);
    const socket = getWebSocket();
    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.action === "updateVotingPlayersList") {
          FetchVotingPlayers(setPlayers, playerGuid);
        }
        if (message.action === "oddBallPlayerLeft") {
          showCustomAlert(
            "The odd ball player has left the game. Ending round"
          );
          setState(phases.ScoreBoard);
        }
        if (message.action === "calculatingVotes") {
          setShowClock(false);
          setEnableVoting(false);
        }
        if (message.action === "oddBallPlayerWasCaught") {
          showCustomAlert(
            "odd ball player was cought! moving to scoring phase"
          );
          setShowClock(true);
          setEnableVoting(true);
          setState(phases.ScoreBoard);
        }
        if (message.action === "oddBallPlayerEscaped") {
          showCustomAlert(
            "odd ball player has escaped! moving to scoring phase"
          );
          setShowClock(true);
          setEnableVoting(true);
          setState(phases.ScoreBoard);
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };
    // Cleanup WebSocket listener on component unmount
    return () => {
      socket.onmessage = null;
    };
  }, [gameRound]);

  return (
    <>
      <div className="gameBody vote-container">
        <div className="vote-instruction">
          <div className="countdown-container">
            {showClock ? (
              <CountdownCircleTimer
                isPlaying
                size={80}
                duration={80}
                colors={["#81ecec", "#fab1a0", "#ff7675"]}
                colorsTime={[190, 15, 0]}
                onComplete={() => {
                  CountDownHandleComplete();
                  return { shouldRepeat: false };
                }}
              >
                {({ remainingTime }) => <div>{remainingTime}</div>}
              </CountdownCircleTimer>
            ) : (
              <div>Collating votes...</div>
            )}
          </div>
          Most of you were asked:
          <div className="vote-question">"{mostAskedQuestion}"</div>
          But one of you got a different question... Who was it?
        </div>
        <div className="vote-list">
          {players.map((player) => (
            <div
              key={player.guid}
              className="vote-option"
              onClick={() => {
                if (enableVoting) {
                  PlayerVoted(player.guid);
                }
              }}
            >
              <div className="vote-player">
                <div className="vote-player-emoji">{player.emoji}</div>
                <div className="vote-player-name">{player.name}</div>
              </div>
              <div className="vote-player-answer">
                answered: "{player.answer}"
              </div>
              <div className="vote-player-score">Score: {player.score}</div>
              <div className="was-voted-by">
                {players
                  .filter((voter) => voter.votedForGuid === player.guid)
                  .map((voter) => (
                    <div key={voter.guid} className="was-voted-by-emoji">
                      {voter.emoji}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function PlayerVoted(votedForGuid) {
  // Send the vote to the websocket server
  const socket = getWebSocket();
  const message = {
    type: "playerVote",
    votedForGuid: votedForGuid,
  };
  socket.send(JSON.stringify(message));
}
function CountDownHandleComplete() {
  const socket = getWebSocket();
  const message = {
    type: "voteCountDownDone",
  };
  socket.send(JSON.stringify(message));
}
async function FetchMostAskedQuestion(setMostAskedQuestion, playerGuid) {
  try {
    // Fetch the most asked question from the server
    const response = await apiCall(
      `/getMostAskedQuestion/${playerGuid}`,
      "GET"
    );
    const data = await response.json();
    if (data) {
      setMostAskedQuestion(data);
    }
  } catch (error) {
    console.error(error);
  }
}
async function FetchVotingPlayers(setPlayers, playerGuid) {
  try {
    // Fetch the list of players who are voting
    const response = await apiCall(`/getVotingPlayers/${playerGuid}`, "GET");
    const data = await response.json();
    if (data) {
      console.log("Fetched voting players:", data);
      setPlayers(data);
    }
  } catch (error) {
    console.error(error);
  }
}
