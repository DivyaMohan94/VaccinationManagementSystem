import React, { Component } from "react";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";
import swal from "sweetalert";
import Button from "@material-ui/core/Button";
import URL_VAL from "../utils/backend";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function DiseaseComponent() {
  const classes = useStyles();

  const [errorMessage, setErrorMessage] = useState("");
  const [diseaseName, setDiseaseName] = useState("");
  const [description, setDescription] = useState("");

  function clearFields(event) {
    Array.from(event.target).forEach((e) => (e.value = ""));
  }

  const handleSubmit = async (e) => {
      console.log(URL_VAL);
    e.preventDefault();
    if (diseaseName === "" || description === "") {
      swal("Error", "Enter Details to add disease", "error", {
        dangerMode: true,
      });
    } else {
      axios.defaults.withCredentials = true;
      var payload = {
        "name":diseaseName,
        "description":description
        }
      await axios.post(`${URL_VAL}/disease`,payload)
        .then((response) => {
          if (response.status === 200) {
            swal("Success", "Disease added successfully!",{
                dangerMode:false
            })
            clearFields(e);
          } else if (response.status == 400) {
              console.log(errorMessage)
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
          console.log(err);
          swal("Disease name already exists", errorMessage, "error", {
            dangerMode: true,
          });
          console.log(errorMessage);
        });
    }
  };

  return (
    <>
      <form className={classes.form} noValidate onSubmit={handleSubmit}>
        <TextField
          required
          name="Disease Name"
          label="Disease Name"
          type="text"
          id="diseaseName"
          autoFocus
          style={{ width: "1000px"}}
          onChange={(event) => {
            event.preventDefault();
            setDiseaseName(event.target.value);
          }}
        />
        <TextField
          required
          name="Description"
          label="Description"
          type="text"
          id="description"
          autoFocus
          style={{ width: "1000px"}}
          onChange={(event) => {
            event.preventDefault();
            setDescription(event.target.value);
          }}
        />
       <div>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ width: "150px", marginTop:"20px"}}
        >
          Add Disease
        </Button>
        </div>
      </form>
    </>
  );
}
