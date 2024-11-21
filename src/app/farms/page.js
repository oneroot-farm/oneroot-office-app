"use client";

import { useRef, useState, useEffect } from "react";

import { z } from "zod";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Box, MenuItem } from "@mui/material";

// Firebase
import { db } from "@/firebase";
import { query, where, getDocs, collection } from "firebase/firestore";

// Components
import Loader from "@/components/loader";
import CropGrid from "@/components/grids/crop";
import SelectInput from "@/components/inputs/selectInput";

// Utils
import { getTimeframeDates } from "@/utils";

// Constants
import { TIMEFRAMES as BASE_TIMEFRAMES, CROPS } from "@/constants";

const schema = z.object({
  timeframe: z.string().nonempty("Timeframe is required"),

  crop: z.string().nonempty("Crop is required"),
});

const defaultValues = {
  timeframe: "today",
  crop: "Tender Coconut",
};

const Farms = () => {
  const {
    watch,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const TIMEFRAMES = [
    { id: 4, label: "Last Week", value: "lastWeek" },
    ...BASE_TIMEFRAMES,
  ];

  const [farms, setFarms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadReference = useRef(false);

  const refetch = async () => {
    await fetchFarms();
  };

  const fetchFarms = async () => {
    try {
      setIsLoading(true);

      const { timeframe, crop } = getValues();

      const { startDate, endDate } = getTimeframeDates(timeframe);

      // define the field name based on the crop
      let field = "";

      switch (crop) {
        case "Tender Coconut":
          field = "readyToHarvestDate";
          break;

        case "Banana":
          field = "bananaReadyToHarvestDate";
          break;

        case "Turmeric":
          field = "turmericReadyToHarvestDate";
          break;

        case "Dry Coconut":
          field = "dryCoconutReadyToHarvestDate";
          break;

        default:
          toast.error("invalid crop type");

          setIsLoading(false);

          return;
      }

      const reference = collection(db, "crops");

      let q = reference;

      if (startDate && endDate) {
        const date = new Date();

        date.setHours(0, 0, 0, 0);

        q = query(
          reference,
          where(
            field,
            ">=",
            startDate
              .toDate()
              .toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
          ),
          where(
            field,
            "<=",
            endDate
              .toDate()
              .toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
          )
        );
      }

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("Found 0 farm records.");

        setFarms([]);
      } else {
        const results = [];

        querySnapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() });
        });

        toast.success(`Found ${results.length} farm records.`);

        setFarms(results);
      }
    } catch (error) {
      toast.error("Failed to fetch farm data.");

      console.error("Error fetching farm data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const { timeframe, crop } = watch();

  useEffect(() => {
    if (loadReference.current) {
      fetchFarms();
    }
  }, [timeframe, crop]);

  useEffect(() => {
    if (!loadReference.current) {
      loadReference.current = true;

      fetchFarms();
    }
  }, []);

  return (
    <Box
      display="flex"
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
    >
      {/* Timeframe */}
      <Controller
        name="timeframe"
        control={control}
        render={({ field }) => (
          <SelectInput
            {...field}
            fullWidth
            label="Timeframe*"
            variant="outlined"
            error={!!errors.timeframe}
            message={errors.timeframe?.message}
          >
            {TIMEFRAMES.map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </SelectInput>
        )}
      />

      {/* Crop */}
      <Controller
        name="crop"
        control={control}
        render={({ field }) => (
          <SelectInput
            {...field}
            fullWidth
            label="Crop*"
            variant="outlined"
            error={!!errors.crop}
            message={errors.crop?.message}
          >
            {CROPS.map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </SelectInput>
        )}
      />

      {/* Grid */}
      <CropGrid crop={crop} data={farms} refetch={refetch} />

      {/* Loader */}
      <Loader open={isLoading} />
    </Box>
  );
};

export default Farms;
