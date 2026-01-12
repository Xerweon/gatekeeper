import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./components/ThemeProvider";
import UpdateChecker from "./components/UpdateChecker";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <UpdateChecker />
      <App />
      <Toaster theme="dark" position="bottom-right" />
    </ThemeProvider>
  </React.StrictMode>,
);
