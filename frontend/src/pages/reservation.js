import React, { useEffect } from "react";
import Axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../components/navbar";
import { Navigate, useNavigate } from "react-router";
import Stack from "@mui/material/Stack";
import {
  Grid,
  Box,
  Typography,
  Button,
  Container,
  Menu,
  TextField,
} from "@material-ui/core";
import SeatPicker from "react-seat-picker";
import { useState } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Card from "@mui/material/Card";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import swal from "sweetalert";
import MenuItem from "@mui/material/MenuItem";

const utils = require("../utils/utilities");

const useStyles = makeStyles((theme) => ({
  seat: {
    height: "100%", // So that grids 1 & 4 go all the way down
    minHeight: 150, // Give minimum height to a div
    border: "1px solid black",
    textAlign: "center",
    display: "flex",
  },
  container: {
    height: "100%", // So that grids 1 & 4 go all the way down
    minHeight: 150, // Give minimum height to a div
    border: "1px solid black",
    fontSize: 30,
    textAlign: "center",
    display: "flex",
  },
  containerTall: {
    minHeight: 250, // This div has higher minimum height
  },
  bannerTitle: {
    fontSize: theme.spacing(1.4),
    textTransform: "uppercase",
    color: "rgb(93, 93, 97)",
    marginBottom: theme.spacing(1),
  },
  bannerContent: {
    fontSize: theme.spacing(2),
    textTransform: "capitalize",
    color: theme.palette.common.white,
  },
  footer: {
    position: "fixed",
    bottom: "0%",
    width: "100%",
    height: "8vh",
    textAlign: "center",
  },
  [theme.breakpoints.down("sm")]: {
    hideOnSmall: {
      display: "none",
    },
  },
}));

