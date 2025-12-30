import api from "./axios";

/* Citizen */
export const myApplications = () => {
  return api.get("/applications/mine");
};

/* State Admin */
export const allApplications = () => {
  return api.get("/applications");
};

/* Single application */
export const getApplicationById = (id) => {
  return api.get(`/applications/${id}`);
};

/* Review / update status */
export const reviewApplication = (id, data) => {
  return api.put(`/applications/${id}`, data);
};
