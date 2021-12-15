import React, { Component } from "react";
import axios from "axios";
import swal from "sweetalert";
import Button from "@material-ui/core/Button";
import Multiselect from "multiselect-react-dropdown";
import { FormLabel } from "@material-ui/core";

class CurrentDateSelectorComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCurrentDateSelection = (e) => {
    localStorage.setItem("currentDate", e.target.value);
  };

  render() {
    return (
      <>
        <div style={{ textAlign: "right", color:"white", marginRight:"100px" }}>
          <b className="mr-2">Select Current Date:</b>
          <input
            type="date"
            onInputCapture={(e) => this.handleCurrentDateSelection(e)}
          ></input>
        </div>
      </>
    );
  }
}

export default CurrentDateSelectorComponent;
