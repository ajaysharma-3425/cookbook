import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { createRecipe } from "../../api/recipeApi";
import toast from "react-hot-toast";
import { 
  ChefHat, 
  Clock, 
  Image as ImageIcon, 
  List, 
  FileText, 
  Save,
  ArrowLeft
} from "lucide-react";

export default function AddRecipe() {
  const { user } = useContext(AuthContext);
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      await createRecipe(form);
      toast.success("Recipe submitted for approval!");
      navigate("/my-recipes");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add recipe");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

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
          
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl">
              <ChefHat className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Add New Recipe
              </h1>
              <p className="text-gray-600 mt-1">
                Share your delicious recipe with the community
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Recipe Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipe Title *
              </label>
              <input
                name="title"
                placeholder="e.g., Classic Spaghetti Carbonara"
                value={form.title}
                onChange={handleChange}
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
                placeholder="Describe your recipe... What makes it special?"
                value={form.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cooking Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Cooking Time (minutes) *
                </label>
                <input
                  type="number"
                  name="cookingTime"
                  placeholder="e.g., 30"
                  value={form.cookingTime}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  required
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Image URL
                </label>
                <input
                  name="image"
                  placeholder="https://example.com/recipe-image.jpg"
                  value={form.image}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                />
                {form.image && (
                  <div className="mt-2">
                    <div className="relative h-40 w-full rounded-lg overflow-hidden border border-gray-200">
                      <img 
                        src={form.image} 
                        alt="Preview" 
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div className="hidden absolute inset-0 bg-gray-100 items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <List className="h-4 w-4" />
                Ingredients *
              </label>
              <textarea
                name="ingredients"
                placeholder="Enter each ingredient on a new line or separate with commas:
• 2 cups flour
• 1 cup sugar
• 3 eggs
                "
                value={form.ingredients}
                onChange={handleChange}
                rows="5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 font-mono text-sm resize-none"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Tip: Use bullet points or commas to separate ingredients
              </p>
            </div>

            {/* Cooking Steps */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cooking Steps *
              </label>
              <textarea
                name="steps"
                placeholder="Describe each step in detail:
1. Preheat the oven to 350°F
2. Mix dry ingredients in a bowl
3. Add wet ingredients and mix until smooth
                "
                value={form.steps}
                onChange={handleChange}
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 resize-none"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Number your steps for better readability
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
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Submit Recipe for Approval
                    </>
                  )}
                </button>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <ChefHat className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      Recipe Approval Process
                    </p>
                    <p className="text-sm text-blue-600 mt-1">
                      Your recipe will be reviewed by our team before being published. 
                      You'll receive a notification once it's approved.
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