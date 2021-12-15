import React, { Component } from "react";
import { Redirect } from "react-router";
import axios from "axios";
import propTypes from "prop-types";
import { makeStyles } from '@material-ui/core/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Navbar from '../components/navbar';
import AppointmentsTabs from '../components/TabAppointmentComponent';

const theme = createTheme();

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        height: '80vh',
        fontFamily: 'Nunito',
    },
    container: {
        textAlign: 'center',
    },
    colorText: {
        color: '#614E42',
    },
}));

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