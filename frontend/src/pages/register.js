import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel"
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";
import Axios from "axios";
import { useNavigate, Link } from "react-router-dom";
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
    backgroundImage: `url(${process.env.PUBLIC_URL + 'aeroplane1.jpeg'})`,
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
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === "" || email === "") {
      swal("Error", "Enter Details to SignUp", "error", {
        dangerMode: true,
      });
    } else {
      Axios.defaults.withCredentials = true;         
      await Axios.post("/users/register", {
        name: name,
        email: email,
        password: password,
      })
        .then((response) => {
          if (response.status === 200) {
            //debugger;
            localStorage.setItem("loggedIn", true);
            localStorage.setItem("email", response.data.email);
            localStorage.setItem("name", response.data.name);
            localStorage.setItem("phone", response.data.phone);
            localStorage.setItem("currency", response.data.currency);
            localStorage.setItem("timezone", response.data.timezone);
            localStorage.setItem("language", response.data.language);
            localStorage.setItem("id", response.data._id);

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
      <Navbar />
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
              <TextField
                required
                fullWidth
                name="First Name"
                label="First Name"
                type="text"
                id="fName"
                autoFocus
                autoComplete="current-Name"
                onChange={(event) => {
                  event.preventDefault();
                  setName(event.target.value);
                }}
              />
              <TextField
                fullWidth
                name="Middle Name"
                label="Middle Name(Optional)"
                type="text"
                id="mName"
                autoFocus
                autoComplete="current-Name"
                onChange={(event) => {
                  event.preventDefault();
                  setName(event.target.value);
                }}
              />
              <TextField
                required
                fullWidth
                name="Last Name"
                label="Last Name"
                type="text"
                id="lName"
                autoFocus
                autoComplete="current-Name"
                onChange={(event) => {
                  event.preventDefault();
                  setName(event.target.value);
                }}
              />
              <TextField
                required
                fullWidth
                name="DOB"
                label="DOB"
                type="text"
                id="dob"
                autoFocus
                autoComplete="current-Name"
                onChange={(event) => {
                  event.preventDefault();
                  setName(event.target.value);
                }}
              />
              <TextField
                fullWidth
                name="Add1"
                label="Street and number"
                type="text"
                id="add1"
                autoFocus
                autoComplete="current-Name"
                onChange={(event) => {
                  event.preventDefault();
                  setName(event.target.value);
                }}
              />
              <TextField
                required
                fullWidth
                name="Add2"
                label="City"
                type="text"
                id="add2"
                autoFocus
                autoComplete="current-Name"
                onChange={(event) => {
                  event.preventDefault();
                  setName(event.target.value);
                }}
              />
              <TextField
                required
                halfWidth
                name="Add3"
                label="State"
                type="text"
                id="add3"
                autoFocus
                autoComplete="current-Name"
                onChange={(event) => {
                  event.preventDefault();
                  setName(event.target.value);
                }}
              />
              <TextField
                sx= {{m:2}}
                required
                halfWidth
                name="Add4"
                label="Zipcode"
                type="text"
                id="add4"
                autoFocus
                autoComplete="current-Name"
                onChange={(event) => {
                  event.preventDefault();
                  setName(event.target.value);
                }}
              />
              <TextField
                required
                fullWidth
                id="mrn"
                label="MRN number"
                name="mrn"
                autoComplete="mrn"                
                onChange={(event) => {
                  event.preventDefault();
                  setEmail(event.target.value);
                }}
              />
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup row
    aria-label="gender"
    defaultValue="female"
    name="radio-buttons-group"
  >
    <FormControlLabel value="female" control={<Radio />} label="Female" />
    <FormControlLabel value="male" control={<Radio />} label="Male" />
    <FormControlLabel value="other" control={<Radio />} label="Other" />
  </RadioGroup>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign Up
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
