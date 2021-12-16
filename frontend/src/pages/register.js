import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import Navbar from "../components/navbar";
import DatePicker from 'react-date-picker';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { FormLabel,FormControl, InputLabel,Select, MenuItem } from "@material-ui/core";



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
  const stateList = [ 'AL','AK','AS','AZ','AR','CA','CO','CT','DE','DC','FM','FL','GA',
 'GU','HI','ID','IL','IN','IA','KS','KY','LA','ME','MH','MD','MA','MI','MN',
 'MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','MP','OH','OK','OR',
'PW','PA','PR','RI','SC','SD','TN','TX','UT','VT','VI','VA','WA','WV','WI','WY']
  const [fname, setFname] = useState("");
  const [mname, setMname] = useState("");
  const [lname, setLname] = useState("");
  const [street, setStreet] = useState("");
  const [state, setStates] = useState(0);
  const [zip, setZip] = useState("");
  const [dob, setDob] = useState(new Date());
  const [city, setCity] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [gender, setGender] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (fname === ""||lname===""||state === ""||city===""||gender ==="" || dob === "" || zip === "") {
      swal("Error", "Enter Details to SignUp", "error", {
        dangerMode: true,
      });
    } else {
      Axios.defaults.withCredentials = true;         
      await Axios.post("/user/register", {
        mrn: localStorage.getItem('mrn'),
        fname: fname,
        mname: mname,
        lname: lname,
        street: street,
        city:city,
        state: stateList[state],
        zip: zip,
        dob: dob.getDate() + "/" + dob.getMonth() + "/" +dob.getFullYear(),
        gender: gender,

      })
        .then((response) => {
          if (response.status === 200) {
            //debugger;
              console.log("----",response.data);
            localStorage.setItem("loggedIn", true);
            localStorage.setItem("email", response.data.emailId);
            localStorage.setItem("name", response.data.fname);
            localStorage.setItem("phone", response.data.phone);
            localStorage.setItem("currency", response.data.currency);
            localStorage.setItem("timezone", response.data.timezone);
            localStorage.setItem("language", response.data.language);
            localStorage.setItem("id", response.data._id);

            navigate("/dashboard");
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
          swal("Server Not Responding", err.response.data.badRequest.msg, "error", {
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
                name="fName"
                label="First Name"
                type="text"
                id="fName"
                autoFocus
                onChange={(event) => {
                  event.preventDefault();
                  setFname(event.target.value);
                }}
              />
              <TextField
                fullWidth
                id="mName"
                label="Middle Name"
                name="mName"
                autoComplete="mName"                
                onChange={(event) => {
                  event.preventDefault();
                  setMname(event.target.value);
                }}
              />
              
              <TextField
                required
                fullWidth
                name="lName"
                label="Last Name"
                id="lName"
                autoComplete="lName" 
                onChange={(event) => {
                  event.preventDefault();
                  setLname(event.target.value);
                }}
              /> 
              <TextField
                fullWidth
                name="street"
                label="Street Name and Number"
                id="street"
                onChange={(event) => {
                  event.preventDefault();
                  setStreet(event.target.value);
                }}
              /> 
              <TextField
                halfWidth
                name="city"
                label="city"
                id="city"
                onChange={(event) => {
                  event.preventDefault();
                  setCity(event.target.value);
                }}
              /> 
              <TextField
                  halfWidth
                  name="zip"
                  label="zipcode"
                  id="zip"
                  onChange={(event) => {
                    event.preventDefault();
                    setZip(event.target.value);
                  }}
                /> 
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">states</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={stateList[state]}
                  label="States"
                  onChange={(event) => setStates(event.target.value)}
                    >
                    {stateList.map((st,i) => <MenuItem value={10}>{st}</MenuItem> )}
                    </Select>
                  </FormControl>
                
              <FormLabel>DOB:</FormLabel>          
              <DatePicker
              onChange={setDob}
              value={dob}
            />
        <FormControl fullWidth component="fieldset">
            <FormLabel component="legend">Gender</FormLabel>
            <RadioGroup row aria-label="gender" name="row-radio-buttons-group"
            value = {gender}
            onChange = {(event) => {setGender(event.target.value)}}
            >
              <FormControlLabel value="female" control={<Radio />} label="Female" />
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="other" control={<Radio />} label="Other" />
            </RadioGroup>
        </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign Up
              </Button>

            </form>
          </div>
        </Grid>
      </Grid>
    </>
  );
}
