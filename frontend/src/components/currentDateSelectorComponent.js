import React, { Component } from "react";
import axios from "axios";
import swal from "sweetalert";
import Button from "@material-ui/core/Button";
import Multiselect from "multiselect-react-dropdown";
import { FormLabel } from "@material-ui/core";
import moment from "moment";

class CurrentDateSelectorComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCurrentDateSelection = (e) => {
    localStorage.setItem("currentDate", e.target.value);
  };

  render() {
    let nextYear = new Date();
    const dd = nextYear.getDate();
    const mm = nextYear.getMonth() + 1;
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
        <div
          style={{ textAlign: "right", color: "white", marginRight: "100px" }}
        >
          <b className="mr-2">Select Current Date:</b>
          <input
            type="date"
            max={nextYear}
            min={today}
            onInputCapture={(e) => this.handleCurrentDateSelection(e)}
          ></input>
        </div>
      </>
    );
  }
}

export default CurrentDateSelectorComponent;
