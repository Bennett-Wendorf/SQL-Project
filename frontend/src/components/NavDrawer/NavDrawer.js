import React from "react";
import { Link, withRouter } from "react-router-dom";
import "./NavDrawer.css";
import logo from "./logo.png";

// Import a bunch of mui components to help build the nav drawer
import { makeStyles } from "@mui/styles";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar"; 
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem"; 
import ListItemIcon from "@mui/material/ListItemIcon"; 
import ListItemText from "@mui/material/ListItemText";
import TaskListIcon from '@mui/icons-material/FormatListBulletedRounded';
import FolderIcon from '@mui/icons-material/FolderOpenRounded';
import ManageIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import { IconButton } from "@mui/material";
import { Grid } from "@mui/material"; 

// Define what we want the width of the drawer to be
const drawerWidth = 220;

// Generate css to style everything nicely
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  link: {
    textDecoration: "none",
    color: theme.palette.text.primary,
  },
  bottomPush1: {
    position: "fixed",
    bottom: 0,
    textAlign: "center",
    paddingBottom: 15,
  },
  bottomPush2: {
    position: "fixed",
    bottom: 0,
    textAlign: "center",
    paddingBottom: 45,
  },
  logoImg: {
    width: "30px",
    objectFit: "cover",
    marginRight: "20px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    padding: "5px",
    marginLeft: "16px",
    height: "64px",
  },
  notifcations: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    marginRight: "auto",
  },
  pageTitle: {
    paddingRight: "20px",
  },
}));

function NavDrawer(props) {
  const classes = useStyles();

  // Get the title of the app bar based on the current page
  const getTitle = () => {
    switch (props.location.pathname.slice(1)) {
      case "user-tasks":
        return "User Tasks";
      case "manage":
        return "Manage";
      case "project":
        return "Project";
      default:
        return "MCSM";
    }
  };

  // Build the actual JSX to build the nav drawer
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Grid item>
            <Typography className={classes.pageTitle} variant="h6" noWrap>
              {getTitle()}
            </Typography>
          </Grid>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div className={classes.logo}>
          <img className={classes.logoImg} alt={"logo"} src={logo} />
          <h3>Task Organizer</h3>
        </div>
        <Divider />

        <List>
          <Link to="/project" className={classes.link}>
            <ListItem button key="Project">
              <ListItemIcon>{<FolderIcon />}</ListItemIcon>
              <ListItemText primary="Project" />
            </ListItem>
          </Link>

          <Link to="/user-tasks" className={classes.link}>
            <ListItem button key="Tasks">
              <ListItemIcon>{<TaskListIcon />}</ListItemIcon>
              <ListItemText primary="User Tasks" />
            </ListItem>
          </Link>

          <Link to="/manage" className={classes.link}>
            <ListItem button key="Manage">
              <ListItemIcon>{<ManageIcon />}</ListItemIcon>
              <ListItemText primary="Manage" />
            </ListItem>
          </Link>

          <ListItem className={classes.bottomPush2}>
            <IconButton aria-label="notifications" size="large">
              <PersonIcon />
            </IconButton>
          </ListItem>

          <ListItem className={classes.bottomPush1}>
            <div>Am Programmr</div>
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}

export default withRouter(NavDrawer);
