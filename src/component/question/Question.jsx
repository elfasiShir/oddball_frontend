import { useState, useEffect } from "react";
import { getWebSocket } from "../../utils/webSocket";
import { apiCall } from "../../utils/api.js";
import { phases } from "../../const";
import { showCustomAlert } from "../../utils/customAlert.jsx";
import "./Question.css";

export function Question({ setState, playerGuid, gameRound }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [numberOfPlayers, setNumberOfPlayers] = useState(0);
  const [currentReadyPlayers, setCurrentReadyPlayers] = useState(0);
  const [foxMessage, setFoxMessage] = useState(null);
  const [isFoxEntityAvailable, setIsFoxEntityAvailable] = useState(false);
  const [pauseReady, setPauseReady] = useState(false);
  const [cheaterPlayers, setCheaterPlayers] = useState([]);
  const [isCheater, setIsCheater] = useState(false);

  useEffect(() => {
    GetPlayerQuestion(playerGuid, setQuestion);
    initPlayerReadyness(playerGuid, setCurrentReadyPlayers, setNumberOfPlayers);
    setIsFoxEntityAvailable(true);

    const socket = getWebSocket();
    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.action === "updatePlayersReadyness") {
          console.log("updatePlayersReadyness", message);
          setCurrentReadyPlayers(message.data.readyPlayerCount);
          setNumberOfPlayers(message.data.playerCount);
        }
        if (message.action === "playerCheatingStarted") {
          // some player has used the fox entity
          setIsFoxEntityAvailable(false);
          setPauseReady(true);
        }
        if (message.action === "foxMessage") {
          // the fox entity has sent a message
          setFoxMessage(message.data.FoxMessage);
        }
        if (message.action === "cheaterResults") {
          // Cheating results from the server
          console.log("Cheater results received:", message.data);
          setCheaterPlayers(message.players);
          setIsCheater(true);
        }
        if (message.action === "playerCheatIsDone") {
          // some player has finished using the fox entity
          setPauseReady(false);
        }
        if (message.action === "playerLeft") {
          initPlayerReadyness(
            playerGuid,
            setCurrentReadyPlayers,
            setNumberOfPlayers
          );
        }
        if (message.action === "oddBallPlayerLeft") {
          showCustomAlert(
            "The odd ball player has left the game, moving to ScoreBoard."
          );
          setIsReady(false);
          setAnswer(false);
          setFoxMessage(null);
          setIsCheater(false);
          setCheaterPlayers([]);
          setIsFoxEntityAvailable(false);
          setState(phases.ScoreBoard);
        }
        if (message.action === "allPlayersReady") {
          console.log("allPlayersReady", message);
          setIsReady(false);
          setAnswer(false);
          setFoxMessage(null);
          setIsCheater(false);
          setCheaterPlayers([]);
          setIsFoxEntityAvailable(false);
          setState(phases.Voting);
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };
    // Cleanup function to remove the event listener
    return () => {
      socket.onmessage = null;
    };
  }, [gameRound]);

  return (
    <>
      {foxMessage && (
        <div className="gameBody fox-entity-body">
          <div className="fox-message">
            <div className="fox-emoji">🦊 Hey there~</div>
            <div className="fox-text">{foxMessage}</div>
          </div>
        </div>
      )}
      <div className="gameBody question-body">
        <div className="question">{question}</div>
        <br />
        <div className="answer-container">
          <input
            className="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button
            className={`action-btn question-btn ${
              isReady ? "ready" : "not-ready"
            }`}
            onClick={() => playerReady(isReady, setIsReady, answer)}
            disabled={pauseReady} // Disable button when pauseReady is true
          >
            {pauseReady ? "🦊" : isReady ? "Not Ready" : "I'm Ready"}
          </button>
          <div className="ready-players">
            {currentReadyPlayers}/{numberOfPlayers}
          </div>
        </div>
        <div className="cheat-container">
          {isFoxEntityAvailable && (
            <>
              <button
                className="question-cheat-button"
                onClick={() => playerCheats(setIsFoxEntityAvailable)}
              >
                🦊 Cheat
              </button>
            </>
          )}
        </div>
      </div>
      {isCheater && (
        <div className="gameBody cheater-body">
          <div className="cheater-message">
            <div>🦊 Good luck babe~ </div>
            <div className="cheater-message-player-list">
              {cheaterPlayers.map((player, index) => (
                <div className="gameBody cheater-message-player" key={index}>
                  {player.Emoji} {player.Name}: "{player.Question}"
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
async function initPlayerReadyness(
  playerGuid,
  setCurrentReadyPlayers,
  setNumberOfPlayers
) {
  const data = await apiCall(`/initPlayerReadynessList/${playerGuid}`, "GET");
  const readyPlayerCountData = await data.json();
  setCurrentReadyPlayers(readyPlayerCountData.readyPlayerCount);
  setNumberOfPlayers(readyPlayerCountData.playerCount);
}

function playerReady(isReady, setIsReady, answer) {
  // Verify answer is a number string

  if (answer === "") {
    showCustomAlert("Please enter an answer before proceeding.", {
      icon: "error",
    });
    return;
  }
  if (isNumericString(answer) === false) {
    showCustomAlert("Answer needs to be a number.", {
      icon: "error",
    });
    return;
  }

  // send player ready status to server
  const socket = getWebSocket();
  const message = {
    type: "playerReady",
    isReady: !isReady,
    answer: answer,
  };
  setIsReady(!isReady);
  socket.send(JSON.stringify(message));
}
function playerCheats(setIsFoxEntityAvailable) {
  const socket = getWebSocket();
  const message = {
    type: "playerCheats",
  };
  setIsFoxEntityAvailable(false);
  socket.send(JSON.stringify(message));
}
async function GetPlayerQuestion(playerGuid, setQuestion) {
  // given player guid db will return a question
  const question = await apiCall(`/getPlayerQuestion/${playerGuid}`, "GET");
  const questionData = await question.json();
  setQuestion(questionData);
}

function isNumericString(str) {
  return !isNaN(str.trim()) && str.trim() !== "";
}
