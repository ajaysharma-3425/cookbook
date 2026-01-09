import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecipeById, updateMyRecipe } from "../../api/recipeApi";
import toast from "react-hot-toast";
import {
  Edit3,
  ChefHat,
  FileText,
  List,
  Utensils,
  Save,
  ArrowLeft,
  AlertCircle,
  Clock
} from "lucide-react";

export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    ingredients: "",
    steps: "",
  });

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    setLoading(true);
    try {
      const res = await getRecipeById(id);
      const recipe = res.data;
      
      // Safely format the data
      let ingredientsText = "";
      if (Array.isArray(recipe.ingredients)) {
        ingredientsText = recipe.ingredients.join(", ");
      } else if (typeof recipe.ingredients === 'string') {
        ingredientsText = recipe.ingredients;
      }
      
      let stepsText = "";
      if (Array.isArray(recipe.steps)) {
        stepsText = recipe.steps.join(", ");
      } else if (typeof recipe.steps === 'string') {
        stepsText = recipe.steps;
      }
      
      setForm({
        title: recipe.title || "",
        description: recipe.description || "",
        ingredients: ingredientsText,
        steps: stepsText,
      });
    } catch (err) {
      console.error("Error fetching recipe:", err);
      toast.error("Cannot edit this recipe");
      navigate("/my-recipes");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updating) return;

    // Validate form
    if (!form.title.trim() || !form.description.trim() || !form.ingredients.trim() || !form.steps.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setUpdating(true);
    try {
      // Prepare data for API
      const updateData = {
        title: form.title.trim(),
        description: form.description.trim(),
      };

      // Convert ingredients to array
      if (form.ingredients.trim()) {
        updateData.ingredients = form.ingredients
          .split(",")
          .map(item => item.trim())
          .filter(item => item.length > 0);
      }

      // Convert steps to array
      if (form.steps.trim()) {
        updateData.steps = form.steps
          .split(",")
          .map(item => item.trim())
          .filter(item => item.length > 0);
      }

      console.log("Sending update data:", updateData);
      
      const response = await updateMyRecipe(id, updateData);
      console.log("Update response:", response);
      
      toast.success("Recipe updated successfully! ✅");
      navigate("/my-recipes");
    } catch (err) {
      console.error("Update error:", err);
      
      // Better error messages
      if (err.response) {
        if (err.response.status === 401) {
          toast.error("You need to login again to update recipes");
        } else if (err.response.status === 403) {
          toast.error("You can only edit your own recipes");
        } else if (err.response.status === 404) {
          toast.error("Recipe not found");
        } else {
          toast.error(err.response?.data?.message || "Update failed. Please try again.");
        }
      } else if (err.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl">
              <Edit3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Edit Recipe
              </h1>
              <p className="text-gray-600 mt-1">
                Update your recipe details
              </p>
            </div>
          </div>

          {/* Info Alert */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Recipe will be re-submitted for approval
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  After updating, your recipe will go through the approval process again.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Recipe Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <ChefHat className="h-4 w-4" />
                Recipe Title *
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter recipe title"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Description *
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your recipe..."
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 resize-none"
                required
              />
            </div>

            {/* Ingredients */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <List className="h-4 w-4" />
                Ingredients *
              </label>
              <textarea
                name="ingredients"
                value={form.ingredients}
                onChange={handleChange}
                placeholder="Enter ingredients separated by commas:
flour, sugar, eggs, butter, milk"
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 font-mono text-sm resize-none"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Separate ingredients with commas. Example: flour, sugar, eggs, butter
              </p>
            </div>

            {/* Steps */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Utensils className="h-4 w-4" />
                Cooking Steps *
              </label>
              <textarea
                name="steps"
                value={form.steps}
                onChange={handleChange}
                placeholder="Enter steps separated by commas:
Preheat oven to 350°F, Mix dry ingredients, Add wet ingredients, Bake for 30 minutes"
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 resize-none"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Separate steps with commas. Example: Preheat oven, Mix ingredients, Bake
              </p>
            </div>

            {/* Form Actions */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
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
              
              {/* Update Note */}
              <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Clock className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-orange-800">
                      Update Process
                    </p>
                    <p className="text-sm text-orange-600 mt-1">
                      Your recipe will be reviewed again after updating. This ensures quality content for our community.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        
      </div>
    </div>
  );
}