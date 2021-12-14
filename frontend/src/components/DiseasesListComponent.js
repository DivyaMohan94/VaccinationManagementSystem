import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import { useEffect, Component } from "react";
import Multiselect from 'multiselect-react-dropdown';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

/*const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];*/

/*export default function MultipleSelectCheckmarks({sendDataToParent}) {
  const [personName, setPersonName] = React.useState([]);
  const [diseaseNames, setDiseaseNames] = React.useState([]);

  useEffect(() => {
    var names = getDiseases();
    setDiseaseNames(names);
  });

  const getDiseases = async () => {
        const res = await axios.get(`http://localhost:8080/disease/diseases`)
        console.log(res.data)
        return res.data;
}

  const handleChange = async(event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a the stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
    await sendDataToParent(value);
  };

  console.log("namesssss")

  console.log(diseaseNames);
  return (
      
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">Select</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {Object.keys().map((name) => (
            <MenuItem key={name.name} value={name.name}>
              <Checkbox checked={personName.indexOf(name.name) > -1} />
              <ListItemText primary={name.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}*/

class DiseaseListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      diseases: [],
      person: [],
    };
    this.onSelect = this.onSelect.bind(this);
    this.onRemove = this.onRemove.bind(this);
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

  onSelect(selectedList, selectedItem) {
      console.log('onselect')
      console.log(selectedList);

}


onRemove(selectedList, removedItem) {
    console.log(selectedList)
}

  render() {
    return (
      <div>
          <div style={{width:"700px"}}>
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
    );
  }
}

export default DiseaseListComponent;
