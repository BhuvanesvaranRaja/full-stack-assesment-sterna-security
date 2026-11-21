import { Card } from "@/components/ui/card";
import DataTable from "@/components/ui/data-table";

export default function LocationTable({
  tab,
  query,
  onQueryChange,
  onAdd,
  addTooltip,
  addDisabled = false,
  pagination = true,
  pageSize = 10,
  serverPagination,
  onPageChange,
  onPageSizeChange,
  rows = [],
  loading = false,
  error,
  onRetry,
}) {
  return (
    <Card
      as="section"
      className="location-mapping-card border-0 shadow-none"
      role="tabpanel"
      id={`panel-${tab.id}`}
      aria-labelledby={`tab-${tab.id}`}
      tabIndex={0}
    >
      <DataTable
        caption={`${tab.title} table`}
        title={tab.title}
        columns={tab.columns}
        rows={rows}
        className={`location-table location-table-${tab.id}`}
        emptyMessage="No results found"
        loading={loading}
        error={error}
        onRetry={onRetry}
        searchValue={query}
        onSearchChange={onQueryChange}
        addActionLabel={onAdd || addTooltip ? tab.title : undefined}
        onAdd={onAdd}
        addTooltip={addTooltip}
        addDisabled={addDisabled}
        pagination={pagination}
        pageSize={pageSize}
        serverPagination={serverPagination}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </Card>
  );
}
