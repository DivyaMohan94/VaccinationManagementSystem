import React, { Component } from "react";
import axios from "axios";
import swal from "sweetalert";
import Button from "@material-ui/core/Button";
import URL_VAL from "../utils/backend";
import Multiselect from "multiselect-react-dropdown";
import { FormLabel } from "@material-ui/core";
import { computeCurrentDateTime } from '../utils/utilities'

function clearFields(event) {
  Array.from(event.target).forEach((e) => (e.value = ""));
}
class NewAppointmentComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appointment_date: null,
      allslots: [],
      slot: null,
      allClinics: [],
      clinic_id: null,
      vaccines: [],
      selectedListVal: [],
      vaccinesDue: [],
    };
  }

  onDateChange(e) {
    this.setState({
      appointment_date: e.target.value,
    });
  }
  async onSlotChange(e) {
    await this.setState({
      slot: e.target.value,
    });
    const data = {
      selectedDate: this.state.appointment_date,
      specificSlot: this.state.slot,
    };
    await this.fetchClinics(data);
  }
  onClinicChange(e) {
    this.setState({
      clinic_id: e.target.value,
    });
  }

  onSelect(selectedList, selectedItem) {
    var tempList = [];
    selectedList.forEach((element) => {
      tempList.push(element.vaccineId);
    });
    this.setState({
      vaccines: tempList,
      selectedListVal: selectedList,
    });
  }
  onRemove(selectedList, removedItem) {
    var tempList = [];
    this.setState({
      vaccines: tempList,
    });
  }

  async componentDidMount() {
    await axios.get(`${URL_VAL}/clinic/slots`).then((response) => {
      console.log("Status Code : ", response.status);
      console.log("Status Code : ", response.data);
      if (response.status === 200) {
        console.log(response.data);
        if (response.data.length > 0) {
          this.setState({
            allslots: response.data,
          });
        }
      }
    });
    let currentDate = localStorage.getItem("currentDate");
    currentDate = computeCurrentDateTime(currentDate);
    console.log("returned date" + currentDate);
    await axios({
      url: `${URL_VAL}/appointment/due`,
      method: "get",
      params: {
        patientId: localStorage.getItem("mrn"),
        currentDate,
      },
    }).then((r) => {
      console.log("vaccines  due----");
      console.log(r.status + " " + r.data[0]);
      if (r.status === 200) {
        if (r.data.length > 0) {
          console.log(r.data);
          this.setState({
            vaccinesDue: r.data[0],
          });
        }
      }
    });
  }

  fetchClinics = (data) => {
    axios({
      url: `${URL_VAL}/clinic/appointments`,
      method: "get",
      data: null,
      params: data,
    }).then((response) => {
      console.log(response.status);
      console.log(response.data);
      if (response.status === 200) {
        console.log("inside 200 of fetch clinics", response.data);
        this.setState({ allClinics: response.data });
      }
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    if (this.validateSave() === true) {
      let currentDate = localStorage.getItem("currentDate");
      currentDate = computeCurrentDateTime(currentDate);
      console.log("returned date" + currentDate);
      let temp_slot = this.state.slot.split(":");
      let slot = {
        hour: parseInt(temp_slot[0]),
        minute: parseInt(temp_slot[1]),
        second: parseInt(temp_slot[2]),
      };
      const data = {
        patient_id: parseInt(localStorage.getItem("mrn")),
        clinic_id: parseInt(this.state.clinic_id),
        appointment_date: this.state.appointment_date,
        current_date: currentDate,
        vaccineIDs: this.state.vaccines,
        slot: slot,
      };
      console.log("is make appointmnet data fine", data);
      await axios
        .post(`${URL_VAL}/appointment`, data)
        .then((response) => {
          if (response.status === 200) {
            swal("Success", "Appointment scheduled successfully!", {
              dangerMode: false,
            });
            clearFields(e);
            console.log(
              this.state.selectedListVal
            );
            window.location.reload(false);
          } else {
            swal("Error", "Some error occured", "error", {
              dangerMode: true,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          var errObj = err.response.data;
          swal("Error", errObj.badRequest.msg, "error", {
            dangerMode: true,
          });
        });
    }
  };

  validateSave() {
    let isValid = true;
    if (
      this.state.appointment_date === null ||
      this.state.vaccines.length === 0 ||
      this.state.clinic_id === "Select" ||
      this.state.clinic_id === null ||
      this.state.slot === "Select" ||
      this.state.slot === null
    ) {
      swal("Error", "Enter all the details to make appointment", "error", {
        dangerMode: true,
      });
      isValid = false;
    }

    return isValid;
  }

  render() {
    let nextYear = new Date(localStorage.getItem('currentDate'));
    let dd = nextYear.getDate();
    let mm = nextYear.getMonth() + 1;
    const yyyy = nextYear.getUTCFullYear() + 1;
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    const today = nextYear.getUTCFullYear() + "-" + mm + "-" + dd;
    nextYear = yyyy + "-" + mm + "-" + dd;
    return (
      <>
        <form noValidate onSubmit={this.handleSubmit}>
          <div style={{ width: "1000px", display: "flex", paddingTop: "25px" }}>
            <div style={{ paddingRight: "30px", marginTop: "5px" }}>
              <FormLabel>Select Appointment Date*</FormLabel>
            </div>
            <div style={{ width: "1000px" }}>
              <input
                max={nextYear}
                min={today}
                type="date"
                onInputCapture={(e) => this.onDateChange(e)}
              ></input>
            </div>
          </div>
          <div style={{ width: "1000px", display: "flex", paddingTop: "25px" }}>
            <div style={{ paddingRight: "30px", marginTop: "5px" }}>
              <FormLabel>Select Appointment Time*</FormLabel>
            </div>
            <div style={{ width: "1000px" }}>
              <select
                className="form-select"
                data-width="fit"
                onChange={(e) => this.onSlotChange(e)}
              >
                <option selected value="Select">
                  Select
                </option>
                {Object.values(this.state.allslots).map((allslot) => (
                  <option value={allslot}>{allslot}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ width: "1000px", display: "flex", paddingTop: "25px" }}>
            <div style={{ paddingRight: "30px", marginTop: "5px" }}>
              <FormLabel>Select Clinic*</FormLabel>
            </div>
            <div style={{ width: "1000px" }}>
              <select
                className="form-select"
                data-width="fit"
                onChange={(e) => this.onClinicChange(e)}
              >
                <option selected value="Select">
                  Select
                </option>
                {Object.values(this.state.allClinics).map((i) => (
                  <option value={i.clinicId}>{i.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ width: "1000px", display: "flex", paddingTop: "25px" }}>
            <div style={{ paddingRight: "30px", marginTop: "5px" }}>
              <FormLabel>Select Vaccines(upto 4)*</FormLabel>
            </div>
            <div style={{ width: "1000px" }}>
              <Multiselect
                options={this.state.vaccinesDue} // Options to display in the dropdown
                onSelect={(e) => this.onSelect(e)} // Function will trigger on select event
                onRemove={(e) => this.onRemove(e)} // Function will trigger on remove event
                displayValue="vaccineName" // Property name to display in the dropdown options
                showCheckbox="true"
                hidePlaceholder="true"
                showArrow="true"
                id="dropdown"
                selectionLimit="4"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ width: "150px", marginTop: "20px" }}
            >
              Make Appointment
            </Button>
          </div>
        </form>
      </>
    );
  }
}

export default NewAppointmentComponent;
