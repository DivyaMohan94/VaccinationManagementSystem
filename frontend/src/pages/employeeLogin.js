import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";
import { Navigate } from "react-router"
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import Navbar from "../components/navbar";
const utils = require("../utils/utilities");

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © ArrayIndexOutOfBounds    "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: `url(${process.env.PUBLIC_URL + 'aeroplane.jpeg'})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function EmployeeLogin() {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");  

  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();
    if (password === "" || email === "") {
      swal("Error", "Enter Details to Login", "error", {
        dangerMode: true,
      });
    } else {

      let data = {
        email: email,
        password: password
      }
      Axios.defaults.withCredentials = true;
      await Axios.post("/employee/login", data)
        .then((response) => {
          if (response.status === 200) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("isEmployee", true);
            utils.setLocalStorage(response.data);
            console.log(response.data);
            navigate("/flightManagement");
          } else if (response.status === 400) {
            setErrorMessage(response.data.message);
            swal("Error", errorMessage, "error", {
              dangerMode: true,
            });
          } else {
            console.log(response);
            swal("Error", errorMessage, "error", {
              dangerMode: true,
            });
          }
        })
        .catch((err) => {
          swal("Check your ID or Password", errorMessage, "error", {
            dangerMode: true,
          });
          console.log(err);
        });
    }
  };
  let redirectVar = null;
  if (utils.isLoggedIn()) {
    redirectVar = <Navigate to="/flightManagement" />
  }
  return (

    <>
      {redirectVar}
      <Navbar />
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image}
          sx={{

            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Employee Sign in
            </Typography>
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={(event) => {
                  event.preventDefault();
                  setEmail(event.target.value);
                }}
              />
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(event) => {
                  event.preventDefault();
                  setPassword(event.target.value);
                }}
              />              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign In
              </Button>
              <Box mt={5}>
                <Copyright />
              </Box>
            </form>
          </div>
        </Grid>
      </Grid>
    </>
  );
}