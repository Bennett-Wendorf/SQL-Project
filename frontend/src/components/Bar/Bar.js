// React stuff
import React from "react";
import Children from 'react-children-utilities';

// MUI components
import { makeStyles } from "@mui/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

const drawerWidth = 220;

// Generate css to style everything nicely
const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
    },
    appBar: {
      [theme.breakpoints.up("sm")]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    pageTitle: {
      paddingRight: "20px",
      marginLeft: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    buttons: {
      minWidth: "250px",
    }
  }));

// Create the bar component to be used on every page
function Bar(props) {
    const classes = useStyles();

    // Filter out children with proper justification
    const leftChildren = Children.filter(props.children, (child) => child.props.justify === "left")
    const rightChildren = Children.filter(props.children, (child) => child.props.justify === "right")

    // Return the JSX necessary to create the bar, with leftChildren to the left of the title and rightChildren to the right
    return (
      <Box className={classes.root} sx={{ flexGrow: 1 }}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
                <div className={classes.buttons}>
                  {leftChildren}
                </div>
                <Typography className={classes.pageTitle} variant="h6" noWrap sx={{ flexGrow: 1 }}>
                    {props.title}
                </Typography>
                <div className={classes.buttons}>
                  {rightChildren}
                </div>
            </Toolbar>
        </AppBar>
      </Box>
    )
}

export default Bar;
