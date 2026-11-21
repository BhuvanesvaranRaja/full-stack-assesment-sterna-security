import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LocationTable from "./LocationTable";
import LockMappingDialog from "./LockMappingDialog";
import { lockMappingApi } from "../lock-mapping.api";

/**
 * Load and filter a location’s lock mappings and manage create, edit, and delete dialogs.
 */
export default function LockMappings({
  locationId,
  tab,
  query,
  onQueryChange,
}) {
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 10,
  });
  const [mappings, setMappings] = useState([]);
  const [loading, setLoading] = useState(Boolean(locationId));
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (!locationId) return;
    const controller = new AbortController();
    const { signal } = controller;

    async function loadMappings() {
      setLoading(true);
      setError("");

      try {
        const data = await lockMappingApi.list(locationId, {
          params: { search: query, page, pageSize },
          signal,
        });
        if (signal.aborted) return;

        setMappings(data.mappings);
        setPagination(data.pagination);
      } catch (error) {
        if (signal.aborted) return;

        setError(
          error.response?.data?.message || "Unable to load lock mappings",
        );
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    }

    // Wait briefly for typing to stop before requesting the results.
    const timer = setTimeout(loadMappings, 250);

    // Cancel pending work when the filters change or the component unmounts.
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [locationId, query, page, pageSize, reload]);

  /**
   * Delete the selected mapping, update the displayed list, and report success or failure.
   */
  async function remove() {
    setBusy(true);
    try {
      await lockMappingApi.remove(locationId, deleting.id);
      setReload((value) => value + 1);
      setDeleting(null);
      toast.success("Lock mapping deleted");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete lock mapping");
      setDeleting(null);
    } finally {
      setBusy(false);
    }
  }

  // Format display values without changing the original mapping used for editing.
  const rows = mappings.map((item, index) => ({
    ...item,
    serialNumber: (pagination.page - 1) * pagination.pageSize + index + 1,
    batteryPercentage:
      item.batteryPercentage == null ? "—" : `${item.batteryPercentage}%`,
    lastCommunicatedAt: item.lastCommunicatedAt
      ? new Date(item.lastCommunicatedAt).toLocaleString()
      : "—",
    action: (
      <div className="mapping-row-actions">
        <Button
          type="button"
          variant="ghost"
          className="mapping-icon-button"
          onClick={() => setEditing(item)}
          aria-label={`Edit ${item.lockName}`}
          title="Edit mapping"
        >
          <Pencil size={16} aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="mapping-icon-button mapping-delete-button"
          onClick={() => setDeleting(item)}
          aria-label={`Delete ${item.lockName}`}
          title="Delete mapping"
        >
          <Trash2 size={16} aria-hidden="true" />
        </Button>
      </div>
    ),
  }));

  return (
    <>
      <LocationTable
        tab={tab}
        query={query}
        onQueryChange={onQueryChange}
        serverPagination={pagination}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onAdd={() => setEditing({})}
        addDisabled={!locationId || loading || Boolean(error)}
        rows={rows}
        loading={loading}
        error={error}
        onRetry={() => {
          setLoading(true);
          setError("");
          setReload((value) => value + 1);
        }}
      />
      {editing && (
        <LockMappingDialog
          locationId={locationId}
          mapping={editing.id ? editing : null}
          onClose={() => setEditing(null)}
          onSaved={() => {
            if (!editing.id) {
              onQueryChange("");
              setPage(1);
            }
            setReload((value) => value + 1);
          }}
        />
      )}
      {deleting && (
        <Dialog
          open
          onOpenChange={(open) => !open && !busy && setDeleting(null)}
        >
          <DialogContent
            className="lock-mapping-dialog lock-mapping-confirm-dialog"
            onClose={() => !busy && setDeleting(null)}
          >
            <DialogHeader className="lock-mapping-confirm-header pr-8 text-left">
              <DialogTitle>Delete lock mapping?</DialogTitle>
            </DialogHeader>
            <div className="lock-mapping-confirm-content">
              <DialogDescription>
                Remove <strong>{deleting.lockName}</strong> from this location.
                This action cannot be undone.
              </DialogDescription>
            </div>
            <DialogFooter className="lock-mapping-confirm-footer gap-2 sm:space-x-0">
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() => setDeleting(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="lock-mapping-confirm-delete-button"
                disabled={busy}
                onClick={remove}
              >
                {busy ? "Deleting..." : "Delete mapping"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
