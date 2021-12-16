import React, { Component } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from '../components/navbar';
import AppointmentsTabs from '../components/TabAppointmentComponent';

const theme = createTheme();


class AppointmentComponent extends Component {
    render() {
        return (
            <>
                <Navbar />
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <AppointmentsTabs />
                </ThemeProvider>
            </>
        );
    }
}


export default AppointmentComponent