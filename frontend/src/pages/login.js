import React from "react";
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
import { useState } from "react";
import URL_VAL from '../utils/backend';
import Modal from '@mui/material/Modal';

import Axios from "axios";

import  {useNavigate}  from "react-router-dom";

//import { useDispatch } from "react-redux";
import swal from "sweetalert";
import Navbar from "../components/navbar";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newpassword, setnewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [stageotp, setOTP] = useState(false);
  const [isValid, setisValid] = useState(true);
  const navigate = useNavigate();

  //const dispatch = useDispatch();
  const responseGoogle = async (resp) => {
    console.log(resp);
    Axios.defaults.withCredentials = true;
    Axios.post(`${URL_VAL}/user/getGoogle`, {
      email: resp.profileObj.email,
      fname: resp.profileObj.givenName,
      lname: resp.profileObj.familyName,
      gid: resp.profileObj.googleId,
    }).then((response) => {
      console.log(response);
      if (response.status === 200) {
        localStorage.setItem("loggedIn",true);
        localStorage.setItem("email", response.data.patient.emailId);
        localStorage.setItem("mrn", response.data.patient.mrn);
        localStorage.setItem("admin", response.data.patient.admin);
        localStorage.setItem(
          "currentDate",
          new Date().toISOString().slice(0, 10)
        );
        if (response.data.status === "Init") {
          setOTP(true);
        } else if (response.data.status === "Verified") {
          navigate("/register");
        } else if (response.data.status === "Registered") {
          navigate("/");
        }
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
    }).catch((err) => {
      swal("Error", err.response.data.badRequest.msg, "error", {
        dangerMode: true,
      });
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
      Axios.post(`${URL_VAL}/user/validateOtp`, {
        email: localStorage.getItem("email"),
        mrn: localStorage.getItem("mrn"),
        otp: otp,
      }).then((response) => {
        if (response.status === 200) {
          navigate("/register");
        } else {
          swal("Eror", "OTP verification failed", "error", {
            dangerMode: true,
          });
        }
      }).catch((err) => {
        swal("Error", err.response.data.badRequest.msg, "error", {
          dangerMode: true,
        });
      })
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(password)
    console.log(email)
    console.log("isValid--",isValid)

   if (password === "" || email === "") {
      swal("Error", "Enter Details to Login", "error", {
        dangerMode: true,
      });
    } else if( validateEmail() === false){
      swal("Error", "Enter Valid email address", "error", {
        dangerMode: true,
      });
    }else {
      Axios.defaults.withCredentials = true;
      Axios.post(`${URL_VAL}/user/login`, {
        email: email,
        password: password,
      })
        .then((response) => {
          if (response.status === 200) {
            localStorage.setItem("loggedIn", true);
            localStorage.setItem("email", response.data.patient.emailId);
            localStorage.setItem("mrn", response.data.patient.mrn);
            localStorage.setItem("admin", response.data.patient.admin);
            localStorage.setItem(
              "currentDate",
              new Date().toISOString().slice(0, 10)
            );
            if (response.data.status === "Init") {
              setOTP(true);
            } else if (response.data.status === "Verified") {
              navigate("/register");
            } else if (response.data.status === "Registered") {
              navigate("/dashboard");
            }
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
          swal("Error", err.response.data.badRequest.msg, "error", {
            dangerMode: true,
          });
          console.log(err);
        });
    }
  };

  const validateEmail = () => {
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if((email).match(mailformat)){
      return true
    } else {
      return false
    }
  }
  const changePwd = () => {
    const data = {
      email: email,
      password: newpassword
    }
    Axios.defaults.withCredentials = true;
    Axios.post(`${URL_VAL}/user/passchange`, {
      email: email,
      password: newpassword
    }).then((response) => {
      if (response.status === 200) {
        localStorage.setItem("loggedIn", true);
        localStorage.setItem("email", response.data.patient.emailId);
        localStorage.setItem("mrn", response.data.patient.mrn);
        localStorage.setItem("admin", response.data.patient.admin);
        localStorage.setItem(
            "currentDate",
            new Date().toISOString().slice(0, 10)
        );
        navigate("/dashboard");
      } else {
        swal("Error", "Please register to change password", "error", {
          dangerMode: true,
        });
      }
    }).catch((err) => {
      swal("Error", err.response.data.badRequest.msg, "error", {
        dangerMode: true,
      });
    })
    handleClose()
  }

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
                setEmail(event.target.value)
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
            <Button onClick={handleOpen}>Change Password</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
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
                      setnewPassword(event.target.value);
                    }}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={changePwd}
                >
                  Confirm Password
                </Button>
              </Box>
            </Modal>
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

          </form>
        </div>
      </Grid>
    </Grid>
    </>
  );
}