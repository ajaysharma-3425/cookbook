import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecipeByIdAdmin, updateRecipeAdmin } from "../../api/adminApi";
import {
  ChefHat,
  Edit,
  ArrowLeft,
  Clock,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Save,
  Eye,
  List,
  Utensils,
  Image as ImageIcon
} from "lucide-react";
import toast from "react-hot-toast";

export default function EditRecipeAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    time: "",
    status: "",
    ingredients: "",
    steps: "",
    image: ""
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    setLoading(true);
    try {
      const { data } = await getRecipeByIdAdmin(id);
      
      // Safely format the data
      let ingredientsText = "";
      if (Array.isArray(data.ingredients)) {
        ingredientsText = data.ingredients.join(", ");
      } else if (typeof data.ingredients === 'string') {
        ingredientsText = data.ingredients;
      }
      
      let stepsText = "";
      if (Array.isArray(data.steps)) {
        stepsText = data.steps.join(", ");
      } else if (typeof data.steps === 'string') {
        stepsText = data.steps;
      }
      
      setForm({
        title: data.title || "",
        description: data.description || "",
        time: data.time || data.cookingTime || "",
        status: data.status || "approved",
        ingredients: ingredientsText,
        steps: stepsText,
        image: data.image || ""
      });
    } catch (error) {
      console.error("Error fetching recipe:", error);
      toast.error("Failed to load recipe details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for time input to ensure it's a number
    if (name === "time") {
      const numericValue = value.replace(/[^0-9]/g, '');
      setForm(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleStatusChange = (statusValue) => {
    setForm(prev => ({ ...prev, status: statusValue }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    // if (!form.title.trim()) {
    //   toast.error("Please enter recipe title");
    //   return;
    // }
    if (!form.description.trim()) {
      toast.error("Please enter recipe description");
      return;
    }
    // if (!form.time.trim()) {
    //   toast.error("Please enter cooking time");
    //   return;
    // }

    // Validate time is a positive number
    const timeNumber = parseInt(form.time);
    if (isNaN(timeNumber) || timeNumber <= 0) {
      toast.error("Please enter a valid cooking time (positive number)");
      return;
    }

    setUpdating(true);
    try {
      // Prepare data for API
      const updateData = {
        title: form.title.trim(),
        description: form.description.trim(),
        time: timeNumber, // Send as number
        status: form.status,
      };

      // Only include image if it's not empty
      if (form.image.trim()) {
        updateData.image = form.image.trim();
      }

      // Convert ingredients to array if provided
      if (form.ingredients.trim()) {
        updateData.ingredients = form.ingredients
          .split(",")
          .map(item => item.trim())
          .filter(item => item.length > 0);
      }

      // Convert steps to array if provided
      if (form.steps.trim()) {
        updateData.steps = form.steps
          .split(",")
          .map(item => item.trim())
          .filter(item => item.length > 0);
      }

      await updateRecipeAdmin(id, updateData);
      toast.success("Recipe updated successfully!");
      setTimeout(() => {
        navigate("/admin/recipes");
      }, 1500);
    } catch (error) {
      console.error("Error updating recipe:", error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Failed to update recipe";
      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const statusOptions = [
    { value: "approved", label: "Approved", icon: <CheckCircle className="h-4 w-4" />, color: "bg-green-100 text-green-800" },
    { value: "pending", label: "Pending", icon: <AlertCircle className="h-4 w-4" />, color: "bg-yellow-100 text-yellow-800" },
    { value: "rejected", label: "Rejected", icon: <XCircle className="h-4 w-4" />, color: "bg-red-100 text-red-800" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading recipe details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Back</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-lg">
                  <Edit className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Edit Recipe
                  </h1>
                  <p className="text-sm text-gray-600">Update recipe details and status</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate(`/recipe/${id}`)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">View Recipe</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recipe Information</h2>
              <span className="text-sm text-gray-500">ID: {id?.substring(0, 8)}...</span>
            </div>
          </div>

          <form onSubmit={submitHandler} className="p-6 space-y-8">
            {/* Recipe Preview */}
            {form.image && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <ChefHat className="h-4 w-4" />
                  Recipe Preview
                </h3>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={form.image}
                      alt="Recipe preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"><ChefHat className="h-8 w-8 text-gray-400" /></div>';
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{form.title || "Untitled Recipe"}</p>
                    <p className="text-sm text-gray-500 line-clamp-2">{form.description || "No description"}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-500" />
                Basic Information
              </h3>
              
              <div className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Recipe Title *
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Enter recipe title"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Enter recipe description"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                    required
                  />
                </div>

                {/* Cooking Time */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Cooking Time (minutes) *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                      placeholder="e.g., 30"
                      type="number"
                      min="1"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                </div>

                {/* Image URL */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Image URL
                  </label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      name="image"
                      value={form.image}
                      onChange={handleChange}
                      placeholder="https://example.com/recipe-image.jpg"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Ingredients Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <List className="h-5 w-5 text-orange-500" />
                Ingredients
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Ingredients (separated by commas)
                  </label>
                  <textarea
                    name="ingredients"
                    value={form.ingredients}
                    onChange={handleChange}
                    placeholder="flour, sugar, eggs, butter, milk, salt, baking powder"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono text-sm resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Separate ingredients with commas. Example: flour, sugar, eggs, butter
                  </p>
                </div>
              </div>
            </div>

            {/* Steps Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Utensils className="h-5 w-5 text-orange-500" />
                Cooking Steps
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Steps (separated by commas)
                  </label>
                  <textarea
                    name="steps"
                    value={form.steps}
                    onChange={handleChange}
                    placeholder="Preheat oven to 350°F, Mix dry ingredients, Add wet ingredients, Pour into pan, Bake for 30 minutes"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Separate steps with commas. Example: Preheat oven, Mix ingredients, Bake
                  </p>
                </div>
              </div>
            </div>

            {/* Status Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Recipe Status
              </h3>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Set Recipe Status
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleStatusChange(option.value)}
                      className={`p-4 rounded-xl border transition-all flex items-center gap-3 ${
                        form.status === option.value
                          ? `${option.color} border-transparent`
                          : "bg-white border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        form.status === option.value
                          ? option.color.replace('bg-', 'bg-').replace('text-', 'text-')
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {option.icon}
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{option.label}</p>
                        <p className="text-xs text-gray-500">
                          {option.value === "approved" && "Visible to all users"}
                          {option.value === "pending" && "Awaiting review"}
                          {option.value === "rejected" && "Hidden from users"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Status Select (Alternative) */}
                <div className="md:hidden">
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Info */}
                <div className={`p-4 rounded-lg ${
                  form.status === "approved" ? "bg-green-50 text-green-700" :
                  form.status === "pending" ? "bg-yellow-50 text-yellow-700" :
                  "bg-red-50 text-red-700"
                }`}>
                  <div className="flex items-start gap-3">
                    {form.status === "approved" && <CheckCircle className="h-5 w-5 flex-shrink-0" />}
                    {form.status === "pending" && <AlertCircle className="h-5 w-5 flex-shrink-0" />}
                    {form.status === "rejected" && <XCircle className="h-5 w-5 flex-shrink-0" />}
                    <div>
                      <p className="font-medium">
                        {form.status === "approved" && "Recipe will be publicly visible"}
                        {form.status === "pending" && "Recipe will be under review"}
                        {form.status === "rejected" && "Recipe will be hidden from users"}
                      </p>
                      <p className="text-sm mt-1">
                        {form.status === "approved" && "All users can view and save this recipe."}
                        {form.status === "pending" && "Only you and admins can see this recipe."}
                        {form.status === "rejected" && "This recipe will not appear in search results."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">Admin Mode Active</h4>
                  <p className="text-sm text-blue-700">
                    You have full control over this recipe. Changes will be applied immediately.
                    All fields marked with * are required.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={updating}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-sm"
              >
                {updating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Update Recipe
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-orange-800 mb-3 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Quick Tips for Editing
          </h3>
          <ul className="space-y-2 text-orange-700">
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold">•</span>
              <span>Update the cooking time accurately for better user experience</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold">•</span>
              <span>Use "Approved" status to make recipes visible to all users</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold">•</span>
              <span>"Pending" status hides recipes while under review</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold">•</span>
              <span>"Rejected" status hides recipes from search results</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold">•</span>
              <span>Separate ingredients and steps with commas for proper formatting</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}