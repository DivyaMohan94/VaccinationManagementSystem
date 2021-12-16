import React, { Component } from "react";
import axios from "axios";
import swal from "sweetalert";
import Button from "@material-ui/core/Button";
import URL_VAL from "../../utils/backend";
import "../../utils/colorSchema.css";
import { computeCurrentDateTime } from "../../utils/utilities";
import moment from "moment";
import Modal from '@mui/material/Modal';
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import {FormLabel} from "@material-ui/core";
import Multiselect from "multiselect-react-dropdown";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

class FutureAppointmentComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      futureAppointments: [],
      checkinAppointment: [],
      open: false,
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
    console.log("hitting this date", e);
    this.setState({
      appointment_date: e.target.value,
    });
  }
  async onSlotChange(e) {
    console.log("hitting this", e);
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

  handleApptDate = (dateString) => {
    return moment(dateString.slice(0,10)).format("DD-MM-YYYY");
  };

  handleAppointmentVaccines = (vaccineList) => {
    return <>{vaccineList.map((v) => `${v.name}, `)}</>;
  };

  handleCancel = (apptId) => {
    console.log("handling cancel for " + apptId);
    axios({
      url: `${URL_VAL}/appointment/cancel/${apptId}`,
      method: "delete",
    }).then((response) => {
      console.log(response.status);
      console.log(response.data);
      if (response.status === 200) {
        swal("Success", "Appointment Cancelled!", {
          dangerMode: false,
        });
      }
    });
  };

  handleCheckIn = (apptId) => {
    const data = {
      patient_id: parseInt(localStorage.getItem("mrn")),
      appointment_id: apptId,
    };
    console.log("handling checkin for " + apptId);
    axios({
      url: `${URL_VAL}/appointment/makecheckin`,
      method: "post",
      data
    }).then((response) => {
      console.log(response.status);
      console.log(response.data);
      if (response.status === 200) {
        swal("Success", "Checked In Successfully!", {
          dangerMode: false,
        });
      }
    });
  };

  handleUpdate = (aapid,e) => {
    e.preventDefault()
    let currentDate = localStorage.getItem("currentDate");
    currentDate = computeCurrentDateTime(currentDate);
    let temp_slot = this.state.slot.split(":");
    let slot = {
      hour: parseInt(temp_slot[0]),
      minute: parseInt(temp_slot[1]),
      second: parseInt(temp_slot[2]),
    };
    const data = {
      appointment_id: aapid,
      clinic_id: parseInt(this.state.clinic_id),
      appointment_date: this.state.appointment_date,
      current_date: currentDate,
      vaccineIDs: this.state.vaccines,
      slot: slot
    };

    console.log("update data",data)

    axios
        .post(`${URL_VAL}/appointment/update`, data)
        .then((response) => {
          if (response.status === 200) {
            swal("Success", "Appointment Updated successfully!", {
              dangerMode: false,
            });
            console.log(
                "this.state.selectedListVal----",
                this.state.selectedListVal
            );
            //window.location.reload(false);
            //this.onRemove(this.state.selectedListVal)
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
          swal("Error", errObj.badRequest.msg, "error", {
            dangerMode: true,
          });
        });
    this.handleclose()
  };

  fetchFutureAppointments = (data) => {
    axios({
      url: `${URL_VAL}/appointment/future`,
      method: "get",
      data: null,
      params: data,
    }).then((response) => {
      console.log(response.status);
      console.log(response.data);
      if (response.status === 200) {
        if (response.data.length > 0) {
          console.log(response.data);
          this.setState({
            futureAppointments: response.data,
          });
        }
      }
    });
  };

  fetchCheckinAppointments = (data) => {
    axios({
      url: `${URL_VAL}/appointment/checkin/eligibleAppointments`,
      method: "get",
      data: null,
      params: data,
    }).then((response) => {
      console.log(response.status);
      console.log("checkin eligible", response.data);
      if (response.status === 200) {
        if (response.data.length > 0) {
          console.log(response.data);
          this.setState({
            checkinAppointment: response.data,
          });
        }
      }
    });
  };

  async componentDidMount() {
    let currentDate = localStorage.getItem("currentDate");
    currentDate = computeCurrentDateTime(currentDate);
    console.log("returned date" + currentDate);

    const data = {
      patient_id: parseInt(localStorage.getItem("mrn")),
      current_date: currentDate,
    };

    await this.fetchFutureAppointments(data);
    await this.fetchCheckinAppointments(data);

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
        console.log("slots are there : ", this.state.allslots);
      }
    });
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

  handleOpen = () =>{
    this.setState({
        open: true
    })
  }

  handleclose = () =>{
    this.setState({
      open: false
    })
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
    const { futureAppointments, checkinAppointment, open} = this.state;
    return (
      <>
        <div className="container-lg">
          <div className="row">
            <div className="col">
              <h4 className="mb-4 centerAlign">
                <b>Appointments Scheduled</b>
              </h4>
              <h4>
                {" "}
                <div className="border-bottom row headingBackground  pb-2 pt-2">
                  <div className="col-4 ">Vaccines Scheduled</div>
                  <div className="col">Clinic</div>
                  <div className="col ">Time Slot</div>
                  <div className="col " style={{ textAlign: "right" }}>
                    Date
                  </div>
                  <>
                    <div className="col">Actions</div>
                  </>
                </div>
              </h4>
              {futureAppointments.length ? (
                futureAppointments.map((item) => (
                  <>
                    <h4>
                      <div className="border-bottom row">
                        <div className="col-4">
                          {this.handleAppointmentVaccines(
                            item.appointment.vaccines
                          )}
                        </div>
                        <div className="col">{item.clinicName}</div>
                        <div className="col">{item.appointment.slot}</div>
                        <div className="col" style={{ textAlign: "right" }}>
                          {this.handleApptDate(
                            item.appointment.appointment_date
                          )}
                        </div>
                        <div className="col">
                          {checkinAppointment.includes(item.appointment.appointmentId) ? (<>
                            <div>{checkinAppointment.includes(item.appointment.appointmentId)} </div>
                            < Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                style={{width: "150px", marginTop: "10px"}}
                                onClick={() =>
                                    this.handleCheckIn(item.appointment.appointmentId)
                                }
                            >
                              Check-In
                            </Button>
                          </>):(<></>)
                          }
                          <br />
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            style={{ width: "150px", marginTop: "10px" }}
                            onClick={() =>
                              this.handleOpen()
                            }
                          >
                            Update
                          </Button>
                          <Modal
                          open={open}
                          onClose={this.handleclose}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                          >
                            <Box sx={style}>
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
                                <div >
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
                                    onClick={(e) => this.handleUpdate(item.appointment.appointmentId,e)}
                                >
                                  Update Appointment
                                </Button>
                              </div>
                            </form>
                            </Box>
                        </Modal>

                          <br />
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            style={{
                              width: "150px",
                              marginTop: "10px",
                              marginBottom: "10px",
                            }}
                            onClick={() =>
                              this.handleCancel(item.appointment.appointmentId)
                            }
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </h4>
                    <br />
                  </>
                ))
              ) : (
                <div className="orangeFont m-5 centerAlign">
                  {" "}
                  <b>There are no appointments scheduled at the moment.</b>
                </div>
              )}
            </div>
          </div>
          <br />
          <div />
        </div>
      </>
    );
  }
}

export default FutureAppointmentComponent;
