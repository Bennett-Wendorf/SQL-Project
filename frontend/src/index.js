// React stuff
import React from "react";
import ReactDOM from "react-dom";

// Css and app component
import "./index.css";
import App from "./App";

// Material ui theming stuff
import { ThemeProvider, StyledEngineProvider, createTheme } from "@mui/material/styles";
import { cyan, green } from "@mui/material/colors";

// Generate a new theme from mui in dark mode with primary color cyan and secondary color green
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: cyan,
    secondary: green,
  },
});

// Render the App component inside the theme provider from mui. This ensures the entire app is themed properly
ReactDOM.render(
  <div>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </StyledEngineProvider>
  </div>,
  document.getElementById("root")
);
