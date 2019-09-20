import React, { useState } from "react";

import { NavLink, Link } from "react-router-dom";
import { useAuth0 } from "../react-auth0-wrapper";
import Media from "react-media";
import MobileTabs from "./MobileTabs";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import SearchBar from "./SearchBar";

const useStyles = makeStyles(theme => ({
  navButton: {
    marginRight: theme.spacing(3),
    color: "#000"
  },
  title: {
    textAlign: "left",
    marginLeft: "20px",
    color: "#000"
  },
  navbar: {
    background: "#fff",
    flexGrow: 1,
    marginBottom: "2em",
    [theme.breakpoints.down("sm")]: {
      padding: "0",
      margin: "0",
      boxShadow: "none"
    }
  },
  log: {
    color: "#fff"
  },
  menu: {
    width: "2em",
    height: "2em",
    padding: "0"
  },
  signup: {
    marginRight: theme.spacing(3),
    color: "#3DB8B3"
  },
  titleLink: {
    flexGrow: 1,
    textDecoration: "none"
  },
  link: {
    textDecoration: "none"
  },
  tabs: {
    position: "fixed",
    marginTop: "3em"
  }
}));

const NavBar = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const [isOpen, setIsOpen] = useState(false);
  const toggleDrawer = open => event => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setIsOpen(!isOpen);
  };
  const classes = useStyles();

  const sideList = side => (
    <div
      role="presentation"
      onClick={toggleDrawer(side, false)}
      onKeyDown={toggleDrawer(side, false)}
    >
      <List>
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div>
      <AppBar className={classes.navbar} color="primary" position="sticky">
        <Toolbar>
          <Link to="/grants" className={classes.titleLink}>
            <Typography variant="h4" className={classes.title}>
              Founder Grants
            </Typography>
          </Link>
          <Media query="(min-width:800px)">
            <div>
              <NavLink to="/" className={classes.link}>
                <Button className={classes.navButton} color="inherit">
                  HOME
                </Button>
              </NavLink>
              <Button className={classes.navButton} color="inherit">
                ABOUT
              </Button>
              <NavLink to="/form" className={classes.link}>
                <Button className={classes.navButton} color="inherit">
                  Submit a Grant
                </Button>
              </NavLink>
              <NavLink className={classes.link} to="/">
                <Button className={classes.navButton} color="inherit">
                  SIGN UP
                </Button>
              </NavLink>

              {!isAuthenticated && (
                <Button
                  className={classes.log}
                  variant="contained"
                  color="primary"
                  onClick={() => loginWithRedirect({})}
                >
                  Log in
                </Button>
              )}

              {isAuthenticated && (
                <Button variant="outlined" onClick={() => logout()}>
                  Log out
                </Button>
              )}
            </div>
          </Media>
          <Media query="(max-width:800px)">
            {matches =>
              matches ? (
                <IconButton
                  className={classes.menu}
                  edge="start"
                  color="primary"
                  aria-label="menu"
                  onClick={toggleDrawer()}
                >
                  <MenuIcon className={classes.menu} />
                </IconButton>
              ) : null
            }
          </Media>

          <SwipeableDrawer
            anchor="right"
            open={isOpen}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
          >
            {sideList("right")}
          </SwipeableDrawer>
        </Toolbar>
      </AppBar>
      <SearchBar />
      <Media query="(max-width:850px)">
        {matches => (matches ? <MobileTabs /> : null)}
      </Media>
    </div>
  );
};

export default NavBar;
