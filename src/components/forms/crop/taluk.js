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

// Firebase
import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";

// Components
import Loader from "@/components/loader";
import FormHeader from "@/components/forms/components/formHeader";
import FormFooter from "@/components/forms/components/formFooter";

// Inputs
import TextInput from "@/components/inputs/textInput";
import SelectInput from "@/components/inputs/selectInput";

// Constants
import { TALUKS } from "@/constants";

const schema = z.object({
  taluk: z
    .string()
    .nullable()
    .refine((val) => val !== "", "Taluk is required"),

  village: z.string().min(1, "Village is required"),
});

const defaultValues = {
  taluk: "",
  village: "",
};

const Taluk = ({ fields, refetch, handleModalClose }) => {
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = useState(false);

  const { cx, classes } = useStyles();

  useEffect(() => {
    if (fields) {
      const { village = "", taluk = "" } = fields;

      const formData = {
        taluk,
        village,
      };

      reset(formData);
    }
  }, [reset, fields]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const payload = {
        ...data,
      };

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

  return (
    <Container disableGutters className={cx(classes.container)}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormHeader sx={{ mt: 4 }}>Location Details</FormHeader>

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
  name: { Taluk },
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

export default Taluk;
