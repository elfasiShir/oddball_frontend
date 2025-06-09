Front end:
npm run dev # For Vite
npm start # For Create React App

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

# Toast message

https://react-hot-toast.com/docs

> npm install react-hot-toast

#Basic Usage

// In App.jsx or index.jsx
import { Toaster } from 'react-hot-toast';

function App() {
return (
<>
<Toaster position="top-right" />
{/* Your app code */}
</>
);
}

# Use the toast anywhere:

import toast from 'react-hot-toast';
function ExampleButton() {
return (
<button onClick={() => toast.success('Saved successfully!')}>
Save
</button>
);
}

# Customization Example

toast('This is a custom toast!', {
icon: '👏',
style: {
borderRadius: '10px',
background: '#333',
color: '#fff',
},
});

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
