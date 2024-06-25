"use client";

import { FC, ComponentType } from "react";

import { makeStyles } from "tss-react/mui";

import { ChipProps } from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import FormHelperText from "@mui/material/FormHelperText";
import { AutocompleteProps } from "@mui/material/Autocomplete";

const AutocompleteInput = (props) => {
  const { cx, classes } = useStyles();

  return (
    <FormControl fullWidth className={cx(classes.autocomplete)}>
      {/* Autocomplete */}
      <Autocomplete {...props} />

      {/* Helper Text */}
      <FormHelperText className={cx(classes.helperText)}>
        {props.message ? props.message : ""}
      </FormHelperText>
    </FormControl>
  );
};

// Styles 💅
const useStyles = makeStyles({
  name: { AutocompleteInput },
})(() => ({
  autocomplete: {
    margin: 0,
  },

  helperText: {
    color: "#f44336",
    fontSize: "0.6428571428571428rem",
    marginLeft: "0.2rem",
  },
}));

export default AutocompleteInput;
