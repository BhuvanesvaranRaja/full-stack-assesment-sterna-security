export const MAPPING_TABS = [
  {
    id: "locks",
    title: "Lock Mapping",
    columns: [
      { key: "serialNumber", header: "S.NO" },
      { key: "lockName", header: "LOCK NAME" },
      { key: "assetMarking", header: "ASSET MARKING" },
      { key: "lockType", header: "LOCK TYPE" },
      { key: "batteryPercentage", header: "BATTERY PERCENTAGE" },
      {
        key: "lastCommunicatedAt",
        header: "LAST COMMUNICATED DATE & TIME",
      },
      { key: "createdBy", header: "CREATED BY" },
      { key: "action", header: "ACTION" },
    ],
  },
  {
    id: "groups",
    title: "Lock Group",
    columns: [
      { key: "lockGroup", header: "Lock Group" },
      { key: "lockGroupType", header: "Lock Group Type" },
      { key: "action", header: "Action" },
    ],
  },
  {
    id: "geofences",
    title: "Geofence",
    columns: [
      { key: "geofenceId", header: "Geofence ID" },
      { key: "geofenceName", header: "Geofence Name" },
      { key: "fenceType", header: "Fence Type" },
      { key: "action", header: "Action" },
    ],
  },
  {
    id: "gateways",
    title: "Gateway Mapping",
    columns: [
      { key: "gatewayId", header: "Gateway ID" },
      { key: "gatewayName", header: "Gateway Name" },
      { key: "macAddress", header: "Mac Address" },
      { key: "action", header: "Action" },
    ],
  },
];
