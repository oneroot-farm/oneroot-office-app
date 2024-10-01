"use client";

import { useState } from "react";

import { z } from "zod";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Box, InputAdornment, IconButton } from "@mui/material";

// Firebase
import { db } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

// Components
import Loader from "@/components/loader";
import CropGrid from "@/components/grids/crop";
import TextInput from "@/components/inputs/textInput";

// Icons
import SearchIcon from "@mui/icons-material/Search";

const schema = z.object({
  numberOfTrees: z.number(),
});

const defaultValues = {
  numberOfTrees: 0,
};

const ManageTrees = () => {
  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const [crops, setCrops] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const numberOfTrees = data.numberOfTrees;

      const q = query(
        collection(db, "crops"),
        where("numberOfTrees", "<=", numberOfTrees)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error(
          `Found 0 records, where number of trees are less than or equal to ${numberOfTrees}.`
        );

        setCrops([]);
      } else {
        const results = [];

        querySnapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() });
        });

        toast.success(`Found ${results.length} records.`);

        setCrops(results);
      }
    } catch (error) {
      toast.error("Failed to fetch data.");

      console.error("error fetching data : ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    try {
      setIsLoading(true);

      const formValues = getValues();

      const numberOfTrees = formValues.numberOfTrees;

      const q = query(
        collection(db, "crops"),
        where("numberOfTrees", "<=", numberOfTrees)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error(
          `Found 0 records, where number of trees are less than or equal to ${numberOfTrees}.`
        );

        setCrops([]);
      } else {
        const results = [];

        querySnapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() });
        });

        toast.success(`Found ${results.length} records.`);

        setCrops(results);
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
          name="numberOfTrees"
          control={control}
          render={({ field: { onChange, ...rest } }) => (
            <TextInput
              {...rest}
              fullWidth
              type="number"
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
              error={!!errors.numberOfTrees}
              helperText={errors.numberOfTrees?.message}
              onChange={(e) => onChange(parseInt(e.target.value))}
            />
          )}
        />
      </form>

      {/* Grid */}
      <CropGrid data={crops} refetch={refetch} />

      {/* Loader */}
      <Loader open={isLoading} />
    </Box>
  );
};

export default ManageTrees;
