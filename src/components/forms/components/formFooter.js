"use client";

import Box from "@mui/material/Box";

const FormFooter = ({ children, ...props }) => {
  return (
    <Box
      my={2}
      display="flex"
      alignItems="center"
      justifyContent="center"
      {...props}
    >
      {children}
    </Box>
  );
};

export default FormFooter;
