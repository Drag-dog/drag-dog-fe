import React from "react";
import { AppRoutes } from "./components/AppRoutes";
import { BrowserRouter as Router } from "react-router-dom";
import { JotaiProvider, MuiThemeProvider } from "./components/providers";

function App() {
  return (
    <>
      <Router>
        <JotaiProvider>
          <MuiThemeProvider>
            <AppRoutes />
          </MuiThemeProvider>
        </JotaiProvider>
      </Router>
    </>
  );
}

export default App;
