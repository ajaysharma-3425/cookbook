import { useEffect, useState } from "react";
import { getMyRecipes, deleteMyRecipe } from "../../api/recipeApi";
import RecipeCard from "../../components/RecipeCard";
import { useNavigate } from "react-router-dom";
import {
  ChefHat,
  PlusCircle,
  Filter,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  BookOpen,
  Trash2,
  Edit3,
  Eye,
  RefreshCw,
  ChefHat as RecipeIcon
} from "lucide-react";
import toast from "react-hot-toast";

export default function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  const fetchMyRecipes = async () => {
    setLoading(true);
    try {
      const res = await getMyRecipes();
      setRecipes(res.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      toast.error("Failed to load your recipes");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this recipe? This action cannot be undone.")) return;
    
    try {
      await deleteMyRecipe(id);
      toast.success("Recipe deleted successfully");
      fetchMyRecipes();
    } catch (error) {
      console.error("Error deleting recipe:", error);
      toast.error("Failed to delete recipe");
    }
  };

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  const filteredRecipes = statusFilter === "all" 
    ? recipes 
    : recipes.filter(recipe => recipe.status === statusFilter);

  const getStatusStats = () => {
    const stats = {
      all: recipes.length,
      pending: recipes.filter(r => r.status === "pending").length,
      approved: recipes.filter(r => r.status === "approved").length,
      rejected: recipes.filter(r => r.status === "rejected").length,
    };
    
    return stats;
  };

  const stats = getStatusStats();

  const getStatusIcon = (status) => {
    switch(status) {
      case "approved": return <CheckCircle className="h-4 w-4" />;
      case "pending": return <Clock className="h-4 w-4" />;
      case "rejected": return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "approved": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "rejected": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl">
                  <ChefHat className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  My Recipes
                </h1>
              </div>
              <p className="text-gray-600">
                Manage and track your submitted recipes
              </p>
            </div>

            <button
              onClick={() => navigate("/add-recipe")}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
            >
              <PlusCircle className="h-5 w-5" />
              Add New Recipe
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Recipes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.all}</p>
                </div>
                <BookOpen className="h-8 w-8 text-orange-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
                <div className="h-8 w-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                </div>
                <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters & Actions */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {/* Status Filter */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Filter className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-medium text-gray-700">Filter by Status</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    statusFilter === "all"
                      ? "bg-orange-500 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  All Recipes ({stats.all})
                </button>
                <button
                  onClick={() => setStatusFilter("approved")}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    statusFilter === "approved"
                      ? "bg-green-500 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <CheckCircle className="h-4 w-4" />
                  Approved ({stats.approved})
                </button>
                <button
                  onClick={() => setStatusFilter("pending")}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    statusFilter === "pending"
                      ? "bg-yellow-500 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  Pending ({stats.pending})
                </button>
                <button
                  onClick={() => setStatusFilter("rejected")}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    statusFilter === "rejected"
                      ? "bg-red-500 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <XCircle className="h-4 w-4" />
                  Rejected ({stats.rejected})
                </button>
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchMyRecipes}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredRecipes.length}</span> of{" "}
            <span className="font-semibold">{recipes.length}</span> recipes
            {statusFilter !== "all" && ` (${statusFilter})`}
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 rounded flex-1"></div>
                  <div className="h-8 bg-gray-200 rounded flex-1"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredRecipes.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="max-w-md mx-auto">
              <div className="h-32 w-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <RecipeIcon className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {recipes.length === 0 ? "No recipes yet" : "No recipes found"}
              </h3>
              <p className="text-gray-600 mb-6">
                {recipes.length === 0
                  ? "Start by adding your first recipe to share with the community!"
                  : `No recipes found with status "${statusFilter}". Try changing the filter.`}
              </p>
              {recipes.length === 0 && (
                <button
                  onClick={() => navigate("/add-recipe")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
                >
                  <PlusCircle className="h-5 w-5" />
                  Create Your First Recipe
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Recipes Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <div key={recipe._id} className="relative group">
                <RecipeCard
                  recipe={recipe}
                  refresh={fetchMyRecipes}
                  showUnsave={false}
                  showStatus={true}
                />

                {/* Action Buttons Overlay */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {/* View Button - Always visible */}
                  <button
                    onClick={() => navigate(`/recipe/${recipe._id}`)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm"
                    title="View Recipe"
                  >
                    <Eye className="h-4 w-4 text-gray-700" />
                  </button>

                  {/* Edit Button - Only for pending recipes */}
                  {recipe.status === "pending" && (
                    <button
                      onClick={() => navigate(`/edit-recipe/${recipe._id}`)}
                      className="p-2 bg-blue-500/90 backdrop-blur-sm rounded-full hover:bg-blue-600 transition-colors shadow-sm"
                      title="Edit Recipe"
                    >
                      <Edit3 className="h-4 w-4 text-white" />
                    </button>
                  )}

                  {/* Delete Button - For pending and rejected recipes */}
                  {(recipe.status === "pending" || recipe.status === "rejected") && (
                    <button
                      onClick={() => handleDelete(recipe._id)}
                      className="p-2 bg-red-500/90 backdrop-blur-sm rounded-full hover:bg-red-600 transition-colors shadow-sm"
                      title="Delete Recipe"
                    >
                      <Trash2 className="h-4 w-4 text-white" />
                    </button>
                  )}
                </div>

                {/* Status Info Card */}
                <div className={`mt-4 p-4 rounded-lg ${getStatusColor(recipe.status)}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(recipe.status)}
                    <span className="font-medium capitalize">{recipe.status}</span>
                  </div>
                  
                  {recipe.status === "pending" && (
                    <p className="text-sm">
                      Your recipe is under review by our team.
                    </p>
                  )}
                  
                  {recipe.status === "approved" && (
                    <p className="text-sm">
                      Your recipe is published and visible to everyone!
                    </p>
                  )}
                  
                  {recipe.status === "rejected" && recipe.rejectionReason && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Rejection Reason:</p>
                      <p className="text-sm mt-1">{recipe.rejectionReason}</p>
                    </div>
                  )}

                  {/* Action Buttons (Mobile & Desktop) */}
                  <div className="flex gap-2 mt-3">
                    {recipe.status === "pending" && (
                      <button
                        onClick={() => navigate(`/edit-recipe/${recipe._id}`)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                      >
                        <Edit3 className="h-3 w-3" />
                        Edit
                      </button>
                    )}
                    
                    {(recipe.status === "pending" || recipe.status === "rejected") && (
                      <button
                        onClick={() => handleDelete(recipe._id)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    )}
                    
                    <button
                      onClick={() => navigate(`/recipe/${recipe._id}`)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
                    >
                      <Eye className="h-3 w-3" />
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tips Section */}
        {!loading && filteredRecipes.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Recipe Status Guide
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-green-800">Approved</h4>
                </div>
                <p className="text-green-700">
                  Your recipe is published and visible to all users. You cannot edit or delete approved recipes.
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-yellow-800">Pending</h4>
                </div>
                <p className="text-yellow-700">
                  Your recipe is under review. You can edit or delete it while it's pending.
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-red-800">Rejected</h4>
                </div>
                <p className="text-red-700">
                  Your recipe needs changes. Check the rejection reason, delete it, or edit and resubmit.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}