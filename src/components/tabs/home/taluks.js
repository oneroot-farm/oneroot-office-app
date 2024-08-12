"use client";

import { useRef, useState, useEffect } from "react";

import { toast } from "react-toastify";

import { Box } from "@mui/material";

// Firebase
import { db } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

// Components
import Loader from "@/components/loader";
import CropGrid from "@/components/grids/crop";

const Districts = () => {
  const [crops, setCrops] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadReference = useRef(true);

  const fetchCrops = async () => {
    try {
      setIsLoading(true);

      const q = query(collection(db, "crops"), where("taluk", "==", null));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error(`Found 0 records where the district is not present`);

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
    await fetchCrops();
  };

  useEffect(() => {
    if (loadReference.current) {
      loadReference.current = false;

      fetchCrops();
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
      <CropGrid data={crops} refetch={refetch} />

      {/* Loader */}
      <Loader open={isLoading} />
    </Box>
  );
};

export default Districts;
