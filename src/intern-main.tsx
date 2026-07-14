import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import InternApp from "./InternApp";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <InternApp />
  </StrictMode>,
);
