// import React, { Component } from "react";
// import axios from "axios";
// import swal from "sweetalert";
// import Button from "@material-ui/core/Button";
// import URL_VAL from "../utils/backend";
// import Multiselect from "multiselect-react-dropdown";
// import { FormLabel } from "@material-ui/core";
// import "../utils/colorSchema.css";


// class FutureAppointmentComponent extends Component {
//   constructor(props) {
//     super(props);
//     this.props = {
//       futureAppointments:
//       [
//       {
//         apptSlot: "9:10",
//         apptDate: "2021-03-01",
//         apptVaccines: ["a", "b", "c"],
//         apptId: 2,
//       },
//       {
//         apptSlot: "10:15",
//         apptDate: "2021-03-01",
//         apptVaccines: ["a"],
//         apptId: 1,
//       },
//       {
//         apptSlot: "01:20",
//         apptDate: "2021-03-01",
//         apptVaccines: ["a", "b"],
//         apptId: 3,
//       },
//       ]
//     };
//   }

//   handleDate = (dateString) => {
//     const dt = new Date(dateString).toDateString();
//     const d = `${`${dt.split(" ")[1]} ${dt.split(" ")[2]}, ${
//       dt.split(" ")[3]
//     }`}`;
//     return d;
//   };

//   handleAppointmentVaccines = (vaccineList) => {
//     return <>{vaccineList.map((v) => `${v}, `)}</>;
//   };

//   componentDidMount() {
//     // localStorage.setItem("id", 1);
//     // localStorage.setItem("currentDate", new Date().toISOString().slice(0, 10));
//     // console.log("inside Dashboard appointment ComponentDiMount");
//   }

//   render() {
// 		// const { futureAppointments } = this.state;
// 		const { showButtons, futureAppointments } = this.props;
//     return (
//       <>
//         <div className="row">
//           <div className="col">
//             <h4 className="mb-4 centerAlign">
//               <b>Appointments Scheduled</b>
//             </h4>
//             <h4>
//               {" "}
//               <div className="border-bottom row headingBackground  pb-2 pt-2">
//                 <div className="col-4 ">Vaccines Scheduled</div>
//                 <div className="col ">Time Slot</div>
//                 <div className="col " style={{ textAlign: "right" }}>
//                   Date
//                 </div>
//                 {showButtons === true ? (
//                   <>
//                     <div className="col">Actions</div>
//                   </>
//                 ) : (
//                   <></>
//                 )}
//               </div>
//             </h4>
//             {futureAppointments.length ? (
//               futureAppointments.map((item) => (
//                 <>
//                   <h4>
//                     <div className="border-bottom row">
//                       <div className="col-4">
//                         {this.handleAppointmentVaccines(item.apptVaccines)}
//                       </div>
//                       <div className="col">{item.apptSlot}</div>
//                       <div className="col" style={{ textAlign: "right" }}>
//                         {this.handleDate(item.apptDate)}
//                       </div>
//                       {showButtons === true ? (
//                         <>
//                           <div className="col">
//                             <Button
//                               type="submit"
//                               variant="contained"
//                               color="primary"
//                               style={{ width: "150px", marginTop: "10px" }}
//                             >
//                               Check-In
//                             </Button>
//                             <br />
//                             <Button
//                               type="submit"
//                               variant="contained"
//                               color="primary"
//                               style={{ width: "150px", marginTop: "10px" }}
//                             >
//                               Update
//                             </Button>
//                             <br />
//                             <Button
//                               type="submit"
//                               variant="contained"
//                               color="primary"
//                               style={{ width: "150px", marginTop: "10px", marginBottom: "10px" }}
//                             >
//                               Blah
//                             </Button>
//                           </div>
//                         </>
//                       ) : (
//                         <></>
//                       )}
//                     </div>
//                   </h4>
//                   <br />
//                 </>
//               ))
//             ) : (
//               <div className="orangeFont m-5 centerAlign">
//                 {" "}
//                 <b>There are no appointments scheduled at the moment.</b>
//               </div>
//             )}
//           </div>
//         </div>
//         <br />
//         <div />
//       </>
//     );
//   }
// }

// export default FutureAppointmentComponent;
