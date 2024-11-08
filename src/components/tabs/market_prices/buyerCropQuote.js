"use client";

import { useRef, useState, useEffect } from "react";

import { toast } from "react-toastify";

import { Button } from "@mui/material";

// Firebase
import { db } from "@/firebase";
import { doc, collection, query, getDoc, getDocs } from "firebase/firestore";

// Components
import Modal from "@/components/modal";
import Loader from "@/components/loader";
import Header from "@/components/header";
import BuyerCropQuoteGrid from "@/components/grids/buyerCropQuote";

// Forms
import CreateBuyerCropQuoteForm from "@/components/forms/buyerCropQuote/create";

// Icons
import AddIcon from "@mui/icons-material/Add";

const BuyerCropQuote = () => {
  const [quotes, setQuotes] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const loadReference = useRef(true);

  const [modal, setModal] = useState({
    create: false,
  });

  // function to open a modal
  const openModal = (state) => setModal((prev) => ({ ...prev, [state]: true }));

  // function to close a modal
  const closeModal = (state) =>
    setModal((prev) => ({ ...prev, [state]: false }));

  const refetch = async () => {
    try {
      setIsLoading(true);

      const q = query(collection(db, "buyer-crop-quotes"));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error(`Found 0 records.`);

        setQuotes([]);
      } else {
        const results = [];

        for (const document of querySnapshot.docs) {
          const { buyerId, ...rest } = document.data();

          const userSnapshot = await getDoc(doc(db, "users", buyerId));

          if (userSnapshot.exists()) {
            results.push({
              id: document.id,
              buyer: userSnapshot.data(),
              ...rest,
            });
          } else {
            results.push({ id: document.id, ...rest });
          }
        }

        toast.success(`Found ${results.length} records.`);

        setQuotes(results);
      }
    } catch (error) {
      toast.error("failed to fetch data.");

      console.error("error fetching data : ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (loadReference.current) {
      loadReference.current = false;

      refetch();
    }
  }, []);
  return (
    <>
      {/* Header */}
      <Header
        onClick={refetch}
        button={"REFRESH"}
        left={
          <Button
            size="large"
            variant="contained"
            endIcon={<AddIcon />}
            onClick={() => openModal("create")}
            sx={(theme) => ({ color: theme.palette.primary.white })}
          >
            Make New Entry
          </Button>
        }
        iconStyles={(theme) => ({ color: theme.palette.primary.white })}
      />

      {/* Grid */}
      <BuyerCropQuoteGrid data={quotes} refetch={refetch} />

      {/* Create Buyer Crop Quote Modal */}
      <Modal
        open={modal.create}
        header={"New Buyer Quote Form"}
        modalStyles={{ padding: "1rem" }}
        handleClose={() => closeModal("create")}
      >
        <CreateBuyerCropQuoteForm
          refetch={refetch}
          handleModalClose={() => closeModal("create")}
        />
      </Modal>

      {/* Loader */}
      <Loader open={isLoading} />
    </>
  );
};

export default BuyerCropQuote;
