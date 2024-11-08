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

// Forms
import UpdateBuyerCropQuoteForm from "@/components/forms/buyerCropQuote/update";

// Utils
import { convertFromTimestampToDate } from "@/utils";

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

const BuyerCropQuote = ({ data, isLoading = false, refetch }) => {
  const { classes } = useStyles();

  const [quote, setQuote] = useState(null);

  const [modal, setModal] = useState({
    update: false,
  });

  // function to open a modal
  const openModal = (state) => setModal((prev) => ({ ...prev, [state]: true }));

  // function to close a modal
  const closeModal = (state) =>
    setModal((prev) => ({ ...prev, [state]: false }));

  const handleUpdateQuote = (row) => {
    setQuote(row);

    openModal("update");
  };

  const columns = useMemo(() => {
    return [
      {
        field: "name",
        headerName: "Buyer Name",
        flex: 1,
        minWidth: 120,
        valueGetter: ({ row }) => row?.buyer?.name || "N/A",
      },
      {
        field: "mobileNumber",
        headerName: "Buyer Mobile Number",
        flex: 1,
        minWidth: 120,
        valueGetter: ({ row }) => row?.buyer?.mobileNumber || "N/A",
      },
      {
        field: "language",
        headerName: "Farmer Language",
        flex: 1,
        minWidth: 120,
        valueGetter: ({ row }) => row?.buyer?.language || "N/A",
      },
      {
        field: "crop",
        headerName: "Crop",
        flex: 1,
        minWidth: 120,
        valueGetter: ({ row }) => row?.crop || "N/A",
      },
      {
        field: "variety",
        headerName: "Variety",
        flex: 1,
        minWidth: 120,
        valueGetter: ({ row }) => row?.variety || "N/A",
      },
      {
        field: "price",
        headerName: "Price",
        flex: 1,
        minWidth: 120,
        valueFormatter: ({ value }) => (value ? `₹ ${value}` : "N/A"),
      },
      {
        field: "createdAt",
        headerName: "Created At",
        flex: 1,
        minWidth: 200,
        valueGetter: ({ row }) =>
          row?.createdAt
            ? convertFromTimestampToDate(row?.createdAt?.seconds, null)
            : "N/A",
      },
      {
        field: "actions",
        headerName: "",
        flex: 1,
        minWidth: 150,
        renderCell: ({ row }) => (
          <Box display={"flex"} gap={1.25}>
            <IconButton onClick={() => handleUpdateQuote(row)}>
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
              columnVisibilityModel: {},
            },

            pagination: { paginationModel: { pageSize: 30 } },
          }}
        />
      </Box>

      {/* Update Quote Modal */}
      <Modal
        open={modal.update}
        header={"Update Farm Form"}
        modalStyles={{ padding: "1rem" }}
        handleClose={() => closeModal("update")}
      >
        <UpdateBuyerCropQuoteForm
          fields={quote}
          refetch={refetch}
          handleModalClose={() => closeModal("update")}
        />
      </Modal>
    </>
  );
};

// 🎨 Styles
const useStyles = makeStyles({ name: { BuyerCropQuote } })((theme) => ({
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

export default BuyerCropQuote;
