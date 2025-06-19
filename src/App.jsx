import { useState, useEffect, useRef } from "react";
import {
  Title,
  JoinGame,
  PlayerList,
  Question,
  Vote,
  Score,
  EmojiBubbles,
} from "./component";
import { getWebSocket } from "./utils/webSocket";
import "./App.css";
import { phases, gradients } from "./const";
import { showCustomAlert } from "./utils/customAlert";
import { Check, X } from "lucide-react";
import { Toaster } from "react-hot-toast";

function App() {
  // State means the current phase of the game
  // phases are defined in const.js
  const [state, setState] = useState(phases.JoinGame);
  //  Player data
  const [playerName, setPlayerName] = useState("");
  const [playerGuid, setPlayerGuid] = useState("");
  // Game data
  const [pin, setPin] = useState("");
  const [gameRound, setGameRound] = useState(0);
  // WebSocket data
  const [socketGuid, setSocketGuid] = useState("");

  // init socket connection
  useEffect(() => {
    pickBackgroundColor();
    const socket = getWebSocket(); // init the WebSocket instance
    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.action === "init") {
          setSocketGuid(message.socketGuid);
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };
    return () => {
      socket.onmessage = null;
    };
  }, []);

  return (
    <>
      {/* Html Body */}
      <div className="card" style={{ minHeight: "100vh" }}>
        <div>
          <Title state={state}/>
        </div>
        <div>
            {state == phases.JoinGame && (
              <JoinGame
                setState={setState}
                socketGuid={socketGuid}
                playerName={playerName}
                setPlayerName={setPlayerName}
                setPin={setPin}
                setPlayerGuid={setPlayerGuid}
              />
            )}
          <div>
            {state == phases.PlayerList && (
              <PlayerList setState={setState} pin={pin} gameRound={gameRound} />
            )}
          </div>
          <div>
            {state == phases.Question && (
              <Question
                setState={setState}
                playerGuid={playerGuid}
                gameRound={gameRound}
              />
            )}
          </div>
          <div>
            {state == phases.Voting && (
              <Vote
                setState={setState}
                playerGuid={playerGuid}
                gameRound={gameRound}
              />
            )}
          </div>
          <div>
            {state == phases.ScoreBoard && (
              <Score
                setState={setState}
                playerGuid={playerGuid}
                gameRound={gameRound}
                setGameRound={setGameRound}
              ></Score>
            )}
          </div>
        </div>

        <EmojiBubbles />
      </div>

      {/* Custom Toast */}

      <Toaster
        position="bottom-right"
        toastOptions={{
          // Default styles for all toasts
          style: {
            background: "#333",
            color: "#fff",
            borderRadius: "8px",
            fontSize: "20px",
          },
          success: {
            icon: <Check size={40} color="white" />,
            style: {
              background: "#55efc4",
            },
          },
          error: {
            icon: <X size={40} color="white" />,
            style: {
              background: "#ff7675",
            },
          },
          foxEntity: {
            icon: "🦊",
            
          },
        }}
      />
    </>
  );
}

function pickBackgroundColor() {
  const randomGradient =
    gradients[Math.floor(Math.random() * gradients.length)];
  document.body.style.background = randomGradient;
}
export default App;
