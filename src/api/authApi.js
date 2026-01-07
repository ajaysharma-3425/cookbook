import axiosInstance from "./axiosInstance";

export const loginUser = (data) => {
  return axiosInstance.post("/auth/login", data);
};

export const signupUser = (data) => {
  return axiosInstance.post("/auth/signup", data);
};

// logged in user profile
export const getMyProfile = () => {
  return axiosInstance.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

