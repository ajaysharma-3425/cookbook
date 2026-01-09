import { useEffect, useState } from "react";
import { getSavedRecipes } from "../../api/recipeApi";
import RecipeCard from "../../components/RecipeCard";
import { 
  Bookmark, 
  Filter, 
  Search, 
  Grid3x3, 
  List, 
  ChefHat,
  Clock,
  RefreshCw,
  BookmarkCheck,
  BookOpen,
  Salad,
  Drumstick,
  Cake,
  X
} from "lucide-react";
import toast from "react-hot-toast";

export default function SavedRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [categories, setCategories] = useState([
    { id: "all", name: "All Recipes", icon: <BookmarkCheck className="h-4 w-4" />, count: 0 },
    { id: "veg", name: "Vegetarian", icon: <Salad className="h-4 w-4" />, count: 0 },
    { id: "nonveg", name: "Non-Veg", icon: <Drumstick className="h-4 w-4" />, count: 0 },
    { id: "dessert", name: "Desserts", icon: <Cake className="h-4 w-4" />, count: 0 },
  ]);

  // Function to get recipe category (same as AllRecipes)
  const getRecipeCategory = (recipe) => {
    const title = recipe.title?.toLowerCase() || '';
    const desc = recipe.description?.toLowerCase() || '';
    
    // Non-veg keywords
    const nonVegKeywords = ['chicken', 'fish', 'meat', 'egg', 'biryani', 'mutton', 
                           'shawarma', 'korma', 'nihaari', 'nihari', 'handi', 'momos'];
    
    // Dessert keywords  
    const dessertKeywords = ['gulab', 'kheer', 'ice cream', 'brownie', 'dessert', 
                            'cake', 'sweet', 'jamun', 'rasmalai', 'baklava', 
                            'croissant', 'lava', 'vanilla', 'choco'];
    
    // Check for non-veg
    const hasNonVeg = nonVegKeywords.some(keyword => 
      title.includes(keyword) || desc.includes(keyword)
    );
    
    if (hasNonVeg) return "nonveg";
    
    // Check for dessert
    const hasDessert = dessertKeywords.some(keyword => 
      title.includes(keyword) || desc.includes(keyword)
    );
    
    if (hasDessert) return "dessert";
    
    return "veg"; // Default to vegetarian
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

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const res = await getSavedRecipes();
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
      console.error("Error fetching saved recipes:", error);
      toast.error("Failed to load saved recipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let results = recipes;

    // Search filter
    if (searchTerm) {
      results = results.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter - USING THE SAME FUNCTION
    if (categoryFilter !== "all") {
      results = results.filter(recipe => 
        getRecipeCategory(recipe) === categoryFilter
      );
    }

    // Time filter
    if (timeFilter !== "all") {
      results = results.filter(recipe => {
        const time = recipe.cookingTime || 0;
        if (timeFilter === "quick") return time <= 30;
        if (timeFilter === "medium") return time > 30 && time <= 60;
        if (timeFilter === "slow") return time > 60;
        return true;
      });
    }

    setFilteredRecipes(results);
  }, [searchTerm, categoryFilter, timeFilter, recipes]);

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setTimeFilter("all");
  };

  const getStats = () => {
    const vegCount = recipes.filter(r => getRecipeCategory(r) === "veg").length;
    const nonvegCount = recipes.filter(r => getRecipeCategory(r) === "nonveg").length;
    const dessertCount = recipes.filter(r => getRecipeCategory(r) === "dessert").length;
    
    return {
      total: recipes.length,
      veg: vegCount,
      nonveg: nonvegCount,
      dessert: dessertCount,
      totalTime: recipes.reduce((sum, r) => sum + (r.cookingTime || 0), 0)
    };
  };

  const stats = getStats();

  const timeFilters = [
    { id: "all", name: "Any Time" },
    { id: "quick", name: "Quick (≤30 min)" },
    { id: "medium", name: "Medium (30-60 min)" },
    { id: "slow", name: "Slow (60+ min)" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl">
                  <BookmarkCheck className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Saved Recipes
                </h1>
              </div>
              <p className="text-gray-600">
                Your personal collection of favorite recipes
              </p>
            </div>

            <button
              onClick={fetchSaved}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Saved</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Bookmark className="h-8 w-8 text-orange-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Vegetarian</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.veg}</p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold">🥗</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Non-Veg</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.nonveg}</p>
                </div>
                <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-red-600 font-bold">🍗</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Desserts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.dessert}</p>
                </div>
                <div className="h-8 w-8 bg-pink-100 rounded-lg flex items-center justify-center">
                  <span className="text-pink-600 font-bold">🍰</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters & Search Bar */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search saved recipes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-3">
              {/* Category Filter with Buttons */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setCategoryFilter(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      categoryFilter === category.id
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {category.icon}
                    {category.name}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      categoryFilter === category.id
                        ? "bg-white/20"
                        : "bg-gray-100"
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="bg-transparent focus:outline-none"
                >
                  {timeFilters.map((time) => (
                    <option key={time.id} value={time.id}>
                      {time.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Toggle */}
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

              {(searchTerm || categoryFilter !== "all" || timeFilter !== "all") && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{filteredRecipes.length}</span> of{" "}
              <span className="font-semibold">{recipes.length}</span> saved recipes
            </p>
          </div>
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
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="h-32 w-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bookmark className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {recipes.length === 0 ? "No saved recipes yet" : "No recipes found"}
              </h3>
              <p className="text-gray-600 mb-6">
                {recipes.length === 0
                  ? "Start saving your favorite recipes to see them here!"
                  : "Try adjusting your search or filters to find what you're looking for."}
              </p>
              {recipes.length === 0 && (
                <button
                  onClick={() => window.location.href = "/"}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
                >
                  <BookOpen className="h-5 w-5" />
                  Browse Recipes
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Recipe Grid/List */
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
          }>
            {filteredRecipes.map((recipe) => (
              viewMode === "grid" ? (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  refresh={fetchSaved}
                  showUnsave={true}
                  showCategory={true}
                />
              ) : (
                /* List View */
                <div key={recipe._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* Image */}
                    <div className="md:w-48 md:h-32 flex-shrink-0">
                      {recipe.image ? (
                        <img
                          src={recipe.image}
                          alt={recipe.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                          <ChefHat className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {recipe.title}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {recipe.description}
                          </p>
                          <div className="mt-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              getRecipeCategory(recipe) === 'veg' ? 'bg-green-100 text-green-700' :
                              getRecipeCategory(recipe) === 'nonveg' ? 'bg-red-100 text-red-700' :
                              'bg-pink-100 text-pink-700'
                            }`}>
                              {getRecipeCategory(recipe).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {recipe.cookingTime} min
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-500">
                            By {recipe.createdBy?.name || "Unknown"}
                          </span>
                          <span className="text-sm text-gray-500">
                            ❤️ {recipe.likes?.length || 0}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <RecipeCard
                            recipe={recipe}
                            refresh={fetchSaved}
                            showUnsave={true}
                            showCategory={false}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        )}

        {/* Quick Stats Footer */}
        {filteredRecipes.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="text-sm text-gray-500">Ready to cook?</p>
                <p className="font-semibold text-gray-900">
                  You have {filteredRecipes.length} delicious recipes waiting!
                </p>
              </div>
              <button
                onClick={() => {
                  if (filteredRecipes.length > 0) {
                    const randomIndex = Math.floor(Math.random() * filteredRecipes.length);
                    window.location.href = `/recipe/${filteredRecipes[randomIndex]._id}`;
                  }
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
              >
                <ChefHat className="h-5 w-5" />
                Cook a Random Recipe
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}