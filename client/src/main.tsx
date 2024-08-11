import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializeFaro } from "@grafana/faro-web-sdk";
import { version } from "../../package.json";

if (process.env.ENV === "production") {
  initializeFaro({
    url: `https://gently-concise-dogfish.ngrok-free.app/faro-grafana/collect`,
    app: {
      name: "kacheri",
      version,
      environment: "web",
    },
  });
}

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <App />
  // </StrictMode>
);
