"use client";

import { useState, useCallback } from "react";

import { makeStyles } from "tss-react/mui";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

// Icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const DocPicker = ({ sx, files, handleFileUpload }) => {
  const { classes } = useStyles();

  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(false);

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
      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        handleFileUpload(event.dataTransfer.files);
      }
    },
    [handleFileUpload]
  );

  const handleChange = useCallback(
    (event) => {
      if (event.target.files && event.target.files.length > 0) {
        handleFileUpload(event.target.files);
      }
    },
    [handleFileUpload]
  );

  const handlePreview = () => setPreview((prev) => !prev);

  return (
    <Paper
      variant="outlined"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      sx={{
        px: 4,
        py: 8,
        ...sx,
      }}
      className={classes.paper}
    >
      <input
        accept="image/*"
        style={{ display: "none" }}
        id="raised-button-file"
        multiple
        type="file"
        onChange={handleChange}
      />

      {!preview ? (
        <label htmlFor="raised-button-file">
          <Box display="flex" flexDirection="column" alignItems="center">
            <IconButton
              color="primary"
              component="span"
              aria-label="upload picture"
            >
              <CloudUploadIcon className={classes.cloudIcon} />
            </IconButton>

            <Typography>
              <Typography fontWeight="500" fontSize={14}>
                <Typography className={classes.uploadText}>
                  Click to upload
                </Typography>{" "}
                or drag and drop
              </Typography>
              SVG, PNG, JPG or GIF (max 3MB)
            </Typography>
          </Box>
        </label>
      ) : (
        <Box className={classes.previewContainer}>
          {files &&
            Array.from(files).map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt={`preview-${index}`}
                className={classes.preview}
              />
            ))}
        </Box>
      )}

      <IconButton
        onClick={handlePreview}
        disabled={!files || files.length === 0}
        className={classes.visibilityIconButton}
      >
        {!preview ? (
          <VisibilityIcon className={classes.visibilityIcon} />
        ) : (
          <VisibilityOffIcon className={classes.visibilityIcon} />
        )}

        <Typography className={classes.fileCount}>{files.length}</Typography>
      </IconButton>
    </Paper>
  );
};

// 🎨 Styles
const useStyles = makeStyles({ name: { DocPicker } })((theme) => ({
  paper: {
    position: "relative",
    borderRadius: 5,
    cursor: "pointer",
    textAlign: "center",
    background: theme.palette.primary.white,
  },
  cloudIcon: {
    fontSize: 30,
  },
  uploadText: {
    textDecoration: "underline",
    color: theme.palette.primary.main,
  },
  fileCount: {
    fontSize: 16,
    marginLeft: 3,
    fontWeight: "500",
  },
  visibilityIconButton: {
    position: "absolute",
    bottom: 10,
    right: 20,
  },
  visibilityIcon: {
    fontSize: 25,
    color: theme.palette.primary.main,
  },
  previewContainer: {
    gap: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
  },
  preview: {
    maxWidth: "100%",
    maxHeight: 145,
    borderRadius: 2.5,
  },
}));

export default DocPicker;
