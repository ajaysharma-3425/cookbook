import { useEffect, useState, useContext } from "react";
import { getApprovedRecipes } from "../../api/recipeApi";
import RecipeCard from "../../components/RecipeCard";
import { AuthContext } from "../../context/AuthContext";
import {
  ChefHat,
  Filter,
  Search,
  Utensils,
  Clock,
  Star,
  Salad,
  Drumstick,
  Cake,
  Grid3x3,
  List,
  X
} from "lucide-react";

export default function AllRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTime, setSelectedTime] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [categories, setCategories] = useState([
    { id: "all", name: "All Recipes", icon: <ChefHat className="h-4 w-4" />, count: 0 },
    { id: "veg", name: "Vegetarian", icon: <Salad className="h-4 w-4" />, count: 0 },
    { id: "nonveg", name: "Non-Veg", icon: <Drumstick className="h-4 w-4" />, count: 0 },
    { id: "dessert", name: "Desserts", icon: <Cake className="h-4 w-4" />, count: 0 },
  ]);
  const { user } = useContext(AuthContext);

  const timeFilters = [
    { id: "all", name: "Any Time" },
    { id: "quick", name: "Quick (<30 min)", maxTime: 30 },
    { id: "medium", name: "Medium (30-60 min)", minTime: 30, maxTime: 60 },
    { id: "slow", name: "Slow (60+ min)", minTime: 60 },
  ];

  const getRecipeCategory = (recipe) => {
    const title = recipe.title?.toLowerCase() || '';
    const desc = recipe.description?.toLowerCase() || '';
    
    if (title.includes('chicken') || title.includes('fish') || title.includes('meat') || 
        title.includes('egg') || title.includes('biryani') || title.includes('mutton') ||
        title.includes('shawarma') || title.includes('korma') ||
        desc.includes('chicken') || desc.includes('fish') || desc.includes('meat')) {
      return "nonveg";
    }
    if (title.includes('gulab') || title.includes('kheer') || title.includes('ice cream') || 
        title.includes('brownie') || title.includes('dessert') || title.includes('cake') ||
        title.includes('sweet') || title.includes('jamun') || title.includes('rasmalai') ||
        title.includes('baklava') || title.includes('croissant') ||
        desc.includes('dessert') || desc.includes('sweet')) {
      return "dessert";
    }
    return "veg";
  };

  const calculateCategoryCounts = (recipeList) => {
    const counts = {
      all: recipeList.length,
      veg: 0,
      nonveg: 0,
      dessert: 0
    };

    recipeList.forEach(recipe => {
      const category = getRecipeCategory(recipe);
      counts[category]++;
    });

    return counts;
  };

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const res = await getApprovedRecipes();
      const recipesData = res.data;
      setRecipes(recipesData);
      setFilteredRecipes(recipesData);
      
      // Calculate category counts
      const categoryCounts = calculateCategoryCounts(recipesData);
      
      // Update categories with counts
      setCategories(prevCategories => 
        prevCategories.map(cat => ({
          ...cat,
          count: categoryCounts[cat.id] || 0
        }))
      );
      
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = recipes;

    // Search filter
    if (searchTerm) {
      result = result.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter(recipe => getRecipeCategory(recipe) === selectedCategory);
    }

    // Time filter
    if (selectedTime !== "all") {
      const timeFilter = timeFilters.find(t => t.id === selectedTime);
      result = result.filter(recipe => {
        const time = recipe.cookingTime || 0;
        if (timeFilter.maxTime && timeFilter.minTime) {
          return time >= timeFilter.minTime && time <= timeFilter.maxTime;
        } else if (timeFilter.maxTime) {
          return time <= timeFilter.maxTime;
        } else if (timeFilter.minTime) {
          return time >= timeFilter.minTime;
        }
        return true;
      });
    }

    setFilteredRecipes(result);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedTime("all");
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedCategory, selectedTime, recipes]);

  const getTotalTime = () => {
    return filteredRecipes.reduce((sum, recipe) => sum + (recipe.cookingTime || 0), 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl">
                <ChefHat className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Explore All Recipes
            </h1>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              Discover delicious recipes from our community. Filter by category, cooking time, or search for your favorites.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search recipes by name or ingredients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Recipes</p>
                  <p className="text-2xl font-bold text-gray-900">{recipes.length}</p>
                </div>
                <Utensils className="h-8 w-8 text-orange-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Showing</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredRecipes.length}</p>
                </div>
                <Filter className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Time</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.floor(getTotalTime() / 60)}h {getTotalTime() % 60}m
                  </p>
                </div>
                <Clock className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{categories.length - 1}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-6 mb-6">
            {/* Category Filters */}
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter by Category
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {category.icon}
                    {category.name}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      selectedCategory === category.id
                        ? "bg-white/20"
                        : "bg-gray-100"
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time & View Filters */}
            <div className="flex gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Cooking Time
                </h3>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {timeFilters.map((time) => (
                    <option key={time.id} value={time.id}>
                      {time.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Toggle */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">View</h3>
                <div className="flex bg-white border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${viewMode === "grid" ? "bg-gray-100" : ""}`}
                  >
                    <Grid3x3 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${viewMode === "list" ? "bg-gray-100" : ""}`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || selectedCategory !== "all" || selectedTime !== "all") && (
            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm text-blue-700">Active filters:</span>
                {searchTerm && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                    Search: "{searchTerm}"
                  </span>
                )}
                {selectedCategory !== "all" && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                    {categories.find(c => c.id === selectedCategory)?.name}
                  </span>
                )}
                {selectedTime !== "all" && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                    {timeFilters.find(t => t.id === selectedTime)?.name}
                  </span>
                )}
              </div>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Found <span className="font-bold">{filteredRecipes.length}</span> recipes
            {selectedCategory !== "all" && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
            {selectedTime !== "all" && ` (${timeFilters.find(t => t.id === selectedTime)?.name})`}
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
                <ChefHat className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? `No recipes match "${searchTerm}". Try a different search term.`
                  : "Try adjusting your filters to find what you're looking for."}
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
              >
                <Filter className="h-5 w-5" />
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          /* Recipes Grid/List */
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
          }>
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                refresh={fetchRecipes}
                showUnsave={false}
                showCategory={true}
              />
            ))}
          </div>
        )}

        {/* Category Highlights */}
        {!loading && filteredRecipes.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Browse by Category
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.slice(1).map((category) => (
                <div
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`bg-gradient-to-br rounded-xl p-6 cursor-pointer transition-transform hover:scale-[1.02] ${
                    category.id === "veg"
                      ? "from-green-50 to-green-100 border border-green-200"
                      : category.id === "nonveg"
                      ? "from-red-50 to-red-100 border border-red-200"
                      : "from-pink-50 to-pink-100 border border-pink-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${
                        category.id === "veg" ? "bg-green-100" :
                        category.id === "nonveg" ? "bg-red-100" : "bg-pink-100"
                      }`}>
                        {category.icon}
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">{category.name}</h4>
                    </div>
                    <span className={`text-sm font-bold ${
                      category.id === "veg" ? "text-green-700" :
                      category.id === "nonveg" ? "text-red-700" : "text-pink-700"
                    }`}>
                      {category.count} recipes
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {category.id === "veg" 
                      ? "Delicious vegetarian dishes from around the world" 
                      : category.id === "nonveg"
                      ? "Hearty non-vegetarian meals for every occasion"
                      : "Sweet treats and delightful desserts"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}