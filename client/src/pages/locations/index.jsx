import { useState, useEffect } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import AppLayout from "@/components/layout/AppLayout";
import LocationList from "./components/LocationList";
import LockMappings from "./components/LockMappings";
import LocationTable from "./components/LocationTable";
import AddLocationDialog from "./components/AddLocationDialog";
import { MAPPING_TABS } from "./location-tabs";
import { locationService } from "./location.service";
import "./Locations.css";

/**
 * Load locations and manage the selected location, detail tabs, search, and creation dialogs.
 */
export default function Locations() {
  const [locations, setLocations] = useState([]);
  const [selected, setSelected] = useState(null);
  const selectedId = selected?.id || "";
  const [locationPage, setLocationPage] = useState(1);
  const [locationPagination, setLocationPagination] = useState({
    page: 1,
    pageCount: 1,
  });
  const [reload, setReload] = useState(0);
  const [locationQuery, setLocationQuery] = useState("");
  const [tableQuery, setTableQuery] = useState("");
  const [activeTab, setActiveTab] = useState("locks");
  const [addingLocation, setAddingLocation] = useState(false);
  const [mobileLocationPickerOpen, setMobileLocationPickerOpen] =
    useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setLoading(true);
      locationService
        .getLocations({
          params: { search: locationQuery, page: locationPage, pageSize: 10 },
          signal: controller.signal,
        })
        .then((data) => {
          if (controller.signal.aborted) return;
          setLocations(data.locations);
          setLocationPagination(data.pagination);
          // Keep the detail pane selected even if search hides its location.
          setSelected((current) => current || data.locations[0] || null);
        })
        .catch(() => {
          // The API interceptor displays request errors.
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [locationQuery, locationPage, reload]);

  function searchLocations(value) {
    setLocationQuery(value);
    setLocationPage(1);
  }

  const tab =
    MAPPING_TABS.find((item) => item.id === activeTab) || MAPPING_TABS[0];
  /**
   * Activate a detail tab and clear the table search.
   */
  function selectTab(id) {
    setActiveTab(id);
    setTableQuery("");
  }

  /**
   * Select a location, clear the table search, and close the mobile picker.
   */
  function selectLocation(id) {
    setSelected(locations.find((location) => location.id === id) || null);
    setTableQuery("");
    setMobileLocationPickerOpen(false);
  }

  // Support arrow keys, Home, and End for keyboard tab navigation.
  /**
   * Move tab selection and keyboard focus using arrow keys, Home, or End.
   */
  function handleTabKey(event, index) {
    const offsets = { ArrowRight: 1, ArrowLeft: -1 };
    let next;
    if (event.key in offsets) {
      next =
        (index + offsets[event.key] + MAPPING_TABS.length) %
        MAPPING_TABS.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = MAPPING_TABS.length - 1;
    } else {
      return;
    }
    event.preventDefault();
    selectTab(MAPPING_TABS[next].id);
    document.getElementById(`tab-${MAPPING_TABS[next].id}`)?.focus();
  }

  /**
   * Create a location, add it to the list, select it, and clear the location search.
   */
  async function handleCreateLocation({ name, city }) {
    const created = await locationService.createLocation({ name, city });
    setSelected(created);
    setLocationQuery("");
    setLocationPage(1);
    setReload((value) => value + 1);
    return created;
  }

  return (
    <AppLayout activePage="Locations" className="locations-shell">
      <div className="locations-body">
        <LocationList
          locations={locations}
          selectedId={selectedId}
          query={locationQuery}
          loading={loading}
          onQueryChange={searchLocations}
          pagination={locationPagination}
          onPageChange={setLocationPage}
          onSelect={selectLocation}
          onAdd={() => setAddingLocation(true)}
        />
        <main id="page-content" className="location-detail" tabIndex={-1}>
          <header className="location-detail-header">
            <h2>{selected?.name || "No location selected"}</h2>
            <div className="location-mobile-controls">
              <Button
                type="button"
                variant="outline"
                className="location-mobile-picker"
                aria-haspopup="dialog"
                aria-expanded={mobileLocationPickerOpen}
                aria-label={`Choose location. Current selection: ${selected?.name || "none"}`}
                onClick={() => setMobileLocationPickerOpen(true)}
              >
                <span>{selected?.name || "Select a location"}</span>
                <ChevronDown size={16} aria-hidden="true" />
              </Button>
              <Button
                type="button"
                className="location-add-icon location-mobile-add"
                aria-label="Add location"
                onClick={() => setAddingLocation(true)}
              >
                <Plus size={17} strokeWidth={1.5} aria-hidden="true" />
              </Button>
            </div>
            <div
              className="location-tabs"
              role="tablist"
              aria-label="Location details"
            >
              {MAPPING_TABS.map((item, index) => (
                <Button
                  variant="ghost"
                  key={item.id}
                  id={`tab-${item.id}`}
                  role="tab"
                  aria-selected={activeTab === item.id}
                  aria-controls={`panel-${item.id}`}
                  tabIndex={activeTab === item.id ? 0 : -1}
                  onClick={() => selectTab(item.id)}
                  onKeyDown={(event) => handleTabKey(event, index)}
                >
                  {item.title}
                </Button>
              ))}
            </div>
          </header>
          <div className="location-detail-content dashboard-content">
            {activeTab === "locks" ? (
              <LockMappings
                key={selected?.id || "empty"}
                locationId={selected?.id}
                tab={tab}
                query={tableQuery}
                onQueryChange={setTableQuery}
              />
            ) : (
              <LocationTable
                tab={tab}
                query={tableQuery}
                onQueryChange={setTableQuery}
                addTooltip="Not yet implemented"
              />
            )}
          </div>
        </main>
      </div>
      {addingLocation && (
        <AddLocationDialog
          onClose={() => setAddingLocation(false)}
          onSave={handleCreateLocation}
        />
      )}
      <Dialog
        open={mobileLocationPickerOpen}
        onOpenChange={setMobileLocationPickerOpen}
      >
        <DialogContent
          className="mobile-location-picker-dialog"
          onClose={() => setMobileLocationPickerOpen(false)}
        >
          <DialogTitle className="mobile-location-picker-title">
            Choose location
          </DialogTitle>
          <LocationList
            heading=""
            locations={locations}
            selectedId={selectedId}
            query={locationQuery}
            loading={loading}
            onQueryChange={searchLocations}
            pagination={locationPagination}
            onPageChange={setLocationPage}
            onSelect={selectLocation}
          />
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
