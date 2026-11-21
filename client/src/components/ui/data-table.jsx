import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import "./data-table.css";

/**
 * Return a readable table error from a string or Error, with a fallback message.
 */
function getErrorMessage(error) {
  if (typeof error === "string" && error.trim()) {
    return error;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Unable to load table data.";
}

/**
 * Render configurable columns and rows with search controls, loading and error states, and pagination.
 */
export default function DataTable({
  caption = "Data table",
  title,
  columns = [],
  rows = [],
  emptyMessage = "No results found",
  loading = false,
  loadingMessage = "Loading...",
  error,
  onRetry,
  getRowKey,
  className,
  searchValue,
  searchable = true,
  onSearchChange,
  searchPlaceholder = "Search",
  addActionLabel,
  onAdd,
  addTooltip,
  addDisabled = false,
  pagination = true,
  pageSize = 10,
  serverPagination,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}) {
  const [localSearch, setLocalSearch] = useState("");
  const search = searchValue ?? localSearch;
  const [paginationState, setPaginationState] = useState({
    page: 1,
    resetKey: "",
  });
  const invalidColumns =
    !Array.isArray(columns) ||
    columns.length === 0 ||
    columns.some(
      (column) =>
        !column ||
        typeof column.key !== "string" ||
        column.key.trim().length === 0,
    );

  const invalidRows =
    !Array.isArray(rows) ||
    rows.some((row) => row === null || typeof row !== "object");
  const safeRows = Array.isArray(rows) ? rows : [];
  // Backend pages are already filtered. Local tables search plain column values.
  const matchingRows =
    !serverPagination && !invalidColumns && search.trim()
      ? safeRows.filter((row) =>
          columns.some((column) => {
            const value = row[column.key];
            return (
              ["string", "number"].includes(typeof value) &&
              String(value).toLowerCase().includes(search.trim().toLowerCase())
            );
          }),
        )
      : safeRows;
  const rowCount = serverPagination?.total ?? matchingRows.length;
  const safePageSize =
    Number.isInteger(serverPagination?.pageSize) &&
    serverPagination.pageSize > 0
      ? serverPagination.pageSize
      : Number.isInteger(pageSize) && pageSize > 0
        ? pageSize
        : 10;
  const pageCount = Math.max(1, Math.ceil(rowCount / safePageSize));
  // Return to page one when the search or result count changes.
  const resetKey = `${search}\u0000${rowCount}\u0000${safePageSize}`;
  const page = paginationState.resetKey === resetKey ? paginationState.page : 1;
  // Keep the selected page within the available results.
  const currentPage = serverPagination?.page ?? Math.min(page, pageCount);
  const pageOffset = (currentPage - 1) * safePageSize;
  const visibleRows =
    pagination && !serverPagination
      ? matchingRows.slice(pageOffset, pageOffset + safePageSize)
      : matchingRows;

  /**
   * Request a backend page or update the page used for local rows.
   */
  function updatePage(nextPage) {
    if (serverPagination) onPageChange?.(nextPage);
    else setPaginationState({ page: nextPage, resetKey });
  }

  /** Update search and reset pagination before the parent requests filtered rows. */
  function updateSearch(value) {
    setLocalSearch(value);
    if (serverPagination) onPageChange?.(1);
    else setPaginationState({ page: 1, resetKey: "" });
    onSearchChange?.(value);
  }

  if (invalidColumns) {
    return (
      <p role="alert">
        Unable to display table: no valid columns are configured.
      </p>
    );
  }

  const stateMessage = error
    ? getErrorMessage(error)
    : invalidRows
      ? "Unable to display table data."
      : null;

  return (
    <>
      {(title || searchable || (addActionLabel && (onAdd || addTooltip))) && (
        <div className="data-table-toolbar">
          {title && <h2>{title}</h2>}
          <div className="data-table-actions">
            {addActionLabel && (onAdd || addTooltip) && (
              <span className="data-table-add-wrapper">
              <Button
                type="button"
                variant="ghost"
                aria-disabled={addTooltip ? true : undefined}
                aria-label={addTooltip ? `${addActionLabel}: ${addTooltip}` : undefined}
                className="data-table-add-button"
                onClick={addTooltip ? undefined : onAdd}
                disabled={addDisabled}
              >
                <Plus size={15} strokeWidth={1.5} aria-hidden="true" />
                {addActionLabel}
              </Button>
              {addTooltip && <span className="data-table-add-tooltip" aria-hidden="true">{addTooltip}</span>}
              </span>
            )}
            {searchable && (
              <label className="data-table-search">
                <Search size={15} strokeWidth={1.5} aria-hidden="true" />
                <Input
                  type="search"
                  aria-label={`Search ${title || caption}`}
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(event) => {
                    updateSearch(event.target.value);
                  }}
                />
              </label>
            )}
          </div>
        </div>
      )}
      <Table className={className} aria-busy={loading}>
        <TableCaption className="sr-only">{caption}</TableCaption>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={`${column.key}-${index}`} scope="col">
                {column.header ?? column.key}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {stateMessage ? (
            <TableRow>
              <TableCell colSpan={columns.length} role="alert">
                <div className="data-table-error">
                  <span>{stateMessage}</span>
                  {error && onRetry && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={onRetry}
                      disabled={loading}
                    >
                      {loading ? "Retrying..." : "Retry"}
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} role="status">
                {loadingMessage}
              </TableCell>
            </TableRow>
          ) : rowCount === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} role="status">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            visibleRows.map((row, rowIndex) => {
              const rowId = getRowKey?.(row, rowIndex) ?? row.id ?? rowIndex;

              return (
                <TableRow key={`${String(rowId)}-${rowIndex}`}>
                  {columns.map((column, columnIndex) => {
                    const value =
                      typeof column.render === "function"
                        ? column.render(row, rowIndex)
                        : row[column.key];

                    return (
                      <TableCell key={`${column.key}-${columnIndex}`}>
                        {value ?? "—"}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
      {pagination && !stateMessage && !loading && rowCount > 0 && (
        <nav
          className="data-table-pagination"
          aria-label={`${title || caption} pagination`}
        >
          <span role="status">
            {pageOffset + 1}–{Math.min(pageOffset + safePageSize, rowCount)} of{" "}
            {rowCount} {rowCount === 1 ? "entry" : "entries"}
          </span>
          <div className="data-table-pagination-controls">
            {onPageSizeChange && (
              <label>
                Rows per page{" "}
                <select
                  value={safePageSize}
                  disabled={loading}
                  onChange={(event) => {
                    onPageChange?.(1);
                    onPageSizeChange(Number(event.target.value));
                  }}
                >
                  {Array.from(new Set([...pageSizeOptions, safePageSize]))
                    .sort((a, b) => a - b)
                    .map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                </select>
              </label>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading || currentPage === 1}
              onClick={() => updatePage(currentPage - 1)}
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {pageCount}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading || currentPage === pageCount}
              onClick={() => updatePage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </nav>
      )}
    </>
  );
}
