import React, { Component } from "react";
import axios from "axios";
import URL_VAL from "../../utils/backend";
import "../../utils/colorSchema.css";
import moment from "moment";
import {computeCurrentDateTime} from "../../utils/utilities";

class VaccinationHistoryComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      historyRecords: {},
    };
  }
  handleApptDate = (dateString) => {
    return moment(dateString.slice(0,10)).format("DD-MM-YYYY");
  };
  fetchVaccinationHistory = () => {
    let currentDate = localStorage.getItem("currentDate");
    currentDate = computeCurrentDateTime(currentDate);
    axios({
      url: `${URL_VAL}/appointment/history`,
      method: "get",
      params: {
        patientId: localStorage.getItem("mrn"),
        currentDate,
      },
    })
      .then((r) => {
        if (r.status === 200) {
          if (r.data !== undefined) {
            this.setState({
              historyRecords: r.data,
            });
          }
        }
      });
  };

    componentDidMount() {
      this.fetchVaccinationHistory();
    }

    render() {
      const { historyRecords } = this.state;
      let history = []
      for (const [vaccine, appointmentList] of Object.entries(historyRecords)) {
        const h = {
          vaccine,
          appointmentsCount: appointmentList.length,
          appointments: appointmentList
        };
        history = [...history, h]
      }
      return (
        <div>
          <div className="container mt-4 textFont" style={{ width: "900px" }}>
            <div className="row d-flex justify-content-center  mb-4">
              <h3 className="headingPadding">
                <b>VACCINATION HISTORY</b>
              </h3>
            </div>
            <h4>
              <div className="row d-flex justify-content-center headingBackground pb-2 pt-2">
                <div className="col-2 pb-2 border-right">Vaccine</div>
                <div className="col-3 pb-2 border-right">Number of Shots</div>
                <div className="col ">
                  <div
                    className="row pb-2"
                    style={{ justifyContent: "center" }}
                  >
                    Appointment Details
                  </div>
                  <div className="row">
                    <div className="col">Date</div>
                    <div className="col">Slot</div>
                    <div className="col">Clinic Name</div>
                  </div>
                </div>
              </div>
              {history.length ? (
                history.map((v) => (
                  <>
                    <div className="row d-flex justify-content-center">
                      <div className="col-2">{v.vaccine}</div>
                      <div className="col-3">{v.appointmentsCount}</div>
                      <div className="col">
                        {v.appointments.map((app) => (
                          <>
                            <div className="row">
                              <div className="col-4">
                                {moment(
                                  app.appointment.appointment_date.slice(0, 10)
                                ).format("DD/MM/YYYY")}
                              </div>
                              <div className="col">{app.appointment.slot}</div>
                              <div className="col">{app.clinicName}</div>
                            </div>
                          </>
                        ))}
                      </div>
                    </div>
                    <br />
                  </>
                ))
              ) : (
                <>
                  <div className="m-5 centerAlign">
                    {" "}
                    <b>No Vaccination History Available.</b>
                  </div>
                </>
              )}
            </h4>
            <br />
            <div />
          </div>
        </div>
      );
    }
  }
export default VaccinationHistoryComponent;
