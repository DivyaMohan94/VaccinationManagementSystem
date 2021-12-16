import React, { Component } from "react";

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
    let dd = nextYear.getDate();
    let mm = nextYear.getMonth() + 1;
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
