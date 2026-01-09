import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getApprovedRecipes } from "../api/recipeApi";
import {
  ChefHat,
  Search,
  Clock,
  Heart,
  Bookmark,
  TrendingUp,
  Star,
  Users,
  Award,
  Filter,
  Eye,
  Flame,
  Salad,
  Cake,
  Coffee,
  Pizza,
  Globe,
  ArrowRight,
  CheckCircle,
  BookOpen,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipes();
  }, []);

  // Update search suggestions when searchQuery changes
  useEffect(() => {
    if (searchQuery.trim() && recipes.length > 0) {
      const suggestions = recipes.filter(recipe =>
        recipe.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients?.some(ing => 
          ing.toLowerCase().includes(searchQuery.toLowerCase())
        )
      ).slice(0, 5); // Show max 5 suggestions
      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, recipes]);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const res = await getApprovedRecipes();
      const allRecipes = res.data || res || [];
      setRecipes(allRecipes);
      
      // Featured recipes (approved and highly rated)
      const featured = allRecipes
        .filter(recipe => recipe.status === "approved")
        .sort((a, b) => (b.likes || 0) - (a.likes || 0))
        .slice(0, 4);
      setFeaturedRecipes(featured);
      
      // Trending recipes (most viewed)
      const trending = allRecipes
        .filter(recipe => recipe.status === "approved")
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 6);
      setTrendingRecipes(trending);
      
    } catch (error) {
      console.error("Error fetching recipes:", error);
      toast.error("Failed to load recipes");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: "all", name: "All Recipes", icon: <BookOpen className="h-5 w-5" /> },
    { id: "veg", name: "Vegetarian", icon: <Salad className="h-5 w-5" /> },
    { id: "nonveg", name: "Non-Veg", icon: <Flame className="h-5 w-5" /> },
    { id: "dessert", name: "Desserts", icon: <Cake className="h-5 w-5" /> },
    { id: "quick", name: "Quick Meals", icon: <Clock className="h-5 w-5" /> },
    { id: "popular", name: "Most Popular", icon: <TrendingUp className="h-5 w-5" /> },
  ];

  const cuisines = [
    { name: "Italian", icon: <Pizza className="h-5 w-5" /> },
    { name: "Indian", icon: <Globe className="h-5 w-5" /> },
    { name: "Mexican", icon: <Flame className="h-5 w-5" /> },
    { name: "Chinese", icon: <Coffee className="h-5 w-5" /> },
    { name: "Mediterranean", icon: <Salad className="h-5 w-5" /> },
  ];

  const stats = [
    { value: "1,000+", label: "Recipes", icon: <BookOpen className="h-6 w-6" />, color: "text-orange-500" },
    { value: "10,000+", label: "Happy Cooks", icon: <Users className="h-6 w-6" />, color: "text-green-500" },
    { value: "4.8", label: "Average Rating", icon: <Star className="h-6 w-6" />, color: "text-yellow-500" },
    { value: "500+", label: "Chef Contributors", icon: <Award className="h-6 w-6" />, color: "text-purple-500" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Find exact match first
      const exactMatch = recipes.find(recipe => 
        recipe.title?.toLowerCase() === searchQuery.toLowerCase()
      );
      
      if (exactMatch) {
        // If exact match found, navigate to that recipe
        navigate(`/recipe/${exactMatch._id}`);
      } else {
        // Otherwise search for recipes and navigate to first result
        const matchingRecipes = recipes.filter(recipe =>
          recipe.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          recipe.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          recipe.ingredients?.some(ing => 
            ing.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
        
        if (matchingRecipes.length > 0) {
          // Navigate to first matching recipe
          navigate(`/recipe/${matchingRecipes[0]._id}`);
        } else {
          // If no matches found, show message and navigate to recipes page with search query
          toast.error(`No recipes found for "${searchQuery}"`);
          navigate(`/recipe?search=${encodeURIComponent(searchQuery)}`);
        }
      }
      setSearchQuery("");
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (recipe) => {
    navigate(`/recipe/${recipe._id}`);
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const handleSearchAll = () => {
    if (searchQuery.trim()) {
      navigate(`/recipe?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setShowSuggestions(false);
    }
  };

  const filteredRecipes = recipes.filter(recipe => {
    if (activeCategory === "all") return true;
    if (activeCategory === "quick") return (recipe.cookingTime || 0) <= 30;
    if (activeCategory === "popular") return (recipe.likes || 0) > 10;
    
    // Simple category detection based on keywords
    const title = recipe.title?.toLowerCase() || '';
    const desc = recipe.description?.toLowerCase() || '';
    
    if (activeCategory === "veg") {
      const nonVegKeywords = ['chicken', 'fish', 'meat', 'egg', 'biryani', 'mutton'];
      return !nonVegKeywords.some(keyword => title.includes(keyword) || desc.includes(keyword));
    }
    if (activeCategory === "nonveg") {
      const nonVegKeywords = ['chicken', 'fish', 'meat', 'egg', 'biryani', 'mutton'];
      return nonVegKeywords.some(keyword => title.includes(keyword) || desc.includes(keyword));
    }
    if (activeCategory === "dessert") {
      const dessertKeywords = ['cake', 'sweet', 'dessert', 'chocolate', 'ice cream', 'cookie'];
      return dessertKeywords.some(keyword => title.includes(keyword) || desc.includes(keyword));
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Discover & Share <span className="text-orange-500">Amazing</span> Recipes
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Join thousands of home cooks sharing their favorite recipes. Find inspiration, save your favorites, and become a better cook every day.
            </p>
            
            {/* Search Bar with Suggestions */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Search for recipes, ingredients, or cuisines..."
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl shadow-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
                >
                  Search
                </button>
              </div>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                  <div className="p-2">
                    {searchSuggestions.map((recipe) => (
                      <button
                        key={recipe._id}
                        type="button"
                        onClick={() => handleSuggestionClick(recipe)}
                        className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center gap-3 transition-colors"
                      >
                        {recipe.image ? (
                          <img
                            src={recipe.image}
                            alt={recipe.title}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg flex items-center justify-center">
                            <ChefHat className="h-5 w-5 text-orange-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{recipe.title}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {recipe.cookingTime || "N/A"} min
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {recipe.likes || 0}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </button>
                    ))}
                    
                    {/* View all results */}
                    {searchQuery.trim() && (
                      <button
                        type="button"
                        onClick={handleSearchAll}
                        className="w-full text-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-orange-600 font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Search className="h-4 w-4" />
                        View all results for "{searchQuery}"
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Search Tips */}
              <div className="mt-3 text-sm text-gray-500 text-left">
                <p>Try searching for: <span className="font-medium text-orange-600">biriyani</span>, <span className="font-medium text-orange-600">chocolate cake</span>, <span className="font-medium text-orange-600">chicken curry</span></p>
              </div>
            </form>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white p-4 rounded-xl shadow-sm border">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${stat.color.replace('text', 'bg')} bg-opacity-10`}>
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Browse by Category</h2>
            <p className="text-gray-600">Find recipes that match your mood and time</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-all ${
                  activeCategory === category.id
                    ? "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300 text-orange-700"
                    : "bg-white border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                }`}
              >
                <div className={`p-3 rounded-lg ${
                  activeCategory === category.id
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {category.icon}
                </div>
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Recipes */}
      <div className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Recipes</h2>
              <p className="text-gray-600">Handpicked recipes from our community</p>
            </div>
            <Link
              to="/recipe"
              className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
            >
              View all recipes <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border p-4 animate-pulse">
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredRecipes.map((recipe) => (
                <div
                  key={recipe._id}
                  onClick={() => navigate(`/recipe/${recipe._id}`)}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                >
                  <div className="relative h-48 overflow-hidden">
                    {recipe.image ? (
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
                        <ChefHat className="h-16 w-16 text-orange-300" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                        <Bookmark className="h-4 w-4 text-gray-700" />
                      </button>
                    </div>
                    {recipe.status === "approved" && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                          <CheckCircle className="h-3 w-3 inline mr-1" />
                          Verified
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                      {recipe.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {recipe.description || "No description"}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {recipe.cookingTime || "N/A"} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {recipe.likes || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <span>4.5</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Trending Now */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
              <p className="text-gray-600">What everyone is cooking this week</p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4 animate-pulse">
                  <div className="h-24 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {trendingRecipes.map((recipe, index) => (
                <div
                  key={recipe._id}
                  onClick={() => navigate(`/recipe/${recipe._id}`)}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 relative">
                      <div className="h-16 w-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        #{index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                        {recipe.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {recipe.description || "No description"}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {recipe.cookingTime || "N/A"} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {recipe.views || 0} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {recipe.likes || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Explore Cuisines */}
      <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Explore World Cuisines</h2>
            <p className="text-gray-600">Travel through food with recipes from around the globe</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {cuisines.map((cuisine) => (
              <div
                key={cuisine.name}
                onClick={() => navigate(`/recipe?cuisine=${cuisine.name.toLowerCase()}`)}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group text-center"
              >
                <div className="h-12 w-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:from-orange-100 group-hover:to-orange-200 transition-all">
                  {cuisine.icon}
                </div>
                <h3 className="font-semibold text-gray-900">{cuisine.name}</h3>
                <p className="text-xs text-gray-500 mt-1">50+ recipes</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Share Your Recipes?
            </h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Join our community of passionate home cooks. Share your favorite recipes, connect with other food lovers, and get feedback from the community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/add-recipe"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-orange-600 rounded-lg hover:bg-gray-100 font-semibold transition-colors"
              >
                <ChefHat className="h-5 w-5" />
                Share a Recipe
              </Link>
              <Link
                to="/recipe"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white/10 font-semibold transition-colors"
              >
                <BookOpen className="h-5 w-5" />
                Browse Recipes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}