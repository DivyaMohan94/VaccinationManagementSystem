import React, { Component } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from '../components/navbar';
import ReportsTab from '../components/Reports/ReportsTab';

const theme = createTheme();


class Report extends Component {
    render() {
        return (
            <>
                <Navbar />
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <ReportsTab />
                </ThemeProvider>
            </>
        );
    }
}


export default Report