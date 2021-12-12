
import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Box } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Axios from "axios";
import Button from "@material-ui/core/Button";
import Typography from "@mui/material/Typography";
import swal from "sweetalert";
import { Navigate } from "react-router";
import Card from "@mui/material/Card";

const utils = require("../utils/utilities");

export default function Profile() {
  let local = localStorage;
  const userID = local.id;
  const [redeemedMiles, setRedeemedMiles] = useState();
  const [name, setName] = useState();
  const [miles, setMiles] = useState();
  const [email, setEmail] = useState();
  const [editState, setEditState] = useState(false);

  useEffect(() => {
    getUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserInfo = async () => {
    await Axios.get("/users/getProfile", {
      params: { id: userID },
    }).then((response) => {
      if (response.data.user != null) {
        if (response.status === 200) {
          setName(response.data.user.name);
          setEmail(response.data.user.email);
          setMiles(response.data.user.miles);
          setRedeemedMiles(response.data.user.redeemedMiles);
          utils.setLocalStorage(response.data.user);
          console.log(response)
        } else {
          //show error dialog
          swal("Error", "Some error occured! try again!", "error", {
            dangerMode: true,
          });
        }
      }
      // console.log(response.data.user.name)
    });
  }

  const submitDetails = async () => {
    const updatedData = {
      _id: userID,
      email: document.getElementById("newEmail").value,
      name: document.getElementById("newName").value,
      miles: miles,
      redeemedMiles: redeemedMiles
    };
    await Axios.post("/users/updateUser", updatedData, {
      params: { id: userID },
    }).then((response) => {
      if (response.status === 200) {
        setName(updatedData.name);
        setEmail(updatedData.email);
        utils.setLocalStorage(updatedData);
        setEditState(false);
      } else {
        //show error dialog
        swal("Error", "Some error occured! try again!", "error", {
          dangerMode: true,
        });
      }
    });
  };

  const setEdit = () => {
    setEditState(true);
  };

  let redirectVar = null;
  if (!utils.isLoggedIn()) {
    redirectVar = <Navigate to="/login" />;
  }
  return (
    <>
      {redirectVar}
      <div>
        <CssBaseline />
        <Box>
          <Navbar />
        </Box>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          minWidhth="200vh"
        >
          <Grid item>
            <Card sx={{ maxWidth: "100vh" }}>
              <Box paddingLeft={15} paddingRight={15} mb={7} mt={7}>
                <form>
                  <Grid
                    container
                    alignItems="left"
                    justify="center"
                    direction="column"
                  >
                    <Grid item>
                      <Typography component="div" mt={2}>
                        Name:{" "}
                        {editState ? (
                          <TextField
                            id="newName"
                            name="name"
                            defaultValue={name}
                          ></TextField>
                        ) : (
                          name
                        )}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography component="div" mt={2}>
                        Email:{" "}
                        {editState ? (
                          <TextField
                            id="newEmail"
                            name="email"
                            defaultValue={email}
                          ></TextField>
                        ) : (
                          email
                        )}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography component="div" mt={2}>
                        Miles: {miles}
                      </Typography>
                    </Grid>

                    <Grid item>
                      <Typography component="div" mt={2}>
                        Redeemed Miles: {redeemedMiles}
                      </Typography>
                    </Grid>
                    <Grid item>

                      {editState ? (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => submitDetails()}
                          mt={10}
                        >
                          Submit
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => setEdit()}
                          mt={10}
                        >
                          Edit{" "}
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </form>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
