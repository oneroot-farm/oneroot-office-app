"use client";

import { FC } from "react";

import { makeStyles } from "tss-react/mui";

import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Select, { SelectProps } from "@mui/material/Select";

const SelectInput = (props) => {
  const { classes, cx } = useStyles();
  return (
    <FormControl fullWidth className={cx(classes.input)}>
      {/* Label */}
      <InputLabel id={props.labelId}>{props.label}</InputLabel>

      {/* Select */}
      <Select {...props}>{props.children}</Select>

      {/* Helper Text */}
      <FormHelperText className={cx(classes.helperText)}>
        {props.message ? props.message : ""}
      </FormHelperText>
    </FormControl>
  );
};

// Styles 💅
const useStyles = makeStyles({
  name: { SelectInput },
})((theme) => ({
  input: {
    margin: "0.8rem 0",

    [theme.breakpoints.down("sm")]: {
      margin: "0.5rem 0",
    },
  },

  helperText: {
    color: "#f44336",
    fontSize: "0.6428571428571428rem",
    marginLeft: "0.2rem",
  },
}));

export default SelectInput;
