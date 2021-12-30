// Import React stuff
import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";

// Import utilities
import logo from "../../res/logo.ico";
import api from "../../utils/api";
import useStore from "../../utils/stores"

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
import DeptIcon from '@mui/icons-material/Groups';
import PersonIcon from "@mui/icons-material/Person";
import { IconButton } from "@mui/material";

// Import menu components for the person selection
import {Menu, MenuItem} from "@mui/material"

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

// Create the PersonMenu component to allow the user to select whose tasks they want to be able to view
function PersonMenu(){

  // Pieces of state for menu handling
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const menuOpen = Boolean(menuAnchorEl)

  // Piece of state to handle list of people
  const [people, setPeople] = useState([])

  // Get the function to set the global store for selected person
  const setSelectedPerson = useStore(state => state.setSelectedPerson)

  // The first time this component renders, make the call to the backend to get the list of people
  useEffect(() => api.get('/api/people')
    .then(response => { 
      setPeople(response.data ? response.data.rows : [])
    })
    .catch(err => console.log(err)), [])

  // Handle menu opening and closing by setting the menu anchor
  const openMenu = (event) => {
    setMenuAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setMenuAnchorEl(null)
  }

  // Handle setting a new selected person
  const setPerson = (personID, personName) => {
    setMenuAnchorEl(null)
    setSelectedPerson({ 'personID': personID, 'personName': personName })
  }

  return (
    <>
      {/* Create the button to open the menu */}
      <IconButton aria-label="Person" size="large" onClick={openMenu}>
        <PersonIcon />
      </IconButton>

      {/* Create the menu for selecting the user */}
      <Menu anchorEl={menuAnchorEl} open={menuOpen} onClose={handleMenuClose} MenuListProps={{ 'aria-labelledby': 'basic-button', }}>
        {/* Create a menu item that always exists for going back to viewing all tasks in the database */}
        <MenuItem key={-1} onClick={() => setPerson(-1, "All Tasks")}>All Tasks</MenuItem>
        {/* Map the list of people to menu items */}
        {people.map((row) => (
            <MenuItem key={row.PersonID} onClick={() => setPerson(row.PersonID, row.FirstName + " " + row.LastName)}>{row.FirstName + " " + row.LastName}</MenuItem>
          ))}
      </Menu>
    </>
  )
}

// Create the NavDrawer(sidebar) component
function NavDrawer() {
  const classes = useStyles();

  // Grab the piece of state for the selected person
  const selectedPerson = useStore(state => state.selectedPerson)

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
        {/* Generate the title and logo section and add a divider below it */}
        <div className={classes.logo}>
          <img className={classes.logoImg} alt={"logo"} src={logo} />
          <h3>Task Organizer</h3>
        </div>
        <Divider />

        {/* Create the list of buttons for each page and have them link to the proper endpoints */}
        <List>
          <Link to="/user-tasks" className={classes.link}>
            <ListItem button key="Tasks">
              <ListItemIcon>{<TaskListIcon />}</ListItemIcon>
              <ListItemText primary="User Tasks" />
            </ListItem>
          </Link>

          <Link to="/project" className={classes.link}>
            <ListItem button key="Project">
              <ListItemIcon>{<FolderIcon />}</ListItemIcon>
              <ListItemText primary="Project" />
            </ListItem>
          </Link>

          <Link to="/department" className={classes.link}>
            <ListItem button key="Department">
              <ListItemIcon>{<DeptIcon />}</ListItemIcon>
              <ListItemText primary="Department" />
            </ListItem>
          </Link>

          <Link to="/manage" className={classes.link}>
            <ListItem button key="Manage">
              <ListItemIcon>{<ManageIcon />}</ListItemIcon>
              <ListItemText primary="Manage" />
            </ListItem>
          </Link>

        </List>

        {/* Create the bottom section for user selection */}
        <div className={classes.bottomPush}>
          <div className={classes.bottomPushItems}>
            {PersonMenu()}
            <div>{selectedPerson.personName}</div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

export default withRouter(NavDrawer);
