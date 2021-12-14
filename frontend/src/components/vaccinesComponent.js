import React, { Component } from "react";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";
import swal from "sweetalert";
import Button from "@material-ui/core/Button";
import URL_VAL from "../utils/backend";
import DiseasesListComponent from "../components/DiseasesListComponent";
import Multiselect from "multiselect-react-dropdown";
import { FormLabel } from "@material-ui/core";

/*const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function VaccineComponent() {
  const classes = useStyles();

  const [errorMessage, setErrorMessage] = useState("");
  const [name, setVaccineName] = useState("");
  const [diseases, setDiseases] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [noOfShots, setNoOfShots] = useState("");
  const [shortInterval, setShortInterval] = useState("");
  const [duration, setDuration] = useState("");

  function clearFields(event) {
    Array.from(event.target).forEach((e) => (e.value = ""));
  }

  const handleSubmit = async (e) => {
    /*e.preventDefault();
    if (diseaseName === "" || description === "") {
      swal("Error", "Enter Details to add disease", "error", {
        dangerMode: true,
      });
    } else {
      axios.defaults.withCredentials = true;
      var payload = {
        "name":diseaseName,
        "description":description
        }
      await axios.post(`http://localhost:8080/disease`,payload)
        .then((response) => {
          if (response.status === 200) {
            swal("Success", "Disease added successfully!",{
                dangerMode:false
            })
            clearFields(e);
          } else if (response.status == 400) {
              console.log(errorMessage)
            setErrorMessage(response.data.message);
            swal("Error", errorMessage, "error", {
              dangerMode: true,
            });
          } else {
            console.log(response);
            swal("Error", errorMessage, "error", {
              dangerMode: true,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          swal("Disease name already exists", errorMessage, "error", {
            dangerMode: true,
          });
          console.log(errorMessage);
        });
    }
  };

  const sendDataToParent = async (names) => { // the callback. Use a better name
    await console.log(names);
  };


  return (
    <>
      <form className={classes.form} noValidate onSubmit={handleSubmit}>
        <TextField
          required
          name="Vaccine Name"
          label="Vaccine Name"
          type="text"
          id="name"
          autoFocus
          style={{ width: "1000px"}}
          onChange={(event) => {
            event.preventDefault();
            setVaccineName(event.target.value);
          }}
        />
        <div>
        <DiseasesListComponent sendDataToParent={sendDataToParent}/>
        </div>
       <div>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ width: "150px", marginTop:"20px"}}
        >
          Add Vaccine
        </Button>
        </div>
      </form>
    </>
  );
}
*/

class VaccineComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      diseases: [],
      name: "",
      diseaseIds: [],
      manufacturer: "",
      numOfShots: 0,
      shotInternalVal: 0,
      durationString: "",
    };

    this.onSelect = this.onSelect.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onManufacturerChange = this.onManufacturerChange.bind(this);
    this.onNumOfShotsChange = this.onNumOfShotsChange.bind(this);
    this.onShortIntervalChange = this.onShortIntervalChange.bind(this);
    //this.onDurationChange = this.onDurationChange.bind(this);
  }

  onNameChange(e) {
    this.setState({
      name: e.target.value,
    });
  }

  onSelect(selectedList, selectedItem) {
    var tempList = [];
    selectedList.forEach((element) => {
      tempList.add(element.diseaseId);
    });
    this.setState({
      diseaseIds: tempList,
    });
  }

  onRemove(selectedList, removedItem) {
    var tempList = [];
    selectedList.forEach((element) => {
      tempList.add(element.diseaseId);
    });
    this.setState({
      diseaseIds: tempList,
    });
  }

  onManufacturerChange(e) {
    this.setState({
      manufacturer: e.target.value,
    });
  }

  onNumOfShotsChange(e){
    this.setState({
        numOfShots: e.target.value,
      });
  }

  onShortIntervalChange(e){
    this.setState({
        shotInternalVal: e.target.value,
      });
  }

  componentDidMount() {
    console.log("inside did");
    axios.get(`http://localhost:8080/disease/diseases`).then((response) => {
      console.log("Status Code : ", response.status);
      console.log("Status Code : ", response.data);
      if (response.status === 200) {
        console.log(response.data);
        if (response.data.length > 0) {
          this.setState({
            diseases: response.data,
          });
        }
      }
    });
  }

  render() {
    return (
      <>
        <form noValidate>
          <TextField
            required
            name="Vaccine Name"
            label="Vaccine Name"
            type="text"
            id="name"
            autoFocus
            style={{ width: "1000px" }}
            onChange={(event) => {
              event.preventDefault();
            }}
          />
          <div style={{ width: "1000px", display: "flex", paddingTop: "25px" }}>
            <div style={{ paddingRight: "30px", marginTop: "5px" }}>
              <FormLabel>Diseases*</FormLabel>
            </div>
            <div style={{ width: "1000px" }}>
              <Multiselect
                options={this.state.diseases} // Options to display in the dropdown
                selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                onSelect={this.onSelect} // Function will trigger on select event
                onRemove={this.onRemove} // Function will trigger on remove event
                displayValue="name" // Property name to display in the dropdown options
                showCheckbox="true"
                hidePlaceholder="true"
              />
            </div>
          </div>
          <TextField
            required
            name="Manufacturer"
            label="Manufacturer"
            type="text"
            id="manufacturer"
            autoFocus
            style={{ width: "1000px" }}
            onChange={(event) => {
              event.preventDefault();
            }}
          />
          <TextField
            required
            name="Number of slots"
            label="Number of slots"
            type="text"
            id="numOfSlots"
            autoFocus
            style={{ width: "1000px" }}
            onChange={(event) => {
              event.preventDefault();
            }}
          />

          <TextField
            name="Short Interval"
            label="Short Interval"
            type="text"
            id="shortInterval"
            autoFocus
            style={{ width: "1000px" }}
            onChange={(event) => {
              event.preventDefault();
            }}
          />

          <TextField
            required
            name="Duration"
            label="Duration"
            type="text"
            id="duration"
            autoFocus
            style={{ width: "1000px" }}
            onChange={(event) => {
              event.preventDefault();
            }}
          />
          <div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ width: "150px", marginTop: "20px" }}
            >
              Add Vaccine
            </Button>
          </div>
        </form>
      </>
    );
  }
}

export default VaccineComponent;
