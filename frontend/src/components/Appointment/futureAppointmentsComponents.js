import React, { Component } from "react";
import axios from "axios";
import swal from "sweetalert";
import Button from "@material-ui/core/Button";
import URL_VAL from "../../utils/backend";
import Multiselect from "multiselect-react-dropdown";
import { FormLabel } from "@material-ui/core";
import "../../utils/colorSchema.css";

class FutureAppointmentComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      futureAppointments: [],
      //   [
      //   {
      //     apptSlot: "9:10",
      //     apptDate: "2021-03-01",
      //     apptVaccines: ["a", "b", "c"],
      //     apptId: 2,
      //   },
      //   {
      //     apptSlot: "10:15",
      //     apptDate: "2021-03-01",
      //     apptVaccines: ["a"],
      //     apptId: 1,
      //   },
      //   {
      //     apptSlot: "01:20",
      //     apptDate: "2021-03-01",
      //     apptVaccines: ["a", "b"],
      //     apptId: 3,
      //   },
      // ],
    };
  }

  handleApptDate = (dateString) => {
    const dt = new Date(dateString.slice(0, 10)).toDateString();
    const d = `${`${dt.split(" ")[1]} ${dt.split(" ")[2]}, ${
      dt.split(" ")[3]
    }`}`;
    return d;
  };

  handleAppointmentVaccines = (vaccineList) => {
    return <>{vaccineList.map((v) => `${v.name}, `)}</>;
  };

  handleBlah = (apptId) => {
    console.log("handling blah for " + apptId);
  };

  handleCheckIn = (apptId) => {
    console.log("handleCheckIn for " + apptId);
  };

  handleUpdate = (apptId) => {
    console.log("handleUpdate for " + apptId);
  };

  componentDidMount() {
    let currentDate = localStorage.getItem("currentDate");
    //add time here to hardcoded string
    let formatString = "-00-00-00";
    currentDate += formatString;

    const data = {
      patient_id: parseInt(localStorage.getItem("id")),
      current_date: currentDate,
    };

    axios({
      url: `${URL_VAL}/appointment/future`,
      method: "get",
      data: null,
      params: data,
    }).then((response) => {
      console.log(response.status + " " + response.data);
      if (response.status === 200) {
        if (response.data.length > 0) {
          console.log(response.data);
          this.setState({
            futureAppointments: response.data,
          });
        }
      }
    });
  }

  render() {
    const { futureAppointments } = this.state;
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
                          {this.handleAppointmentVaccines(item.vaccines)}
                        </div>
                        <div className="col">{item.slot}</div>
                        <div className="col" style={{ textAlign: "right" }}>
                          {this.handleApptDate(item.appointment_date)}
                        </div>
                        <div className="col">
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            style={{ width: "150px", marginTop: "10px" }}
                            onClick={() =>
                              this.handleCheckIn(item.appointmentId)
                            }
                          >
                            Check-In
                          </Button>
                          <br />
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            style={{ width: "150px", marginTop: "10px" }}
                            onClick={() =>
                              this.handleUpdate(item.appointmentId)
                            }
                          >
                            Update
                          </Button>
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
                            onClick={() => this.handleBlah(item.appointmentId)}
                          >
                            Blah
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
