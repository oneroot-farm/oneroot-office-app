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
import UpdateFarmForm from "@/components/forms/farm/update";
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

const Crop = ({
  data,
  refetch,
  isLoading = false,
  crop: cropName = "Tender Coconut",
}) => {
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
    // start
    let base = [
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
        field: "village",
        headerName: "Village",
        flex: 1,
        minWidth: 120,
      },
      {
        field: "taluk",
        headerName: "Taluk",
        flex: 1,
        minWidth: 120,
      },
      {
        field: "paymentTerms",
        headerName: "Payment Terms",
        flex: 1,
        minWidth: 120,
      },
    ];

    // dynamic mid
    switch (cropName) {
      case "Tender Coconut":
        base = [
          ...base,
          {
            field: "variety",
            headerName: "Variety",
            flex: 1,
            minWidth: 120,
            valueFormatter: ({ value }) => value || "N/A",
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
        ];
        break;

      case "Banana":
        base = [
          ...base,
          {
            field: "bananaVariety",
            headerName: "Variety",
            flex: 1,
            minWidth: 120,
            valueFormatter: ({ value }) => value || "N/A",
          },
          {
            field: "tarShape",
            headerName: "Tar Shape",
            flex: 1,
            minWidth: 120,
            valueFormatter: ({ value }) => value || "N/A",
          },
          {
            field: "tarWeight",
            headerName: "Tar Weight",
            flex: 1,
            minWidth: 120,
            valueFormatter: ({ value }) => (value ? `${value} quintal` : "N/A"),
          },
          {
            field: "numberOfBananaTrees",
            headerName: "Number Of Banana Trees",
            flex: 1,
            minWidth: 120,
            valueFormatter: ({ value }) => value || "N/A",
          },
          {
            field: "numberOfBananaTreesRTH",
            headerName: "Number Of Banana Trees RTH",
            flex: 1,
            minWidth: 120,
            valueFormatter: ({ value }) => value || "N/A",
          },
          {
            field: "bananaGeneralHarvestCycleInDays",
            headerName: "Banana Harvest Cycle In Days",
            flex: 1,
            minWidth: 120,
            valueFormatter: ({ value }) => value || "N/A",
          },
          {
            field: "cutCount",
            headerName: "Cut Count",
            flex: 1,
            minWidth: 120,
            valueFormatter: ({ value }) => value || "N/A",
          },
          {
            field: "cutType",
            headerName: "Cut Type",
            flex: 1,
            minWidth: 120,
            valueFormatter: ({ value }) => value || "N/A",
          },
          {
            field: "bananaReadyToHarvestDate",
            headerName: "Banana Ready To Harvest Date",
            flex: 1,
            minWidth: 120,
            valueFormatter: ({ value }) => value || "N/A",
          },
        ];
        break;

      case "Turmeric":
        base = [
          ...base,
          {
            field: "region",
            headerName: "Region",
            flex: 1,
            minWidth: 120,
            valueFormatter: ({ value }) => value || "N/A",
          },
          {
            field: "turmericVariety",
            headerName: "Variety",
            flex: 1,
            minWidth: 120,
            valueFormatter: ({ value }) => value || "N/A",
          },
          {
            field: "isTurmericOrganic",
            headerName: "Is Turmeric Organic",
            flex: 1,
            minWidth: 120,
            renderCell: ({ value }) => (value ? "Yes" : "No"),
          },
          {
            field: "turmericGeneralHarvestCycleInDays",
            headerName: "Turmeric Harvest Cycle In Days",
            flex: 1,
            minWidth: 120,
          },
          {
            field: "isPolished",
            headerName: "Is Polished",
            flex: 1,
            minWidth: 120,
            renderCell: ({ value }) => (value ? "Yes" : "No"),
          },
          {
            field: "isUnpolished",
            headerName: "Is Unpolished",
            flex: 1,
            minWidth: 120,
            renderCell: ({ value }) => (value ? "Yes" : "No"),
          },
          {
            field: "isSinglePolished",
            headerName: "Is Single Polished",
            flex: 1,
            minWidth: 120,
            renderCell: ({ value }) => (value ? "Yes" : "No"),
          },
          {
            field: "isDoublePolished",
            headerName: "Is Double Polished",
            flex: 1,
            minWidth: 120,
            renderCell: ({ value }) => (value ? "Yes" : "No"),
          },
          {
            field: "turmericReadyToHarvestDate",
            headerName: "Turmeric Ready To Harvest Date",
            flex: 1,
            minWidth: 120,
            valueFormatter: ({ value }) => value || "N/A",
          },
          {
            field: "totalTurmericQuantity",
            headerName: "Total Turmeric Quantity",
            flex: 1,
            minWidth: 120,
            valueFormatter: ({ value }) => (value ? `${value} quintal` : "N/A"),
          },
          {
            field: "fingerQuantity",
            headerName: "Finger Quantity",
            flex: 1,
            minWidth: 120,
            valueFormatter: ({ value }) => (value ? `${value} quintal` : "N/A"),
          },
          {
            field: "bulbQuantity",
            headerName: "Bulb Quantity",
            flex: 1,
            minWidth: 120,
            valueFormatter: ({ value }) => (value ? `${value} quintal` : "N/A"),
          },
          {
            field: "isIPM",
            headerName: "Is IPM",
            flex: 1,
            minWidth: 120,
            renderCell: ({ value }) => (value ? "Yes" : "No"),
          },
        ];
        break;

      case "Dry Coconut":
        base = [
          ...base,
          {
            field: "isDryCoconutHarvested",
            headerName: "Is Dry Coconut Harvested",
            flex: 1,
            minWidth: 120,
            renderCell: ({ value }) => (value ? "Yes" : "No"),
          },
          {
            field: "isOnTree",
            headerName: "Is Dry Coconut On Tree",
            flex: 1,
            minWidth: 120,
            renderCell: ({ value }) => (value ? "Yes" : "No"),
          },
          {
            field: "numberOfDryCoconutsAvailable",
            headerName: "Number Of Dry Coconuts Available",
            flex: 1,
            minWidth: 120,
            valueFormatter: ({ value }) => value || "N/A",
          },
          {
            field: "isWithHusk",
            headerName: "Is With Husk",
            flex: 1,
            minWidth: 120,
            renderCell: ({ value }) => (value ? "Yes" : "No"),
          },
          {
            field: "isWithSemiHusk",
            headerName: "Is With Semi Husk",
            flex: 1,
            minWidth: 120,
            renderCell: ({ value }) => (value ? "Yes" : "No"),
          },
          {
            field: "dryCoconutGeneralHarvestCycleInDays",
            headerName: "Dry Coconut Harvest Cycle In Days",
            flex: 1,
            minWidth: 120,
          },
          {
            field: "dryCoconutReadyToHarvestDate",
            headerName: "Dry Coconut Ready To Harvest Date",
            flex: 1,
            minWidth: 120,
            valueFormatter: ({ value }) => value || "N/A",
          },
        ];
        break;
    }

    // end
    base = [
      ...base,
      {
        field: "tags",
        headerName: "Tags",
        flex: 1,
        minWidth: 120,
        renderCell: ({ value }) => {
          if (Array.isArray(value) && value.length > 0) {
            return (
              <Box className={classes.tags}>
                {value.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    variant="outlined"
                    color="warning"
                  />
                ))}
              </Box>
            );
          }

          return "N/A";
        },
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

    return base;
  }, [cropName]);

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
                village: false,
                language: false,
                paymentTerms: false,

                // tender coconut
                actualReadyToHarvestDate: false,
                firstLastHarvestDate: false,
                secondLastHarvestDate: false,
                thirdLastHarvestDate: false,
                cropsAvailable: false,
                ageOfTree: false,
                heightOfTree: false,
                isTenderCoconutFarm: false,
                isDryCoconutFarm: false,
                generalHarvestCycleInDays: false,
                chutePercentage: false,

                // banana
                tarWeight: false,
                cutType: false,
                numberOfBananaTrees: false,
                bananaGeneralHarvestCycleInDays: false,
                bananaGeneralHarvestCycleInDays: false,

                // turmeric
                isTurmericOrganic: false,
                turmericGeneralHarvestCycleInDays: false,
                isPolished: false,
                isUnpolished: false,
                isSinglePolished: false,
                isDoublePolished: false,
                fingerQuantity: false,
                bulbQuantity: false,

                // dry coconut
                isWithSemiHusk: false,
                isWithHusk: false,
                dryCoconutGeneralHarvestCycleInDays: false,
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

        {/* <UpdateFarmForm
          fields={crop}
          refetch={refetch}
          handleModalClose={() => closeModal("update")}
        /> */}
      </Modal>

      {/* Create QC Request Confirmation */}
      <Modal
        open={confirm.qc}
        header={"Create New QC Request"}
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
  tags: {
    gap: 5,
    padding: 5,
    display: "flex",
    overflowY: "auto",
  },
}));

export default Crop;
