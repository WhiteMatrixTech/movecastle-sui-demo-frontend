import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { WalletProvider } from "@suiet/wallet-kit";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "@suiet/wallet-kit/style.css";
import "./index.css";
import "react-circular-progressbar/dist/styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WalletProvider>
      <App />
      <ToastContainer />
    </WalletProvider>
  </React.StrictMode>
);
