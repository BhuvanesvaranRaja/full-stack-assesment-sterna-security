import { Plus, Search, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LocationList({
  locations,
  selectedId,
  query,
  onQueryChange,
  onSelect,
  onAdd,
  loading = false,
  heading = "Locations",
  pagination,
  onPageChange,
}) {
  return (
    <aside className="location-list" aria-label="Locations">
      {(heading || onAdd) && (
        <div className="location-list-heading">
          {heading && <h1>{heading}</h1>}
          {onAdd && (
            <Button
              type="button"
              className="location-add-icon"
              aria-label="Add location"
              onClick={onAdd}
            >
              <Plus size={17} strokeWidth={1.5} />
            </Button>
          )}
        </div>
      )}
      <label className="location-search location-list-search">
        <Search size={15} strokeWidth={1.5} aria-hidden="true" />
        <Input
          type="search"
          placeholder="Enter search term"
          aria-label="Search locations"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </label>
      <div className="location-list-items">
        {locations.map((location) => (
          <Button
            variant="ghost"
            type="button"
            key={location.id}
            className={`location-list-item${selectedId === location.id ? " is-selected" : ""}`}
            aria-pressed={selectedId === location.id}
            onClick={() => onSelect(location.id)}
          >
            <span className="location-initial" aria-hidden="true">
              {location.name.charAt(0).toUpperCase()}
            </span>
            <span>
              <strong>{location.name}</strong>
              <small>{location.city}</small>
            </span>
          </Button>
        ))}
        {loading && (
          <div className="location-list-loading" role="status">
            <LoaderCircle className="spinner" size={15} />
            <span>Updating locations…</span>
          </div>
        )}
        {!loading && locations.length === 0 && (
          <p className="location-list-empty">No locations found</p>
        )}
      </div>
      {pagination?.pageCount > 1 && (
        <nav className="location-list-pagination" aria-label="Location pages">
          <Button
            variant="outline"
            size="sm"
            disabled={loading || pagination.page <= 1}
            onClick={() => onPageChange(pagination.page - 1)}
          >
            Previous
          </Button>
          <span>
            {pagination.page} / {pagination.pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={loading || pagination.page >= pagination.pageCount}
            onClick={() => onPageChange(pagination.page + 1)}
          >
            Next
          </Button>
        </nav>
      )}
    </aside>
  );
}
