// IMPORTANTE: Certifique-se de que este arquivo SÓ contenha este código.
// O ponto de entrada da sua aplicação, onde o router é configurado.

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// --- FIM do arquivo src/main.jsx ---
