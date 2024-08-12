"use client";

import { useState } from "react";

import { makeStyles } from "tss-react/mui";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

// Components
import TabPanel from "@/components/tabPanel";

// Tabs
import CropsTab from "@/components/tabs/home/crops.js";
import TaluksTab from "@/components/tabs/home/taluks.js";

const Home = () => {
  const { classes } = useStyles();

  const [currentTab, setCurrentTab] = useState(0);

  const handleChange = (_, value) => setCurrentTab(value);
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={currentTab}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Farms" id={`tab-${0}`} className={classes.tab} />
          <Tab label="Manage Taluks" id={`tab-${1}`} className={classes.tab} />
        </Tabs>
      </Box>

      <TabPanel value={currentTab} index={0} className={classes.panel}>
        <CropsTab />
      </TabPanel>

      <TabPanel value={currentTab} index={1} className={classes.panel}>
        <TaluksTab />
      </TabPanel>
    </Box>
  );
};

// 🎨 Styles
const useStyles = makeStyles({
  name: { Home },
})((theme) => ({
  tab: {
    minWidth: "50%",
  },
  panel: {
    "& .MuiBox-root": {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
}));

export default Home;
