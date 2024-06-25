"use client";

import { useCallback, useState } from "react";

import { Box, Paper, Typography, IconButton } from "@mui/material";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const DocPicker = ({ onFileUpload }) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      setDragOver(false);
      if (event.dataTransfer.files && event.dataTransfer.files[0]) {
        onFileUpload(event.dataTransfer.files[0]);
      }
    },
    [onFileUpload]
  );

  const handleChange = useCallback(
    (event) => {
      if (event.target.files && event.target.files[0]) {
        onFileUpload(event.target.files[0]);
      }
    },
    [onFileUpload]
  );

  return (
    <Paper
      variant="outlined"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      sx={(theme) => ({
        px: 4,
        py: 8,
        borderRadius: 5,
        cursor: "pointer",
        textAlign: "center",
        background: theme.palette.primary.white,
      })}
    >
      <input
        accept="image/*"
        style={{ display: "none" }}
        id="raised-button-file"
        multiple
        type="file"
        onChange={handleChange}
      />

      <label htmlFor="raised-button-file">
        <Box display="flex" flexDirection="column" alignItems="center">
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
          >
            <CloudUploadIcon style={{ fontSize: 30 }} />
          </IconButton>
          <Typography>
            <Typography fontWeight="500" fontSize={14}>
              <Typography
                sx={(theme) => ({
                  textDecoration: "underline",
                  color: theme.palette.primary.main,
                })}
              >
                Click to upload
              </Typography>{" "}
              or drag and drop
            </Typography>
            SVG, PNG, JPG or GIF (max 3MB)
          </Typography>
        </Box>
      </label>
    </Paper>
  );
};

export default DocPicker;
