import * as React from "react";
import { Link } from "react-router-dom";

import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import SpeedIcon from "@mui/icons-material/Speed";
import Toolbar from '@mui/material/Toolbar';

import './SideMenu.css';

const drawerWidth = 240;

export default function SideMenu() {
  return (
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "lightgrey"
          },
        }}
        variant="permanent"
        anchor="left"
        className="side-menu-container"
      >
        <Toolbar className="welcome-message"><b>WELCOME</b></Toolbar>
        <Divider />
        <List>
          <Link to="/" key="home">
            <ListItem key="home" disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
          </Link>

          <Link to="/students" key="student">
            <ListItem key="student" disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Student" />
              </ListItemButton>
            </ListItem>
          </Link>

          <Link to="/courses" key="courses">
            <ListItem key="courses" disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <AutoStoriesIcon />
                </ListItemIcon>
                <ListItemText primary="Courses" />
              </ListItemButton>
            </ListItem>
          </Link>

          <Link to="/results" key="result">
            <ListItem key="result" disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <SpeedIcon />
                </ListItemIcon>
                <ListItemText primary="Result" />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>
      </Drawer>
  );
}
