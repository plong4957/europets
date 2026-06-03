import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { LangProvider } from "./context/LangContext";
import "./styles/admin/global.css";
import "./styles/admin/admin-shared.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <LangProvider>
      <App />
    </LangProvider>
  </BrowserRouter>
);
