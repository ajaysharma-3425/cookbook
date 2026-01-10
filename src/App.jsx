import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { Toaster } from 'react-hot-toast'

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./auth/AdminRoute";

import Login from "./auth/Login";
import Signup from "./auth/Signup";

import MyRecipes from "./pages/user/MyRecipes";
import SavedRecipes from "./pages/user/SavedRecipes";
import AllRecipes from "./pages/user/AllRecipes";
import AddRecipe from "./pages/user/AddRecipe";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminPendingRecipes from "./pages/admin/AdminPendingRecipes"; // ✅ NEW
import EditRecipe from "./pages/user/EditRecipe";
import RecipeDetail from "./pages/user/RecipeDetail";
import Profile from "./pages/Profile";
import AboutUs from "./pages/AboutUs";
import AdminRecipes from "./pages/admin/AdminRecipes";
import EditRecipeAdmin from "./pages/admin/EditRecipeAdmin";
import AddRecipeAdmin from "./pages/admin/AddRecipeAdmin";
import Home from "./pages/Home";
import ContactUs from "./pages/ContactUs";
import AdminUsers from "./pages/admin/AdminUsers";
import EditUserAdmin from "./pages/admin/EditUserAdmin";


<Toaster position='top-right' />

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [])
  return (

    <BrowserRouter>
      <Navbar user={user} setUser={setUser} />

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/recipe" element={<AllRecipes />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* USER PROTECTED */}
        <Route
          path="/my-recipes"
          element={
            <ProtectedRoute>
              <MyRecipes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/saved-recipes"
          element={
            <ProtectedRoute>
              <SavedRecipes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-recipe"
          element={
            <ProtectedRoute>
              <AddRecipe />
            </ProtectedRoute>
          }
        />
        <Route path="/edit-recipe/:id" element={<EditRecipe />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />

        <Route path="/profile" element={<Profile />} />
        
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/admin/users/:id/profile" element={<Profile />} />



        {/* ADMIN PROTECTED */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/pending"
          element={
            <AdminRoute>
              <AdminPendingRecipes />
            </AdminRoute>
          }
        />
      
      <Route
          path="/admin/recipes"
          element={
            <AdminRoute>
              <AdminRecipes />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/recipes/edit/:id"
          element={
            <AdminRoute>
              <EditRecipeAdmin />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/recipes/add"
          element={
            <AdminRoute>
              <AddRecipeAdmin />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users/edit/:id"
          element={
            <AdminRoute>
              <EditUserAdmin />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
