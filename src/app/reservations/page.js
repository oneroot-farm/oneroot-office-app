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
  collection,
} from "firebase/firestore";

// Components
import Loader from "@/components/loader";
import SelectInput from "@/components/inputs/selectInput";
import ReservationGrid from "@/components/grids/reservation";

// Utils
import { getTimeframeDates } from "@/utils";

// Constants
import { TIMEFRAMES } from "@/constants";

const schema = z.object({
  timeframe: z.string().nonempty("Timeframe is required"),
});

const defaultValues = {
  timeframe: "today",
};

const Reservations = () => {
  const {
    watch,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadReference = useRef(true);
  const timeframeReference = useRef(defaultValues.timeframe);

  const refetch = async () => {
    await fetchReservations();
  };

  const fetchReservations = async () => {
    try {
      setIsLoading(true);

      const { timeframe } = getValues();

      const { startDate, endDate } = getTimeframeDates(timeframe);

      const reference = collection(db, "reservations");

      let q = reference;

      if (startDate && endDate) {
        q = query(
          reference,
          where("reservationDate", ">=", startDate),
          where("reservationDate", "<=", endDate)
        );
      }

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("Found 0 reservation records.");

        setReservations([]);
      } else {
        const results = [];

        for (const reservationDoc of querySnapshot.docs) {
          const reservation = { ...reservationDoc.data() };

          // fetch crop data
          if (reservation.cropId) {
            const cropDocument = await getDoc(
              doc(db, "crops", reservation.cropId)
            );

            if (cropDocument.exists()) {
              reservation.crop = { ...cropDocument.data() };
            } else {
              reservation.crop = null;
            }
          }

          // fetch user data
          if (reservation.userId) {
            const userDocument = await getDoc(
              doc(db, "users", reservation.userId)
            );

            if (userDocument.exists()) {
              reservation.user = { ...userDocument.data() };
            } else {
              reservation.user = null;
            }
          }

          results.push(reservation);
        }

        toast.success(`Found ${results.length} reservation records.`);

        setReservations(results);
      }
    } catch (error) {
      toast.error("Failed to fetch reservation data.");

      console.error("Error fetching reservation data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (loadReference.current) {
      loadReference.current = false;

      fetchReservations(getValues().timeframe);
    }
  }, []);

  const timeframe = watch("timeframe");

  useEffect(() => {
    if (!loadReference.current && timeframeReference.current !== timeframe) {
      timeframeReference.current = timeframe;

      fetchReservations(timeframe);
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
      <ReservationGrid data={reservations} refetch={refetch} />

      {/* Loader */}
      <Loader open={isLoading} />
    </Box>
  );
};

export default Reservations;
