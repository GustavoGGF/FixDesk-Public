import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import image from "./images/logos/logo.png";

window.REACT_APP_FAVICON_URL = image;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
