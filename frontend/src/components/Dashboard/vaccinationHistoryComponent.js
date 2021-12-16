import React, { Component } from "react";
import axios from "axios";
import swal from "sweetalert";
import Button from "@material-ui/core/Button";
import URL_VAL from "../../utils/backend";
import Multiselect from "multiselect-react-dropdown";
import { FormLabel } from "@material-ui/core";
import Navbar from "../navbar";
import "../../utils/colorSchema.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

class VaccinationHistoryComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      historyRecords: {},
    };
  }

  handleApptDate = (dateString) => {
    const dt = new Date(dateString.slice(0, 10)).toDateString();
    const d = `${dt.split(" ")[1]} ${dt.split(" ")[2]}, ${dt.split(" ")[3]}`;
    return d;
  };

  fetchVaccinationHistory = () => {
    let currentDate = localStorage.getItem("currentDate");
    //add time here to hardcoded string
    let formatString = "-00-00-00";
    currentDate += formatString;

    const data = {
      patientId: parseInt(localStorage.getItem("mrn")),
      currentDate: currentDate,
    }

    axios({
      url: `${URL_VAL}/appointment/history`,
      method: "get",
      params: {
        patientId: localStorage.getItem("mrn"),
        currentDate,
      },
    })
      .then((r) => {
        console.log(r.status + " " + r.data);
        if (r.status === 200) {
          if (r.data !== undefined) {
            console.log(r.data);
            this.setState({
              historyRecords: r.data,
            });
          }
        }
      });
  };

    componentDidMount() {
      localStorage.setItem("id", 1);
      // localStorage.setItem("currentDate", new Date().toISOString().slice(0, 10));
      console.log("inside Dashboard vacc history ComponentDiMount");
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
          //  <div className="col">{app.appointment_date}</div>
          //                     <div className="col">{app.slot}</div>
          //                     <div className="col">{app.clinicName}</div>
        };
        history = [...history, h]
      }
    
      console.log(history);


      return (
        <div>
          <div className="container mt-4 textFont" style={{ width: "900px" }}>
            <div className="row d-flex justify-content-center  mb-4">
              <h3 className="headingPadding">
                <b>VACCINATION HISTORY</b>
              </h3>
            </div>
            <div className="row d-flex justify-content-center">
              <div className="col">Vaccine</div>
              <div className="col">Number of Shots</div>
              <div className="col">Appointment Details</div>
            </div>
            {history.map((v) => (
              <div className="row d-flex justify-content-center">
                <div className="col">{v.vaccine}</div>
                <div className="col">{v.appointmentsCount}</div>
                <div className="col">
                  {v.appointments.map((app) => (
                    <>
                      <div className="row">
                        <div className="col-4">
                          {app.appointment.appointment_date}
                        </div>
                        <div className="col">{app.appointment.slot}</div>
                        <div className="col">{app.clinicName}</div>
                      </div>
                    </>
                  ))}
                </div>
              </div>
            ))}
            <br />
            <div />
          </div>
        </div>
      );
    }
  }
export default VaccinationHistoryComponent;
