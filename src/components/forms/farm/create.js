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
import { doc, addDoc, updateDoc, collection } from "firebase/firestore";

// Components
import Loader from "@/components/loader";
import DocPicker from "@/components/docPicker";
import DatePicker from "@/components/datePicker";
import FormHeader from "@/components/forms/components/formHeader";
import FormFooter from "@/components/forms/components/formFooter";

// Inputs
import TextInput from "@/components/inputs/textInput";
import SelectInput from "@/components/inputs/selectInput";

// Utils
import {
  areCoordinates,
  getCurrentLocation,
  uploadFilesHandler,
} from "@/utils";

// Constants
import {
  CROPS,
  TALUKS,
  YES_NO,
  CUT_TYPES,
  LANGUAGES,
  TAR_SHAPES,
  PAYMENT_TERMS,
  BANANA_VARIETIES,
  COCONUT_VARIETIES,
  TURMERIC_VARIETIES,
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

  taluk: z
    .string()
    .nullable()
    .refine((val) => val !== "", "Taluk is required"),

  village: z.string().min(1, "Village is required"),

  coords: z.string().optional(),

  cropsAvailable: z.array(z.string()),

  // tender coconut
  tenderCoconut: z
    .object({
      variety: z
        .string()
        .nullable()
        .refine((val) => val !== "", "Variety is required"),

      numberOfTrees: z
        .number()
        .nonnegative("Please enter a valid number of trees")
        .refine((value) => value !== 0, "Number of trees can not be zero")
        .refine(
          (value) => !isNaN(value),
          "Number of trees must be a valid number"
        ),

      heightOfTree: z
        .number()
        .nonnegative("Please enter a valid height of tree")
        .refine(
          (value) => !isNaN(value),
          "Height of tree must be a valid number"
        ),

      ageOfTree: z
        .number()
        .nonnegative("Please enter a valid age of tree")
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
        .refine(
          (value) => !isNaN(value),
          "Number of nuts must be a valid number"
        ),

      nutsFromLastHarvest: z
        .number()
        .nonnegative("Please enter a valid nuts from last harvest")
        .refine(
          (value) => value !== 0,
          "Nuts from last harvest can not be zero"
        )
        .refine(
          (value) => !isNaN(value),
          "Nuts from last harvest must be a valid number"
        ),

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

      isReadyToHarvest: z.boolean().nullable(),
    })
    .optional(),

  // turmeric
  turmeric: z
    .object({
      region: z.string(),

      numberOfAcres: z
        .number()
        .nonnegative("Please enter a valid number of acres"),

      turmericVariety: z.string().nullable(),

      isTurmericOrganic: z.boolean().nullable(),

      isPolished: z.boolean().nullable(),

      isSinglePolished: z.boolean().nullable(),

      isDoublePolished: z.boolean().nullable(),

      isIPM: z.boolean().nullable(),

      turmericGeneralHarvestCycleInDays: z
        .number()
        .nonnegative("Please enter a valid general harvest cycle in days")
        .refine(
          (value) => !isNaN(value),
          "General harvest cycle in days must be a valid number"
        ),

      totalTurmericQuantity: z
        .number()
        .nonnegative("Please enter a valid total turmeric quantity")
        .refine(
          (value) => !isNaN(value),
          "Total turmeric quantity must be a valid number"
        ),

      fingerQuantity: z
        .number()
        .nonnegative("Please enter a valid finger quantity")
        .refine(
          (value) => !isNaN(value),
          "Finger quantity must be a valid number"
        ),

      bulbQuantity: z
        .number()
        .nonnegative("Please enter a valid bulb quantity")
        .refine(
          (value) => !isNaN(value),
          "Bulb quantity must be a valid number"
        ),

      isTurmericReadyToHarvest: z.boolean().nullable(),
    })
    .optional(),

  // banana
  banana: z
    .object({
      bananaVariety: z.string().nullable(),

      tarShape: z.string(),

      tarWeight: z.number().nonnegative("Please enter a valid tar weight"),

      numberOfBananaTrees: z
        .number()
        .nonnegative("Please enter a valid number of trees")
        .refine(
          (value) => !isNaN(value),
          "Number of trees must be a valid number"
        ),

      numberOfBananaTreesRTH: z
        .number()
        .nonnegative("Please enter a valid number of trees")
        .refine(
          (value) => !isNaN(value),
          "Number of trees must be a valid number"
        ),

      bananaGeneralHarvestCycleInDays: z
        .number()
        .nonnegative("Please enter a valid general harvest cycle in days")
        .refine(
          (value) => !isNaN(value),
          "General harvest cycle in days must be a valid number"
        ),

      cutCount: z
        .number()
        .nonnegative("Please enter a valid cut count")
        .refine((value) => !isNaN(value), "Cut count must be a valid number"),

      cutType: z.string(),

      isBananaReadyToHarvest: z.boolean().nullable(),
    })
    .optional(),

  // dry coconut
  dryCoconut: z
    .object({
      isDryCoconutHarvested: z.boolean().nullable(),

      isOnTree: z.boolean().nullable(),

      numberOfDryCoconutsAvailable: z
        .number()
        .nonnegative("Please enter a valid number of dry coconuts available")
        .refine(
          (value) => !isNaN(value),
          "Dry coconuts available must be a valid number"
        ),

      isWithHusk: z.boolean().nullable(),

      isWithSemiHusk: z.boolean().nullable(),

      dryCoconutGeneralHarvestCycleInDays: z
        .number()
        .nonnegative("Please enter a valid general harvest cycle in days")
        .refine(
          (value) => !isNaN(value),
          "General harvest cycle in days must be a valid number"
        ),

      isDryCoconutReadyToHarvest: z.boolean().nullable(),
    })
    .optional(),
});

