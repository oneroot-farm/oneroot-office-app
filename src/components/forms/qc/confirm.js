"use client";

import { useState } from "react";

import { toast } from "react-toastify";
import { makeStyles } from "tss-react/mui";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";

// Firebase
import { db } from "@/firebase";
import {
  doc,
  addDoc,
  updateDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

// Components
import Loader from "@/components/loader";
import FormHeader from "@/components/forms/components/formHeader";
import FormFooter from "@/components/forms/components/formFooter";

const Confirm = ({ fields, refetch, handleModalClose }) => {
  const [loading, setLoading] = useState(false);

  const { cx, classes } = useStyles();

  const handleCreateQCRequest = async () => {
    try {
      setLoading(true);

      const payload = {
        cropId: fields.id,
        status: "pending",
        userId: null,
        tags: ["need-location", "office"],
        createdAt: serverTimestamp(),
      };

      const reference = await addDoc(collection(db, "qc_requests"), payload);

      const id = reference.id;

      await updateDoc(doc(db, "qc_requests", id), { id });

      toast.success("Request created successfully!");

      refetch();

      handleModalClose();
    } catch (error) {
      console.log(error);

      toast.error("error creating request : ", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container disableGutters className={cx(classes.container)}>
      <FormHeader sx={{ mt: 4 }}>
        Are you sure you want to create a new QC request for {fields?.farmName}{" "}
        ?
      </FormHeader>

      <FormFooter sx={{ gap: 2 }}>
        <Button
          size="large"
          type="button"
          variant="outlined"
          onClick={handleModalClose}
          sx={(theme) => ({ color: theme.palette.primary })}
        >
          Cancel
        </Button>

        <Button
          size="large"
          variant="contained"
          onClick={handleCreateQCRequest}
          sx={(theme) => ({ color: theme.palette.primary.white })}
        >
          Confirm
        </Button>
      </FormFooter>

      {/* Loader */}
      <Loader open={loading} />
    </Container>
  );
};

// Styles 💅
const useStyles = makeStyles({
  name: { Confirm },
})((theme) => ({
  container: {},

  inputWrapper: {
    gap: 12,
    display: "flex",

    [theme.breakpoints.down("sm")]: {
      gap: 0,
      flexWrap: "wrap",
    },
  },
}));

export default Confirm;
