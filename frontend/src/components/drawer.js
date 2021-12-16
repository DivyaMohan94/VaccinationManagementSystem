import List from "@material-ui/core/List";
import { SwipeableDrawer } from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Box } from "@mui/system";
import { useState } from 'react';
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Divider } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 100,
  },
  drawerPaper: {
    width: 240,
  },
}));

export default function SidePan() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const isEmployeeLogin = localStorage.getItem("isEmployee");

  return (
    <>
      <CssBaseline />
      <IconButton onClick={() => setOpen(true)}>
        <MenuIcon style={{ fill: "white" }} />
      </IconButton>
      <SwipeableDrawer
        paddingLeft={10}
        className={classes.drawer}
        open={open}
        anchor="left"
        onClose={() => {
          setOpen(false);
        }}
        onOpen={() => {}}
      >
        <div>
          <Box textAlign="center" p={2}>
            Menus
          </Box>
          <Divider />
          <List>
            {isEmployeeLogin ? (
              <ListItem button component={Link} to="/flightManagement">
                Flight Management
              </ListItem>
            ) : (
              <>
                <ListItem
                  button
                  component={Link}
                  paddingLeft={10}
                  to="/dashboard"
                >
                  Dashboard
                  </ListItem>
                  {localStorage.getItem('admin') === "true" ? (<>
                    <ListItem button component={Link} to="/admin">
                      Admin
                    </ListItem>
                    </>):(<></>)
                  }
                <ListItem button component={Link} to="/appointment">
                  Appointment
                </ListItem>
                <ListItem button component={Link} to="/report">
                  Report
                </ListItem>
              </>
            )}
          </List>
        </div>
      </SwipeableDrawer>
    </>
  );
}
