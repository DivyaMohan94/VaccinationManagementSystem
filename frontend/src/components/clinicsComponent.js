import React, { Component } from "react";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import swal from "sweetalert";
import Button from "@material-ui/core/Button";
import URL_VAL from "../utils/backend";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import TimePicker from "@mui/lab/TimePicker";
import { FormLabel } from "@material-ui/core";
import moment from "moment";

function clearFields(event) {
  Array.from(event.target).forEach((e) => (e.value = ""));
}
class ClinicComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      diseases: [],
      name: "",
      street: "",
      number: 0,
      city: "",
      state: "",
      zipcode: "",
      numberOfPhysicians: "",
      selectedStartTime: "",
      selectedEndTime: "",
    };

    this.onNameChange = this.onNameChange.bind(this);
    this.onStreetChange = this.onStreetChange.bind(this);
    this.onNumberChange = this.onNumberChange.bind(this);
    this.onCityChange = this.onCityChange.bind(this);
    this.onStateChange = this.onStateChange.bind(this);
    this.onZipcodeChange = this.onZipcodeChange.bind(this);
    this.onNumberOfPhysiciansChange =
      this.onNumberOfPhysiciansChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateSave = this.validateSave.bind(this);
    this.onStartTimeChange = this.onStartTimeChange.bind(this);
    this.onEndTimeChange = this.onEndTimeChange.bind(this);
  }

  onNameChange(e) {
    this.setState({
      name: e.target.value,
    });
  }

  onStreetChange(e) {
    this.setState({
      street: e.target.value,
    });
  }

  onNumberChange(e) {
    this.setState({
      number: e.target.value,
    });
  }

  onCityChange(e) {
    this.setState({
      city: e.target.value,
    });
  }

  onStateChange(e) {
    this.setState({
      state: e.target.value,
    });
  }

  onZipcodeChange(e) {
    this.setState({
      zipcode: e.target.value,
    });
  }

  onNumberOfPhysiciansChange(e) {
    this.setState({
      numberOfPhysicians: e.target.value,
    });
  }

  onStartTimeChange = (newValue) => {
    this.setState({
      selectedStartTime: newValue,
    });
  };

  onEndTimeChange = (newValue) => {
    this.setState({
      selectedEndTime: newValue,
    });
  };

  componentDidMount() {
    axios.get(`${URL_VAL}/disease/diseases`).then((response) => {
      if (response.status === 200) {
        console.log(response.data);
        if (response.data.length > 0) {
          this.setState({
            diseases: response.data,
          });
        }
      }
    });
  }

  handleSubmit = async (e) => {
    e.preventDefault();

    if (this.validateSave() === true) {
      var momentStartDate = moment(this.state.selectedStartTime);
      var momentEndDate = moment(this.state.selectedEndTime);

      axios.defaults.withCredentials = true;

      var payload = {
        name: this.state.name,
        address: {
          street: this.state.street,
          number: this.state.number,
          city: this.state.city,
          state: this.state.state,
          zipcode: this.state.zipcode,
        },
        startTime: {
          hour: momentStartDate.format("HH"),
          minute: momentStartDate.format("mm"),
          second: momentStartDate.format("ss"),
        },
        endTime: {
          hour: momentEndDate.format("HH"),
          minute: momentEndDate.format("mm"),
          second: momentEndDate.format("ss"),
        },
        numberOfPhysicians: this.state.numberOfPhysicians,
      };

      await axios
        .post(`${URL_VAL}/clinic`, payload)
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            swal("Success", "Clinic added successfully!", {
              dangerMode: false,
            });
            clearFields(e);
          }
        })
        .catch((err) => {
          console.log("inside catch");

          var errObj = err.response.data;

          swal("Error", errObj.badRequest.msg, "error", {
            dangerMode: true,
          });
        });
    }
  };

  validateSave() {
    let isValid = true;
    const numRejex = /^[0-9]+$/;
    if (
      this.state.name === "" ||
      this.state.street === "" ||
      this.state.city === "" ||
      this.state.state === "" ||
      this.state.zipcode === "" ||
      this.state.numberOfPhysicians === "" ||
      this.state.selectedEndTime === "" ||
      this.state.selectedStartTime === ""
    ) {
      swal("Error", "Enter all the details to add clinic", "error", {
        dangerMode: true,
      });
      isValid = false;
    } else if (!this.state.numberOfPhysicians.match(numRejex)) {
      swal(
        "Error",
        "Only numeric value is allowed for number of physicians",
        "error",
        {
          dangerMode: true,
        }
      );
      isValid = false;
    }

    return isValid;
  }

  render() {
    return (
      <>
        <form noValidate onSubmit={this.handleSubmit}>
          <TextField
            required
            name="Clinic Name"
            label="Clinic Name"
            type="text"
            id="name"
            autoFocus
            style={{ width: "1000px" }}
            onChange={this.onNameChange}
          />
          <TextField
            required
            name="Street"
            label="Street"
            type="text"
            id="street"
            autoFocus
            style={{ width: "1000px" }}
            onChange={this.onStreetChange}
          />
          <TextField
            name="Number"
            label="Number"
            type="text"
            id="number"
            autoFocus
            style={{ width: "1000px" }}
            onChange={this.onNumberChange}
          />
          <TextField
            required
            name="City"
            label="City"
            type="text"
            id="city"
            autoFocus
            style={{ width: "1000px" }}
            onChange={this.onCityChange}
          />
          <TextField
            required
            name="State"
            label="State"
            type="text"
            id="state"
            autoFocus
            style={{ width: "1000px" }}
            onChange={this.onStateChange}
          />
          <TextField
            required
            name="Zipcode"
            label="Zipcode"
            type="text"
            id="zipcode"
            autoFocus
            style={{ width: "1000px" }}
            onChange={this.onZipcodeChange}
          />

          <TextField
            required
            name="Number of physicians"
            label="Number of physicians"
            type="text"
            id="numberOfPhysicians"
            autoFocus
            style={{ width: "1000px" }}
            onChange={this.onNumberOfPhysiciansChange}
          />

          <div>
            <FormLabel style={{ paddingTop: "25px", paddingRight: "20px" }}>
              Business Hours*
            </FormLabel>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                style={{ paddingTop: "25px", paddingRight: "20px" }}
                label="Start Time"
                ampm={false}
                value={this.state.selectedStartTime}
                onChange={this.onStartTimeChange}
                renderInput={(params) => <TextField {...params} />}
              />

              <TimePicker
                label="End Time"
                ampm={false}
                value={this.state.selectedEndTime}
                onChange={this.onEndTimeChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </div>

          <div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ width: "150px", marginTop: "20px" }}
            >
              Add Clinic
            </Button>
          </div>
        </form>
      </>
    );
  }
}

export default ClinicComponent;
