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
        <Route path="/" element={<AllRecipes />} />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
