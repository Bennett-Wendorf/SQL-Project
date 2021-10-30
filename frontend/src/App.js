// Do some necessary imports for React to function properly
import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

// Import Page component definitons
import { UserTasks, Project, Manage } from "./pages";

// Import css for this component
import "./App.css";

// Import the NavDrawer component so it can be rendered
import NavDrawer from "./components/NavDrawer/NavDrawer";

// Import material UI stuff
import { makeStyles } from "@mui/styles";

// Generate some themeing for this component
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },

  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(2),
  },

  toolbar: theme.mixins.toolbar,
}));

// Build the JSX to export for this component. This defines how the entire app is structured
function App() {
  const classes = useStyles();

  return (
    <Router>
      <div className={classes.root}>
        <NavDrawer />
        <div className={classes.content}>
          <div className={classes.toolbar} />
          <Switch>
            <Redirect exact from="/" to="project" />
            <Route path="/manage">
              <Manage />
            </Route>
            <Route path="/user-tasks">
              <UserTasks />
            </Route>
            <Route path="/project">
              <Project />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
