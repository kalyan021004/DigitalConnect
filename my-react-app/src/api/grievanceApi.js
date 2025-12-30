import api from "./axios";

// Citizen
export const createGrievance = (data) =>
  api.post("/grievances", data);

export const myGrievances = () =>
  api.get("/grievances/mine");

// Gram Panchayat
export const allGrievances = () =>
  api.get("/grievances");

export const updateGrievance = (id, data) =>
  api.put(`/grievances/${id}`, data);


export const getGrievanceById = (id) =>
  api.get(`/grievances/${id}`);

