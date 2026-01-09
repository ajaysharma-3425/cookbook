import api from "./axios";

export const getAllRecipesAdmin = (status) =>
  api.get(`/admin/recipes${status ? `?status=${status}` : ""}`);

export const getRecipeByIdAdmin = (id) =>
  api.get(`/admin/recipes/${id}`);

export const createRecipeAdmin = (data) =>
  api.post("/admin/recipes", data);

export const updateRecipeAdmin = (id, data) =>
  api.put(`/admin/recipes/${id}`, data);

export const deleteRecipeAdmin = (id) =>
  api.delete(`/admin/recipes/${id}`);
