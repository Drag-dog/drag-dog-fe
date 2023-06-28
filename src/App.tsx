import React from "react";
import { AppRoutes } from "./components/AppRoutes";
import { BrowserRouter as Router } from "react-router-dom";
import { MuiThemeProvider } from "./components/providers/MuiThemeProvider";

function App() {
  return (
    <>
      <Router>
        <MuiThemeProvider>
          <AppRoutes />
        </MuiThemeProvider>
      </Router>
    </>
  );
}

export default App;
