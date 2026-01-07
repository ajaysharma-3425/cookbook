import { useNavigate } from "react-router-dom";
import { saveRecipe, unsaveRecipe, toggleLike } from "../api/recipeApi";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  Heart,
  Bookmark,
  Clock,
  ChefHat,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Flame
} from "lucide-react";

export default function RecipeCard({ 
  recipe, 
  refresh, 
  showUnsave, 
  showStatus = false, 
  showCategory = true,
  ...props 
}) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isLoggedIn = !!user;
  const isSaved = user?.savedRecipes?.includes(recipe._id);

  // Determine recipe category based on keywords
  const getRecipeCategory = () => {
    const title = recipe.title?.toLowerCase() || '';
    const description = recipe.description?.toLowerCase() || '';
    
    if (title.includes('chicken') || title.includes('fish') || title.includes('egg') || 
        title.includes('meat') || title.includes('biryani') || description.includes('non-veg')) {
      return { name: 'Non-Veg', color: 'bg-red-100 text-red-700', icon: '🍗' };
    }
    if (title.includes('gulab') || title.includes('kheer') || title.includes('ice cream') || 
        title.includes('brownie') || title.includes('dessert') || description.includes('sweet')) {
      return { name: 'Dessert', color: 'bg-pink-100 text-pink-700', icon: '🍰' };
    }
    return { name: 'Vegetarian', color: 'bg-green-100 text-green-700', icon: '🥗' };
  };

  const category = getRecipeCategory();

  const handleAuthAction = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (loading) return;
    
    try {
      setLoading(true);
      await toggleLike(recipe._id);
      refresh();
    } catch (err) {
      toast.error("Like failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (loading) return;

    try {
      setLoading(true);
      await saveRecipe(recipe._id);
      toast.success("Recipe Saved Successfully ✅");
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving recipe");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      await unsaveRecipe(recipe._id);
      toast.success("Recipe removed ❌");
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unsave failed");
    }
  };

  const handleViewRecipe = () => {
    navigate(`/recipe/${recipe._id}`);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const formatTime = (time) => {
    if (!time) return "N/A";
    return time <= 60 ? `${time} min` : `${Math.floor(time / 60)} hr ${time % 60} min`;
  };

  const getStatusIcon = () => {
    switch(recipe.status) {
      case "approved": return <CheckCircle className="h-4 w-4" />;
      case "pending": return <AlertCircle className="h-4 w-4" />;
      case "rejected": return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
      {/* Image Section */}
      <div 
        className="relative h-56 overflow-hidden cursor-pointer"
        onClick={handleViewRecipe}
      >
        {recipe.image && !imageError ? (
          <img
            src={recipe.image}
            alt={recipe.title}
            onError={handleImageError}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <ChefHat className="h-16 w-16 text-gray-400" />
          </div>
        )}
        
        {/* Category Badge */}
        {showCategory && (
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${category.color}`}>
              {category.icon} {category.name}
            </span>
          </div>
        )}

        {/* Status Badge */}
        {showStatus && recipe.status && (
          <div className="absolute top-3 right-3">
            <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
              recipe.status === "approved" 
                ? "bg-green-100 text-green-700" 
                : recipe.status === "pending" 
                ? "bg-yellow-100 text-yellow-700" 
                : "bg-red-100 text-red-700"
            }`}>
              {getStatusIcon()}
              {recipe.status.toUpperCase()}
            </div>
          </div>
        )}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Recipe Title & Author */}
        <div className="mb-3">
          <h3 
            onClick={handleViewRecipe}
            className="text-lg font-bold text-gray-800 line-clamp-1 hover:text-orange-600 cursor-pointer transition-colors"
          >
            {recipe.title}
          </h3>
          {recipe.createdBy?.name && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <Users className="h-3 w-3" />
              <span>By {recipe.createdBy.name}</span>
            </div>
          )}
        </div>

        {/* Recipe Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {recipe.description || "A delicious recipe waiting to be tried!"}
        </p>

        {/* Stats Bar */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{formatTime(recipe.cookingTime)}</span>
            </div>
            
            <div className="flex items-center gap-1 text-gray-600">
              <Flame className="h-4 w-4" />
              <span>{recipe.difficulty || "Easy"}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Heart className={`h-4 w-4 ${recipe.likes?.length > 0 ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
              <span className="text-gray-600">{recipe.likes?.length || 0}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Like Button */}
            <button
              disabled={loading}
              onClick={handleAuthAction}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                recipe.likes?.includes(user?._id) 
                  ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Heart className={`h-4 w-4 ${recipe.likes?.includes(user?._id) ? 'fill-red-600' : ''}`} />
              <span className="text-sm font-medium">Like</span>
            </button>

            {/* Save/Unsave Button */}
            {!showUnsave ? (
              <button
                disabled={loading}
                onClick={handleSave}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                  isSaved 
                    ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-blue-600' : ''}`} />
                <span className="text-sm font-medium">Save</span>
              </button>
            ) : (
              <button
                onClick={handleUnsave}
                className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span className="text-sm font-medium">Remove</span>
              </button>
            )}
          </div>

          {/* View Recipe Button */}
          <button
            onClick={handleViewRecipe}
            className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
          >
            <Eye className="h-4 w-4" />
            <span className="text-sm font-medium">View</span>
          </button>
        </div>

        {/* Rejection Reason */}
        {showStatus && recipe.status === "rejected" && recipe.rejectionReason && (
          <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg">
            <div className="flex items-start gap-2">
              <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-700">Rejection Reason</p>
                <p className="text-sm text-red-600 mt-1">{recipe.rejectionReason}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}