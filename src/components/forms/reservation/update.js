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
import { doc, updateDoc, Timestamp } from "firebase/firestore";

// Components
import Loader from "@/components/loader";
import DatePicker from "@/components/datePicker";
import FormHeader from "@/components/forms/components/formHeader";
import FormFooter from "@/components/forms/components/formFooter";

// Inputs
import TextInput from "@/components/inputs/textInput";
import SelectInput from "@/components/inputs/selectInput";

// Constants
import { RESERVATION_STATUSES } from "@/constants";

// Utils
import { convertFromTimestampToDate } from "@/utils";

const schema = z.object({
  price: z
    .number()
    .positive("Price must be a positive number")
    .refine((value) => !isNaN(value), "Price must be a valid number"),
  status: z.string().min(1, "Status is required"),
  reason: z.string().optional(),
  additionalDetails: z.string().optional(),
});

const defaultValues = {
  price: 0,
  status: "",
  reason: "",
  additionalDetails: "",
};

const Update = ({ fields, refetch, handleModalClose }) => {
  const {
    reset,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const { cx, classes } = useStyles();

  const [dates, setDates] = useState({
    reservationDate: dayjs(),
  });
  const [loading, setLoading] = useState(false);

  const watchStatus = watch("status");

  useEffect(() => {
    if (fields) {
      const {
        price = 0,
        reservationDate = dayjs(),
        status = "",
        reason = "",
        additionalDetails = "",
      } = fields;

      const formData = {
        price,
        status: status.toLowerCase().replace(/\s+/g, "-"),
        reason,
        additionalDetails,
      };

      reset(formData);

      const date = convertFromTimestampToDate(
        reservationDate.seconds,
        reservationDate.nanoseconds
      );

      setDates({
        reservationDate: dayjs(date),
      });
    }
  }, [reset, fields]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const payload = {
        ...data,
        reservationDate: Timestamp.fromDate(new Date(dates.reservationDate)),
      };

      const reference = doc(db, "reservations", fields.id);

      await updateDoc(reference, payload);

      toast.success("Record updated successfully!");

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
        <FormHeader sx={{ mt: 4 }}>Reservation Details</FormHeader>

        <Box className={cx(classes.inputWrapper)}>
          <Controller
            name="price"
            control={control}
            render={({ field: { onChange, ...rest } }) => (
              <TextInput
                {...rest}
                fullWidth
                type="number"
                label="Price*"
                variant="outlined"
                error={!!errors.price}
                helperText={errors.price?.message}
                onChange={(e) => onChange(parseFloat(e.target.value))}
              />
            )}
          />

          <DatePicker
            pickerProps={{
              format: "DD-MM-YYYY",
              label: "Reservation Date*",
              sx: { width: "100%" },
              value: dates.reservationDate,
              onChange: (date) =>
                setDates((previous) => ({
                  ...previous,
                  reservationDate: dayjs(date),
                })),
              renderInput: (params) => <TextInput {...params} />,
            }}
          />
        </Box>

        <Box className={cx(classes.inputWrapper)}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <SelectInput
                {...field}
                fullWidth
                label="Status*"
                variant="outlined"
                error={!!errors.status}
                message={errors.status?.message}
              >
                {RESERVATION_STATUSES.map((s) => (
                  <MenuItem key={s.value} value={s.value}>
                    {s.label}
                  </MenuItem>
                ))}
              </SelectInput>
            )}
          />

          <Controller
            name="additionalDetails"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                fullWidth
                label="Additional Details"
                variant="outlined"
                error={!!errors.additionalDetails}
                helperText={errors.additionalDetails?.message}
              />
            )}
          />
        </Box>

        {watchStatus === "cancelled" && (
          <Box className={cx(classes.inputWrapper)}>
            <Controller
              name="reason"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  fullWidth
                  label="Reason for Cancellation"
                  variant="outlined"
                  error={!!errors.reason}
                  helperText={errors.reason?.message}
                />
              )}
            />
          </Box>
        )}

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
