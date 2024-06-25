"use client";

import { makeStyles } from "tss-react/mui";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

// Icons
import AddIcon from "@mui/icons-material/Add";
import CreateIcon from "@mui/icons-material/Create";
import RefreshIcon from "@mui/icons-material/Refresh";

const Header = ({
  left,
  button,
  onClick,
  icon,
  iconSize,
  iconStyles,
  buttonProps,
}) => {
  const { classes, cx } = useStyles();

  return (
    <Box
      mb={2}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      {/* Left */}
      {left && left}

      {/* Right */}
      {icon ? (
        <IconButton size={iconSize} onClick={onClick}>
          {icon}
        </IconButton>
      ) : (
        <IconButton
          {...buttonProps}
          onClick={onClick}
          className={cx(classes.iconButton)}
        >
          {button === "CREATE" && <AddIcon sx={iconStyles} />}

          {button === "UPDATE" && <CreateIcon sx={iconStyles} />}

          {button === "REFRESH" && <RefreshIcon sx={iconStyles} />}
        </IconButton>
      )}
    </Box>
  );
};

// Styles 💅
const useStyles = makeStyles({
  name: { Header },
})((theme) => ({
  iconButton: {
    backgroundColor: theme.palette.primary.light,

    "&:hover, &.Mui-focusVisible": {
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

export default Header;
