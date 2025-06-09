import { useState, useEffect } from "react";
import { apiCall } from "../../utils/api.js";
import { getWebSocket } from "../../utils/webSocket";
import { phases, adjectives, animalNames, animalEmojis } from "../../const";
import { showCustomAlert } from "../../utils/customAlert.jsx";
import toast from "react-hot-toast";
import { Repeat, Play } from "lucide-react";
import "./JoinGame.css";

export function JoinGame({
  setState,
  socketGuid,
  playerName,
  setPlayerName,
  setPin,
  setPlayerGuid,
}) {
  const [showPinInput, setShowPinInput] = useState(false);
  const [PinInput, setPinInput] = useState("");
  const [animalEmoji, setAnimalEmoji] = useState(pickRandomEmoji());

  useEffect(() => {
    setPlayerName(generateAnimalName(adjectives, animalNames));
  }, []);

  return (
    <div className="join-container">
      <div className="join-card">
        <div className="name-box-container">
          <div className="name-section">
            <div className="name-box">
              <label className="name-label">And you are...</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="name-input"
              />
              <div
                onClick={() =>
                  setPlayerName(generateAnimalName(adjectives, animalNames))
                }
                className="reset-icon"
              >
                <Repeat size={20} color="white" />
              </div>
            </div>
            <div
              className="profile-pic emojiSelector"
              onClick={() => {
                setAnimalEmoji(pickRandomEmoji);
              }}
            >
              {animalEmoji}
            </div>
          </div>
        </div>

        <div className="actions">
          <button onClick={() => setShowPinInput(true)} className="action-btn">
            Join existing game
          </button>
          <button
            onClick={() =>
              InitGame(
                playerName,
                setState,
                setPin,
                animalEmoji,
                socketGuid,
                setPlayerGuid
              )
            }
            className="action-btn"
          >
            Host a game
          </button>
        </div>

        {showPinInput && (
          <div className="pin-input-container">
            <input
              placeholder="Enter PIN"
              onChange={(e) => setPinInput(e.target.value)}
              className="pin-input"
            />
            <div
              className="play-btn"
              onClick={() => {
                JoinExistingGame(
                  playerName,
                  setState,
                  PinInput,
                  animalEmoji,
                  setPin,
                  socketGuid,
                  setPlayerGuid
                );
              }}
            >
              <Play size={20} color="white" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

async function InitGame(
  playerName,
  setState,
  setPin,
  animalEmoji,
  socketGuid,
  setPlayerGuid
) {
  const newGame = {
    gameRound: 0,
    gameState: 0,
  };

  try {
    // Create a new game and get the game ID
    const game = await apiCall("/createGame", "POST", newGame);
    const gameData = await game.json();
    console.log("Game created:", gameData);
    setPin(gameData.pin);
    // Add player to the game
    const playerJson = {
      gameId: gameData.id,
      socketGuid: socketGuid,
      name: playerName,
      emoji: animalEmoji,
    };
    const player = await apiCall("/addPlayer", "PUT", playerJson);
    // if api call returns Results.BadRequest it means the game is already in session
    if (player.status === 400 || player.status === 409) {
      showCustomAlert("Game already in session", { icon: "error" });
      return;
    }
    const playerData = await player.json();
    console.log("Player added:", playerData);
    setPlayerGuid(playerData.guid);
    // Send message to the socket to update socket data with player data
    const socket = getWebSocket();
    socket.send(
      JSON.stringify({
        type: "PlayerAdded",
        gameId: gameData.id,
        playerId: playerData.id,
        playerGuid: playerData.guid,
      })
    );
    setState(phases.PlayerList);
  } catch (error) {
    console.error(error);
  }
}

async function JoinExistingGame(
  playerName,
  setState,
  PinInput,
  animalEmoji,
  setPin,
  socketGuid,
  setPlayerGuid
) {
  try {
    // first check if the pin exists
    const pin = PinInput.trim();
    const game = await apiCall(`/getGameByPin/${pin}`, "GET");
    const gameData = await game.json();
    if (!gameData) {
      showCustomAlert("Game doesn't exist", { icon: "error" });
      return;
    }
    // if gameState is not at waiting room, reject player
    if (gameData.gameState != 0) {
      showCustomAlert("Game already in session");
      return;
    }
    // Pin exists, set the pin in the state
    setPin(pin);
    const playerJson = {
      gameId: gameData.id,
      socketGuid: socketGuid,
      name: playerName,
      emoji: animalEmoji,
    };
    // Add player to the game
    const player = await apiCall("/addPlayer", "PUT", playerJson);
    const playerData = await player.json();

    console.log("Player added:", playerData);

    setPlayerGuid(playerData.guid);
    // Send message to the socket to update socket data with player data
    const socket = getWebSocket();
    socket.send(
      JSON.stringify({
        type: "PlayerAdded",
        gameId: gameData.id,
        playerId: playerData.id,
        playerGuid: playerData.guid,
      })
    );
    setState(phases.PlayerList);
  } catch (error) {
    console.error(error);
  }
}

function generateAnimalName(adjectives, animalNames) {
  return (
    adjectives[Math.floor(Math.random() * adjectives.length)] +
    " " +
    animalNames[Math.floor(Math.random() * animalNames.length)]
  );
}

function pickRandomEmoji() {
  const randomIndex = Math.floor(Math.random() * animalEmojis.length);
  return animalEmojis[randomIndex];
}
