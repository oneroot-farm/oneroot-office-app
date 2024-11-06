"use client";

import { useState, useEffect } from "react";

import { z } from "zod";
import { makeStyles } from "tss-react/mui";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@mui/material/Button";

import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";

// Firebase
import { db } from "@/firebase";
import { query, where, getDocs, addDoc, collection } from "firebase/firestore";

// Components
import FormHeader from "@/components/forms/components/formHeader";
import FormFooter from "@/components/forms/components/formFooter";
import DynamicInputGroup from "@/components/dynamicInputGroup/dynamicInputGroup";

// Icons
import AddIcon from "@mui/icons-material/Add";

const schema = z.object({
  prices: z.object({
    tenderCoconut: z.array(
      z.object({
        variety: z.string().refine((val) => val !== "", "Variety is required"),
        price: z
          .number()
          .nonnegative("Please enter a valid price")
          .refine((value) => value !== 0, "Price can not be zero")
          .refine((value) => !isNaN(value), "Price must be a valid number"),
        location: z
          .string()
          .refine((val) => val !== "", "Location is required"),
      })
    ),

    banana: z.array(
      z.object({
        variety: z.string().refine((val) => val !== "", "Variety is required"),
        price: z
          .number()
          .nonnegative("Please enter a valid price")
          .refine((value) => value !== 0, "Price can not be zero")
          .refine((value) => !isNaN(value), "Price must be a valid number"),
        location: z.string(),
      })
    ),

    turmeric: z.array(
      z.object({
        variety: z.string().refine((val) => val !== "", "Variety is required"),
        price: z
          .number()
          .nonnegative("Please enter a valid price")
          .refine((value) => value !== 0, "Price can not be zero")
          .refine((value) => !isNaN(value), "Price must be a valid number"),
        location: z
          .string()
          .refine((val) => val !== "", "Location is required"),
      })
    ),

    dryCoconut: z.array(
      z.object({
        variety: z.string(),
        price: z
          .number()
          .nonnegative("Please enter a valid price")
          .refine((value) => value !== 0, "Price can not be zero")
          .refine((value) => !isNaN(value), "Price must be a valid number"),
        location: z
          .string()
          .refine((val) => val !== "", "Location is required"),
      })
    ),
  }),
});

const defaultValues = {
  prices: {
    tenderCoconut: [{ variety: "", price: 0, location: "" }],
    banana: [{ variety: "", price: 0, location: "" }],
    turmeric: [{ variety: "", price: 0, location: "" }],
    dryCoconut: [{ variety: "", price: 0, location: "" }],
  },
};

