import { locationApi } from "./location.api";

export const locationService = {
  getLocations: async (options = {}) => {
    const response = await locationApi.getLocations(options);
    return response.data;
  },

  createLocation: async ({ name, city }) => {
    const response = await locationApi.createLocation({
      name: name.trim(),
      city: city.trim(),
    });
    return response.data?.location;
  },
};

export default locationService;
