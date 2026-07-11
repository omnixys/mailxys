"use client";

import { SearchRounded } from "@mui/icons-material";
import {
  alpha,
  Box,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useMemo, useState } from "react";

export interface Column<T> {
  id: string;
  label: string;
  accessor: (row: T) => React.ReactNode;
  sortable?: boolean;
  sortAccessor?: (row: T) => string | number;
  width?: number | string;
  align?: "left" | "right" | "center";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchAccessor?: (row: T) => string;
  rowsPerPage?: number;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

type Order = "asc" | "desc";

export function DataTable<T extends { id: string }>({
  columns,
  data,
  searchPlaceholder = "Search...",
  searchAccessor,
  rowsPerPage = 10,
  onRowClick,
  emptyMessage = "No data found",
}: DataTableProps<T>) {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<string>("");
  const [page, setPage] = useState(0);

  const filteredData = useMemo(() => {
    if (!search || !searchAccessor) return data;
    const q = search.toLowerCase();
    return data.filter((row) => searchAccessor(row).toLowerCase().includes(q));
  }, [data, search, searchAccessor]);

  const sortedData = useMemo(() => {
    if (!orderBy) return filteredData;
    const col = columns.find((c) => c.id === orderBy);
    if (!col) return filteredData;
    const sortFn = col.sortAccessor ?? col.accessor;
    return [...filteredData].sort((a, b) => {
      const aVal = sortFn(a);
      const bVal = sortFn(b);
      const aStr = String(aVal);
      const bStr = String(bVal);
      return order === "asc"
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
  }, [filteredData, orderBy, order, columns]);

  const paginatedData = useMemo(
    () =>
      sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [sortedData, page, rowsPerPage],
  );

  const handleSort = (id: string) => {
    setOrder(orderBy === id && order === "asc" ? "desc" : "asc");
    setOrderBy(id);
  };

  return (
    <Box>
      {/* Search */}
      {searchAccessor && (
        <Box sx={{ mb: 2, maxWidth: 360 }}>
          <TextField
            fullWidth
            size="small"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded
                      sx={{ fontSize: "1.125rem", color: "text.secondary" }}
                    />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
      )}

      {/* Table */}
      <TableContainer
        sx={{
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align ?? "left"}
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "text.secondary",
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    bgcolor: alpha(theme.palette.action.active, 0.02),
                    width: col.width,
                    whiteSpace: "nowrap",
                  }}
                >
                  {col.sortable ? (
                    <TableSortLabel
                      active={orderBy === col.id}
                      direction={orderBy === col.id ? order : "asc"}
                      onClick={() => handleSort(col.id)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{ py: 6 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  sx={{
                    cursor: onRowClick ? "pointer" : "default",
                    "&:last-child td": { borderBottom: 0 },
                  }}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.id}
                      align={col.align ?? "left"}
                      sx={{
                        py: 1.5,
                        fontSize: "0.8125rem",
                        borderBottom: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      {col.accessor(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {sortedData.length > rowsPerPage && (
          <TablePagination
            component="div"
            count={sortedData.length}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={() => {}}
            rowsPerPageOptions={[rowsPerPage]}
            sx={{
              borderTop: `1px solid ${theme.palette.divider}`,
              "& .MuiTablePagination-toolbar": { minHeight: 48 },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                {
                  fontSize: "0.8125rem",
                },
            }}
          />
        )}
      </TableContainer>
    </Box>
  );
}
