import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

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
    // title: {
    //     color: '#DD8042',
    //     fontSize: '2.5rem'              
    // },
}));
export default function LandingComponent() {
    const classes = useStyles();
    
    return (
        <div className={classes.root} id="header">
            <div className={classes.container}>
                <h1 className={classes.colorText}>
                    <span>Welcome to AIOB Airlines!</span>
                </h1>
            </div>
        </div>
    );
}