const MarketPrices = () => {
  const {
    reset,
    control,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const [isFormDisabled, setIsFormDisabled] = useState(false);

  const { cx, classes } = useStyles();

  const {
    fields: tenderCoconutFields,
    append: appendTenderCoconut,
    remove: removeTenderCoconut,
  } = useFieldArray({
    control,
    name: "prices.tenderCoconut",
  });

  const {
    fields: bananaFields,
    append: appendBanana,
    remove: removeBanana,
  } = useFieldArray({
    control,
    name: "prices.banana",
  });

  const {
    fields: turmericFields,
    append: appendTurmeric,
    remove: removeTurmeric,
  } = useFieldArray({
    control,
    name: "prices.turmeric",
  });

  const {
    fields: dryCoconutFields,
    append: appendDryCoconut,
    remove: removeDryCoconut,
  } = useFieldArray({
    control,
    name: "prices.dryCoconut",
  });

  const onSubmit = async (data) => {
    const crops = {};

    Object.keys(data.prices).forEach((cropKey) => {
      const cropName = {
        tenderCoconut: "Tender Coconut",
        banana: "Banana",
        turmeric: "Turmeric",
        dryCoconut: "Dry Coconut",
      }[cropKey];

      const cropEntries = data.prices[cropKey]
        .filter(
          (item) =>
            item.price &&
            (!item.location || item.location.trim() !== "") &&
            (cropKey !== "banana" || item.variety || item.variety === "")
        )
        .map((item) => ({
          crop: cropName,
          location: item.location || "",
          price: item.price,
          variety: item.variety || "",
        }));

      if (cropEntries.length > 0) crops[cropKey] = cropEntries;
    });

    const entry = {
      createdAt: new Date(),
      crops,
    };

    try {
      await addDoc(collection(db, "market-prices"), entry);

      console.log("entry added successfully: ", entry);

      // reset form
      reset();

      // check entries created today
      await checkEntriesCreatedToday();
    } catch (error) {
      console.error("error adding entry: ", error);
    }
  };

  const checkEntriesCreatedToday = async () => {
    const today = new Date();

    // set the start and end of the day
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // query for entries created today
    const entriesQuery = query(
      collection(db, "market-prices"),
      where("createdAt", ">=", startOfDay),
      where("createdAt", "<=", endOfDay)
    );

    const snapshot = await getDocs(entriesQuery);

    // disable form if an entry has been created today
    if (!snapshot.empty) setIsFormDisabled(true);
  };

  // fetch today's entries on component load
  useEffect(() => {
    checkEntriesCreatedToday();
  }, []);

  return (
    <Container disableGutters className={cx(classes.container)}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormHeader sx={{ mt: 4 }}>Tender Coconut</FormHeader>

        {tenderCoconutFields.map((field, index) => (
          <DynamicInputGroup
            key={field.id}
            control={control}
            index={index}
            crop="tenderCoconut"
            errors={errors?.prices?.tenderCoconut?.[index]}
            onRemove={() => removeTenderCoconut(index)}
            isRemovable={tenderCoconutFields.length > 1}
            formValues={getValues()}
          />
        ))}

        <IconButton
          onClick={() =>
            appendTenderCoconut({ variety: "", price: "", location: "" })
          }
        >
          <AddIcon />
        </IconButton>

        <FormHeader sx={{ mt: 4 }}>Turmeric</FormHeader>

        {turmericFields.map((field, index) => (
          <DynamicInputGroup
            key={field.id}
            control={control}
            index={index}
            crop="turmeric"
            errors={errors?.prices?.turmeric?.[index]}
            onRemove={() => removeTurmeric(index)}
            isRemovable={turmericFields.length > 1}
            formValues={getValues()}
          />
        ))}

        <IconButton
          onClick={() =>
            appendTurmeric({ variety: "", price: "", location: "" })
          }
        >
          <AddIcon />
        </IconButton>

        <FormHeader sx={{ mt: 4 }}>Banana</FormHeader>

        {bananaFields.map((field, index) => (
          <DynamicInputGroup
            key={field.id}
            control={control}
            index={index}
            crop="banana"
            errors={errors?.prices?.banana?.[index]}
            onRemove={() => removeBanana(index)}
            isRemovable={bananaFields.length > 1}
            required={{
              variety: true,
              location: false,
              price: true,
            }}
            formValues={getValues()}
          />
        ))}

        <IconButton
          onClick={() => appendBanana({ variety: "", price: "", location: "" })}
        >
          <AddIcon />
        </IconButton>

        <FormHeader sx={{ mt: 4 }}>Dry Coconut</FormHeader>

        {dryCoconutFields.map((field, index) => (
          <DynamicInputGroup
            key={field.id}
            control={control}
            index={index}
            crop="dryCoconut"
            errors={errors?.prices?.dryCoconut?.[index]}
            onRemove={() => removeDryCoconut(index)}
            isRemovable={dryCoconutFields.length > 1}
            required={{
              variety: false,
              location: true,
              price: true,
            }}
            formValues={getValues()}
          />
        ))}

        <IconButton
          onClick={() =>
            appendDryCoconut({ variety: "", price: "", location: "" })
          }
        >
          <AddIcon />
        </IconButton>

        <FormFooter>
          <Button
            size="large"
            type="submit"
            variant="contained"
            disabled={isFormDisabled}
            sx={(theme) => ({ color: theme.palette.primary.white })}
          >
            Submit
          </Button>
        </FormFooter>
      </form>
    </Container>
  );
};

// Styles 💅
const useStyles = makeStyles({
  name: { MarketPrices },
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

export default MarketPrices;
