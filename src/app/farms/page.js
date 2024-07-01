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
import { TIMEFRAMES as BASE_TIMEFRAMES } from "@/constants";

const schema = z.object({
  timeframe: z.string().nonempty("Timeframe is required"),
});

const defaultValues = {
  timeframe: "today",
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

  const loadReference = useRef(true);
  const timeframeReference = useRef(defaultValues.timeframe);

  const refetch = async () => {
    await fetchFarms();
  };

  const fetchFarms = async () => {
    try {
      setIsLoading(true);

      const { timeframe } = getValues();

      const { startDate, endDate } = getTimeframeDates(timeframe);

      const reference = collection(db, "crops");

      let q = reference;

      if (startDate && endDate) {
        const date = new Date();

        date.setHours(0, 0, 0, 0);

        const today = date.toLocaleDateString("en-CA", {
          timeZone: "Asia/Kolkata",
        });

        q = query(
          reference,
          where(
            "readyToHarvestDate",
            ">=",
            startDate
              .toDate()
              .toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
          ),
          where(
            "readyToHarvestDate",
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

  useEffect(() => {
    if (loadReference.current) {
      loadReference.current = false;

      fetchFarms(getValues().timeframe);
    }
  }, []);

  const timeframe = watch("timeframe");

  useEffect(() => {
    if (!loadReference.current && timeframeReference.current !== timeframe) {
      timeframeReference.current = timeframe;

      fetchFarms(timeframe);
    }
  }, [timeframe]);

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

      {/* Grid */}
      <CropGrid data={farms} refetch={refetch} />

      {/* Loader */}
      <Loader open={isLoading} />
    </Box>
  );
};

export default Farms;
