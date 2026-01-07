import api from "./axios";
// import axios from "axios";


// const API = axios.create({
//   baseURL: "http://localhost:5000/api",
// });

// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//   }
//   return req;
// });

// public – approved recipes
export const getApprovedRecipes = () => api.get(`/recipes`);

// protected
export const toggleLike = (id) => api.post(`/recipes/${id}/like`);
export const saveRecipe = (id) => api.post(`/recipes/${id}/save`);
export const rejectRecipe = (id) => api.put(`/recipes/reject/${id}`);
export const unsaveRecipe = (id) => api.delete(`/recipes/${id}/save`);
export const getSavedRecipes = (id) => api.get(`/recipes/saved`);
export const createRecipe = (data) => api.post("/recipes", data);
export const getMyRecipes = () => api.get("/recipes/my");
export const getRecipeById = (id) => api.get(`/recipes/${id}`);
export const updateMyRecipe = (id,data) => api.put(`/recipes/${id}`,data);
export const deleteMyRecipe = (id) => api.delete(`/recipes/${id}`);
// single recipe
// export const getSingleRecipe = (id) => api.get(`/recipes/${id}`);



