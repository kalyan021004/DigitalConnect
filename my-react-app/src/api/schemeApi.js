import api from "./axios";

/* Get all schemes */
export const fetchSchemes = () => {
  return api.get("/schemes");
};

/* Get single scheme */
export const getSchemeById = (id) => {
  return api.get(`/schemes/${id}`);
};

/* Apply for scheme */
export const applyScheme = (schemeId) =>
  api.post("/applications/apply", { schemeId });