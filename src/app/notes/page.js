"use client";

import { useState } from "react";

import { z } from "zod";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Box, IconButton, InputAdornment } from "@mui/material";

// Firebase
import { db } from "@/firebase";
import { query, where, getDocs, collection } from "firebase/firestore";

// Components
import Loader from "@/components/loader";
import NoteGrid from "@/components/grids/note";
import TextInput from "@/components/inputs/textInput";

// Icons
import SearchIcon from "@mui/icons-material/Search";

const schema = z.object({
  id: z.string().nonempty("Farm ID is required"),
});

const defaultValues = {
  id: "",
};

const Notes = () => {
  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const [farms, setFarms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const refetch = async () => {
    try {
      setIsLoading(true);

      const q = query(
        collection(db, "crops"),
        where("farmName", "==", getValues().id)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error(`Found 0 records, onboard farm for ${getValues().id}`);

        setFarms([]);
      } else {
        const results = [];

        querySnapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() });
        });

        toast.success(`Found ${results.length} records.`);

        setFarms(results);
      }
    } catch (error) {
      toast.error("Failed to fetch data.");

      console.error("error fetching data : ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const q = query(
        collection(db, "crops"),
        where("farmName", "==", data.id)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error(`Found 0 records, onboard farm for ${data.id}`);

        setFarms([]);
      } else {
        const results = [];

        querySnapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() });
        });

        toast.success(`Found ${results.length} records.`);

        setFarms(results);
      }
    } catch (error) {
      toast.error("Failed to fetch data.");

      console.error("error fetching data : ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
    >
      {/* Form */}
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="id"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              fullWidth
              placeholder="Search..."
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton type="submit">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={!!errors.mobileNumber}
              helperText={errors.mobileNumber?.message}
            />
          )}
        />
      </form>

      {/* Grid */}
      <NoteGrid data={farms} refetch={refetch} />

      {/* Loader */}
      <Loader open={isLoading} />
    </Box>
  );
};

export default Notes;
