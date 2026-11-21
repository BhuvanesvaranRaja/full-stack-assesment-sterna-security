import apiClient from "@/api/apiClient";

const path = (locationId) => `/locations/${locationId}/lock-mappings`;
export const lockMappingApi = {
  list: async (locationId, options = {}) =>
    (await apiClient.get(path(locationId), options)).data,
  save: async (locationId, id, values) =>
    (id
      ? await apiClient.put(`${path(locationId)}/${id}`, values)
      : await apiClient.post(path(locationId), values)
    ).data.mapping,
  remove: (locationId, id) => apiClient.delete(`${path(locationId)}/${id}`),
};
