import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializeFaro } from "@grafana/faro-web-sdk";
import { version } from "../../package.json";

initializeFaro({
  url: "https://gently-concise-dogfish.ngrok-free.app/faro-grafana/collect",
  app: {
    name: "kacheri",
    version,
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
