import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";

console.log(">> initializing index in react");
const targetNode = document.getElementById("root");
console.log(">> initializing index in react", targetNode);

const root = ReactDOM.createRoot(targetNode);
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="164876143514-m3oj8ic5pt5h4iud0c968qd688ih7l49.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
