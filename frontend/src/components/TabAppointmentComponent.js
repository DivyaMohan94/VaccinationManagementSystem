import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PastAppointments from "../components/Appointment/pastAppointmentsComponent";
import UpcomingAppointments from '../components/Appointment/futureAppointmentsComponents';
import NewAppointmentComponent from '../components/newAppointment';

function TabAppointmentPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabAppointmentPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function AppointmentsTabs() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aaria-label="nav tabs example"
          >
            <Tab label="Past " {...a11yProps(0)} />
            <Tab label="Upcoming" {...a11yProps(1)} />
            <Tab label="Schedule" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabAppointmentPanel value={value} index={0}>
          <PastAppointments />
        </TabAppointmentPanel>
        <TabAppointmentPanel value={value} index={1}>
          <UpcomingAppointments />
        </TabAppointmentPanel>
        <TabAppointmentPanel value={value} index={2}>
          <NewAppointmentComponent />
        </TabAppointmentPanel>
      </Box>
    );
}