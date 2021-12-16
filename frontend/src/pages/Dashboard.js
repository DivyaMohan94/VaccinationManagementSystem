import React, { Component } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Navbar from "../components/navbar";
import DashboardTabs from "../components/dashboardTabComponents";

const theme = createTheme();


class DashboardComponentMain extends Component {
  render() {
    return (
      <>
        <Navbar />
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <DashboardTabs />
        </ThemeProvider>
      </>
    );
  }
}

export default DashboardComponentMain;
