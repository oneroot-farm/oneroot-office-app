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
  getGridDateOperators,
} from "@mui/x-data-grid";

import { Box, Chip, IconButton, CircularProgress } from "@mui/material";

// Components
import Modal from "@/components/modal";
import NoRows from "@/components/noRows";
import MUICustomDateFilter from "@/components/muiCustomDateFilter";

// Forms
import UpdateReservationForm from "@/components/forms/reservation/update";

// Utils
import { compareDate, convertFromTimestampToDate } from "@/utils";

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

const ReservationStatusChip = ({ status }) => {
  return (
    <Box width="100%" display="flex" alignItems="center">
      <Chip
        label={status.toUpperCase()}
        sx={(theme) => ({
          p: 1,
          borderRadius: 2,
          fontWeight: "500",
          letterSpacing: 0.3,
          backgroundColor:
            theme.palette.primary[
              `reservation-${status.toLowerCase().replace(/\s+/g, "-")}`
            ],
          color: theme.palette.primary.grey4,
          opacity: 0.75,
        })}
      />
    </Box>
  );
};

const Reservation = ({ data, isLoading = false, refetch }) => {
  const { classes } = useStyles();

  const [reservation, setReservation] = useState(null);
  const [modal, setModal] = useState({
    update: false,
  });

  // function to open a modal
  const openModal = (state) => setModal((prev) => ({ ...prev, [state]: true }));

  // function to close a modal
  const closeModal = (state) =>
    setModal((prev) => ({ ...prev, [state]: false }));

  const handleUpdateReservation = (row) => {
    setReservation(row);

    openModal("update");
  };

  const DateOperators = getGridDateOperators().map((operator) => ({
    ...operator,
    InputComponent: MUICustomDateFilter,
    getApplyFilterFn: (item) => {
      return (params) => {
        if (!item.field || !item.value) {
          return true;
        }

        const d1 = convertFromTimestampToDate(
          params.value.seconds,
          params.value.nanoseconds
        );
        const d2 = item.value;

        return compareDate(d1, d2);
      };
    },
  }));

  const columns = useMemo(() => {
    return [
      {
        field: "reservationId",
        headerName: "Reservation ID",
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
        valueGetter: ({ row }) => row.crop?.farmerName || "N/A",
      },
      {
        field: "language",
        headerName: "Farmer Language",
        flex: 1,
        minWidth: 120,
        valueGetter: ({ row }) => row.crop?.language || "N/A",
      },
      {
        field: "crop4",
        headerName: "Farmer Mobile Number",
        flex: 1,
        minWidth: 120,
        valueGetter: ({ row }) => row.crop?.mobileNumber || "N/A",
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
        valueGetter: ({ row }) => row.user?.name || "N/A",
      },
      {
        field: "buyerMobileNumber",
        headerName: "Buyer Mobile Number",
        flex: 1,
        minWidth: 120,
        valueGetter: ({ row }) => row.user?.mobileNumber || "N/A",
      },
      {
        field: "price",
        headerName: "Price",
        flex: 1,
        minWidth: 120,
        valueFormatter: ({ value }) => `${value} Rs.`,
      },
      {
        field: "reservationDate",
        headerName: "Reservation Date",
        flex: 1,
        minWidth: 120,
        /* filterOperators: DateOperators, */
        valueFormatter: ({ value }) =>
          convertFromTimestampToDate(value.seconds, value.nanoseconds),
      },
      {
        field: "status",
        headerName: "Reservation Status",
        flex: 1,
        minWidth: 180,
        renderCell: ({ row }) => <ReservationStatusChip status={row.status} />,
      },
      {
        field: "actions",
        headerName: "",
        flex: 1,
        minWidth: 120,
        renderCell: ({ row }) => (
          <IconButton onClick={() => handleUpdateReservation(row)}>
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
                isTenderCoconutFarm: false,
                isDryCoconutFarm: false,
                generalHarvestCycleInDays: false,
                chutePercentage: false,
                paymentTerms: false,
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

      {/* Update Reservation Modal */}
      <Modal
        open={modal.update}
        header={"Update Reservation Form"}
        modalStyles={{ padding: "1rem" }}
        handleClose={() => closeModal("update")}
      >
        <UpdateReservationForm
          refetch={refetch}
          fields={reservation}
          handleModalClose={() => closeModal("update")}
        />
      </Modal>
    </>
  );
};

// 🎨 Styles
const useStyles = makeStyles({ name: { Reservation } })((theme) => ({
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

export default Reservation;
