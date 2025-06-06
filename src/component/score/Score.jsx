import { useState, useEffect, use } from "react";
import { getWebSocket } from "../../utils/webSocket";
import { apiCall } from "../../utils/api.js";
import { phases } from "../../const";
import "./Score.css";

export function Score({ setState, playerGuid, gameRound, setGameRound }) {
  const [players, setPlayers] = useState([]);
  const [enableStartNewRound, setEnableStartNewRound] = useState(true);

  useEffect(() => {
    FetchPlayerScores(setPlayers, playerGuid);

    const socket = getWebSocket();
    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.action === "startingNewRound") {
          setEnableStartNewRound(false);
        }
        if (message.action === "gameStarted") {
          setGameRound((gameRound) => gameRound + 1);
          setEnableStartNewRound(true);
          setState(phases.Question);
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };
  }, [gameRound]);
  return (
    <>
      <div className="gameBody score-container">
        <div className="socre-title">Current score board:</div>
        <div className="score-list">
          {players.map((player, index) => (
            <div key={player.guid} className="score-player">
              <div className="score-player-emoji">{player.emoji}</div>
              <div className="score-player-name">{player.name}</div>
              <div
                className={`score-player-score ${
                  index === 0 && player.score > 0
                    ? "score-player-score-winner"
                    : ""
                }`}
              >
                {player.score}
              </div>
            </div>
          ))}
        </div>
        <div className="score-options">
          <button
            className="exit-game-button"
            onClick={() => window.location.reload(true)}
          >
            Exit game
          </button>
          {enableStartNewRound ? (
            <button className="new-round-button" onClick={() => NextRound()}>
              Another round
            </button>
          ) : (
            <div>Starting new round...</div>
          )}
        </div>
      </div>
    </>
  );
}

async function FetchPlayerScores(setPlayers, playerGuid) {
  try {
    // Fetch players
    const responce = await apiCall(`/getScoringPlayers/${playerGuid}`, "GET");
    const data = await responce.json();
    if (data) {
      console.log("Fetched players: ", data);
      setPlayers(data);
    }
  } catch (error) {
    console.error(error);
  }
}

function NextRound() {
  // advance the game to the next round
  const socket = getWebSocket();
  const message = {
    type: "NextRound",
  };
  socket.send(JSON.stringify(message));
}
