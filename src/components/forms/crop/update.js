"use client";

import { useState, useEffect } from "react";

import { z } from "zod";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { makeStyles } from "tss-react/mui";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";

// Firebase
import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";

// Components
import Loader from "@/components/loader";
import DatePicker from "@/components/datePicker";
import FormHeader from "@/components/forms/components/formHeader";
import FormFooter from "@/components/forms/components/formFooter";

// Inputs
import TextInput from "@/components/inputs/textInput";
import SelectInput from "@/components/inputs/selectInput";

// Utils
import { areCoordinates } from "@/utils";

// Constants
import {
  CROPS,
  LANGUAGES,
  PAYMENT_TERMS,
  COCONUT_VARIETIES,
  IPM_ORGANIC_TYPES,
  TURMERIC_VARIETIES,
  TURMERIC_POLISHED_TYPES,
} from "@/constants";

const schema = z.object({
  farmerName: z.string().min(1, "Farmer name is required"),

  mobileNumber: z
    .string()
    .min(10, "Mobile number must be exactly 10 digits")
    .max(10, "Mobile number must be exactly 10 digits"),

  language: z
    .string()
    .nullable()
    .refine((val) => val !== "", "Language is required"),

  paymentTerms: z
    .string()
    .nullable()
    .refine((val) => val !== "", "Payment terms are required"),

  isTenderCoconutFarm: z.boolean(),

  isDryCoconutFarm: z.boolean(),

  generalHarvestCycleInDays: z
    .number()
    .nonnegative("Please enter a valid general harvest cycle in days")
    .refine(
      (value) => value !== 0,
      "General harvest cycle in days can not be zero"
    )
    .refine(
      (value) => !isNaN(value),
      "General harvest cycle in days must be a valid number"
    ),

  village: z.string().min(1, "Village is required"),

  isOrganic: z.boolean().nullable(),

  variety: z
    .string()
    .nullable()
    .refine((val) => val !== "", "Variety is required"),

  numberOfTrees: z
    .number()
    .nonnegative("Please enter a valid number of trees")
    .refine((value) => value !== 0, "Number of trees can not be zero")
    .refine((value) => !isNaN(value), "Number of trees must be a valid number"),

  heightOfTree: z
    .number()
    .nonnegative("Please enter a valid height of tree")
    .refine((value) => value !== 0, "Height of tree can not be zero")
    .refine((value) => !isNaN(value), "Height of tree must be a valid number"),

  ageOfTree: z
    .number()
    .nonnegative("Please enter a valid age of tree")
    .refine((value) => value !== 0, "Age of tree can not be zero")
    .refine((value) => !isNaN(value), "Age of tree must be a valid number"),

  chutePercentage: z
    .number()
    .nonnegative("Please enter a valid chute percentage")
    .refine(
      (value) => !isNaN(value),
      "Chute percentage must be a valid number"
    ),

  numberOfNuts: z
    .number()
    .nonnegative("Please enter a valid number of nuts")
    .refine((value) => value !== 0, "Number of nuts can not be zero")
    .refine((value) => !isNaN(value), "Number of nuts must be a valid number"),

  nutsFromLastHarvest: z
    .number()
    .nonnegative("Please enter a valid nuts from last harvest")
    .refine((value) => value !== 0, "Nuts from last harvest can not be zero")
    .refine(
      (value) => !isNaN(value),
      "Nuts from last harvest must be a valid number"
    ),

  cropsAvailable: z.array(z.string()),

  numberOfAcres: z.number().nonnegative("Please enter a valid number of acres"),
  /* .refine((value) => value !== 0, "Number of acres can not be zero") */
  /* .refine((value) => !isNaN(value), "Number of acres must be a valid number"), */

  turmericVariety: z.string().nullable(),
  /* .refine((value) => value !== "", "Variety is required"), */

  polishedType: z.string().nullable(),
  /* .refine((value) => value !== "", "Polished type is required"), */

  ipmOrOrganic: z.string().nullable(),
  /* .refine((value) => value !== "", "IPM Or Oraganic is required"), */

  mapLink: z.string().optional(),

  coords: z.string().optional(),
});

