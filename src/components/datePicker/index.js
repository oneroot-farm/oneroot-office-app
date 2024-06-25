"use client";

import { makeStyles } from "tss-react/mui";

import { LocalizationProvider } from "@mui/x-date-pickers/index";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDatePicker, DesktopDatePicker } from "@mui/x-date-pickers/index";

const DatePicker = ({ pickerProps }) => {
  const { classes, cx } = useStyles();

  let component = null;

  if (typeof window !== "undefined" && window.innerWidth <= 760) {
    component = (
      <MobileDatePicker {...pickerProps} className={cx(classes.picker)} />
    );
  } else {
    component = (
      <DesktopDatePicker {...pickerProps} className={cx(classes.picker)} />
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {component}
    </LocalizationProvider>
  );
};

// Styles 💅
const useStyles = makeStyles({
  name: { DatePicker },
})((theme) => ({
  picker: {
    margin: "0.8rem 0",

    [theme.breakpoints.down("sm")]: {
      margin: "0.5rem 0",
    },
  },
}));

export default DatePicker;
