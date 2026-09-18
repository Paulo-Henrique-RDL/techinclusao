import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./state/AuthProvider.jsx";
import { CourseProvider } from "./state/CourseProvider.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CourseProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CourseProvider>
    </AuthProvider>
  </StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      console.warn("techinclusao: não foi possível registrar o service worker.");
    });
  });
}
