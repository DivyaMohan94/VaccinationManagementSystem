import React, { Component } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from '../components/navbar';
import TabComponent from '../components/tabComponent'

const theme = createTheme();


class AdminComponent extends Component {
    render() {
      return (
          <>
        <Navbar />
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <TabComponent/>
      </ThemeProvider>
      </>
      );
    }
  }


  export default AdminComponent