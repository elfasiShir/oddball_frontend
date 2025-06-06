import { useState, useEffect } from "react";

import { phases } from "../../const";
import { apiCall } from "../../utils/api";
import { getWebSocket } from "../../utils/webSocket";
import { Copy, RefreshCcw } from "lucide-react";
import "./PlayerList.css";
import "../../App.css";

export function PlayerList({ setState, pin, gameRound }) {
  const [players, setPlayers] = useState([]);
  // Is game starting? show Loading.
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    // Fetch the player list from the server
    fetchPlayerList(pin, setPlayers);

    // Set up WebSocket connection to listen for player updates
    const socket = getWebSocket();

    // Listen for WebSocket messages
    socket.onmessage = (event) => {
      try {
        // Ignore non-JSON messages
        if (!event.data.startsWith("{")) return;

        const message = JSON.parse(event.data);
        if (message.action === "playerJoined") {
          console.log("Player joined:", message);
          fetchPlayerList(pin, setPlayers);
        } else if (message.action === "playerLeft") {
          console.log("Player left:", message);
          fetchPlayerList(pin, setPlayers);
        } else if (
          message.action === "lockSocket" ||
          message.action === "hostSocketLoading"
        ) {
          console.log("Game start loading:", message);
          setShowLoading(true);
        } else if (message.action === "unlockSocket") {
          // websocket is unlocked
          setShowLoading(false);
        } else if (message.action === "gameStarted") {
          console.log("Game started:", message);
          setShowLoading(false);
          setState(phases.Question);
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
      <div className="gameBody roomCode">
        <h2>Room code: {pin}</h2>
        <button
          className="copyButton"
          onClick={() => navigator.clipboard.writeText(pin)}
        >
          <Copy />
        </button>
      </div>
      <br />
      {showLoading ? (
        <div className="loading">
          <h2>Game is starting... </h2>
          <RefreshCcw className="loadingIcon" />
        </div>
      ) : (
        <button onClick={() => startGame(players)}>Everyone is here!</button>
      )}

      <div className="playerList">
        {players.map((player) => (
          <div className="player" key={player.guid}>
            <div
              className={`profile-pic playerProfile ${getRandomAnimation()}`}
            >
              {player.emoji}
            </div>
            <div className="playerName">{player.name} </div>
          </div>
        ))}
      </div>
    </>
  );
}

function startGame(players) {
  // Check if there are enough players to start the game
  if (players.length < 1) {
    // TODO: change to 3
    // TODO: pretty alert
    alert("Not enough players to start the game.");
    return;
  }
  // Send a message to websocket to handle game start
  const socket = getWebSocket();
  socket.send(
    JSON.stringify({
      type: "GameStart",
    })
  );
  // generate question and suss question, update db
  //after update websocket call "gameStarted"
}

async function fetchPlayerList(pin, setPlayers) {
  try {
    const players = await apiCall(`/getPlayerList/${pin}`, "GET");
    const playerData = await players.json();
    setPlayers(playerData);
  } catch (error) {
    console.error("Error fetching player list:", error);
  }
}

// Helper function to assign a random animation class
function getRandomAnimation() {
  const animations = ["wiggle", "jump", "spin", "flip"];
  return animations[Math.floor(Math.random() * animations.length)];
}
