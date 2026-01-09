import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRecipeAdmin } from "../../api/adminApi";
import toast from "react-hot-toast";
import {
  ChefHat,
  Clock,
  Image as ImageIcon,
  List,
  FileText,
  Save,
  ArrowLeft,
  Upload,
  AlertCircle,
  X,
  CheckCircle,
} from "lucide-react";

export default function AddRecipeAdmin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    ingredients: "",
    steps: "",
    image: "",
    cookingTime: "",
  });

  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Update preview for image URL
    if (name === "image" && value) {
      setPreviewImage(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      description: form.description,
      image: form.image,
      cookingTime: Number(form.cookingTime),

      // 🔥 string → array
      ingredients: form.ingredients
        .split(/[\n,]/)
        .map(i => i.trim())
        .filter(Boolean),

      steps: form.steps
        .split(/[\n,]/)
        .map(s => s.trim())
        .filter(Boolean),

      status: "approved", // 🔥 admin recipe auto approved
    };

    try {
      setLoading(true);
      await createRecipeAdmin(payload);
      toast.success("Recipe added successfully!");
      navigate("/admin/recipes");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add recipe");
    } finally {
      setLoading(false);
    }
  };

  const clearField = (fieldName) => {
    setForm({ ...form, [fieldName]: "" });
    if (fieldName === "image") {
      setPreviewImage("");
    }
  };

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
                  <ChefHat className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Add New Recipe
                  </h1>
                  <p className="text-sm text-gray-600">Create and publish a new recipe</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Admin Mode</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recipe Details</h2>
              <span className="text-sm text-gray-500">* Required fields</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-500" />
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Recipe Title *
                  </label>
                  <div className="relative">
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      placeholder="Enter recipe title..."
                      required
                    />
                    {form.title && (
                      <button
                        type="button"
                        onClick={() => clearField("title")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Cooking Time */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Cooking Time (minutes) *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      name="cookingTime"
                      value={form.cookingTime}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., 30"
                      min="1"
                      required
                    />
                  </div>
                </div>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-h-[120px]"
                  placeholder="Describe your recipe..."
                  required
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-orange-500" />
                Recipe Image
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Image URL Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Image URL
                  </label>
                  <div className="relative">
                    <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      name="image"
                      value={form.image}
                      onChange={handleChange}
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="https://example.com/image.jpg"
                    />
                    {form.image && (
                      <button
                        type="button"
                        onClick={() => clearField("image")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Image Preview */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Image Preview
                  </label>
                  <div className="h-48 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={() => setPreviewImage("")}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <ImageIcon className="h-12 w-12 mb-2" />
                        <p className="text-sm">No image preview available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <List className="h-5 w-5 text-orange-500" />
                Ingredients *
              </h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Enter ingredients (one per line or separated by commas)
                  </label>
                  <span className="text-xs text-gray-500">
                    {form.ingredients.split(/[\n,]/).filter(Boolean).length} items
                  </span>
                </div>
                <textarea
                  name="ingredients"
                  value={form.ingredients}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono text-sm min-h-[180px]"
                  placeholder="2 cups flour
1 cup sugar
3 eggs
1 tsp vanilla extract

Or: 2 cups flour, 1 cup sugar, 3 eggs, 1 tsp vanilla extract"
                  required
                />
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Separate ingredients by new lines or commas
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-orange-500" />
                Cooking Steps *
              </h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Enter cooking steps (one per line or separated by commas)
                  </label>
                  <span className="text-xs text-gray-500">
                    {form.steps.split(/[\n,]/).filter(Boolean).length} steps
                  </span>
                </div>
                <textarea
                  name="steps"
                  value={form.steps}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm min-h-[200px]"
                  placeholder="Preheat oven to 350°F
Mix dry ingredients in a bowl
Add wet ingredients and stir
Pour into baking pan
Bake for 30 minutes

Or: Preheat oven to 350°F, Mix dry ingredients, Add wet ingredients, Bake"
                  required
                />
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Separate steps by new lines or commas
                </div>
              </div>
            </div>

            {/* Admin Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">Admin Mode Active</h4>
                  <p className="text-sm text-blue-700">
                    This recipe will be automatically approved and published immediately upon submission.
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
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-sm"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Adding Recipe...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Publish Recipe
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
            Quick Tips for Better Recipes
          </h3>
          <ul className="space-y-2 text-orange-700">
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold">•</span>
              <span>Use high-quality, descriptive images for better engagement</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold">•</span>
              <span>Be specific with measurements and cooking times</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold">•</span>
              <span>List ingredients in the order they're used</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold">•</span>
              <span>Write clear, step-by-step instructions</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}