export default function Reservation() {
  const queryParams = new URLSearchParams(window.location.search);
  let flightId = queryParams.get("flightId");
  const classes = useStyles();
  const [rows, setRows] = useState([
    [
      { id: 1, number: 1, isSelected: true, tooltip: "Reserved by you" },
      { id: 2, number: 2, tooltip: "Cost: 15$" },
      null,
      {
        id: 3,
        number: "3",
        isReserved: true,
        orientation: "east",
        tooltip: "Reserved by Rogger",
      },
      { id: 4, number: "4", orientation: "west" },
      null,
      { id: 5, number: 5 },
      { id: 6, number: 6 },
    ],
  ]);
  const navigate = useNavigate();
  const [origin, setOrigin] = useState();
  const [destination, setDestination] = useState();
  const [ticketPrice, setTicketPrice] = useState(0);
  const [oldTicketPrice, setoldTicketPrice] = useState(0);
  const [seat, setSeat] = useState();
  const [mileage, setMileage] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const name = localStorage.getItem("name");
  const [rerender, setRerender] = useState(false);
  let redirectVar = null;
  if (!utils.isLoggedIn()) {
    redirectVar = <Navigate to="/login" />;
  }
  useEffect(() => {
    fetchFlightInformation();
    // setRerender(false);
  }, [rerender]);

  const fetchFlightInformation = async () => {
    await Axios.get("/flight/getFlightById", {
      params: { flightId: flightId },
    }).then((response) => {
      if (response.status === 200) {
        // setRows(response.data.seatAvailable);
        setRows(response.data.seatAvailable);
        setOrigin(response.data.origin);
        setDestination(response.data.destination);
        setTicketPrice(response.data.cost);
        setoldTicketPrice(response.data.cost);
        setFinalPrice(response.data.cost);
        setRerender(true);
      } else {
        swal("Error", "Failed to fetch flight info, retry.", "error", {
          dangerMode: true,
        });
      }
    });
  };

  const onBookSeats = async () => {
    let x = document.getElementById("seatNumberToSend").innerHTML;
    console.log(x);
    let seatSend = ["-1", "-1"];
    if (x) {
      seatSend = x.split("");
    }
    const body = {
      token: localStorage.getItem("token"),
      flightId: flightId,
      miles: mileage,
      row: seatSend[0],
      col: seatSend[1],
    };
    await Axios.post("/reservation/create", body).then((response) => {
      if (response.status === 200) {
        swal({
          title: "Booked Successfully",
          text: "Reservation Completed",
          icon: "success",
        }).then(function (isConfirm) {
          if (isConfirm) {
            navigate("/myReservation");
          }
        });
      } else {
        swal("Error", "Failed to book flight, retry.", "error", {
          dangerMode: true,
        });
      }
    });
  };
  const fetchMiles = (e) => {
    console.log(e.target.value);
    if (e.target.value == "yes") {
      setMileage(localStorage.getItem("miles") / 10);
      setFinalPrice(ticketPrice - localStorage.getItem("miles") / 10);
    } else {
      setMileage(0);
      setFinalPrice(ticketPrice);
    }
    // if(mileage === 0) {
    //   setMileage(localStorage.getItem("miles") / 10)
    //   setFinalPrice(ticketPrice - localStorage.getItem("miles")/10)
    // }
    // else {
    //   setMileage(0)
    //   setFinalPrice(ticketPrice)
    // }
  };

  const handleInputChange = (event) => {
    event.preventDefault();
    let { value } = event.target;
    setSeat(value);
    let chars = value.split("");
    if (chars[1] === "A" || chars[1] === "F") {
      setTicketPrice(oldTicketPrice + 10);
      setFinalPrice(oldTicketPrice + 10);
    }
    if (chars[1] === "C" || chars[1] === "D") {
      setTicketPrice(oldTicketPrice + 10);
      setFinalPrice(oldTicketPrice + 10);
    }
    if (chars[1] === "B" || chars[1] === "E") {
      setTicketPrice(oldTicketPrice);
      setFinalPrice(oldTicketPrice);
    }
  };
  console.log(rows);
  return (
    <>
      {redirectVar}
      <Navbar />
      {rerender ? (
        <div>
          <Grid
            container
            spacing={5}
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Grid item>
              <Card
                sx={{ minWidth: "80vh", minHeight: "80vh", marginTop: "2vh" }}
              >
                <Container
                  width="sl"
                  className={classes.container}
                  style={{ borderColor: "transparent", marginTop: "5vh" }}
                >
                  <Grid spacing={2} style={{ height: "100%", width: "100%" }}>
                    <Stack
                      sx={{ pt: 2 }}
                      direction="row"
                      spacing={2}
                      justifyContent="center"
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <LocationOnIcon sx={{ fontSize: 40 }} />
                        <Typography
                          variant="h2"
                          direction="column"
                          align="center"
                        >
                          {origin}
                        </Typography>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <ArrowForwardIcon
                          sx={{ minWidth: 100, fontSize: 50 }}
                        />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <LocationOnIcon sx={{ fontSize: 40 }} />
                        <Typography
                          variant="h2"
                          direction="column"
                          align="center"
                        >
                          {destination}
                        </Typography>
                      </div>
                    </Stack>
                  </Grid>
                </Container>
                <Container
                  style={{ marginTop: "20px", justifyContent: "center" }}
                  className={classes.seat}
                  style={{ borderColor: "transparent" }}
                >
                  <TextField
                    required
                    id="rowSelect"
                    name="rowSelect"
                    label="Row"
                    select
                    onChange={handleInputChange}
                    style={{ minWidth: "30vh" }}
                  >
                    {rows.map((item) => {
                      if (item.isReserved) {
                        return <span></span>;
                      } else {
                        return (
                          <MenuItem key={item._id} value={item.row + item.col}>
                            {item.row + item.col}
                          </MenuItem>
                        );
                      }
                    })}
                  </TextField>
                </Container>
                <Container
                  maxWidth="sm"
                  className={classes.container}
                  style={{ borderColor: "transparent", marginTop: "2vh" }}
                >
                  <Grid spacing={2} style={{ height: "100%" }}>
                    <Stack
                      sx={{ pt: 2, pl: 4 }}
                      direction="row"
                      spacing={4}
                      style={{
                        width: "50vh",
                        align: "center",
                        alignItems: "center",
                      }}
                      justifyContent="center"
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "10%",
                          width: "100%",
                          marginLeft: "10%",
                        }}
                      >
                        <FormControl component="fieldset">
                          <FormLabel component="legend">
                            {" "}
                            Do you want to use Mileage points?
                          </FormLabel>
                          <RadioGroup
                            row
                            defaultValue="no"
                            aria-label="mileage"
                            name="row-radio-buttons-group"
                          >
                            <FormControlLabel
                              value="yes"
                              control={<Radio />}
                              label="Yes"
                              onChange={(e) => {
                                fetchMiles(e);
                              }}
                            />
                            <FormControlLabel
                              value="no"
                              control={<Radio />}
                              label="No"
                              onChange={(e) => {
                                fetchMiles(e);
                              }}
                            />
                          </RadioGroup>
                        </FormControl>
                      </div>
                    </Stack>
                  </Grid>
                </Container>
              </Card>
            </Grid>
          </Grid>
          <Box
            marginTop={2}
            bgcolor="rgb(18, 20, 24)"
            className={classes.footer}
          >
            <Grid container>
              <Grid item xs={8} md={10}>
                <Grid container spacing={3} style={{ padding: 10 }}>
                  {/* {user && user.name && ( */}
                  <Grid item className={classes.hideOnSmall}>
                    <Typography className={classes.bannerTitle}>
                      Name
                    </Typography>
                    <Typography className={classes.bannerContent}>
                      {name}
                    </Typography>
                  </Grid>
                  {/* )} */}
                  <Grid item>
                    <Typography className={classes.bannerTitle}>
                      Seat
                    </Typography>
                    {/* {selectedSeats > 0 ? ( */}
                    <Typography
                      className={classes.bannerContent}
                      value={seat}
                      id="seatNumberToSend"
                    >
                      {seat}
                      {/* {selectedSeats} tickets */}
                    </Typography>
                    {/* ) : ( */}
                    {/* <Typography className={classes.bannerContent}>0</Typography> */}
                    {/* )} */}
                  </Grid>
                  <Grid item>
                    <Typography className={classes.bannerTitle}>
                      Original Price
                    </Typography>
                    <Typography className={classes.bannerContent}>
                      ${ticketPrice}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography className={classes.bannerTitle}>
                      Mileage Points Discount
                    </Typography>
                    <Typography className={classes.bannerContent}>
                      ${mileage}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography className={classes.bannerTitle}>
                      Overall Price
                    </Typography>
                    <Typography className={classes.bannerContent}>
                      ${finalPrice}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                item
                xs={4}
                md={2}
                style={{
                  color: "rgb(120, 205, 4)",
                  background: "rgb(18, 20, 24)",
                  display: "flex",
                }}
              >
                <Button
                  color="inherit"
                  fullWidth
                  // disabled={seatsAvailable <= 0}
                  onClick={onBookSeats}
                >
                  Checkout
                </Button>
              </Grid>
            </Grid>
          </Box>
        </div>
      ) : (
        <>/</>
      )}
    </>
  );
}
