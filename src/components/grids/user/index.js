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
import UpdateUserForm from "@/components/forms/user/update";

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

const Crop = ({ data, isLoading = false, refetch }) => {
  const { classes } = useStyles();

  const [user, setUser] = useState(null);

  const [modal, setModal] = useState({
    update: false,
  });

  // function to open a modal
  const openModal = (state) => setModal((prev) => ({ ...prev, [state]: true }));

  // function to close a modal
  const closeModal = (state) =>
    setModal((prev) => ({ ...prev, [state]: false }));

  const handleUpdateUser = (row) => {
    setUser(row);

    openModal("update");
  };

  const columns = useMemo(() => {
    return [
      {
        field: "name",
        headerName: "Name",
        flex: 1,
        minWidth: 120,
        valueFormatter: ({ value }) => value || "N/A",
      },
      {
        field: "mobileNumber",
        headerName: "Mobile Number",
        flex: 1,
        minWidth: 120,
        valueFormatter: ({ value }) => value || "N/A",
      },
      {
        field: "identity",
        headerName: "Identity",
        flex: 1,
        minWidth: 120,
        valueFormatter: ({ value }) => value || "N/A",
      },
      {
        field: "createdAt",
        headerName: "Registration Date",
        flex: 1,
        minWidth: 120,
        valueFormatter: ({ value }) =>
          convertFromTimestampToDate(value.seconds, value.nanoseconds),
      },
      {
        field: "isVerified",
        headerName: "Status",
        flex: 1,
        minWidth: 120,
        renderCell: ({ value }) => {
          return (
            <Chip
              variant="outlined"
              color={value ? "success" : "warning"}
              label={value ? "Verified" : "Not Verified"}
            />
          );
        },
      },
      {
        field: "actions",
        headerName: "",
        flex: 1,
        minWidth: 150,
        renderCell: ({ row }) => (
          <IconButton onClick={() => handleUpdateUser(row)}>
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
              columnVisibilityModel: {},
            },

            pagination: { paginationModel: { pageSize: 30 } },
          }}
        />
      </Box>

      {/* Update User Modal */}
      <Modal
        open={modal.update}
        header={"Update User Form"}
        modalStyles={{ padding: "1rem" }}
        handleClose={() => closeModal("update")}
      >
        <UpdateUserForm
          fields={user}
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
  tags: {
    gap: 5,
    padding: 5,
    display: "flex",
    overflowY: "auto",
  },
}));

export default Crop;
