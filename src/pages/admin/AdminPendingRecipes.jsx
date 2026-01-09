import { useEffect, useState } from "react";
import axios from "axios";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  ChefHat, 
  Eye, 
  Calendar,
  User,
  AlertCircle,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";

const AdminPendingRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const token = localStorage.getItem("token");

    const fetchPendingRecipes = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                "http://localhost:5000/api/admin/recipes/pending",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setRecipes(res.data);
        } catch (error) {
            console.error("Error fetching recipes:", error);
        } finally {
            setLoading(false);
        }
    };

    const approveRecipe = async (id) => {
        try {
            await axios.put(
                `http://localhost:5000/api/admin/recipes/status/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            // Remove from UI
            setRecipes(recipes.filter((r) => r._id !== id));
            setSelectedRecipe(null);
        } catch (error) {
            console.error("Error approving recipe:", error);
            alert("Failed to approve recipe");
        }
    };

    const handleReject = async (id) => {
        const reason = prompt("Enter rejection reason:");
        if (!reason) return;
        
        try {
            await axios.put(
                `http://localhost:5000/api/admin/recipes/reject/${id}`,
                { reason },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setRecipes((prev) => prev.filter((r) => r._id !== id));
            setSelectedRecipe(null);
        } catch (err) {
            console.error(err.response?.data || err.message);
            alert("Failed to reject recipe");
        }
    };

    const openRecipeDetails = (recipe) => {
        setSelectedRecipe(recipe);
    };

    const closeRecipeDetails = () => {
        setSelectedRecipe(null);
    };

    useEffect(() => {
        fetchPendingRecipes();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
                            <Clock className="h-8 w-8 text-orange-500" />
                            Pending Recipes Review
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Review and approve recipes submitted by creators
                        </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl px-4 py-3">
                        <div className="flex items-center gap-2">
                            <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                                {recipes.length}
                            </div>
                            <span className="font-semibold text-orange-700">Pending</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recipe List - Left Panel */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Recipes Awaiting Approval ({recipes.length})
                                </h2>
                                <button
                                    onClick={fetchPendingRecipes}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Refresh List
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="py-12 flex flex-col items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                                <p className="mt-4 text-gray-600">Loading recipes...</p>
                            </div>
                        ) : recipes.length === 0 ? (
                            <div className="py-16 text-center">
                                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle className="h-8 w-8 text-green-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                    All Caught Up!
                                </h3>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    No pending recipes to review. Check back later for new submissions.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {recipes.map((recipe) => (
                                    <div
                                        key={recipe._id}
                                        className="p-6 hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-start gap-4">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                                                            <ChefHat className="h-6 w-6 text-orange-600" />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-800 text-lg mb-1">
                                                            {recipe.title}
                                                        </h3>
                                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                                                            <div className="flex items-center gap-1">
                                                                <User className="h-4 w-4" />
                                                                <span>{recipe.createdBy?.name || "Unknown User"}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="h-4 w-4" />
                                                                <span>
                                                                    {new Date(recipe.createdAt).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-600 line-clamp-2">
                                                            {recipe.description || "No description provided"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <button
                                                    onClick={() => openRecipeDetails(recipe)}
                                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-200"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    View Details
                                                </button>
                                                
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => approveRecipe(recipe._id)}
                                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors duration-200"
                                                    >
                                                        <ThumbsUp className="h-4 w-4" />
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(recipe._id)}
                                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200"
                                                    >
                                                        <ThumbsDown className="h-4 w-4" />
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel - Stats & Preview */}
                <div className="space-y-6">
                    {/* Stats Card */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Review Statistics
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                <div>
                                    <p className="text-sm text-blue-600">Total Pending</p>
                                    <p className="text-2xl font-bold text-gray-800">{recipes.length}</p>
                                </div>
                                <Clock className="h-8 w-8 text-blue-500" />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <p className="text-sm text-green-600">Ready to Approve</p>
                                    <p className="text-xl font-bold text-gray-800">{recipes.length}</p>
                                </div>
                                <div className="p-3 bg-orange-50 rounded-lg">
                                    <p className="text-sm text-orange-600">Action Required</p>
                                    <p className="text-xl font-bold text-gray-800">{recipes.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            Quick Actions
                        </h3>
                        <div className="space-y-3">
                            <button
                                onClick={fetchPendingRecipes}
                                className="w-full flex items-center justify-between p-3 bg-white hover:bg-orange-50 border border-orange-200 rounded-lg transition-colors duration-200"
                            >
                                <span className="font-medium text-orange-700">Refresh List</span>
                                <Clock className="h-4 w-4 text-orange-500" />
                            </button>
                            <button
                                onClick={() => {
                                    if (recipes.length > 0) {
                                        openRecipeDetails(recipes[0]);
                                    }
                                }}
                                className="w-full flex items-center justify-between p-3 bg-white hover:bg-orange-50 border border-orange-200 rounded-lg transition-colors duration-200"
                            >
                                <span className="font-medium text-orange-700">View First Recipe</span>
                                <Eye className="h-4 w-4 text-orange-500" />
                            </button>
                        </div>
                    </div>

                    {/* Guidelines */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Review Guidelines
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-600">Check for appropriate content and language</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-600">Verify recipe completeness</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-600">Ensure proper attribution</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-600">Provide clear reason for rejection</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Recipe Details Modal */}
            {selectedRecipe && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-gray-800">
                                Recipe Details
                            </h3>
                            <button
                                onClick={closeRecipeDetails}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            >
                                <XCircle className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="mb-6">
                                <h4 className="text-2xl font-bold text-gray-800 mb-2">
                                    {selectedRecipe.title}
                                </h4>
                                <div className="flex items-center gap-4 text-gray-600 mb-4">
                                    <div className="flex items-center gap-1">
                                        <User className="h-4 w-4" />
                                        <span>{selectedRecipe.createdBy?.name || "Unknown User"}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            {new Date(selectedRecipe.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h5 className="font-semibold text-gray-700 mb-2">Description</h5>
                                    <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                                        {selectedRecipe.description || "No description provided"}
                                    </p>
                                </div>

                                {selectedRecipe.ingredients && (
                                    <div>
                                        <h5 className="font-semibold text-gray-700 mb-2">Ingredients</h5>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            {Array.isArray(selectedRecipe.ingredients) ? (
                                                <ul className="list-disc list-inside space-y-1">
                                                    {selectedRecipe.ingredients.map((ing, idx) => (
                                                        <li key={idx} className="text-gray-600">{ing}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-gray-600">{selectedRecipe.ingredients}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {selectedRecipe.instructions && (
                                    <div>
                                        <h5 className="font-semibold text-gray-700 mb-2">Instructions</h5>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            {Array.isArray(selectedRecipe.instructions) ? (
                                                <ol className="list-decimal list-inside space-y-2">
                                                    {selectedRecipe.instructions.map((step, idx) => (
                                                        <li key={idx} className="text-gray-600">{step}</li>
                                                    ))}
                                                </ol>
                                            ) : (
                                                <p className="text-gray-600">{selectedRecipe.instructions}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {selectedRecipe.tags && selectedRecipe.tags.length > 0 && (
                                    <div>
                                        <h5 className="font-semibold text-gray-700 mb-2">Tags</h5>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedRecipe.tags.map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => approveRecipe(selectedRecipe._id)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors duration-200"
                            >
                                <ThumbsUp className="h-5 w-5" />
                                Approve Recipe
                            </button>
                            <button
                                onClick={() => handleReject(selectedRecipe._id)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200"
                            >
                                <ThumbsDown className="h-5 w-5" />
                                Reject Recipe
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPendingRecipes;