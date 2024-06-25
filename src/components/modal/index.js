"use client";

import { makeStyles } from "tss-react/mui";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { default as MuiModal } from "@mui/material/Modal";

// Icons
import CloseIcon from "@mui/icons-material/Close";

const Modal = ({ header, children, open, handleClose, modalStyles }) => {
  const { classes, cx } = useStyles();
  return (
    <MuiModal
      open={open}
      onClose={handleClose}
      sx={{ p: 2, ...modalStyles, overflowY: "auto" }}
    >
      <Container className={cx(classes.wrapper)} disableGutters>
        <Box className={cx(classes.header)} sx={{ p: 2 }}>
          <Typography
            varient="h2"
            fontSize={20}
            fontWeight="500"
            className={cx(classes.modalTitle)}
          >
            {header}
          </Typography>

          <IconButton
            size={"small"}
            onClick={handleClose}
            className={cx(classes.iconButton)}
          >
            <CloseIcon
              sx={(theme) => ({ color: theme.palette.primary.white })}
            />
          </IconButton>
        </Box>

        <Box sx={{ p: 2 }}>{children}</Box>
      </Container>
    </MuiModal>
  );
};

// Styles 💅
const useStyles = makeStyles({
  name: { Modal },
})((theme) => ({
  wrapper: {
    maxWidth: 900,
    borderRadius: 5,
    backgroundColor: theme.palette.primary.white,
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.palette.primary.grey7,

    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },

  modalTitle: {
    color: theme.palette.primary.black,
  },

  iconButton: {
    backgroundColor: theme.palette.primary.light,

    "&:hover, &.Mui-focusVisible": {
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

export default Modal;
