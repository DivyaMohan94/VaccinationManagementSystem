import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import MenuItem from "@mui/material/MenuItem";
import Axios from "axios";
import swal from "sweetalert";

export default function UpdateModal(props) {
  const [row, setRow] = React.useState();
  const [col, setCol] = React.useState();
  const reservation = props.reservationId;
  const updateReservation = async () => {
    await Axios.post("/reservation/modify", {
      token: localStorage.getItem("token"),
      reservationId: reservation._id,
      row: row,
      col: col,
    }).then((response) => {
      if (response.status === 200) {
        swal("Success", "Reservation Updated", "success").then((success) => {
          if (success) {
            props.handleClose();
          }
        });
      } else {
        swal({
          title: "Update failed",
          text: "Failed to update reservation",
          icon: "error",
        }).then(function (isConfirm) {
          if (isConfirm) {
            props.handleClose();
          }
        });
      }
    });
  };
  const helper = (e) => {
    const seat = e.target.value;
    const temp = seat.split("");
    setRow(temp[0]);
    setCol(temp[1]);
  };

  return (
    <div>
      <Dialog open={props.open} onClose={props.handleClose}>
        <DialogTitle>Change Seats</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select a new seat
            {/* {props.reservationId} */}
          </DialogContentText>
          <TextField
            required
            id="rowSelect"
            name="rowSelect"
            label="Row"
            select
            style={{ minWidth: "30vh" }}
            autoWidth
            onChange={helper}
          >
            {reservation ? (
              reservation.flightName.seatAvailable.map((item) => {
                if (item.isReserved) {
                  return <span></span>;
                } else {
                  return (
                    <MenuItem key={item._id} value={item.row + item.col}>
                      {item.row + item.col}
                    </MenuItem>
                  );
                }
              })
            ) : (
              <MenuItem>No seats</MenuItem>
            )}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose}>Cancel</Button>
          <Button onClick={updateReservation}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
