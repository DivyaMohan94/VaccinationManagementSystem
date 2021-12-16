import React, { Component } from "react";
import axios from "axios";
import swal from "sweetalert";
import Button from "@material-ui/core/Button";
import URL_VAL from "../../utils/backend";
import Multiselect from "multiselect-react-dropdown";
import { FormLabel } from "@material-ui/core";
import "../../utils/colorSchema.css";
import { computeCurrentDateTime } from "../../utils/utilities";

class PastAppointmentComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pastAppointments: [],
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

  componentDidMount() {
    let currentDate = localStorage.getItem("currentDate");
    currentDate = computeCurrentDateTime(currentDate);
    console.log("returned date" + currentDate);

    const data = {
      patient_id: parseInt(localStorage.getItem("mrn")),
      current_date: currentDate,
    };

    axios({
      url: `${URL_VAL}/appointment/past`,
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
            pastAppointments: response.data,
          });
        }
      }
    });
  }

  render() {
    const { pastAppointments } = this.state;
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
                </div>
              </h4>
              {pastAppointments.length ? (
                pastAppointments.map((item) => (
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
                      </div>
                    </h4>
                    <br />
                  </>
                ))
              ) : (
                <div className="m-5 centerAlign">
                  {" "}
                  <b>There are no past appointments to view.</b>
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

export default PastAppointmentComponent;
