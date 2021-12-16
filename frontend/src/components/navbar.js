import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useNavigate, Link } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ListItemText } from "@mui/material";
import SidePan from "./drawer";
import CurrentDateSelectorComponent from "./currentDateSelectorComponent";
import moment from "moment";

export default function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const login = localStorage.getItem("loggedIn");

  let history = useNavigate();
  const useLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    history("/");
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="relative" style={{ backgroundColor: "Black" }}>
          <Toolbar>
            <SidePan>
              <CssBaseline />
            </SidePan>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 55678 }}
              paddingLeft={2}
            >
              <Link style={{ color: "White" }} component={Link} to="/">
                Vaccination Management System
              </Link>
            </Typography>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>

            <Menu
              id="menu-appbar"
              style={{ color: "black" }}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {login ? (
                <>
                  <MenuItem onClick={useLogout}>
                    <ListItemIcon>
                      <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem>
                    <ListItemIcon>
                      <LoginIcon color="action" />
                    </ListItemIcon>
                    <ListItemText>
                      <Link to="/login">Login</Link>
                    </ListItemText>
                  </MenuItem>
                  {/*<MenuItem>
                    <ListItemIcon>
                      <HowToRegIcon />
                    </ListItemIcon>
                    <ListItemText>
                      <Link to="/register">Sign-Up</Link>
                    </ListItemText>
                 </MenuItem>*/}
                </>
              )}
            </Menu>
          </Toolbar>
          <div
            className="row"
            style={{
              color: "white",
              marginRight: "100px",
              justifyContent: "end",
            }}
          >
            {localStorage.getItem("loggedIn") ? (
              <>
                ({`Current Real Date: ${new Date().toLocaleDateString()}`}
                <br />
                {`Current Real Time: ${new Date().toLocaleTimeString()}`}
                <br />
                {`Selected Current Date: ${moment(
                  localStorage.getItem("currentDate")
                ).format("MM/DD/YYYY")}`}
                <CurrentDateSelectorComponent />
              </>
            ) : (
              <></>
            )}
          </div>
          {/* <div
            class="row"
            style="color: white;margin-right: 100px;justify-content: end;"
          >
            {`Current Real Time: ${new Date().toISOString()}`}
          </div> */}
        </AppBar>
      </Box>
    </>
  );
}
