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

class SystemReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clinicId: "",
      fromDate: "",
      toDate: "",
      clinicList: [],
      clinicName: "",
      reportData: [],
    };

    this.onClinicChange = this.onClinicChange.bind(this);
    this.onFromDateChange = this.onFromDateChange.bind(this);
    this.onToDateChange = this.onToDateChange.bind(this);
    this.fetchReport = this.fetchReport.bind(this);
    this.validate = this.validate.bind(this);
  }

  onClinicChange(e) {
    this.setState({
      clinicName: e.target.value,
    });
  }

  onFromDateChange(e) {
    this.setState({
      fromDate: e,
    });
  }

  onToDateChange(e) {
    this.setState({
      toDate: e,
    });
  }

  componentDidMount() {
    axios.get(`${URL_VAL}/clinic/all`).then((response) => {
      console.log("Status Code : ", response.status);
      console.log("Status Code : ", response.data);
      if (response.status === 200) {
        if (response.data.length > 0) {
          this.setState({
            clinicList: response.data,
          });
        }
      }
    });
  }

  fetchReport = () => {
    if (this.validate() === true) {
      const data = {
        clinicId: this.state.clinicName,
        fromDate: moment(this.state.fromDate).format("YYYY-MM-DD-HH"),
        toDate: moment(this.state.toDate).format("YYYY-MM-DD-HH"),
      };
      axios({
        url: `${URL_VAL}/reports/systemReport`,
        method: "get",
        data: null,
        params: data,
      }).then((response) => {
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
      this.state.clinicName === "" ||
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

    return (
      <>
        <Box
          sx={{
            minWidth: 120,
            display: "inline-flex",
          }}
        >
          <FormControl fullWidth style={{ paddingRight: "40px" }}>
            <InputLabel id="demo-simple-select-label">Clinics</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={this.state.clinicName}
              label="Clinic"
              onChange={this.onClinicChange}
            >
              {Object.values(this.state.clinicList).map((clinic) => (
                <MenuItem
                  value={clinic.clinicId}
                  tabindex={clinic.clinicId}
                  id={clinic.clinicId}
                >
                  {clinic.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
