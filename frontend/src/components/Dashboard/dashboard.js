import React, { Component } from "react";
import axios from "axios";
import swal from "sweetalert";
import Button from "@material-ui/core/Button";
import URL_VAL from "../../utils/backend";
import Multiselect from "multiselect-react-dropdown";
import { FormLabel } from "@material-ui/core";
import Navbar from "../navbar";
import '../../utils/colorSchema.css';

class DashboardComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vaccinationsDue: [],
      //   [
      //   {
      //     vaccineName: "CovidVaccine",
      //     shotNumber: 3,
      //     dueDate: "2022-05-04T18:30:00.000+00:00",
      //     vaccineId: 1,
      //   },
      //   {
      //     vaccineName: "DPTVaccine",
      //     shotNumber: 1,
      //     dueDate: "2021-12-13T18:30:00.000+00:00",
      //     vaccineId: 2,
      //   },
      //   {
      //     vaccineName: "DPTVaccinte",
      //     shotNumber: 1,
      //     dueDate: "2021-12-13T18:30:00.000+00:00",
      //     vaccineId: 3,
      //   },
      // ],
      futureAppointments: [],
      // [
      // {
      //   apptSlot: "9:10",
      //   apptDate: "2021-03-01",
      //   apptVaccines: ["a", "b", "c"],
      //   apptId: 2,
      // },
      // {
      //   apptSlot: "10:15",
      //   apptDate: "2021-03-01",
      //   apptVaccines: ["a"],
      //   apptId: 1,
      // },
      // {
      //   apptSlot: "01:20",
      //   apptDate: "2021-03-01",
      //   apptVaccines: ["a", "b"],
      //   apptId: 3,
      // },
      // ]
    };
  }

  handleVaccineDate = (dateString) => {
    const dt = new Date(dateString).toDateString();
    const d = `${`${dt.split(" ")[1]} ${dt.split(" ")[2]}, ${
      dt.split(" ")[3]
    }`}`;
    return d;
  };

  handleApptDate = (dateString) => {
    const dt = new Date(dateString.slice(0,10)).toDateString();
    const d = `${`${dt.split(" ")[1]} ${dt.split(" ")[2]}, ${
      dt.split(" ")[3]
    }`}`;
    return d;
  };

  fetchDashboardData = () => {
    let currentDate = localStorage.getItem("currentDate");
    //add time here to hardcoded string
    let formatString = "-00-00-00";
    currentDate += formatString;

    const data = {
      patient_id: parseInt(localStorage.getItem("id")),
      current_date: currentDate,
    };

    axios({
      url: `${URL_VAL}/appointment/updatestatus`,
      method: "post",
      data,
    })
      .then((response) => {
        if (response.status === 200) {
          axios({
            url: `${URL_VAL}/appointment/due`,
            method: "get",
            params: {
              patientId: localStorage.getItem("id"),
              currentDate,
            },
          }).then((r) => {
            console.log(r.status + " " + r.data[0]);
            if (r.status === 200) {
              if (r.data.length > 0) {
                console.log(r.data);
                this.setState({
                  vaccinationsDue: r.data[0],
                  futureAppointments: r.data[1],
                });
              }
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleAppointmentVaccines = (vaccineList) => {
    return (<>{vaccineList.length > 0? <>{vaccineList.map((v) => `${v.name},`)}</>: <></>}</>);
  }

  componentDidMount() {
    localStorage.setItem("id", 1);
    // localStorage.setItem("currentDate", new Date().toISOString().slice(0, 10));
    console.log("inside Dashboard ComponentDiMount");
    this.fetchDashboardData();
  }

  render() {
    const { vaccinationsDue, futureAppointments } = this.state;
    return (
      <>
        <div className="container mt-4 textFont" style={{ width: "900px" }}>
          <div className="row d-flex justify-content-center  mb-4">
            <h3 className="headingPadding">
              <b>DASHBOARD</b>
            </h3>
          </div>
          {/* <div className="row d-flex mb-4" style={{ textAlign: "right" }}>
            <div style={{ textAlign: "right" }}>
              <b className="mr-2">Select Current Date:</b>
              <input
                type="date"
                onInputCapture={(e) => this.handleCurrentDateSelection(e)}
              ></input>
            </div>
          </div> */}
          <br />
          <div className="row">
            <div className="col">
              <h4 className="mb-4 centerAlign">
                <b>Vaccinations Due</b>
              </h4>
              <div className="row d-flex">
                <div className="col">
                  <h4>
                    <div className="border-bottom row headingBackground pb-2 pt-2">
                      <div className="col-4">Vaccine</div>
                      <div className="col">Shot Number</div>
                      <div className="col" style={{ textAlign: "right" }}>
                        Due On
                      </div>
                    </div>
                  </h4>
                </div>
              </div>
              {vaccinationsDue.length > 0 ? (
                vaccinationsDue.map((item) => (
                  <>
                    <h4>
                      <div className="border-bottom row">
                        <div className="col-4">{item.vaccineName}</div>
                        <div className="col-2">{item.shotNumber}</div>
                        <div className="col" style={{ textAlign: "right" }}>
                          {this.handleVaccineDate(item.dueDate)}
                        </div>
                      </div>
                    </h4>
                    <br />
                  </>
                ))
              ) : (
                <div className="orangeFont m-5 centerAlign">
                  {" "}
                  <b>No Vaccinations Due</b>
                </div>
              )}
            </div>
          </div>
          <br />
          <br />
          <div className="row">
            <div className="col">
              <h4 className="mb-4 centerAlign">
                <b>Appointments Scheduled</b>
              </h4>
              <h4>
                {" "}
                <div className="border-bottom row headingBackground pb-2 pt-2">
                  <div className="col-4">Vaccines Scheduled</div>
                  <div className="col">Clinic</div>
                  <div className="col">Time Slot</div>
                  <div className="col" style={{ textAlign: "right" }}>
                    Date
                  </div>
                </div>
              </h4>
              {futureAppointments.length ? (
                futureAppointments.map((item) => (
                  <>
                    <h4>
                      <div className="border-bottom row">
                        <div className="col">
                          {this.handleAppointmentVaccines(
                              item.appointment.vaccines
                            )
                          }
                        </div>
                        <div className="col">{item.clinicName}</div>
                        <div className="col">{item.appointment.slot}</div>
                        <div className="col" style={{ textAlign: "right" }}>
                          {this.handleApptDate(
                            item.appointment.appointment_date
                          )}
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

export default DashboardComponent;
