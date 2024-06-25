"use client";

import Image from "next/image";

import { Fragment, useEffect, useState } from "react";

import { usePathname, useRouter } from "next/navigation";

import { styled, useTheme } from "@mui/material/styles";

import {
  Box,
  Drawer as MuiDrawer,
  AppBar as MuiAppBar,
  Toolbar,
  Avatar,
  List,
  Tooltip,
  CssBaseline,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/redux/slice/user";

// Utils
import { capitalizeString } from "@/utils";

// Constants
import { LOWER_MENU } from "@/constants";

// Define constants.
const drawerWidth = 240;

// Define style mixins for drawer open/close animations.
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

// Styled components for the AppBar, Drawer, and DrawerHeader.
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const MenuList = ({ items, open, onClick, listProps }) => (
  <List {...listProps}>
    {items.map((item) => (
      <ListItem key={item.name} disablePadding sx={{ display: "block" }}>
        <Tooltip
          placement="right"
          leaveDelay={100}
          enterDelay={100}
          title={!open ? item.name : ""}
          componentsProps={{
            tooltip: {
              sx: (theme) => ({
                px: 1.5,
                py: 0.8,
                letterSpacing: 1,
                fontSize: "0.8rem",
                backgroundColor: theme.palette.primary.black,
              }),
            },
          }}
        >
          <ListItemButton
            onClick={() => onClick(item.name)}
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              {item.icon}
            </ListItemIcon>

            <ListItemText primary={item.name} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </Tooltip>
      </ListItem>
    ))}
  </List>
);

// SideBar component definition.
const DesktopSideBar = ({ children, menu }) => {
  const theme = useTheme();

  const [active, setActive] = useState("Dashboard");
  const [open, setOpen] = useState(false);

  const user = useSelector((state) => state.user.data ?? {});

  // Pathname
  const pathName = usePathname();

  // Router
  const router = useRouter();

  const dispatch = useDispatch();

  // Handles opening and closing of the drawer.
  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  // Update active state when route changes
  useEffect(() => {
    const currentRoute = pathName.split("/")[1]; // Extract the route name from the path

    const route = currentRoute === "" ? "Dashboard" : currentRoute;

    if (route) {
      setActive(capitalizeString(route.replace(/_/g, " ")));
    }
  }, [pathName]);

  // Not rendering sidebar for login page 🚨
  if (pathName === "login" || pathName?.includes("login"))
    return <Fragment>{children}</Fragment>;

  // List Item click handler
  const listItemClickHandler = (text) => {
    const path =
      text === "Dashboard" ? "/" : text.toLowerCase().replace(/ /g, "_");

    router.push(`/${path}`);
  };

  const filterMenu = (items) => {
    if (user?.role === "CC_MANAGER") {
      return items.filter(
        (item) => item.name !== "Users" && item.name !== "Outward"
      );
    }

    return items;
  };

  const logoutClickHandler = () => {
    dispatch(logoutUser());

    router.replace("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar
        open={open}
        position="fixed"
        sx={(theme) => ({ backgroundColor: theme.palette.primary.white })}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            sx={{ marginRight: 5, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>

          <Typography fontWeight={"600"} variant="h4" noWrap component="div">
            {active}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        open={open}
        variant="permanent"
        className="shadow-md"
        sx={{ "& .MuiDrawer-paper": { border: "none" } }}
      >
        <DrawerHeader>
          <div className="w-full h-full relative">
            <Image
              alt="logo"
              layout="fill"
              objectFit="contain"
              src="/assets/logo.png"
              unoptimized
            />
          </div>

          <IconButton onClick={handleDrawerToggle}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>

        {open && (
          <div className="flex flex-col gap-4 justify-center items-center mt-2">
            <Avatar
              alt="Rohit"
              sx={{ width: 100, height: 100 }}
              src="/assets/card-fallback.png"
            />

            <Typography
              fontWeight={"600"}
              variant="h4"
              noWrap
              component="div"
              textAlign={"center"}
            >
              {user?.name}
              <Typography
                noWrap
                variant="h6"
                component="div"
                fontWeight={"500"}
              >
                {user?.role} - {user?.id}
              </Typography>
            </Typography>
          </div>
        )}

        <MenuList
          open={open}
          items={filterMenu(menu.TOP_MENU)}
          onClick={listItemClickHandler}
        />

        {/* <Divider /> */}

        {/* <MenuList
          open={open}
          items={filterMenu(menu.MIDDLE_MENU)}
          onClick={listItemClickHandler}
        /> */}

        {/* <Divider /> */}

        {/* <MenuList
          open={open}
          items={filterMenu(menu.BOTTOM_MENU)}
          onClick={listItemClickHandler}
        /> */}

        {/* <MenuList
          open={open}
          items={LOWER_MENU}
          listProps={{ sx: { mt: "auto" } }}
          onClick={logoutClickHandler}
        /> */}
      </Drawer>

      <Box
        component="main"
        sx={{
          p: 3,
          flexGrow: 1,

          /* 
          marginRight: `${open ? drawerWidth : theme.spacing(7)}px`,
          
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),

          width: `calc(100% - ${open ? drawerWidth : theme.spacing(7)}px)`,
         */
        }}
      >
        <DrawerHeader />

        {children}
      </Box>
    </Box>
  );
};

export default DesktopSideBar;
