import { React, useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import Grid from "@material-ui/core/Grid";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Container from '@mui/material/Container';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Axios from 'axios';
import { Navigate } from "react-router";
import Typography from '@mui/material/Typography';

const theme = createTheme();


const utils = require("../utils/utilities");

const useStyles = makeStyles({
  container: {
    height: "100%", // So that grids 1 & 4 go all the way down
    minHeight: 150, // Give minimum height to a div
    border: "1px solid black",
    fontSize: 30,
    textAlign: "center",
  },
  containerTall: {
    minHeight: 250, // This div has higher minimum height
  },
});

export default function FlightManagement() {
  const classes = useStyles();
  const [flights, setFlights] = useState([
    {
      seatAvailable: ["100"],
      seatBooked: ["2"],
      _id: "61a9b2d318800a18b16fa371",
      flightName: "AA294",
      airplaneName: "Boeing189",
      arrivalTime: "2021-05-27T12:00:00.000Z",
      departureTime: "2021-05-02T07:00:00.000Z",
      origin: "NYC",
      destination: "SFO",
      miles: 2000,
    },
  ]);
  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    await Axios.get("/flight/getAllFlights").then((response) => {
      // console.log(response);
      if (response.status === 200) {
        setFlights(response.data.flights);
      } else {
        // TODO: add error handling to display no flights found
        setFlights([
          {
            seatAvailable: 0,
            seatBooked: 0,
            _id: "0",
            flightName: "No Flights Found",
            airplaneName: "",
            arrivalTime: "",
            departureTime: "",
            origin: "",
            destination: "",
            miles: 0,
          },
        ])
      }
    });
  };

  let redirectVar = null;
  if (!utils.isLoggedIn()) {
    console.log("flightManagement -> ")
    redirectVar = <Navigate to="/employeeLogin" />
  }
  return (
    <>
      {redirectVar}
      <Navbar />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container component="main" sx={{ mb: 4, width: 1000 }}>
          <Paper variant="outlined" sx={{ my: { xs: 3, md: 2 }, p: { xs: 2, md: 3 } }}>
            <Typography component="h1" variant="h4" align="center">
              Existing Flights
            </Typography>
            <Box paddingRight={5} paddingLeft={5} >
              <Grid container direction="row" spacing={1}>
                <Grid item xs={12} >
                  <Link to="/createFlight">
                    <Button color="primary" variant="contained"
                      style={{ marginTop: '5vh', marginBottom: "1vh" }}>
                      Add new flight
                    </Button>
                  </Link>
                  <div style={{ marginTop: "2vh" }}>
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 750 }} aria-label="simple table">
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
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {flights.length !== 0 ? flights.map((row) => (
                            <TableRow
                              key={row._id}
                              sx={{
                                "&:last-child td, &:last-child th": { border: 0 },
                              }}
                            >
                              <TableCell component="th" scope="row">
                                {row.flightName}
                              </TableCell>
                              <TableCell align="right">{row.origin}</TableCell>
                              <TableCell align="right">{row.destination}</TableCell>
                              <TableCell align="right">
                                {new Date(row.departureTime).toLocaleString(
                                  "en-GB",
                                  {
                                    weekday: "short",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    timezone: 'PST'
                                  }
                                )}
                              </TableCell>
                              <TableCell align="right">
                                {new Date(row.departureTime).toLocaleString(
                                  "en-GB",
                                  {
                                    hour12: false,
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    timezone: 'PST'
                                  }
                                )}
                              </TableCell>
                              <TableCell align="right">
                                {new Date(row.arrivalTime).toLocaleString(
                                  "en-GB",
                                  {
                                    weekday: "short",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    timezone: 'PST'
                                  }
                                )}
                              </TableCell>
                              <TableCell align="right">
                                {new Date(row.arrivalTime).toLocaleString("en-GB", {
                                  hour12: false,
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  timezone: 'PST'
                                })}
                              </TableCell>
                              <TableCell align="right">
                                {row.airplaneName}
                              </TableCell>
                            </TableRow>
                          )) : "No Flights found"}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Container>
      </ThemeProvider>
    </>
  )
}