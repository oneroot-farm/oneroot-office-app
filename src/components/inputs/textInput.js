"use client";

import { makeStyles } from "tss-react/mui";

import TextField from "@mui/material/TextField";

const TextInput = (props) => {
  const { classes, cx } = useStyles();
  return (
    <TextField
      {...props}
      className={cx(classes.input)}
      FormHelperTextProps={{
        className: cx(classes.helperText),
      }}
      onWheel={(event) => {
        const inputElement = event.target; // Assert the type

        inputElement.blur(); // Now 'blur' is recognized
      }}
    />
  );
};

// Styles 💅
const useStyles = makeStyles({
  name: { TextInput },
})((theme) => ({
  input: {
    margin: "0.8rem 0",

    [theme.breakpoints.down("sm")]: {
      margin: "0.5rem 0",
    },
  },

  helperText: {
    marginLeft: "0.2rem",
  },
}));

export default TextInput;
