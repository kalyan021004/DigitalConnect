import api from "./axios";

/* Login */
export const loginUser = (data) => {
  return api.post("/auth/login", data);
};

/* Signup */
export const signupUser = (data) => {
  return api.post("/auth/signup", data);
};

/* Current User */
export const getMe = () => {
  return api.get("/auth/me");
};
