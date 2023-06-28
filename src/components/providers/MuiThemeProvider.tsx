import React from "react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme, responsiveFontSizes } from "@mui/material/styles";
import { configMuiBreakpoints } from "../../constants/config/configMuiBreakpoints";
import { configMuiComponents } from "../../constants/config/configMuiComponents";
import { configMuiPalette } from "../../constants/config/configMuiPalette";
import { configMuiTypography } from "../../constants/config/configMuiTypography";

let theme = createTheme({
  typography: { ...configMuiTypography },
  palette: { ...configMuiPalette },
  breakpoints: { ...configMuiBreakpoints },
  components: { ...configMuiComponents },
});

theme = responsiveFontSizes(theme);

export const MuiThemeProvider = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
);
