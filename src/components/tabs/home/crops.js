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
import Modal from "@/components/modal";
import Loader from "@/components/loader";
import CropGrid from "@/components/grids/crop";
import TextInput from "@/components/inputs/textInput";

// Forms
import CreateCropForm from "@/components/forms/crop/create";
import CreateFarmForm from "@/components/forms/farm/create";

// Icons
import SearchIcon from "@mui/icons-material/Search";

const schema = z.object({
  mobileNumber: z
    .string()
    .min(10, "Mobile number must be exactly 10 digits")
    .max(10, "Mobile number must be exactly 10 digits"),
});

const defaultValues = {
  mobileNumber: "",
};

const Crops = () => {
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
  const [modal, setModal] = useState({
    create: false,
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const cleanNumber = data.mobileNumber.replace(/^\+91/, "");

      const q = query(
        collection(db, "crops"),
        where("mobileNumber", "==", `+91${cleanNumber}`)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error(`Found 0 records, onboard farm for +91${cleanNumber}`);

        setCrops([]);

        openModal("create");
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

      const cleanNumber = formValues.mobileNumber.replace(/^\+91/, "");

      const q = query(
        collection(db, "crops"),
        where("mobileNumber", "==", `+91${cleanNumber}`)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error(`Found 0 records, create farm for +91${cleanNumber}`);

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

  // function to open a modal
  const openModal = (state) => setModal((prev) => ({ ...prev, [state]: true }));

  // function to close a modal
  const closeModal = (state) =>
    setModal((prev) => ({ ...prev, [state]: false }));

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
          name="mobileNumber"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
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
              error={!!errors.mobileNumber}
              helperText={errors.mobileNumber?.message}
            />
          )}
        />
      </form>

      {/* Grid */}
      <CropGrid data={crops} refetch={refetch} />

      {/* Create Crop Modal */}
      <Modal
        open={modal.create}
        header={"New Farm Form"}
        modalStyles={{ padding: "1rem" }}
        handleClose={() => closeModal("create")}
      >
        {/* <CreateCropForm
          refetch={refetch}
          fields={{
            mobileNumber: getValues().mobileNumber,
          }}
          handleModalClose={() => closeModal("create")}
        /> */}

        <CreateFarmForm
          refetch={refetch}
          fields={{
            mobileNumber: getValues().mobileNumber,
          }}
          handleModalClose={() => closeModal("create")}
        />
      </Modal>

      {/* Loader */}
      <Loader open={isLoading} />
    </Box>
  );
};

export default Crops;
