import React, { Component } from "react";
import axios from "axios";
import URL_VAL from "../../utils/backend";
import '../../utils/colorSchema.css';
import { computeCurrentDateTime } from '../../utils/utilities';
import moment from "moment";
class DashboardComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vaccinationsDue: [],
      futureAppointments: [],
    };
  }

  handleVaccineDate = (dateString) => {
    return moment(dateString).format("DD-MM-YYYY");
  };
  handleApptDate = (dateString) => {
    return moment(dateString.slice(0,10)).format("DD-MM-YYYY");
  };
  fetchDashboardData = () => {
    let currentDate = localStorage.getItem("currentDate");
    currentDate = computeCurrentDateTime(currentDate);
    const data = {
      patient_id: parseInt(localStorage.getItem("mrn")),
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
              patientId: localStorage.getItem("mrn"),
              currentDate,
            },
          }).then((r) => {
            if (r.status === 200) {
              if (r.data.length > 0) {
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
                <div className=" m-5 centerAlign">
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
