import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Tuan7App from "./Tuan7App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Tuan7App />
  </StrictMode>
);
