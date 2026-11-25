import "bootstrap/dist/css/bootstrap.min.css";
import "./app/styles/index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import { Provider } from "react-redux";
import { App } from "./app/App";
import { store } from "./app/store";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);

if ("serviceWorker" in navigator) {
  registerSW({ immediate: true });
}
