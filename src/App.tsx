import React from "react";
import { AppRoutes } from "./components/AppRoutes";
import { BrowserRouter as Router } from "react-router-dom";
import { JotaiProvider, MuiThemeProvider } from "./components/providers";
import { ReactQueryProvider } from "./components/providers/ReactQueryProvider";

function App() {
  return (
    <>
      <Router>
        <JotaiProvider>
          <ReactQueryProvider>
            <MuiThemeProvider>
              <AppRoutes />
            </MuiThemeProvider>
          </ReactQueryProvider>
        </JotaiProvider>
      </Router>
    </>
  );
}

export default App;
