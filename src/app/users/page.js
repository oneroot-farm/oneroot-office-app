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
import UserGrid from "@/components/grids/user";
import SelectInput from "@/components/inputs/selectInput";

// Constants
import { USER_VERIFICATION_STATUSES } from "@/constants";

const schema = z.object({
  status: z.string().nonempty("Status is required"),
});

const defaultValues = {
  status: false,
};

const Users = () => {
  const {
    watch,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadReference = useRef(true);
  const statusReference = useRef(defaultValues.status);

  const refetch = async () => await fetchUsers();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);

      const { status } = getValues();

      const reference = collection(db, "users");

      let q = reference;

      q = query(reference, where("isVerified", "==", status));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("Found 0 unverified users.");

        setUsers([]);
      } else {
        const results = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        toast.success(`Found ${results.length} unverified users.`);

        setUsers(results);
      }
    } catch (error) {
      toast.error("Failed to fetch unverified users.");

      console.error("Error fetching unverified users: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (loadReference.current) {
      loadReference.current = false;

      fetchUsers(getValues().status);
    }
  }, []);

  const status = watch("status");

  useEffect(() => {
    if (!loadReference.current && statusReference.current !== status) {
      statusReference.current = status;

      fetchUsers();
    }
  }, [status]);

  return (
    <Box
      display="flex"
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
    >
      {/* User Verification Status */}
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
            {USER_VERIFICATION_STATUSES.map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </SelectInput>
        )}
      />

      {/* Grid */}
      <UserGrid data={users} refetch={refetch} />

      {/* Loader */}
      <Loader open={isLoading} />
    </Box>
  );
};

export default Users;
