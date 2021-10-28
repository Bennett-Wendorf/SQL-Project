import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ThemeProvider, StyledEngineProvider, createTheme } from "@mui/material/styles";
import { cyan, green } from "@mui/material/colors";
import { Provider } from "react-redux";
import store from "./app/store";

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: cyan,
    secondary: green,
  },
});

ReactDOM.render(
  <Provider store={store}>
    <div>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </StyledEngineProvider>
    </div>
  </Provider>,
  document.getElementById("root")
);
