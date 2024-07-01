"use client";

import { useMemo, useState } from "react";

import { makeStyles } from "tss-react/mui";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarColumnsButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";

import { Box, Chip, IconButton, CircularProgress } from "@mui/material";

// Components
import Modal from "@/components/modal";
import NoRows from "@/components/noRows";

// Forms
import UpdateCropForm from "@/components/forms/crop/update";
import ConfirmQCRequest from "@/components/forms/qc/confirm";

// Utils
import { openGoogleMapUrl } from "@/utils";

// Icons
import EditIcon from "@mui/icons-material/Edit";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

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

const Crop = ({ data, isLoading = false, refetch }) => {
  const { classes } = useStyles();

  const [crop, setCrop] = useState(null);

  const [modal, setModal] = useState({
    update: false,
  });
  const [confirm, setConfirm] = useState({
    qc: false,
  });

  // function to open a modal
  const openModal = (state) => setModal((prev) => ({ ...prev, [state]: true }));

  // function to close a modal
  const closeModal = (state) =>
    setModal((prev) => ({ ...prev, [state]: false }));

  // function to show a confirmation
  const showConfirmation = (state) =>
    setConfirm((prev) => ({ ...prev, [state]: true }));

  // function to dismiss a confirmation
  const dismissConfirmation = (state) =>
    setConfirm((prev) => ({ ...prev, [state]: false }));

  const handleUpdateCrop = (row) => {
    setCrop(row);

    openModal("update");
  };

  const handleCreateQCRequest = (row) => {
    setCrop(row);

    showConfirmation("qc");
  };

  const columns = useMemo(() => {
    return [
      {
        field: "farmName",
        headerName: "Farm ID",
        flex: 1,
        minWidth: 120,
      },
      {
        field: "farmerName",
        headerName: "Farmer Name",
        flex: 1,
        minWidth: 120,
      },
      {
        field: "language",
        headerName: "Language",
        flex: 1,
        minWidth: 120,
      },
      {
        field: "mobileNumber",
        headerName: "Mobile Number",
        flex: 1,
        minWidth: 120,
      },
      {
        field: "variety",
        headerName: "Variety",
        flex: 1,
        minWidth: 120,
      },
      {
        field: "numberOfTrees",
        headerName: "Number Of Trees",
        flex: 1,
        minWidth: 120,
      },
      {
        field: "ageOfTree",
        headerName: "Age Of Tree",
        flex: 1,
        minWidth: 120,
        valueFormatter: ({ value }) => `${value} years`,
      },
      {
        field: "heightOfTree",
        headerName: "Height Of Tree",
        flex: 1,
        minWidth: 120,
        valueFormatter: ({ value }) => `${value} ft.`,
      },
      {
        field: "numberOfNuts",
        headerName: "Number Of Nuts",
        flex: 1,
        minWidth: 120,
      },
      {
        field: "nutsFromLastHarvest",
        headerName: "Nuts From Last Harvest",
        flex: 1,
        minWidth: 120,
      },
      {
        field: "readyToHarvestDate",
        headerName: "Next Harvest Date",
        flex: 1,
        minWidth: 120,
      },
      {
        field: "actualReadyToHarvestDate",
        headerName: "Actual Next Harvest Date",
        flex: 1,
        minWidth: 120,
      },
      {
        field: "chutePercentage",
        headerName: "Chute Percentage",
        flex: 1,
        minWidth: 120,
      },
      {
        field: "firstLastHarvestDate",
        headerName: "First Last Harvest Date",
        flex: 1,
        minWidth: 120,
      },
      {
        field: "secondLastHarvestDate",
        headerName: "Second Last Harvest Date",
        flex: 1,
        minWidth: 120,
      },
      {
        field: "thirdLastHarvestDate",
        headerName: "Third Last Harvest Date",
        flex: 1,
        minWidth: 120,
      },
      /*
      {
        field: "village",
        headerName: "Village",
        flex: 1,
        minWidth: 120,
      },
      */
      {
        field: "cropsAvailable",
        headerName: "Crops Available",
        flex: 1,
        minWidth: 120,
        renderCell: ({ value }) => {
          if (Array.isArray(value)) {
            return value.join(", ");
          }

          return value || "N/A";
        },
      },
      {
        field: "isTenderCoconutFarm",
        headerName: "Tender Coconut Farm",
        flex: 1,
        minWidth: 120,
        renderCell: ({ value }) => (value ? "Yes" : "No"),
      },
      {
        field: "isDryCoconutFarm",
        headerName: "Dry Coconut Farm",
        flex: 1,
        minWidth: 120,
        renderCell: ({ value }) => (value ? "Yes" : "No"),
      },
      {
        field: "generalHarvestCycleInDays",
        headerName: "General Harvest Cycle In Days",
        flex: 1,
        minWidth: 120,
      },
      {
        field: "paymentTerms",
        headerName: "Payment Terms",
        flex: 1,
        minWidth: 120,
      },
      {
        field: "tags",
        headerName: "Tags",
        flex: 1,
        minWidth: 120,
        renderCell: ({ value }) => {
          if (Array.isArray(value) && value.length > 0) {
            return (
              <>
                {value.map((tag, index) => (
                  <Chip key={index} label={tag} color="warning" />
                ))}
              </>
            );
          }

          return "N/A";
        },
      },
      {
        field: "actions",
        headerName: "",
        flex: 1,
        minWidth: 120,
        renderCell: ({ row }) => (
          <Box display={"flex"} gap={1.5}>
            <IconButton onClick={() => handleUpdateCrop(row)}>
              <EditIcon />
            </IconButton>

            <IconButton
              onClick={() =>
                openGoogleMapUrl(row.location.latitude, row.location.longitude)
              }
            >
              <LocationOnIcon />
            </IconButton>

            <IconButton onClick={() => handleCreateQCRequest(row)}>
              <AssignmentTurnedInIcon />
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
                language: false,
                actualReadyToHarvestDate: false,
                firstLastHarvestDate: false,
                secondLastHarvestDate: false,
                thirdLastHarvestDate: false,
                cropsAvailable: false,
                /* village: false, */
                ageOfTree: false,
                heightOfTree: false,
                isTenderCoconutFarm: false,
                isDryCoconutFarm: false,
                generalHarvestCycleInDays: false,
                chutePercentage: false,
                paymentTerms: false,
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

      {/* Create QC Request Confirmation */}
      <Modal
        open={confirm.qc}
        header={"Create QC Request"}
        modalStyles={{ padding: "1rem" }}
        handleClose={() => dismissConfirmation("qc")}
      >
        <ConfirmQCRequest
          fields={crop}
          refetch={refetch}
          handleModalClose={() => dismissConfirmation("qc")}
        />
      </Modal>
    </>
  );
};

// 🎨 Styles
const useStyles = makeStyles({ name: { Crop } })((theme) => ({
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

export default Crop;
