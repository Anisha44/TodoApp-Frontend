import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider> {/* Wrap the entire app in AuthProvider */}
   <Router>
   <App />

   </Router>
  </AuthProvider>
);
