"use client";

import { useState, useEffect } from "react";

import { z } from "zod";
import { toast } from "react-toastify";
import { makeStyles } from "tss-react/mui";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

// Firebase
import { db } from "@/firebase";
import {
  addDoc,
  updateDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

// Components
import Loader from "@/components/loader";
import DocPicker from "@/components/docPicker";
import FormHeader from "@/components/forms/components/formHeader";
import FormFooter from "@/components/forms/components/formFooter";

// Inputs
import TextInput from "@/components/inputs/textInput";
import SelectInput from "@/components/inputs/selectInput";

// Utils
import { uploadFilesHandler } from "@/utils";

// Constants
import { YES_NO, LANGUAGES, COCONUT_VARIETIES } from "@/constants";

const schema = z.object({
  name: z.string().min(1, "Name is required"),

  mobileNumber: z
    .string()
    .min(10, "Mobile number must be exactly 10 digits")
    .max(10, "Mobile number must be exactly 10 digits"),

  language: z
    .string()
    .nullable()
    .refine((val) => val !== "", "Language is required"),

  isVerified: z.boolean(),

  aadharCardNumber: z.string(),

  village: z.string().min(1, "Village is required"),

  labourForceCount: z
    .number()
    .nonnegative("Please enter a valid labour force count")
    .refine((value) => value !== 0, "Labour force count can not be zero")
    .refine(
      (value) => !isNaN(value),
      "Labour force count must be a valid number"
    ),

  dailyNutsYield: z
    .number()
    .nonnegative("Please enter a valid daily nuts yield")
    .refine((value) => value !== 0, "Daily nuts yield can not be zero")
    .refine(
      (value) => !isNaN(value),
      "Daily nuts yield must be a valid number"
    ),

  targetRegions: z.string(),

  preferredVarieties: z.array(z.string()),

  supplyNetwork: z.string(),

  selfQC: z.boolean(),

  dailyFeedback: z.boolean(),

  amountWillingToPay: z
    .number()
    .nonnegative("Please enter a valid amount willing to pay")
    .refine(
      (value) => !isNaN(value),
      "Amount willing to pay must be a valid number"
    ),
});

const defaultValues = {
  name: "",
  mobileNumber: "",
  language: "",
  isVerified: true,
  aadharCardNumber: "",
  village: "",
  labourForceCount: 0,
  dailyNutsYield: 0,
  targetRegions: "",
  preferredVarieties: [],
  supplyNetwork: "",
  selfQC: false,
  dailyFeedback: false,
  amountWillingToPay: 0,
};

const Create = ({ refetch, handleModalClose }) => {
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const { cx, classes } = useStyles();

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (f) => {
    if (f.length > 2) {
      toast.error("Only 2 images are allowed: Aadhar front and back");

      return;
    }

    setFiles(f);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      if (data.aadharCardNumber) {
        let valid = true;

        const aadharRegex = /^[0-9]{12}$/;

        if (!aadharRegex.test(data.aadharCardNumber)) {
          setError("aadharCardNumber", {
            type: "manual",
            message: "Aadhar card number must be exactly 12 digits",
          });

          valid = false;
        }

        if (!valid) return;
      }

      const { mobileNumber } = data;

      const payload = {
        ...data,
        mobileNumber: `+91${mobileNumber}`,
        targetRegions: data.targetRegions
          .split(",")
          .map((region) => region.trim()),
        supplyNetwork: data.supplyNetwork
          .split(",")
          .map((network) => network.trim()),
        androidId: "",
        fcmToken: "",
        identity: "BUYER",
        createdAt: serverTimestamp(),
        tags: ["office-app"],
      };

      if (files && files.length > 0) {
        const images = Array.from(files);

        const urls = await uploadFilesHandler(images, "aadhar-images");

        payload.aadharImages = urls;
      } else {
        payload.aadharImages = [];
      }

      console.log("BUYER : ", payload);

      const reference = await addDoc(collection(db, "users"), payload);

      payload.id = reference.id;

      await updateDoc(reference, { id: reference.id });

      toast.success("Record created successfully!");

      refetch();

      handleModalClose();
    } catch (error) {
      console.log(error);

      toast.error("Error updating record: ", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container disableGutters className={cx(classes.container)}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormHeader sx={{ mt: 4 }}>User Details</FormHeader>

        <Box className={cx(classes.inputWrapper)}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                fullWidth
                label="Name*"
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name?.message}
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
            name="isVerified"
            control={control}
            render={({ field }) => (
              <SelectInput
                {...field}
                fullWidth
                label="Is Verified*"
                variant="outlined"
                disabled={true}
                error={!!errors.isVerified}
                message={errors.isVerified?.message}
              >
                {YES_NO.map((l) => (
                  <MenuItem value={l.value}>{l.label}</MenuItem>
                ))}
              </SelectInput>
            )}
          />
        </Box>

        <FormHeader sx={{ mt: 4 }}>Additional Details</FormHeader>

        <Box className={cx(classes.inputWrapper)} sx={{ mb: 2.5 }}>
          <Box className={cx(classes.docPickerContainer)}>
            <Typography className={cx(classes.docPickerLabel)}>
              Aadhar Front & Back
            </Typography>

            <DocPicker
              files={files}
              key="aadhar-front-back"
              handleFileUpload={handleFileUpload}
            />
          </Box>
        </Box>

        <Box className={cx(classes.inputWrapper)}>
          <Controller
            name="aadharCardNumber"
            control={control}
            render={({ field: { onChange, ...rest } }) => (
              <TextInput
                {...rest}
                fullWidth
                type="number"
                label="Aadhar Card Number"
                variant="outlined"
                error={!!errors.aadharCardNumber}
                helperText={errors.aadharCardNumber?.message}
                onChange={(e) => {
                  const value = e.target.value;

                  const regex = /^\d*$/;

                  if (regex.test(value)) onChange(value);
                }}
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
            name="preferredVarieties"
            control={control}
            render={({ field }) => (
              <SelectInput
                {...field}
                multiple
                fullWidth
                label="Preferred Varieties*"
                variant="outlined"
                error={!!errors.preferredVarieties}
                message={errors.preferredVarieties?.message}
              >
                {COCONUT_VARIETIES.map((l) => (
                  <MenuItem value={l.value}>{l.label}</MenuItem>
                ))}
              </SelectInput>
            )}
          />

          <Controller
            name="selfQC"
            control={control}
            render={({ field }) => (
              <SelectInput
                {...field}
                fullWidth
                label="Self QC*"
                variant="outlined"
                error={!!errors.selfQC}
                message={errors.selfQC?.message}
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
            name="targetRegions"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                fullWidth
                label="Target Regions"
                variant="outlined"
                error={!!errors.targetRegions}
                helperText={
                  errors.targetRegions?.message ||
                  "Separate multiple values with commas (,)"
                }
              />
            )}
          />

          <Controller
            name="labourForceCount"
            control={control}
            render={({ field: { onChange, ...rest } }) => (
              <TextInput
                {...rest}
                fullWidth
                type="number"
                label="Labour Force Count*"
                variant="outlined"
                inputProps={{
                  step: 0.1,
                }}
                error={!!errors.labourForceCount}
                helperText={errors.labourForceCount?.message}
                onChange={(e) => onChange(parseFloat(e.target.value))}
              />
            )}
          />
        </Box>

        <Box className={cx(classes.inputWrapper)}>
          <Controller
            name="dailyNutsYield"
            control={control}
            render={({ field: { onChange, ...rest } }) => (
              <TextInput
                {...rest}
                fullWidth
                type="number"
                label="Daily Nuts Yield*"
                variant="outlined"
                inputProps={{
                  step: 0.1,
                }}
                error={!!errors.dailyNutsYield}
                helperText={errors.dailyNutsYield?.message}
                onChange={(e) => onChange(parseFloat(e.target.value))}
              />
            )}
          />

          <Controller
            name="supplyNetwork"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                fullWidth
                label="Supply Network*"
                variant="outlined"
                error={!!errors.supplyNetwork}
                helperText={
                  errors.supplyNetwork?.message ||
                  "Separate multiple values with commas (,)"
                }
              />
            )}
          />
        </Box>

        <Box className={cx(classes.inputWrapper)}>
          <Controller
            name="dailyFeedback"
            control={control}
            render={({ field }) => (
              <SelectInput
                {...field}
                fullWidth
                label="Daily Feedback*"
                variant="outlined"
                error={!!errors.dailyFeedback}
                message={errors.dailyFeedback?.message}
              >
                {YES_NO.map((l) => (
                  <MenuItem value={l.value}>{l.label}</MenuItem>
                ))}
              </SelectInput>
            )}
          />

          <Controller
            name="amountWillingToPay"
            control={control}
            render={({ field: { onChange, ...rest } }) => (
              <TextInput
                {...rest}
                fullWidth
                type="number"
                label="Amount Willing To Pay"
                variant="outlined"
                inputProps={{
                  step: 0.1,
                }}
                error={!!errors.amountWillingToPay}
                helperText={errors.amountWillingToPay?.message}
                onChange={(e) => onChange(parseFloat(e.target.value))}
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

  docPickerContainer: {
    width: "100%",

    [theme.breakpoints.down("sm")]: {
      "&:nth-of-type(2)": {
        marginTop: 16,
      },
    },
  },

  docPickerLabel: {
    marginBottom: 2,
    color: theme.palette.primary["grey2"],
  },
}));

export default Create;
