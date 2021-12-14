import * as React from "react";
import { CssBaseline } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import LandingContent from "../components/LandingContent";
import Navbar from "../components/navbar";
import { Box } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    backgroundImage: `url(i.jpg)`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
}));

export default function Landing() {
  const classes = useStyles();
  return (
    <>
      <div>
        <Navbar />
        <CssBaseline />
        <Box className={classes.root}>
          <LandingContent />
        </Box>
      </div>
    </>
  );
}
