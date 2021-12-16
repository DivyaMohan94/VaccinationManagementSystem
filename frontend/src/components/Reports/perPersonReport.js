import React, { Component } from "react";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import swal from "sweetalert";
import Button from "@material-ui/core/Button";
import URL_VAL from "../../utils/backend";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {
  Container,
  Card,
  Typography,
  CardContent,
} from "@material-ui/core";
import moment from "moment";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";

function clearFields(event) {
  Array.from(event.target).forEach((e) => (e.value = ""));
}

class SystemReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fromDate: "",
      toDate: "",
      reportData: [],
    };

    this.onFromDateChange = this.onFromDateChange.bind(this);
    this.onToDateChange = this.onToDateChange.bind(this);
    this.fetchReport = this.fetchReport.bind(this);
    this.validate = this.validate.bind(this);
  }

  onFromDateChange(e) {
    console.log(e);
    this.setState({
      fromDate: e,
    });
  }

  onToDateChange(e) {
    console.log(e);
    this.setState({
      toDate: e,
    });
  }

  componentDidMount() {
    console.log("inside did");
  }

  fetchReport = () => {
    if (this.validate() === true) {
      const data = {
        patientId: localStorage.getItem("mrn"),
        fromDate: moment(this.state.fromDate).format("YYYY-MM-DD-HH"),
        toDate: moment(this.state.toDate).format("YYYY-MM-DD-HH"),
      };
      console.log(data);
      axios({
        url: `${URL_VAL}/reports/perPatientReport`,
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
              reportData: response.data,
            });
          }
        }
      });
    }
  };

  validate() {
    let isValid = true;
    if (
      this.state.fromDate === "" ||
      this.state.toDate === ""
    ) {
      swal("Error", "Enter all the details to generate report", "error", {
        dangerMode: true,
      });
      isValid = false;
    }

    return isValid;
  }

  render() {
    var myd = moment(localStorage.getItem("currentDate"));

    var date = localStorage.getItem("currentDate");
    var max = myd.add(12, "months");

    console.log(max._d);

    console.log(this.state.reportData);

    console.log(myd.format("YYYY-MM-DD-HH"));

    return (
      <>
        <Box
          sx={{
            minWidth: 120,
            display: "inline-flex",
          }}
        >
          <div style={{ paddingRight: "40px" }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                disablePast
                minDate={new Date(date)}
                maxDate={max._d}
                label="From Date"
                inputFormat="MM/dd/yyyy"
                value={this.state.fromDate}
                onChange={this.onFromDateChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </div>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              disablePast
              minDate={new Date(localStorage.getItem("currentDate"))}
              maxDate={max._d}
              label="To Date"
              inputFormat="MM/dd/yyyy"
              value={this.state.toDate}
              onChange={this.onToDateChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Box>

        <div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ width: "150px", marginTop: "20px" }}
            onClick={this.fetchReport}
          >
            Generate
          </Button>
        </div>
        {this.state.reportData.length ? (
          <Container fixed>
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <Typography
                  sx={{ fontSize: 30 }}
                  color="text.secondary"
                  gutterBottom
                  variant="h6"
                >
                  Total Number of Appointments : {this.state.reportData[0]}
                </Typography>
                <Typography
                  sx={{ fontSize: 30 }}
                  color="text.secondary"
                  gutterBottom
                  variant="h6"
                >
                  Total Number of No Shows : {this.state.reportData[1]}
                </Typography>
                <Typography
                  sx={{ fontSize: 30 }}
                  color="text.secondary"
                  gutterBottom
                  variant="h6"
                >
                  No Show Rate : {this.state.reportData[2]}
                </Typography>
              </CardContent>
            </Card>
          </Container>
        ) : (
          <div></div>
        )}
      </>
    );
  }
}

export default SystemReport;
