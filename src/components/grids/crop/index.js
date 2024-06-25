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

import { Box, IconButton, CircularProgress } from "@mui/material";

// Components
import Modal from "@/components/modal";
import NoRows from "@/components/noRows";

// Forms
import UpdateCropForm from "@/components/forms/crop/update";

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

const Crop = ({ data, isLoading = false, refetch }) => {
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
    setCrop(row);

    openModal("update");
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
        field: "actions",
        headerName: "",
        flex: 1,
        minWidth: 120,
        renderCell: ({ row }) => (
          <IconButton onClick={() => handleUpdateCrop(row)}>
            <EditIcon />
          </IconButton>
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
