"use client";

import { useRef, useState, useEffect } from "react";

import { toast } from "react-toastify";

import { Box } from "@mui/material";

// Firebase
import { db } from "@/firebase";
import { query, where, getDocs, collection } from "firebase/firestore";

// Components
import Loader from "@/components/loader";
import UserGrid from "@/components/grids/user";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const isMounted = useRef(true);

  const refetch = async () => await fetchUsers();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);

      const reference = collection(db, "users");

      let q = reference;

      q = query(reference, where("isVerified", "==", false));

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
    if (isMounted.current) {
      fetchUsers();

      isMounted.current = false;
    }
  }, []);

  return (
    <Box
      display="flex"
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
    >
      {/* Grid */}
      <UserGrid data={users} refetch={refetch} />

      {/* Loader */}
      <Loader open={isLoading} />
    </Box>
  );
};

export default Users;
