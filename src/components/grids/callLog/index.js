"use client";

import { useState, useMemo } from "react";

import { makeStyles } from "tss-react/mui";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarColumnsButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";

import { Box, IconButton, CircularProgress } from "@mui/material";

// Components
import Modal from "@/components/modal";
import NoRows from "@/components/noRows";
import AudioPlayer from "@/components/audioPlayer";

// Forms
import UpdateCropForm from "@/components/forms/crop/update";

// Utils
import { formatDuration } from "@/utils";

// Icons
import EditIcon from "@mui/icons-material/Edit";

const CustomToolbar = () => (
  <GridToolbarContainer>
    <GridToolbarContainer
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
      </Box>

      <Box>
        <GridToolbarQuickFilter />
      </Box>
    </GridToolbarContainer>
  </GridToolbarContainer>
);

const CallLog = ({ data, isLoading = false, refetch }) => {
  const { classes } = useStyles();

  const [crop, setCrop] = useState(null);

  const [modal, setModal] = useState({
    update: false,
  });

  // function to open a modal
  const openModal = (state) => setModal((prev) => ({ ...prev, [state]: true }));

  // function to close a modal
  const closeModal = (state) =>
    setModal((prev) => ({ ...prev, [state]: false }));

  const handleUpdateCrop = (row) => {
    setCrop(row.crop);

    openModal("update");
  };

  const columns = useMemo(() => {
    return [
      {
        field: "callId",
        headerName: "Call ID",
        flex: 1,
        minWidth: 120,
      },
      {
        field: "farmName",
        headerName: "Farm ID",
        flex: 1,
        minWidth: 120,
        valueGetter: ({ row }) => row.crop?.farmName || "N/A",
      },
      {
        field: "farmerName",
        headerName: "Farmer Name",
        flex: 1,
        minWidth: 120,
        valueGetter: ({ row }) =>
          row.farmer ? row.farmer.name : row.crop.farmerName || "N/A",
      },
      {
        field: "language",
        headerName: "Farmer Language",
        flex: 1,
        minWidth: 120,
        valueGetter: ({ row }) =>
          row.farmer ? row.farmer.language : row.crop?.language || "N/A",
      },
      {
        field: "farmerMobileNumber",
        headerName: "Farmer Mobile Number",
        flex: 1,
        minWidth: 120,
        valueGetter: ({ row }) =>
          row.farmer
            ? row.farmer?.mobileNumber
            : row.crop?.mobileNumber || "N/A",
      },
      {
        field: "variety",
        headerName: "Variety",
        flex: 1,
        minWidth: 120,
        valueGetter: ({ row }) => row.crop?.variety || "N/A",
      },
      {
        field: "numberOfTrees",
        headerName: "Number Of Trees",
        flex: 1,
        minWidth: 120,
        valueGetter: ({ row }) => row.crop?.numberOfTrees || "N/A",
      },
      {
        field: "ageOfTree",
        headerName: "Age Of Tree",
        flex: 1,
        minWidth: 120,
        valueGetter: ({ row }) => `${row.crop?.ageOfTree} years` || "N/A",
      },
      {
        field: "heightOfTree",
        headerName: "Height Of Tree",
        flex: 1,
        minWidth: 120,
        valueGetter: ({ row }) => `${row.crop?.heightOfTree} ft.` || "N/A",
      },
      {
        field: "numberOfNuts",
        headerName: "Number Of Nuts",
        flex: 1,
        minWidth: 120,
        valueGetter: ({ row }) => row.crop?.numberOfNuts || "N/A",
      },
      {
        field: "nutsFromLastHarvest",
        headerName: "Nuts From Last Harvest",
        flex: 1,
        minWidth: 120,
        valueGetter: ({ row }) => row.crop?.nutsFromLastHarvest || "N/A",
      },
      {
        field: "readyToHarvestDate",
        headerName: "Next Harvest Date",
        flex: 1,
        minWidth: 120,
        valueGetter: ({ row }) => row.crop?.readyToHarvestDate || "N/A",
      },
      {
        field: "actualReadyToHarvestDate",
        headerName: "Actual Next Harvest Date",
        flex: 1,
        minWidth: 120,
        valueGetter: ({ row }) => row.crop?.actualReadyToHarvestDate || "N/A",
      },
      {
        field: "chutePercentage",
        headerName: "Chute Percentage",
        flex: 1,
        minWidth: 120,
        valueGetter: ({ row }) => row.crop?.chutePercentage || "N/A",
      },
      {
        field: "firstLastHarvestDate",
        headerName: "First Last Harvest Date",
        flex: 1,
        minWidth: 120,
        valueGetter: ({ row }) => row.crop?.firstLastHarvestDate || "N/A",
      },
      {
        field: "secondLastHarvestDate",
        headerName: "Second Last Harvest Date",
        flex: 1,
        minWidth: 120,
        valueGetter: ({ row }) => row.crop?.secondLastHarvestDate || "N/A",
      },
      {
        field: "thirdLastHarvestDate",
        headerName: "Third Last Harvest Date",
        flex: 1,
        minWidth: 120,
        valueGetter: ({ row }) => row.crop?.thirdLastHarvestDate || "N/A",
      },
      /*
      {
        field: "village",
        headerName: "Village",
        flex: 1,
        minWidth: 120,
        valueGetter: ({ row }) => row.crop?.village || "N/A",
      },
      */
      {
        field: "cropsAvailable",
        headerName: "Crops Available",
        flex: 1,
        minWidth: 120,
        valueGetter: ({ row }) => {
          const crops = row.crop?.cropsAvailable;

          if (Array.isArray(crops)) {
            return crops.join(", ");
          }

          return crops || "N/A";
        },
      },
      {
        field: "isTenderCoconutFarm",
        headerName: "Tender Coconut Farm",
        flex: 1,
        minWidth: 120,
        valueGetter: ({ row }) =>
          (row.crop?.isTenderCoconutFarm ? "Yes" : "No") || "N/A",
      },
      {
        field: "isDryCoconutFarm",
        headerName: "Dry Coconut Farm",
        flex: 1,
        minWidth: 120,
        valueGetter: ({ row }) =>
          (row.crop?.isDryCoconutFarm ? "Yes" : "No") || "N/A",
      },
      {
        field: "generalHarvestCycleInDays",
        headerName: "General Harvest Cycle In Days",
        flex: 1,
        minWidth: 120,
        valueGetter: ({ row }) => row.crop?.generalHarvestCycleInDays || "N/A",
      },
      {
        field: "paymentTerms",
        headerName: "Payment Terms",
        flex: 1,
        minWidth: 120,
        valueGetter: ({ row }) => row.crop?.paymentTerms || "N/A",
      },
      {
        field: "name",
        headerName: "Buyer Name",
        flex: 1,
        minWidth: 120,
        valueGetter: ({ row }) => row.buyer?.name || "N/A",
      },
      {
        field: "buyerMobileNumber",
        headerName: "Buyer Mobile Number",
        flex: 1,
        minWidth: 120,
        valueGetter: ({ row }) => row.buyer?.mobileNumber || "N/A",
      },
      {
        field: "duration",
        headerName: "Duration",
        flex: 1,
        minWidth: 120,
        valueFormatter: ({ value }) => (value ? formatDuration(value) : "N/A"),
      },
      {
        field: "identity",
        headerName: "Initiated By",
        flex: 1,
        minWidth: 120,
        valueGetter: ({ row }) => {
          if (row.farmer && row.farmer.identity) {
            return row.farmer.identity;
          } else if (row.buyer && row.buyer.identity) {
            return row.buyer.identity;
          } else {
            return "N/A";
          }
        },
      },
      {
        field: "recordingURL",
        headerName: "Call Recording",
        flex: 1,
        minWidth: 250,
        renderCell: ({ value }) =>
          value ? <AudioPlayer url={value} /> : "N/A",
      },
      {
        field: "timestamp",
        headerName: "Call Timestamp",
        flex: 1,
        minWidth: 200,
        valueFormatter: ({ value }) =>
          value ? value.replace(" UTC+05:30", "") : "N/A",
      },
      {
        field: "actions",
        headerName: "",
        flex: 1,
        minWidth: 150,
        renderCell: ({ row }) => (
          <Box display={"flex"} gap={1.25}>
            <IconButton onClick={() => handleUpdateCrop(row)}>
              <EditIcon />
            </IconButton>
          </Box>
        ),
      },
    ];
  }, []);

  return (
    <>
      <Box m="20px 0 0 0" width="100%" height="75vh" className={classes.grid}>
        <DataGrid
          rows={data || []}
          columns={columns}
          loading={isLoading}
          density="comfortable"
          getRowId={(row) => row.id}
          onCellClick={(params, event) => {
            if (params.field === "actions") event.stopPropagation();
          }}
          slots={{
            toolbar: CustomToolbar,
            noRowsOverlay: NoRows,
            loadingOverlay: CircularProgress,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          initialState={{
            columns: {
              columnVisibilityModel: {
                farmerName: false,
                language: false,
                actualReadyToHarvestDate: false,
                firstLastHarvestDate: false,
                secondLastHarvestDate: false,
                thirdLastHarvestDate: false,
                cropsAvailable: false,
                isTenderCoconutFarm: false,
                isDryCoconutFarm: false,
                generalHarvestCycleInDays: false,
                chutePercentage: false,
                paymentTerms: false,
                name: false,
                /* village: false, */
                variety: false,
                numberOfNuts: false,
                nutsFromLastHarvest: false,
                numberOfTrees: false,
                ageOfTree: false,
                heightOfTree: false,
                readyToHarvestDate: false,
              },
            },

            pagination: { paginationModel: { pageSize: 30 } },
          }}
        />
      </Box>

      {/* Update Crop Modal */}
      <Modal
        open={modal.update}
        header={"Update Farm Form"}
        modalStyles={{ padding: "1rem" }}
        handleClose={() => closeModal("update")}
      >
        <UpdateCropForm
          fields={crop}
          refetch={refetch}
          handleModalClose={() => closeModal("update")}
        />
      </Modal>
    </>
  );
};

// 🎨 Styles
const useStyles = makeStyles({ name: { CallLog } })((theme) => ({
  grid: {
    "& .MuiDataGrid-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDataGrid-cell": {
      borderBottom: "none",
    },
    "& .name-column--cell": {
      color: theme.palette.primary.main,
    },
    "& .MuiDataGrid-columnHeaders": {
      borderBottom: "none",
      backgroundColor: theme.palette.primary.transparent,
    },
    "& .MuiDataGrid-virtualScroller": {
      overflowX: "auto",
      backgroundColor: theme.palette.background.paper,
    },
    "& .MuiDataGrid-footerContainer": {
      backgroundColor: theme.palette.primary.transparent,
    },
    "& .MuiCheckbox-root": {
      color: `${theme.palette.secondary.dark} !important`,
    },
  },
}));

export default CallLog;
