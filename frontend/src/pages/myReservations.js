import React, { useEffect } from "react";
import Axios from "axios";
import Navbar from "../components/navbar";
import { Navigate, useNavigate } from "react-router";
import { Grid, Box, Button } from "@material-ui/core";
import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import swal from "sweetalert";
import UpdateModal from "../components/updateModal";
const utils = require("../utils/utilities");
const token = localStorage.getItem("token");
export default function MyReservation() {
  const navigate = useNavigate();
  const today = new Date();
  const [reservation, setReservation] = useState();
  const [render, setRender] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [reservationId, setReservationId] = useState();

  const handleClose = () => {
    setOpen(false);
    setRender(!render);
  };
  useEffect(() => {
    fetchReservations();
  }, [render]);

  const fetchReservations = async () => {
    console.log(localStorage.getItem("token"));
    await Axios.get("/reservation/get", {
      params: { token: localStorage.getItem("token") },
    }).then((response) => {
      //
      console.log(response);
      if (response.status === 200) {
        setReservation(response.data);
      }
      if (response.status === 203) {
        setReservation(null);
      }
    });
  };

  const updateResHandler = async (id) => {
    setReservationId(id);
    const row = "1";
    const col = "F";
    setOpen(true);
    // add modal to send axios call
    // await Axios.post("/reservation/modify", {
    //   token: token,
    //   reservationId: reservationId,
    //   row: row,
    //   col: col,
    // }).then((response) => {
    //   if (response.status === 200) {
    //     swal("Success", "Reservation Updated", "success");
    //   }
    // });
  };

  const deleteResHandler = (id) => {
    Axios.delete("/reservation/cancel", {
      data: { token: token, reservationId: id },
    }).then((response) => {
      if (response.status === 200) {
        // success message
        swal({
          title: "Deleted Successfully",
          text: "Reservation Deleted",
          icon: "success",
        }).then(function (isConfirm) {
          if (isConfirm) {
            setRender(!render);
            navigate("/myReservation");
          }
        });
      } else {
        // error message
        swal({
          title: "Delete failed",
          text: "Failed to delete reservation",
          icon: "error",
        }).then(function (isConfirm) {
          if (isConfirm) {
            setRender(!render);
            navigate("/myReservation");
          }
        });
      }
    });
  };

  let redirectVar = null;
  if (!utils.isLoggedIn()) {
    redirectVar = <Navigate to="/login" />;
  }

  return (
    <>
      {redirectVar}
      <Navbar />
      <Box paddingLeft={20} paddingRight={5}>
        {" "}
        {reservation ? (
          <Grid container direction="row" spacing={1}>
            <Grid xs={10}>
              {/* <Link to="/createFlight"><Button color="primary" variant="contained" style={{marginTop:'5vh', marginBottom:"1vh"}}>Add new flight</Button></Link> */}
              <div style={{ marginTop: "10vh" }}>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Flight Number</TableCell>
                        <TableCell align="right">Origin</TableCell>
                        <TableCell align="right">Destination</TableCell>
                        <TableCell align="right">Departure Date</TableCell>
                        <TableCell align="right">Departure Time</TableCell>
                        <TableCell align="right">Arrival Date</TableCell>
                        <TableCell align="right">Arrival Time</TableCell>
                        <TableCell align="right">Aircraft</TableCell>
                        <TableCell align="right">Seat</TableCell>
                        <TableCell align="right">Update</TableCell>
                        <TableCell align="right">Delete</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reservation.length !== 0
                        ? reservation.map((row) => (
                            <TableRow
                              key={row._id}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell component="th" scope="row">
                                {row.flightName.flightName}
                              </TableCell>
                              <TableCell align="right">
                                {row.flightName.origin}
                              </TableCell>
                              <TableCell align="right">
                                {row.flightName.destination}
                              </TableCell>
                              <TableCell align="right">
                                {new Date(
                                  row.flightName.departureTime
                                ).toLocaleString("en-GB", {
                                  weekday: "short",
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  timeZone: "UTC",
                                })}
                              </TableCell>
                              <TableCell align="right">
                                {new Date(
                                  row.flightName.departureTime
                                ).toLocaleString("en-GB", {
                                  hour12: false,
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  timeZone: "UTC",
                                })}
                              </TableCell>
                              <TableCell align="right">
                                {new Date(
                                  row.flightName.arrivalTime
                                ).toLocaleString("en-GB", {
                                  weekday: "short",
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  timeZone: "UTC",
                                })}
                              </TableCell>
                              <TableCell align="right">
                                {new Date(
                                  row.flightName.arrivalTime
                                ).toLocaleString("en-GB", {
                                  hour12: false,
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  timeZone: "UTC",
                                })}
                              </TableCell>
                              <TableCell align="right">
                                {row.flightName.airplaneName}
                              </TableCell>
                              <TableCell align="right">
                                {row.seat.row + row.seat.col}
                              </TableCell>
                              <TableCell align="right">
                                <Button
                                  color="primary"
                                  variant="contained"
                                  size="small"
                                  onClick={() => updateResHandler(row)}
                                  data-id={row._id}
                                  disabled={
                                    new Date(row.flightName.departureTime) <
                                    today
                                  }
                                >
                                  Update
                                </Button>
                              </TableCell>
                              <TableCell align="right">
                                <Button
                                  id="deleteButton"
                                  color="secondary"
                                  variant="contained"
                                  size="small"
                                  onClick={() => deleteResHandler(row._id)}
                                  data-id={row._id}
                                  disabled={
                                    new Date(row.flightName.departureTime) <
                                    today
                                  }
                                >
                                  Delete
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        : "No Flights found"}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Grid>
            <UpdateModal
              handleClose={handleClose}
              open={open}
              reservationId={reservationId}
              fullWidth={true}
              maxWidth={"md"}
              scroll='body'
            />
          </Grid>
        ) : (
          <h2>No Active reservations found</h2>
        )}
      </Box>
    </>
  );
}
