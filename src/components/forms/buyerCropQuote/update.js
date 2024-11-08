"use client";

import { useRef, useState, useEffect } from "react";

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
import {
  doc,
  where,
  query,
  getDocs,
  updateDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

// Components
import Loader from "@/components/loader";
import FormHeader from "@/components/forms/components/formHeader";
import FormFooter from "@/components/forms/components/formFooter";

// Inputs
import TextInput from "@/components/inputs/textInput";
import SelectInput from "@/components/inputs/selectInput";
import AutocompleteInput from "@/components/inputs/autocompleteInput";

// Utils
import { convertToCamelCase } from "@/utils";

// Constants
import { OPTIONS_TO_QUOTE } from "@/constants";

const schema = z.object({
  buyer: z.object({
    label: z.string(),
    value: z.string(),
  }),

  crop: z.string().refine((val) => val !== "", "Crop is required"),

  variety: z.string(),

  price: z
    .number()
    .nonnegative("Please enter a valid price")
    .refine((value) => value !== 0, "Price can not be zero")
    .refine((value) => !isNaN(value), "Price must be a valid number"),
});

const defaultValues = {
  buyer: "",
  crop: "",
  variety: "",
  price: 0,
};

const Update = ({ fields, refetch, handleModalClose }) => {
  const {
    control,
    reset,
    watch,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = useState(false);

  const [buyers, setBuyers] = useState([]);

  const loadReference = useRef(true);

  const { cx, classes } = useStyles();

  const onSubmit = async (data) => {
    const { buyer, crop, variety, price } = data;

    if (crop === "Tender Coconut" || crop === "Banana" || crop === "Turmeric") {
      let valid = true;

      if (!variety || variety === "") {
        setError("variety", {
          type: "manual",
          message: "Variety is required",
        });

        valid = false;
      }

      if (!valid) return;
    }

    try {
      setLoading(true);

      const reference = doc(db, "buyer-crop-quotes", fields?.id);

      await updateDoc(reference, {
        buyerId: buyer?.value,
        crop: crop,
        variety: variety || "",
        price: price,
        updatedAt: serverTimestamp(),
      });

      toast.success("Quote created successfully!");

      refetch();

      handleModalClose();
    } catch (error) {
      console.log(error);

      toast.error("error creating quote : ", error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBuyers = async () => {
    try {
      setLoading(true);

      const reference = collection(db, "users");

      let q = reference;

      q = query(reference, where("identity", "==", "BUYER"));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("Found 0 buyers.");

        setBuyers([]);
      } else {
        const results = [];

        querySnapshot.forEach((doc) => {
          const { id, name, mobileNumber } = doc.data();

          results.push({
            id: id,
            label: `${name} (${mobileNumber})`,
            value: id,
          });
        });

        setBuyers(results);
      }
    } catch (error) {
      toast.error("failed to fetch buyers data.");

      console.error("error fetching buyers data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loadReference.current) {
      loadReference.current = false;

      fetchBuyers();
    }
  }, []);

  useEffect(() => {
    if (fields) {
      const { buyer, crop, variety, price } = fields;

      const formData = {
        buyer: {
          id: buyer?.id,
          label: `${buyer?.name} (${buyer?.mobileNumber})`,
          value: buyer?.id,
        },
        crop,
        variety,
        price,
      };

      reset(formData);
    }
  }, [reset, fields]);

  return (
    <Container disableGutters className={cx(classes.container)}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormHeader sx={{ mt: 4 }}>Quote Details</FormHeader>

        <Box className={cx(classes.inputWrapper)}>
          <Controller
            name="buyer"
            control={control}
            render={({ field }) => (
              <AutocompleteInput
                {...field}
                fullWidth
                variant="outlined"
                options={buyers ? buyers : []}
                getOptionLabel={(option) =>
                  typeof option === "string" ? option : option.label || ""
                }
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                disabled={buyers.length === 0}
                onChange={(event, value) => field.onChange(value)}
                renderInput={(params) => (
                  <TextInput
                    {...params}
                    label="Buyer*"
                    variant="outlined"
                    error={!!errors.buyer}
                    helperText={errors.buyer?.message}
                  />
                )}
              />
            )}
          />

          <Controller
            name="crop"
            control={control}
            render={({ field }) => (
              <SelectInput
                {...field}
                fullWidth
                label="Crop*"
                variant="outlined"
                disabled={true}
                error={!!errors.crop}
                message={errors.crop?.message}
                onChange={(e) => {
                  setValue("variety", "");

                  field.onChange(e);
                }}
              >
                {OPTIONS_TO_QUOTE?.crops?.map((l) => (
                  <MenuItem value={l.value}>{l.label}</MenuItem>
                ))}
              </SelectInput>
            )}
          />
        </Box>

        <Box className={cx(classes.inputWrapper)}>
          <Controller
            name="variety"
            control={control}
            render={({ field }) => (
              <SelectInput
                {...field}
                fullWidth
                label="Variety"
                variant="outlined"
                disabled={true}
                error={!!errors.variety}
                message={errors.variety?.message}
              >
                {OPTIONS_TO_QUOTE?.varieties[
                  convertToCamelCase(watch()?.crop)
                ]?.map((l) => (
                  <MenuItem value={l.value}>{l.label}</MenuItem>
                ))}
              </SelectInput>
            )}
          />

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
                inputProps={{
                  step: 0.1,
                }}
                error={!!errors.price}
                helperText={errors.price?.message}
                onChange={(e) => onChange(parseFloat(e.target.value))}
              />
            )}
          />
        </Box>

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
