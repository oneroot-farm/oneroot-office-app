"use client";

import { useRef, useState, useEffect } from "react";

import { z } from "zod";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Box, MenuItem } from "@mui/material";

// Firebase
import { db } from "@/firebase";
import {
  doc,
  query,
  where,
  getDoc,
  getDocs,
  Timestamp,
  collection,
} from "firebase/firestore";

// Components
import Loader from "@/components/loader";
import SelectInput from "@/components/inputs/selectInput";
import CallLogsGrid from "@/components/grids/callLog";

// Utils
import { getTimeframeDates, convertToISTString } from "@/utils";

// Constants
import { TIMEFRAMES as BASE_TIMEFRAMES } from "@/constants";

const schema = z.object({
  timeframe: z.string().nonempty("Timeframe is required"),
});

const defaultValues = {
  timeframe: "today",
};

const CallLogs = () => {
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
    ...BASE_TIMEFRAMES.filter((t) => t.value === "today"),
  ];

  const [callLogs, setCallLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadReference = useRef(true);
  const timeframeReference = useRef(defaultValues.timeframe);

  const refetch = async () => {
    await fetchCallLogs();
  };

  const fetchCallLogs = async () => {
    try {
      setIsLoading(true);

      const { timeframe } = getValues();

      const { startDate, endDate } = getTimeframeDates(timeframe);

      const reference = collection(db, "call_attempts");

      let q = reference;

      if (startDate && endDate) {
        const startOfDay = convertToISTString(startDate.toDate());

        const endOfDay = convertToISTString(
          new Date(endDate.toDate().setHours(23, 59, 59, 999))
        );

        q = query(
          reference,
          where("startStamp", ">=", startOfDay),
          where("startStamp", "<=", endOfDay)
        );
      }

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("Found 0 call log records.");

        setCallLogs([]);
      } else {
        const results = [];

        for (const callLogDoc of querySnapshot.docs) {
          const callLog = { ...callLogDoc.data() };

          // fetch crop data
          if (callLog.cropId) {
            const cropDocument = await getDoc(doc(db, "crops", callLog.cropId));

            if (cropDocument.exists()) {
              callLog.crop = { ...cropDocument.data() };
            } else {
              callLog.crop = null;
            }
          }

          // fetch user data
          if (callLog.userId) {
            const userDocument = await getDoc(doc(db, "users", callLog.userId));

            if (userDocument.exists()) {
              callLog.user = { ...userDocument.data() };
            } else {
              callLog.user = null;
            }
          }

          results.push(callLog);
        }

        toast.success(`Found ${results.length} call log records.`);

        setCallLogs(results);
      }
    } catch (error) {
      toast.error("Failed to fetch call logs data.");

      console.error("Error fetching call logs data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  /*
  useEffect(() => {
    if (loadReference.current) {
      loadReference.current = false;

      fetchCallLogs(getValues().timeframe);
    }
  }, []);

  const timeframe = watch("timeframe");

  useEffect(() => {
    if (!loadReference.current && timeframeReference.current !== timeframe) {
      timeframeReference.current = timeframe;

      fetchCallLogs(timeframe);
    }
  }, [timeframe]);
  */

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
      <CallLogsGrid data={callLogs} refetch={refetch} />

      {/* Loader */}
      <Loader open={isLoading} />
    </Box>
  );
};

export default CallLogs;