const defaultValues = {
  farmerName: "",
  mobileNumber: "",
  language: "",
  paymentTerms: "",
  isTenderCoconutFarm: true,
  isDryCoconutFarm: false,
  generalHarvestCycleInDays: 0,
  village: "",
  isOrganic: false,
  variety: "",
  numberOfTrees: 0,
  heightOfTree: 0,
  ageOfTree: 0,
  chutePercentage: 0,
  numberOfNuts: 0,
  nutsFromLastHarvest: 0,
  cropsAvailable: [],
  numberOfAcres: 0,
  turmericVariety: "",
  polishedType: "",
  ipmOrOrganic: "",
  mapLink: "",
  coords: "",
};

const Update = ({ fields, refetch, handleModalClose }) => {
  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const [dates, setDates] = useState({
    readyToHarvestDate: dayjs(),
    lastHarvestDate: dayjs(),
  });
  const [loading, setLoading] = useState(false);

  const { cx, classes } = useStyles();

  useEffect(() => {
    if (fields) {
      const {
        farmerName = "",
        mobileNumber = "",
        language = "",
        paymentTerms = "",
        isTenderCoconutFarm = false,
        isDryCoconutFarm = false,
        generalHarvestCycleInDays = 0,
        village = "",
        isOrganic = false,
        variety = "",
        numberOfTrees = 0,
        heightOfTree = 0,
        ageOfTree = 0,
        chutePercentage = 0,
        numberOfNuts = 0,
        nutsFromLastHarvest = 0,
        cropsAvailable = [],
        numberOfAcres = 0,
        turmericVariety = "",
        polishedType = "",
        ipmOrOrganic = "",
        mapLink = "",
        location = { latitude: null, longitude: null },
        readyToHarvestDate = dayjs(),
        firstLastHarvestDate = dayjs(),
      } = fields;

      const formData = {
        farmerName,
        mobileNumber: mobileNumber.replace(/^\+91/, ""),
        language,
        paymentTerms,
        isTenderCoconutFarm,
        isDryCoconutFarm,
        generalHarvestCycleInDays,
        village,
        isOrganic,
        variety,
        numberOfTrees,
        heightOfTree,
        ageOfTree,
        chutePercentage,
        numberOfNuts,
        nutsFromLastHarvest,
        cropsAvailable: Array.isArray(cropsAvailable) ? cropsAvailable : "",
        numberOfAcres,
        turmericVariety,
        polishedType,
        ipmOrOrganic,
        mapLink,
      };

      reset(formData);

      if (location && location.latitude && location.longitude) {
        const coords = `${location.latitude}, ${location.longitude}`;

        setValue("coords", coords);
      }

      setDates({
        readyToHarvestDate: dayjs(readyToHarvestDate),
        lastHarvestDate: dayjs(firstLastHarvestDate),
      });
    }
  }, [reset, fields]);

  const onSubmit = async (data) => {
    const {
      cropsAvailable,
      numberOfAcres,
      turmericVariety,
      polishedType,
      ipmOrOrganic,
      mapLink,
      coords,
    } = data;

    if (cropsAvailable.includes("Turmeric")) {
      let valid = true;

      if (numberOfAcres === 0 || isNaN(numberOfAcres)) {
        setError("numberOfAcres", {
          type: "manual",
          message: "Number of acres can not be zero and must be a valid number",
        });

        valid = false;
      }

      if (!turmericVariety || turmericVariety === "") {
        setError("turmericVariety", {
          type: "manual",
          message: "Variety is required",
        });

        valid = false;
      }

      if (!polishedType || polishedType === "") {
        setError("polishedType", {
          type: "manual",
          message: "Polished type is required",
        });

        valid = false;
      }

      if (!ipmOrOrganic || ipmOrOrganic === "") {
        setError("ipmOrOrganic", {
          type: "manual",
          message: "IPM Or Organic is required",
        });

        valid = false;
      }

      if (!valid) return;
    }

    if (coords) {
      const point = /^\s*-?\d+\.\d+\s*,\s*-?\d+\.\d+\s*$/;

      if (!point.test(coords) && !areCoordinates(coords)) {
        setError("coords", {
          type: "manual",
          message: "Coordinates are not valid",
        });

        return;
      }
    }

    if (mapLink) {
      const url = /^(ftp|http|https):\/\/[^ "]+$/;

      if (!url.test(mapLink)) {
        setError("mapLink", {
          type: "manual",
          message: "Map Link is not a valid URL",
        });

        return;
      }
    }

    try {
      setLoading(true);

      const {
        readyToHarvestDate,
        firstLastHarvestDate,
        mobileNumber,
        ...rest
      } = data;

      const payload = {
        ...rest,
        readyToHarvestDate: dayjs(readyToHarvestDate).format("YYYY-MM-DD"),
        firstLastHarvestDate: dayjs(dates.lastHarvestDate).format("YYYY-MM-DD"),
        mobileNumber: `+91${mobileNumber}`,
      };

      if (coords && areCoordinates(coords)) {
        const [lat, lng] = coords.split(",");

        payload.location = {
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
        };
      } else {
        const position = await getCurrentLocation();

        payload.location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
      }

      if (fields && fields?.tags) {
        const updatedTags = fields.tags.filter((t) => t !== "need-location");

        payload.tags = updatedTags;
      }

      const reference = doc(db, "crops", fields.id);

      await updateDoc(reference, payload);

      toast.success("Record updated successfully!");

      refetch();

      handleModalClose();
    } catch (error) {
      console.log(error);

      toast.error("error updating record : ", error.message);
    } finally {
      setLoading(false);
    }
  };

  const crops = watch("cropsAvailable");

  return (
    <Container disableGutters className={cx(classes.container)}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormHeader sx={{ mt: 4 }}>Farmer Details</FormHeader>

        <Box className={cx(classes.inputWrapper)}>
          <Controller
            name="farmerName"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                fullWidth
                label="Farmer Name*"
                variant="outlined"
                error={!!errors.farmerName}
                helperText={errors.farmerName?.message}
              />
            )}
          />

          <Controller
            name="mobileNumber"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                fullWidth
                label="Mobile Number*"
                variant="outlined"
                error={!!errors.mobileNumber}
                helperText={errors.mobileNumber?.message}
              />
            )}
          />
        </Box>

        <Box className={cx(classes.inputWrapper)}>
          <Controller
            name="language"
            control={control}
            render={({ field }) => (
              <SelectInput
                {...field}
                fullWidth
                label="Language*"
                variant="outlined"
                error={!!errors.language}
                message={errors.language?.message}
              >
                {LANGUAGES.map((l) => (
                  <MenuItem value={l.value}>{l.label}</MenuItem>
                ))}
              </SelectInput>
            )}
          />

          <Controller
            name="paymentTerms"
            control={control}
            render={({ field }) => (
              <SelectInput
                {...field}
                fullWidth
                label="Payment Terms*"
                variant="outlined"
                error={!!errors.paymentTerms}
                message={errors.paymentTerms?.message}
              >
                {PAYMENT_TERMS.map((l) => (
                  <MenuItem value={l.value}>{l.label}</MenuItem>
                ))}
              </SelectInput>
            )}
          />
        </Box>

        <FormHeader sx={{ mt: 4 }}>Farm Details</FormHeader>

        <Box className={cx(classes.inputWrapper)}>
          <Controller
            name="isTenderCoconutFarm"
            control={control}
            render={({ field }) => (
              <SelectInput
                {...field}
                fullWidth
                label="Tender Coconut Farm*"
                variant="outlined"
                error={!!errors.isTenderCoconutFarm}
                message={errors.isTenderCoconutFarm?.message}
              >
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </SelectInput>
            )}
          />

          <Controller
            name="isDryCoconutFarm"
            control={control}
            render={({ field }) => (
              <SelectInput
                {...field}
                fullWidth
                label="Dry Coconut Farm*"
                variant="outlined"
                error={!!errors.isDryCoconutFarm}
                message={errors.isDryCoconutFarm?.message}
              >
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </SelectInput>
            )}
          />
        </Box>

        <Box className={cx(classes.inputWrapper)}>
          <Controller
            name="generalHarvestCycleInDays"
            control={control}
            render={({ field: { onChange, ...rest } }) => (
              <TextInput
                {...rest}
                fullWidth
                type="number"
                label="General Harvest Cycle In Days*"
                variant="outlined"
                error={!!errors.generalHarvestCycleInDays}
                helperText={errors.generalHarvestCycleInDays?.message}
                onChange={(e) => onChange(parseInt(e.target.value))}
              />
            )}
          />

          <Controller
            name="village"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                fullWidth
                label="Village*"
                variant="outlined"
                error={!!errors.village}
                helperText={errors.village?.message}
              />
            )}
          />
        </Box>

        <Box className={cx(classes.inputWrapper)}>
          <Controller
            name="isOrganic"
            control={control}
            render={({ field }) => (
              <SelectInput
                {...field}
                fullWidth
                label="Is Organic*"
                variant="outlined"
                error={!!errors.isOrganic}
                message={errors.isOrganic?.message}
              >
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </SelectInput>
            )}
          />
        </Box>

        <FormHeader sx={{ mt: 4 }}>Crop Details</FormHeader>

        <Box className={cx(classes.inputWrapper)}>
          <Controller
            name="variety"
            control={control}
            render={({ field }) => (
              <SelectInput
                {...field}
                fullWidth
                label="Variety*"
                variant="outlined"
                error={!!errors.variety}
                message={errors.variety?.message}
              >
                {COCONUT_VARIETIES.map((l) => (
                  <MenuItem value={l.value}>{l.label}</MenuItem>
                ))}
              </SelectInput>
            )}
          />

          <Controller
            name="numberOfTrees"
            control={control}
            render={({ field: { onChange, ...rest } }) => (
              <TextInput
                {...rest}
                fullWidth
                type="number"
                label="Number Of Trees*"
                variant="outlined"
                error={!!errors.numberOfTrees}
                helperText={errors.numberOfTrees?.message}
                onChange={(e) => onChange(parseInt(e.target.value))}
              />
            )}
          />
        </Box>

        <Box className={cx(classes.inputWrapper)}>
          <Controller
            name="heightOfTree"
            control={control}
            render={({ field: { onChange, ...rest } }) => (
              <TextInput
                {...rest}
                fullWidth
                type="number"
                label="Height Of Tree*"
                variant="outlined"
                inputProps={{
                  step: 0.1,
                }}
                error={!!errors.heightOfTree}
                helperText={errors.heightOfTree?.message}
                onChange={(e) => onChange(parseFloat(e.target.value))}
              />
            )}
          />

          <Controller
            name="ageOfTree"
            control={control}
            render={({ field: { onChange, ...rest } }) => (
              <TextInput
                {...rest}
                fullWidth
                type="number"
                label="Age Of Tree*"
                variant="outlined"
                inputProps={{
                  step: 0.1,
                }}
                error={!!errors.ageOfTree}
                helperText={errors.ageOfTree?.message}
                onChange={(e) => onChange(parseFloat(e.target.value))}
              />
            )}
          />
        </Box>

        <Box className={cx(classes.inputWrapper)}>
          <Controller
            name="chutePercentage"
            control={control}
            render={({ field: { onChange, ...rest } }) => (
              <TextInput
                {...rest}
                fullWidth
                type="number"
                label="Chute Percentage"
                variant="outlined"
                inputProps={{
                  step: 0.1,
                }}
                error={!!errors.chutePercentage}
                helperText={errors.chutePercentage?.message}
                onChange={(e) => onChange(parseFloat(e.target.value))}
              />
            )}
          />

          <Controller
            name="numberOfNuts"
            control={control}
            render={({ field: { onChange, ...rest } }) => (
              <TextInput
                {...rest}
                fullWidth
                type="number"
                label="Number Of Nuts*"
                variant="outlined"
                error={!!errors.numberOfNuts}
                helperText={errors.numberOfNuts?.message}
                onChange={(e) => onChange(parseInt(e.target.value))}
              />
            )}
          />
        </Box>

        <Box className={cx(classes.inputWrapper)}>
          <DatePicker
            pickerProps={{
              format: "DD-MM-YYYY",
              label: "Ready To Harvest Date*",
              sx: { width: "100%" },
              value: dates.readyToHarvestDate,
              onChange: (date) =>
                setDates((previous) => ({
                  ...previous,
                  readyToHarvestDate: dayjs(date),
                })),
              renderInput: (params) => <TextInput {...params} />,
            }}
          />

          {/* Date Picker */}
          <DatePicker
            pickerProps={{
              format: "DD-MM-YYYY",
              label: "Last Harvest Date*",
              sx: { width: "100%" },
              value: dates.lastHarvestDate,
              onChange: (date) =>
                setDates((previous) => ({
                  ...previous,
                  lastHarvestDate: dayjs(date),
                })),
              renderInput: (params) => <TextInput {...params} />,
            }}
          />
        </Box>

        <Box className={cx(classes.inputWrapper)}>
          <Controller
            name="nutsFromLastHarvest"
            control={control}
            render={({ field: { onChange, ...rest } }) => (
              <TextInput
                {...rest}
                fullWidth
                type="number"
                label="Nuts From Last Harvest*"
                variant="outlined"
                error={!!errors.nutsFromLastHarvest}
                helperText={errors.nutsFromLastHarvest?.message}
                onChange={(e) => onChange(parseInt(e.target.value))}
              />
            )}
          />

          <Controller
            name="cropsAvailable"
            control={control}
            render={({ field }) => (
              <SelectInput
                {...field}
                multiple
                fullWidth
                label="Crops Available"
                variant="outlined"
                error={!!errors.cropsAvailable}
                message={errors.cropsAvailable?.message}
              >
                {CROPS.map((l) => (
                  <MenuItem value={l.value}>{l.label}</MenuItem>
                ))}
              </SelectInput>
            )}
          />
        </Box>

        {crops.includes("Turmeric") && (
          <>
            <FormHeader sx={{ mt: 4 }}>Turmeric Details</FormHeader>

            <Box className={cx(classes.inputWrapper)}>
              <Controller
                name="turmericVariety"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    {...field}
                    fullWidth
                    label="Variety*"
                    variant="outlined"
                    error={!!errors.turmericVariety}
                    message={errors.turmericVariety?.message}
                  >
                    {TURMERIC_VARIETIES.map((l) => (
                      <MenuItem value={l.value}>{l.label}</MenuItem>
                    ))}
                  </SelectInput>
                )}
              />

              <Controller
                name="numberOfAcres"
                control={control}
                render={({ field: { onChange, ...rest } }) => (
                  <TextInput
                    {...rest}
                    fullWidth
                    type="number"
                    label="Number Of Acres*"
                    variant="outlined"
                    inputProps={{
                      step: 0.1,
                    }}
                    error={!!errors.numberOfAcres}
                    helperText={errors.numberOfAcres?.message}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                  />
                )}
              />
            </Box>

            <Box className={cx(classes.inputWrapper)}>
              <Controller
                name="polishedType"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    {...field}
                    fullWidth
                    label="Polished Type*"
                    variant="outlined"
                    error={!!errors.polishedType}
                    message={errors.polishedType?.message}
                  >
                    {TURMERIC_POLISHED_TYPES.map((l) => (
                      <MenuItem value={l.value}>{l.label}</MenuItem>
                    ))}
                  </SelectInput>
                )}
              />

              <Controller
                name="ipmOrOrganic"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    {...field}
                    fullWidth
                    label="IPM Or Oraganic*"
                    variant="outlined"
                    error={!!errors.ipmOrOrganic}
                    message={errors.ipmOrOrganic?.message}
                  >
                    {IPM_ORGANIC_TYPES.map((l) => (
                      <MenuItem value={l.value}>{l.label}</MenuItem>
                    ))}
                  </SelectInput>
                )}
              />
            </Box>
          </>
        )}

        <FormHeader sx={{ mt: 4 }}>Additional Details</FormHeader>

        <Box className={cx(classes.inputWrapper)}>
          <Controller
            name="coords"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                fullWidth
                label="Coordinates"
                variant="outlined"
                error={!!errors.coords}
                helperText={
                  errors.coords?.message ||
                  "Captures current location if not provided"
                }
              />
            )}
          />

          <Controller
            name="mapLink"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                fullWidth
                label="Map Link"
                variant="outlined"
                error={!!errors.mapLink}
                helperText={errors.mapLink?.message}
              />
            )}
          />
        </Box>

        <FormFooter>
          <Button
            size="large"
            variant="contained"
            sx={(theme) => ({ color: theme.palette.primary.white })}
            type="submit"
          >
            Submit
          </Button>
        </FormFooter>
      </form>

      <Loader open={loading} />
    </Container>
  );
};

// Styles 💅
const useStyles = makeStyles({
  name: { Update },
})((theme) => ({
  container: {},

  inputWrapper: {
    gap: 12,
    display: "flex",

    [theme.breakpoints.down("sm")]: {
      gap: 0,
      flexWrap: "wrap",
    },
  },
}));

export default Update;
