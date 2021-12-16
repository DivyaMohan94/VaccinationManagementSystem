import React, { Component } from "react";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";
import swal from "sweetalert";
import Button from "@material-ui/core/Button";
import URL_VAL from "../utils/backend";
import Multiselect from "multiselect-react-dropdown";
import { FormLabel } from "@material-ui/core";

function clearFields(event) {
  Array.from(event.target).forEach((e) => (e.value = ""));
}

class VaccineComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      diseases: [],
      name: "",
      diseaseIds: [],
      manufacturer: "",
      numOfShots: 0,
      shotIntervalVal: 0,
      durationString: "",
      duration: 0,
      errorMessage: "",
      selectedListVal:[]
    };

    this.onSelect = this.onSelect.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onManufacturerChange = this.onManufacturerChange.bind(this);
    this.onNumOfShotsChange = this.onNumOfShotsChange.bind(this);
    this.onShortIntervalChange = this.onShortIntervalChange.bind(this);
    this.onDurationChange = this.onDurationChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateSave = this.validateSave.bind(this);
  }

  onNameChange(e) {
    this.setState({
      name: e.target.value,
    });
  }

  onSelect(selectedList, selectedItem) {
    var tempList = [];
    selectedList.forEach((element) => {
      tempList.push(element.diseaseId);
    });
    this.setState({
      diseaseIds: tempList,
      selectedListVal:selectedList
    });
  }

  onRemove(selectedList, removedItem) {
    var tempList = [];
    selectedList.forEach((element) => {
      tempList.push(element.diseaseId);
    });
    this.setState({
      diseaseIds: tempList,
    });
  }

  onManufacturerChange(e) {
    this.setState({
      manufacturer: e.target.value,
    });
  }

  onNumOfShotsChange(e) {
    this.setState({
      numOfShots: e.target.value,
    });
  }

  onShortIntervalChange(e) {
    this.setState({
      shotIntervalVal: e.target.value,
    });
  }

  onDurationChange(e) {
    if (e.target.value.toLowerCase() == "lifetime") {
      this.setState({
        duration: -1,
      });
    } else {
      this.setState({
        duration: e.target.value,
      });
    }
  }

  componentDidMount() {
    console.log("inside did");
    axios.get(`${URL_VAL}/disease/diseases`).then((response) => {
      console.log("Status Code : ", response.status);
      console.log("Status Code : ", response.data);
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
      axios.defaults.withCredentials = true;

      var payload = {
        name: this.state.name,
        diseaseIds: this.state.diseaseIds,
        manufacturer: this.state.manufacturer,
        numOfShots: this.state.numOfShots,
        shotInterval: this.state.shotIntervalVal,
        duration: this.state.duration,
      };
      console.log(payload);

      await axios
        .post(`${URL_VAL}/vaccine`, payload)
        .then((response) => {
          if (response.status === 200) {
            swal("Success", "Vaccine added successfully!", {
              dangerMode: false,
            });
            clearFields(e);
            this.onRemove(this.state.selectedListVal)
          } else {
            console.log(response);
            swal("Error", "Some error occured", "error", {
              dangerMode: true,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          var errObj = err.response.data;
          swal(
            "Error",
            errObj.badRequest.msg,
            "error",
            {
              dangerMode: true,
            }
          );
          //console.log(errorMessage);
        });
    }
  };

  validateSave() {
    let isValid = true;
    const numRejex = /^[0-9]+$/;
    if (
      this.state.name === "" ||
      this.state.diseaseIds.length === 0 ||
      this.state.manufacturer === "" ||
      this.state.numOfShots === "" ||
      this.state.duration === ""
    ) {
      swal("Error", "Enter all the details to add vaccine", "error", {
        dangerMode: true,
      });
      isValid = false;
    } else if (this.state.manufacturer.length < 3) {
      swal(
        "Error",
        "Manufacturer name must be more than 3 characters",
        "error",
        {
          dangerMode: true,
        }
      );
      isValid = false;
    } else if (!this.state.numOfShots.match(numRejex)) {
      swal(
        "Error",
        "Only numeric value is allowed for number of shots",
        "error",
        {
          dangerMode: true,
        }
      );
      isValid = false;
    } else if (
      this.state.shotIntervalVal != "" &&
      !this.state.shotIntervalVal.match(numRejex)
    ) {
      swal(
        "Error",
        "Only numeric value is allowed for short interval",
        "error",
        {
          dangerMode: true,
        }
      );
      isValid = false;
    } else if (Number(this.state.numOfShots) < 1) {
      swal("Error", "There must be atleast 1 valid shot", "error", {
        dangerMode: true,
      });
      isValid = false;
    } else if (
      Number(this.state.numOfShots) > 1 &&
      this.state.shotIntervalVal == ""
    ) {
      swal(
        "Error",
        "Enter valid numeric interval if there are more than 1 shots",
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
            name="Vaccine Name"
            label="Vaccine Name"
            type="text"
            id="name"
            autoFocus
            style={{ width: "1000px" }}
            onChange={this.onNameChange}
          />
          <div style={{ width: "1000px", display: "flex", paddingTop: "25px" }}>
            <div style={{ paddingRight: "30px", marginTop: "5px" }}>
              <FormLabel>Diseases*</FormLabel>
            </div>
            <div style={{ width: "1000px" }}>
              <Multiselect
                options={this.state.diseases} // Options to display in the dropdown
                selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                onSelect={this.onSelect} // Function will trigger on select event
                onRemove={this.onRemove} // Function will trigger on remove event
                displayValue="name" // Property name to display in the dropdown options
                showCheckbox="true"
                hidePlaceholder="true"
                showArrow="true"
                id="dropdown"
              />
            </div>
          </div>
          <TextField
            required
            name="Manufacturer"
            label="Manufacturer"
            type="text"
            id="manufacturer"
            autoFocus
            style={{ width: "1000px" }}
            onChange={this.onManufacturerChange}
          />
          <TextField
            required
            name="Number of slots"
            label="Number of slots"
            type="text"
            id="numOfSlots"
            autoFocus
            style={{ width: "1000px" }}
            onChange={this.onNumOfShotsChange}
          />

          <TextField
            name="Short Interval"
            label="Short Interval"
            type="text"
            id="shortInterval"
            autoFocus
            style={{ width: "1000px" }}
            onChange={this.onShortIntervalChange}
          />

          <TextField
            required
            name="Duration"
            label="Duration"
            type="text"
            id="duration"
            autoFocus
            style={{ width: "1000px" }}
            onChange={this.onDurationChange}
          />
          <div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ width: "150px", marginTop: "20px" }}
            >
              Add Vaccine
            </Button>
          </div>
        </form>
      </>
    );
  }
}

export default VaccineComponent;
