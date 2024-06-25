"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

const FormHeader = ({ children, sx = {}, icon, iconProps, ...props }) => {
  const styles = {
    my: 2,
    pb: 1.5,
    borderBottom: (theme) => `0.5px solid ${theme.palette.divider}`,
    ...sx,
  };

  return (
    <Box sx={styles} {...props}>
      <Typography variant="h2" fontWeight="500" fontSize={20}>
        {children}
      </Typography>

      <IconButton {...iconProps}>{icon}</IconButton>
    </Box>
  );
};

export default FormHeader;
