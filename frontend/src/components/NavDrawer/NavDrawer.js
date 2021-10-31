import React from "react";
import { Link, withRouter } from "react-router-dom";
import "./NavDrawer.css";
import logo from "../../res/logo.ico";

// Import a bunch of mui components to help build the nav drawer
import { makeStyles } from "@mui/styles";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem"; 
import ListItemIcon from "@mui/material/ListItemIcon"; 
import ListItemText from "@mui/material/ListItemText";
import TaskListIcon from '@mui/icons-material/FormatListBulletedRounded';
import FolderIcon from '@mui/icons-material/FolderOpenRounded';
import ManageIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import { IconButton } from "@mui/material";

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
  bottomPush: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "flex-end",
    height: "100%",
  },
  bottomPushItems: {
    textAlign: "center",
    marginTop: "auto",
    marginBottom: "20px"
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
}));

function NavDrawer(props) {
  const classes = useStyles();

  // Build the actual JSX to build the nav drawer
  return (
    <div className={classes.root}>
      <CssBaseline />
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

        </List>
        <div className={classes.bottomPush}>
          <div className={classes.bottomPushItems}>
            {/* TODO: Make this into a <Menu /> */}
            <IconButton aria-label="notifications" size="large">
              <PersonIcon />
            </IconButton>
            <div>Am Programmr</div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

export default withRouter(NavDrawer);
