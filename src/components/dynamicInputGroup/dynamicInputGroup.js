"use client";

import MenuItem from "@mui/material/MenuItem";

import { Controller } from "react-hook-form";

import IconButton from "@mui/material/IconButton";

// Inputs
import TextInput from "@/components/inputs/textInput";
import SelectInput from "@/components/inputs/selectInput";

// Constants
import { MARKET_PRICES } from "@/constants";

// Icons
import RemoveIcon from "@mui/icons-material/Remove";

const DynamicInputGroup = ({
  control,
  index,
  onRemove,
  errors,
  crop,
  isRemovable,
  required = {
    variety: true,
    location: true,
    price: true,
  },
  formValues,
}) => {
  const availableVarieties = MARKET_PRICES[crop].varieties;
  const availableLocations = MARKET_PRICES[crop].locations;

  // get all selected varieties and locations from the form values
  const selectedVarieties = formValues.prices[crop].map((item) => item.variety);
  const selectedLocations = formValues.prices[crop].map(
    (item) => item.location
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: 16,
      }}
    >
      <Controller
        name={`prices.${crop}[${index}].variety`}
        control={control}
        render={({ field }) => (
          <SelectInput
            {...field}
            fullWidth
            label={`Variety${required?.variety ? "*" : ""}`}
            variant="outlined"
            error={!!errors?.variety}
            message={errors?.variety?.message}
          >
            {availableVarieties?.map((variety) => (
              <MenuItem
                key={variety.id}
                value={variety.value}
                disabled={
                  crop === "tenderCoconut"
                    ? false
                    : selectedVarieties.includes(variety.value)
                }
              >
                {variety.label}
              </MenuItem>
            ))}
          </SelectInput>
        )}
      />

      <Controller
        name={`prices.${crop}[${index}].location`}
        control={control}
        render={({ field }) => (
          <SelectInput
            {...field}
            fullWidth
            label={`Location${required?.location ? "*" : ""}`}
            variant="outlined"
            error={!!errors?.location}
            message={errors?.location?.message}
          >
            {availableLocations?.map((location) => (
              <MenuItem
                key={location.id}
                value={location.value}
                disabled={selectedLocations.includes(location.value)}
              >
                {location.label}
              </MenuItem>
            ))}
          </SelectInput>
        )}
      />

      <Controller
        name={`prices.${crop}[${index}].price`}
        control={control}
        render={({ field: { onChange, ...rest } }) => (
          <TextInput
            {...rest}
            fullWidth
            type="number"
            label={`Price${required?.price ? "*" : ""}`}
            variant="outlined"
            inputProps={{ step: 0.01 }}
            error={!!errors?.price}
            helperText={errors?.price?.message}
            onChange={(e) => onChange(parseFloat(e.target.value))}
          />
        )}
      />

      <IconButton onClick={onRemove} color="secondary" disabled={!isRemovable}>
        <RemoveIcon />
      </IconButton>
    </div>
  );
};

export default DynamicInputGroup;
