Front end:
npm run dev # For Vite
npm start # For Create React App

Back end:
dotnet dev-certs https --trust

To run back end; run program.cs file

Nuget package:
dotnet add package Microsoft.EntityFrameworkCore.InMemory
dotnet add package Microsoft.AspNetCore.Diagnostics.EntityFrameworkCore
dotnet add package NSwag.AspNetCore #swagger ui

Color pallete:
https://flatuicolors.com/palette/us

Icons:
https://lucide.dev/
usage example:
import { Smile } from 'lucide-react';

function App() {
return <Smile size={24} color="black" />;
}

Countdown timer:
// npm install react-countdown-circle-timer
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

Sweet alert: https://sweetalert2.github.io/
npm install sweetalert2 sweetalert2-react-content

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

example:
const MySwal = withReactContent(Swal);

MySwal.fire({
title: <p>🎉 Congratulations!</p>,
html: <div>Your team won!<br />Get ready for the next round.</div>,
icon: 'success',
showConfirmButton: true,
});

Websocket:

listen to websocket:
wscat -c ws://localhost:5062/ws

AI create questions prompt:
game rules follows as such:
x players play the game x - 1 players receive question A
but 1 player will receive question B
the difference between question A and B is as follows
both question expect numerical answer only
example:
A: How many months passed since you last traveled abroad?
B: How many pets did you have?

the goal of the game is to identify the player who got the question B after all answers revealed (and not the questions given)

- Questions CANT ask about common knowledge
  example: you CANT ask how many days are in the week because
  the answer will always be 7, then any player who didnt type 7 will easily be identified as the one who got question B

- Questions should have around the same range of plausible answers. meaning as example you cant ask a question that can have 0-9000000 as numeric answer and another question that can only have 0-90 numeric answers
  like:
  A: at what age you had your favorite birthday.
  B: how many milliseconds passed since your birthday

generate QuestionA and questionB as json

QuestionA will be dubbed "question"
QuestionB will be dubbed "oddBallQuestion" as it will be the question given to 1 party member

like so:
[
{
"question": "How many months passed since you last traveled abroad?",
"oddBallQuestion": "How many pets did you have?"
}
]

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