const defaultValues = {
  farmerName: "",
  mobileNumber: "",
  language: "",
  paymentTerms: "",
  village: "",
  taluk: "",
  coords: "",
  cropsAvailable: [],

  // tender coconut
  tenderCoconut: {
    variety: "",
    numberOfTrees: 0,
    heightOfTree: 0,
    ageOfTree: 0,
    chutePercentage: 0,
    numberOfNuts: 0,
    nutsFromLastHarvest: 0,
    generalHarvestCycleInDays: 0,
    isReadyToHarvest: false,
  },

  // turmeric
  turmeric: {
    region: "",
    numberOfAcres: 0,
    turmericVariety: "",
    isTurmericOrganic: false,
    isPolished: false,
    isSinglePolished: false,
    isDoublePolished: false,
    isIPM: false,
    turmericGeneralHarvestCycleInDays: 0,
    totalTurmericQuantity: 0,
    fingerQuantity: 0,
    bulbQuantity: 0,
    isTurmericReadyToHarvest: false,
  },

  // banana
  banana: {
    bananaVariety: "",
    tarShape: "",
    tarWeight: 0,
    numberOfBananaTrees: 0,
    numberOfBananaTreesRTH: 0,
    bananaGeneralHarvestCycleInDays: 0,
    cutCount: 0,
    cutType: "",
    isBananaReadyToHarvest: false,
  },

  // dry coconut
  dryCoconut: {
    isDryCoconutHarvested: false,
    isOnTree: false,
    numberOfDryCoconutsAvailable: 0,
    isWithHusk: false,
    isWithSemiHusk: false,
    dryCoconutGeneralHarvestCycleInDays: 0,
    isDryCoconutReadyToHarvest: false,
  },
};

