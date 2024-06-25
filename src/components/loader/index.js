"use client";

import { Backdrop, CircularProgress } from "@mui/material";

const Loader = ({ open, handleClose }) => {
  return (
    <Backdrop
      sx={{
        zIndex: (theme) => theme.zIndex.drawer - 1,
        color: (theme) => theme.palette.primary.light,
      }}
      open={open}
      onClick={handleClose}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loader;
