"use client";

import { useMemo } from "react";

import { makeStyles } from "tss-react/mui";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarColumnsButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";

import { Box, CircularProgress } from "@mui/material";

// Components
import NoRows from "@/components/noRows";

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

  const formatData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.reduce((acc, item) => {
      const { notes, ...rest } = item;

      if (Array.isArray(notes) && notes.length > 0) {
        notes.forEach((note, index) => {
          acc.push({ ...rest, notes: note, id: `${item.id}-${index}` });
        });
      } else {
        acc.push({ ...item, notes: "N/A", id: `${item.id}-0` });
      }
      return acc;
    }, []);
  }, [data]);

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
        field: "notes",
        headerName: "Notes",
        flex: 1,
        minWidth: 200,
        renderCell: ({ value }) => {
          if (Array.isArray(value)) {
            return value.join(", ");
          }

          return value || "N/A";
        },
      },
    ];
  }, []);

  return (
    <>
      <Box m="20px 0 0 0" width="100%" height="75vh" className={classes.grid}>
        <DataGrid
          rows={formatData}
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
              },
            },

            pagination: { paginationModel: { pageSize: 30 } },
          }}
        />
      </Box>
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