const Create = ({ fields, refetch, handleModalClose }) => {
  const {
    reset,
    watch,
    control,
    setError,
    setValue,
    register,
    unregister,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    shouldUnregister: true,
    resolver: zodResolver(schema),
  });

  const [files, setFiles] = useState([]);
  const [dates, setDates] = useState({
    readyToHarvestDate: dayjs(),
    lastHarvestDate: dayjs(),
  });
  const [loading, setLoading] = useState(false);

  const { cx, classes } = useStyles();

  useEffect(() => {
    if (fields) {
      const { mobileNumber = "" } = fields;

      const formData = {
        mobileNumber: mobileNumber.replace(/^\+91/, ""),
      };

      reset(formData);
    }
  }, [reset, fields]);

  const handleFileUpload = (files) => {
    setFiles(files);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const {
        farmerName,
        mobileNumber,
        language,
        paymentTerms,
        village,
        taluk,
        coords,
        cropsAvailable,

        tenderCoconut,
        turmeric,
        banana,
        dryCoconut,
      } = data;

      // payload

      // sanity checks
      if (!cropsAvailable || cropsAvailable.length === 0) {
        setError("cropsAvailable", {
          type: "manual",
          message: "At least one crop is required",
        });

        return;
      }

      if (coords) {
        const point = /^\s*-?\d+\.\d+\s*,\s*-?\d+\.\d+\s*$/;

        if (!point.test(coords) && !areCoordinates(coords)) {
          setError("coords", {
            type: "manual",
            message: "Coordinates must be in 'latitude, longitude' format",
          });

          return;
        }
      }

      // location
      let position = null;

      if (coords && areCoordinates(coords)) {
        const [lat, lng] = coords.split(",");

        position = {
          coords: {
            latitude: parseFloat(lat),
            longitude: parseFloat(lng),
          },
        };
      } else {
        position = await getCurrentLocation();
      }

      const payload = {
        farmerName,
        language,
        paymentTerms,
        village,
        taluk,
        mobileNumber: `+91${mobileNumber}`,
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        cropsAvailable,

        readyToHarvestDate: dayjs(dates.readyToHarvestDate).format(
          "YYYY-MM-DD"
        ),
        lastHarvestDate: dayjs(dates.lastHarvestDate).format("YYYY-MM-DD"),

        ...tenderCoconut,
        ...turmeric,
        ...banana,
        ...dryCoconut,
      };

      // file upload
      if (files && files.length > 0) {
        const images = Array.from(files);

        const urls = await uploadFilesHandler(images, "farm-images");

        payload.images = urls;
      } else {
        payload.images = [];
      }

      const reference = await addDoc(collection(db, "crops"), payload);

      const id = reference.id;

      const farmName = `FARM-${id.substring(0, 5)}`;

      await updateDoc(doc(db, "crops", id), { id, farmName });

      toast.success("Record created successfully!");

      refetch();

      handleModalClose();
    } catch (error) {
      console.log(error);

      toast.error("error creating record : ", error.message);
    } finally {
      setLoading(false);
    }
  };

  // watching `cropsAvailable`
  const crops = watch("cropsAvailable");

  // crop options map
  const map = {
    "Tender Coconut": "tenderCoconut",
    Turmeric: "turmeric",
    Banana: "banana",
    "Dry Coconut": "dryCoconut",
  };

  // dynamically manage form fields based on cropsAvailable
  useEffect(() => {
    Object.entries(map).forEach(([label, key]) => {
      if (crops?.includes(label)) {
        register(key);
      } else {
        unregister(key);
      }
    });
  }, [crops, unregister]);

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

        <DocPicker
          sx={{ mb: 2.5 }}
          files={files}
          handleFileUpload={handleFileUpload}
        />

        <Box className={cx(classes.inputWrapper)}>
          <Controller
            name="taluk"
            control={control}
            render={({ field }) => (
              <SelectInput
                {...field}
                fullWidth
                label="Taluk*"
                variant="outlined"
                error={!!errors.taluk}
                message={errors.taluk?.message}
              >
                {TALUKS.map((l) => (
                  <MenuItem value={l.value}>{l.label}</MenuItem>
                ))}
              </SelectInput>
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

        {/* Tender Coconut */}
        {crops?.includes("Tender Coconut") && (
          <>
            <FormHeader sx={{ mt: 4 }}>Tender Coconut</FormHeader>

            <Box className={cx(classes.inputWrapper)}>
              <Controller
                name="tenderCoconut.variety"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    {...field}
                    fullWidth
                    label="Variety*"
                    variant="outlined"
                    error={!!errors?.tenderCoconut?.variety}
                    message={errors?.tenderCoconut?.variety?.message}
                  >
                    {COCONUT_VARIETIES.map((l) => (
                      <MenuItem value={l.value}>{l.label}</MenuItem>
                    ))}
                  </SelectInput>
                )}
              />

              <Controller
                name="tenderCoconut.generalHarvestCycleInDays"
                control={control}
                render={({ field: { onChange, ...rest } }) => (
                  <TextInput
                    {...rest}
                    fullWidth
                    type="number"
                    label="General Harvest Cycle In Days*"
                    variant="outlined"
                    error={!!errors?.tenderCoconut?.generalHarvestCycleInDays}
                    helperText={
                      errors?.tenderCoconut?.generalHarvestCycleInDays?.message
                    }
                    onChange={(e) => onChange(parseInt(e.target.value))}
                  />
                )}
              />
            </Box>

            <Box className={cx(classes.inputWrapper)}>
              <Controller
                name="tenderCoconut.numberOfTrees"
                control={control}
                render={({ field: { onChange, ...rest } }) => (
                  <TextInput
                    {...rest}
                    fullWidth
                    type="number"
                    label="Number Of Trees*"
                    variant="outlined"
                    error={!!errors?.tenderCoconut?.numberOfTrees}
                    helperText={errors?.tenderCoconut?.numberOfTrees?.message}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                  />
                )}
              />

              <Controller
                name="tenderCoconut.heightOfTree"
                control={control}
                render={({ field: { onChange, ...rest } }) => (
                  <TextInput
                    {...rest}
                    fullWidth
                    type="number"
                    label="Height Of Tree (in ft.)"
                    variant="outlined"
                    inputProps={{
                      step: 0.1,
                    }}
                    error={!!errors?.tenderCoconut?.heightOfTree}
                    helperText={errors?.tenderCoconut?.heightOfTree?.message}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                  />
                )}
              />
            </Box>

            <Box className={cx(classes.inputWrapper)}>
              <Controller
                name="tenderCoconut.ageOfTree"
                control={control}
                render={({ field: { onChange, ...rest } }) => (
                  <TextInput
                    {...rest}
                    fullWidth
                    type="number"
                    label="Age Of Tree (in years)"
                    variant="outlined"
                    inputProps={{
                      step: 0.1,
                    }}
                    error={!!errors?.tenderCoconut?.ageOfTree}
                    helperText={errors?.tenderCoconut?.ageOfTree?.message}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                  />
                )}
              />

              <Controller
                name="tenderCoconut.chutePercentage"
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
                    error={!!errors?.tenderCoconut?.chutePercentage}
                    helperText={errors?.tenderCoconut?.chutePercentage?.message}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                  />
                )}
              />
            </Box>

            <Box className={cx(classes.inputWrapper)}>
              <Controller
                name="tenderCoconut.numberOfNuts"
                control={control}
                render={({ field: { onChange, ...rest } }) => (
                  <TextInput
                    {...rest}
                    fullWidth
                    type="number"
                    label="Number Of Nuts*"
                    variant="outlined"
                    error={!!errors?.tenderCoconut?.numberOfNuts}
                    helperText={errors?.tenderCoconut?.numberOfNuts?.message}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                  />
                )}
              />

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
            </Box>

            <Box className={cx(classes.inputWrapper)}>
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

              <Controller
                name="tenderCoconut.nutsFromLastHarvest"
                control={control}
                render={({ field: { onChange, ...rest } }) => (
                  <TextInput
                    {...rest}
                    fullWidth
                    type="number"
                    label="Nuts From Last Harvest*"
                    variant="outlined"
                    error={!!errors?.tenderCoconut?.nutsFromLastHarvest}
                    helperText={
                      errors?.tenderCoconut?.nutsFromLastHarvest?.message
                    }
                    onChange={(e) => onChange(parseInt(e.target.value))}
                  />
                )}
              />
            </Box>

            <Box className={cx(classes.inputWrapper)}>
              <Controller
                name="tenderCoconut.isReadyToHarvest"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    {...field}
                    fullWidth
                    label="Is Ready To Harvest"
                    variant="outlined"
                    error={!!errors?.tenderCoconut?.isReadyToHarvest}
                    message={errors?.tenderCoconut?.isReadyToHarvest?.message}
                  >
                    {YES_NO.map((l) => (
                      <MenuItem value={l.value}>{l.label}</MenuItem>
                    ))}
                  </SelectInput>
                )}
              />
            </Box>
          </>
        )}

        {/* Turmeric */}
        {crops?.includes("Turmeric") && (
          <>
            <FormHeader sx={{ mt: 4 }}>Turmeric</FormHeader>

            <Box className={cx(classes.inputWrapper)}>
              <Controller
                name="turmeric.region"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    fullWidth
                    label="Region"
                    variant="outlined"
                    error={!!errors?.turmeric?.region}
                    helperText={errors?.turmeric?.region?.message}
                  />
                )}
              />

              <Controller
                name="turmeric.turmericVariety"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    {...field}
                    fullWidth
                    label="Variety"
                    variant="outlined"
                    error={!!errors?.turmeric?.turmericVariety}
                    message={errors?.turmeric?.turmericVariety?.message}
                  >
                    {TURMERIC_VARIETIES.map((l) => (
                      <MenuItem value={l.value}>{l.label}</MenuItem>
                    ))}
                  </SelectInput>
                )}
              />
            </Box>

            <Box className={cx(classes.inputWrapper)}>
              <Controller
                name="turmeric.numberOfAcres"
                control={control}
                render={({ field: { onChange, ...rest } }) => (
                  <TextInput
                    {...rest}
                    fullWidth
                    type="number"
                    label="Number Of Acres"
                    variant="outlined"
                    inputProps={{
                      step: 0.1,
                    }}
                    error={!!errors?.turmeric?.numberOfAcres}
                    helperText={errors?.turmeric?.numberOfAcres?.message}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                  />
                )}
              />

              <Controller
                name="turmeric.isTurmericOrganic"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    {...field}
                    fullWidth
                    label="Is Turmeric Organic"
                    variant="outlined"
                    error={!!errors?.turmeric?.isTurmericOrganic}
                    message={errors?.turmeric?.isTurmericOrganic?.message}
                  >
                    {YES_NO.map((l) => (
                      <MenuItem value={l.value}>{l.label}</MenuItem>
                    ))}
                  </SelectInput>
                )}
              />
            </Box>

            <Box className={cx(classes.inputWrapper)}>
              <Controller
                name="turmeric.isPolished"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    {...field}
                    fullWidth
                    label="Is Turmeric Polished"
                    variant="outlined"
                    error={!!errors?.turmeric?.isPolished}
                    message={errors?.turmeric?.isPolished?.message}
                  >
                    {YES_NO.map((l) => (
                      <MenuItem value={l.value}>{l.label}</MenuItem>
                    ))}
                  </SelectInput>
                )}
              />

              <Controller
                name="turmeric.isSinglePolished"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    {...field}
                    fullWidth
                    label="Is Turmeric Single Polished"
                    variant="outlined"
                    error={!!errors?.turmeric?.isSinglePolished}
                    message={errors?.turmeric?.isSinglePolished?.message}
                  >
                    {YES_NO.map((l) => (
                      <MenuItem value={l.value}>{l.label}</MenuItem>
                    ))}
                  </SelectInput>
                )}
              />
            </Box>

            <Box className={cx(classes.inputWrapper)}>
              <Controller
                name="turmeric.isDoublePolished"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    {...field}
                    fullWidth
                    label="Is Turmeric Double Polished"
                    variant="outlined"
                    error={!!errors?.turmeric?.isDoublePolished}
                    message={errors?.turmeric?.isDoublePolished?.message}
                  >
                    {YES_NO.map((l) => (
                      <MenuItem value={l.value}>{l.label}</MenuItem>
                    ))}
                  </SelectInput>
                )}
              />
            </Box>

            <Box className={cx(classes.inputWrapper)}>
              <Controller
                name="turmeric.isIPM"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    {...field}
                    fullWidth
                    label="Is Turmeric IPM"
                    variant="outlined"
                    error={!!errors?.turmeric?.isIPM}
                    message={errors?.turmeric?.isIPM?.message}
                  >
                    {YES_NO.map((l) => (
                      <MenuItem value={l.value}>{l.label}</MenuItem>
                    ))}
                  </SelectInput>
                )}
              />

              <Controller
                name="turmeric.turmericGeneralHarvestCycleInDays"
                control={control}
                render={({ field: { onChange, ...rest } }) => (
                  <TextInput
                    {...rest}
                    fullWidth
                    type="number"
                    label="General Harvest Cycle In Days"
                    variant="outlined"
                    error={
                      !!errors?.turmeric?.turmericGeneralHarvestCycleInDays
                    }
                    helperText={
                      errors?.turmeric?.turmericGeneralHarvestCycleInDays
                        ?.message
                    }
                    onChange={(e) => onChange(parseInt(e.target.value))}
                  />
                )}
              />
            </Box>

            <Box className={cx(classes.inputWrapper)}>
              <Controller
                name="turmeric.totalTurmericQuantity"
                control={control}
                render={({ field: { onChange, ...rest } }) => (
                  <TextInput
                    {...rest}
                    fullWidth
                    type="number"
                    label="Total Quantity (in quintal)"
                    variant="outlined"
                    inputProps={{
                      step: 0.1,
                    }}
                    error={!!errors?.turmeric?.totalTurmericQuantity}
                    helperText={
                      errors?.turmeric?.totalTurmericQuantity?.message
                    }
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                  />
                )}
              />

              <Controller
                name="turmeric.fingerQuantity"
                control={control}
                render={({ field: { onChange, ...rest } }) => (
                  <TextInput
                    {...rest}
                    fullWidth
                    type="number"
                    label="Total Finger Quantity (in quintal)"
                    variant="outlined"
                    inputProps={{
                      step: 0.1,
                    }}
                    error={!!errors?.turmeric?.fingerQuantity}
                    helperText={errors?.turmeric?.fingerQuantity?.message}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                  />
                )}
              />
            </Box>

            <Box className={cx(classes.inputWrapper)}>
              <Controller
                name="turmeric.bulbQuantity"
                control={control}
                render={({ field: { onChange, ...rest } }) => (
                  <TextInput
                    {...rest}
                    fullWidth
                    type="number"
                    label="Total Bulb Quantity (in quintal)"
                    variant="outlined"
                    inputProps={{
                      step: 0.1,
                    }}
                    error={!!errors?.turmeric?.bulbQuantity}
                    helperText={errors?.turmeric?.bulbQuantity?.message}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                  />
                )}
              />

              <Controller
                name="turmeric.isTurmericReadyToHarvest"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    {...field}
                    fullWidth
                    label="Is Ready To Harvest"
                    variant="outlined"
                    error={!!errors?.turmeric?.isTurmericOrganic}
                    message={errors?.turmeric?.isTurmericOrganic?.message}
                  >
                    {YES_NO.map((l) => (
                      <MenuItem value={l.value}>{l.label}</MenuItem>
                    ))}
                  </SelectInput>
                )}
              />
            </Box>
          </>
        )}

        {/* Banana */}
        {crops?.includes("Banana") && (
          <>
            <FormHeader sx={{ mt: 4 }}>Banana</FormHeader>

            <Box className={cx(classes.inputWrapper)}>
              <Controller
                name="banana.bananaVariety"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    {...field}
                    fullWidth
                    label="Variety"
                    variant="outlined"
                    error={!!errors?.banana?.bananaVariety}
                    message={errors?.banana?.bananaVariety?.message}
                  >
                    {BANANA_VARIETIES.map((l) => (
                      <MenuItem value={l.value}>{l.label}</MenuItem>
                    ))}
                  </SelectInput>
                )}
              />

              <Controller
                name="banana.tarShape"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    {...field}
                    fullWidth
                    label="Tar Shape"
                    variant="outlined"
                    error={!!errors?.banana?.tarShape}
                    message={errors?.banana?.tarShape?.message}
                  >
                    {TAR_SHAPES.map((l) => (
                      <MenuItem value={l.value}>{l.label}</MenuItem>
                    ))}
                  </SelectInput>
                )}
              />
            </Box>

            <Box className={cx(classes.inputWrapper)}>
              <Controller
                name="banana.tarWeight"
                control={control}
                render={({ field: { onChange, ...rest } }) => (
                  <TextInput
                    {...rest}
                    fullWidth
                    type="number"
                    label="Tar Weight (In Quintals)"
                    variant="outlined"
                    inputProps={{
                      step: 0.1,
                    }}
                    error={!!errors?.banana?.tarWeight}
                    helperText={errors?.banana?.tarWeight?.message}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                  />
                )}
              />

              <Controller
                name="banana.numberOfBananaTrees"
                control={control}
                render={({ field: { onChange, ...rest } }) => (
                  <TextInput
                    {...rest}
                    fullWidth
                    type="number"
                    label="Number Of Banana Trees"
                    variant="outlined"
                    error={!!errors?.banana?.numberOfBananaTrees}
                    helperText={errors?.banana?.numberOfBananaTrees?.message}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                  />
                )}
              />
            </Box>

            <Box className={cx(classes.inputWrapper)}>
              <Controller
                name="banana.numberOfBananaTreesRTH"
                control={control}
                render={({ field: { onChange, ...rest } }) => (
                  <TextInput
                    {...rest}
                    fullWidth
                    type="number"
                    label="Number Of Banana Trees RTH"
                    variant="outlined"
                    error={!!errors?.banana?.numberOfBananaTreesRTH}
                    helperText={errors?.banana?.numberOfBananaTreesRTH?.message}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                  />
                )}
              />

              <Controller
                name="banana.bananaGeneralHarvestCycleInDays"
                control={control}
                render={({ field: { onChange, ...rest } }) => (
                  <TextInput
                    {...rest}
                    fullWidth
                    type="number"
                    label="General Harvest Cycle In Days"
                    variant="outlined"
                    error={!!errors?.banana?.bananaGeneralHarvestCycleInDays}
                    helperText={
                      errors?.banana?.bananaGeneralHarvestCycleInDays?.message
                    }
                    onChange={(e) => onChange(parseInt(e.target.value))}
                  />
                )}
              />
            </Box>

            <Box className={cx(classes.inputWrapper)}>
              <Controller
                name="banana.cutCount"
                control={control}
                render={({ field: { onChange, ...rest } }) => (
                  <TextInput
                    {...rest}
                    fullWidth
                    type="number"
                    label="Cut Count"
                    variant="outlined"
                    error={!!errors?.banana?.cutCount}
                    helperText={errors?.banana?.cutCount?.message}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                  />
                )}
              />

              <Controller
                name="banana.cutType"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    {...field}
                    fullWidth
                    label="Cut Type"
                    variant="outlined"
                    error={!!errors?.banana?.cutType}
                    message={errors?.banana?.cutType?.message}
                  >
                    {CUT_TYPES.map((l) => (
                      <MenuItem value={l.value}>{l.label}</MenuItem>
                    ))}
                  </SelectInput>
                )}
              />
            </Box>

            <Box className={cx(classes.inputWrapper)}>
              <Controller
                name="banana.isBananaReadyToHarvest"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    {...field}
                    fullWidth
                    label="Is Ready To Harvest"
                    variant="outlined"
                    error={!!errors?.banana?.isBananaReadyToHarvest}
                    message={errors?.banana?.isBananaReadyToHarvest?.message}
                  >
                    {YES_NO.map((l) => (
                      <MenuItem value={l.value}>{l.label}</MenuItem>
                    ))}
                  </SelectInput>
                )}
              />
            </Box>
          </>
        )}

        {/* Dry Coconut */}
        {crops?.includes("Dry Coconut") && (
          <>
            <FormHeader sx={{ mt: 4 }}>Dry Coconut</FormHeader>

            <Box className={cx(classes.inputWrapper)}>
              <Controller
                name="dryCoconut.isDryCoconutHarvested"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    {...field}
                    fullWidth
                    label="Is Dry Coconut Harvested"
                    variant="outlined"
                    error={!!errors?.dryCoconut?.isDryCoconutHarvested}
                    message={errors?.dryCoconut?.isDryCoconutHarvested?.message}
                  >
                    {YES_NO.map((l) => (
                      <MenuItem value={l.value}>{l.label}</MenuItem>
                    ))}
                  </SelectInput>
                )}
              />

              <Controller
                name="dryCoconut.isOnTree"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    {...field}
                    fullWidth
                    label="Is On Tree"
                    variant="outlined"
                    error={!!errors?.dryCoconut?.isOnTree}
                    message={errors?.dryCoconut?.isOnTree?.message}
                  >
                    {YES_NO.map((l) => (
                      <MenuItem value={l.value}>{l.label}</MenuItem>
                    ))}
                  </SelectInput>
                )}
              />
            </Box>

            <Box className={cx(classes.inputWrapper)}>
              <Controller
                name="dryCoconut.numberOfDryCoconutsAvailable"
                control={control}
                render={({ field: { onChange, ...rest } }) => (
                  <TextInput
                    {...rest}
                    fullWidth
                    type="number"
                    label="Number Of Dry Coconuts Available"
                    variant="outlined"
                    error={!!errors?.dryCoconut?.numberOfDryCoconutsAvailable}
                    helperText={
                      errors?.dryCoconut?.numberOfDryCoconutsAvailable?.message
                    }
                    onChange={(e) => onChange(parseInt(e.target.value))}
                  />
                )}
              />

              <Controller
                name="dryCoconut.isWithHusk"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    {...field}
                    fullWidth
                    label="Is With Husk"
                    variant="outlined"
                    error={!!errors?.dryCoconut?.isWithHusk}
                    message={errors?.dryCoconut?.isWithHusk?.message}
                  >
                    {YES_NO.map((l) => (
                      <MenuItem value={l.value}>{l.label}</MenuItem>
                    ))}
                  </SelectInput>
                )}
              />
            </Box>

            <Box className={cx(classes.inputWrapper)}>
              <Controller
                name="dryCoconut.isWithSemiHusk"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    {...field}
                    fullWidth
                    label="Is With Semi Husk"
                    variant="outlined"
                    error={!!errors?.dryCoconut?.isWithSemiHusk}
                    message={errors?.dryCoconut?.isWithSemiHusk?.message}
                  >
                    {YES_NO.map((l) => (
                      <MenuItem value={l.value}>{l.label}</MenuItem>
                    ))}
                  </SelectInput>
                )}
              />

              <Controller
                name="dryCoconut.dryCoconutGeneralHarvestCycleInDays"
                control={control}
                render={({ field: { onChange, ...rest } }) => (
                  <TextInput
                    {...rest}
                    fullWidth
                    type="number"
                    label="General Harvest Cycle In Days"
                    variant="outlined"
                    error={
                      !!errors?.dryCoconut?.dryCoconutGeneralHarvestCycleInDays
                    }
                    helperText={
                      errors?.dryCoconut?.dryCoconutGeneralHarvestCycleInDays
                        ?.message
                    }
                    onChange={(e) => onChange(parseInt(e.target.value))}
                  />
                )}
              />
            </Box>

            <Box className={cx(classes.inputWrapper)}>
              <Controller
                name="dryCoconut.isDryCoconutReadyToHarvest"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    {...field}
                    fullWidth
                    label="Is Ready To Harvest"
                    variant="outlined"
                    error={!!errors?.dryCoconut?.isDryCoconutReadyToHarvest}
                    message={
                      errors?.dryCoconut?.isDryCoconutReadyToHarvest?.message
                    }
                  >
                    {YES_NO.map((l) => (
                      <MenuItem value={l.value}>{l.label}</MenuItem>
                    ))}
                  </SelectInput>
                )}
              />
            </Box>
          </>
        )}

        <FormFooter>
          <Button
            size="large"
            type="submit"
            variant="contained"
            sx={(theme) => ({ color: theme.palette.primary.white })}
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
  name: { Create },
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

export default Create;
