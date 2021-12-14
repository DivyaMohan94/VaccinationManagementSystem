import React, {useRef} from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import GoogleLogin from "react-google-login";
//import image from "./splitwise.png";
import { useState } from "react";

import Axios from "axios";

import  {useNavigate, Link}  from "react-router-dom";

//import { useDispatch } from "react-redux";
import swal from "sweetalert";
import Navbar from "../components/navbar";

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
    //backgroundImage: `url(${image})`,
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
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

export default function Login() {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [stageotp, setOTP] = useState(false);
  const navigate = useNavigate();

  //const dispatch = useDispatch();
  const responseGoogle = async (resp) => {
    console.log(resp);
    Axios.defaults.withCredentials = true;
    Axios.post("http://localhost:8080/user/getGoogle", {
        email: resp.profileObj.email,
        fname: resp.profileObj.givenName,
        lname: resp.profileObj.familyName,
        gid: resp.profileObj.googleId
      }).then((response) => {
        if(response.status === 200){
          localStorage.setItem("email", response.data.emailId)
          localStorage.setItem("mrn", response.data.mrn)
          setOTP(true)
        }
      })
  }

  const onCancelOTP = (e) => {
    console.log("Clearing")
    setOTP(false);
  }
  const onSubmitOtp = (e) => {
    if(otp === "") {
      swal("Eror", "Empty OTP", "error", {
        dangerMode: true,
    });
    }
    else {
      Axios.defaults.withCredentials = true;
      Axios.post("http://localhost:8080/user/validateOtp", {
        email: localStorage.getItem("email"),
        mrn: localStorage.getItem("mrn"),
        otp: otp,
      }).then((response) => {
        if(response.status === 200) {
          navigate("/register")
        }
        else {
          swal("Eror", "OTP verification failed", "error", {
            dangerMode: true,
        });
        }
      })
    }
  }
  const handleSubmit = (e) => {
    debugger;
    e.preventDefault();
    if (password === "" || email === "") {
      swal("Error", "Enter Details to Login", "error", {
        dangerMode: true,
      });
    } else {
      Axios.defaults.withCredentials = true;
      Axios.post("http://localhost:8080/user/login", {
        email: email,
        password: password,
      })
        .then((response) => {
          if (response.status === 200) {

            navigate("/home");
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

  return (
      
      <> 
      {console.log(stageotp)}
      <Navbar/>
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
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
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={stageotp}
            >
              Sign In
            </Button>
            <GoogleLogin
              clientId="664857607032-ok389vi4jghphm7t69trrq8vc0hdeagj.apps.googleusercontent.com"
              fullWidth
              buttonText="Login"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={'single_host_origin'}
              disabled={stageotp}
            />,
            <div>{stageotp ? 
            <div>
            <TextField
              required
              fullWidth
              open={stageotp}
              name="otp"
              label="otp"
              type="otp"
              id="otp"
              autoComplete="current-password"
              onChange={(event) => {
                event.preventDefault();
                setOtp(event.target.value);
              }}
            />
            <Button
              open={stageotp}
              variant="contained"
              fullwidth
              color="primary"
              className={classes.submit}
              onClick = {() => onSubmitOtp()}
            >
              Submit OTP
            </Button>
            <Button
              open="false"
              variant="contained"
              fullwidth
              color="secondary"
              className={classes.submit}
              onClick = {() => onCancelOTP()}
            >
              Cancel
            </Button>
            </div> : <div></div>}
            </div>

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