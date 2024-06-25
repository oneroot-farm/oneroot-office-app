"use client";

import Box from "@mui/material/Box";

const FormFooter = ({ children }) => {
  return (
    <Box my={2} display="flex" alignItems="center" justifyContent="center">
      {children}
    </Box>
  );
};

export default FormFooter;
