import React, { useEffect } from "react";
import { animalEmojis } from "../../const";
import "./EmojiBubbles.css";

export function EmojiBubbles() {
  useEffect(() => {
    const container = document.getElementById("emoji-bubble-container");

    if (!container) return;

    const interval = setInterval(() => {
      const emoji = document.createElement("div");
      emoji.className = "emoji-bubble";
      emoji.textContent =
        animalEmojis[Math.floor(Math.random() * animalEmojis.length)];

      // Randomize position and size
      emoji.style.left = Math.random() * 100 + "vw";
      emoji.style.fontSize = Math.random() * 1.5 + 1 + "rem";

      container.appendChild(emoji);

      // Remove the emoji after the animation ends
      setTimeout(() => {
        container.removeChild(emoji);
      }, 4000); // Match the animation duration
    }, 500); // Adjust interval for frequency of bubbles

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div id="emoji-bubble-container" className="emoji-bubble-container"></div>
  );
}
