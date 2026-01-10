import { useEffect, useState } from "react";
import { getMyProfile } from "../api/authApi";
import { getMyRecipes, getSavedRecipes } from "../api/recipeApi";
import { 
  User, 
  Mail, 
  Shield, 
  BookOpen, 
  ThumbsUp, 
  Bookmark, 
  CheckCircle, 
  Clock, 
  XCircle,
  TrendingUp,
  Award,
  ChefHat,
  Settings,
  Edit3,
  Bell,
  UserCheck,
  Heart,
  Clock as ClockIcon,
  Eye,
  Plus,
  Search,
  X,
  Grid3x3,
  List,
  Salad,
  Drumstick,
  Cake,
  RefreshCw
} from "lucide-react";

export default function Profile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [myRecipes, setMyRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [recipesLoading, setRecipesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [categoryFilter, setCategoryFilter] = useState("all");
  

  useEffect(() => {
    fetchProfile();
  }, []);

  // Fetch recipes when tab changes to "recipes" or "saved"
  useEffect(() => {
    if (activeTab === "recipes") {
      fetchMyRecipes();
    } else if (activeTab === "saved") {
      fetchSavedRecipes();
    }
  }, [activeTab]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await getMyProfile();
      setData(res.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRecipes = async () => {
    setRecipesLoading(true);
    try {
      const res = await getMyRecipes();
      console.log("My Recipes API Response:", res);
      
      // Handle both response formats
      let recipesData = [];
      if (res && res.data) {
        recipesData = res.data; // API returns { data: [...] }
      } else if (Array.isArray(res)) {
        recipesData = res; // API returns array directly
      } else if (res && res.recipes) {
        recipesData = res.recipes; // API returns { recipes: [...] }
      }
      
      console.log("Processed My Recipes:", recipesData);
      setMyRecipes(Array.isArray(recipesData) ? recipesData : []);
    } catch (error) {
      console.error("Error fetching my recipes:", error);
      setMyRecipes([]);
    } finally {
      setRecipesLoading(false);
    }
  };

  const fetchSavedRecipes = async () => {
    setRecipesLoading(true);
    try {
      const res = await getSavedRecipes();
      console.log("Saved Recipes API Response:", res);
      
      // Handle both response formats
      let recipesData = [];
      if (res && res.data) {
        recipesData = res.data; // API returns { data: [...] }
      } else if (Array.isArray(res)) {
        recipesData = res; // API returns array directly
      } else if (res && res.savedRecipes) {
        recipesData = res.savedRecipes; // API returns { savedRecipes: [...] }
      }
      
      console.log("Processed Saved Recipes:", recipesData);
      setSavedRecipes(Array.isArray(recipesData) ? recipesData : []);
    } catch (error) {
      console.error("Error fetching saved recipes:", error);
      setSavedRecipes([]);
    } finally {
      setRecipesLoading(false);
    }
  };

  const handleCreateRecipe = () => {
    window.location.href = "/add-recipe";
  };

  const handleBrowseRecipes = () => {
    window.location.href = "/recipes";
  };

  const handleRecipeClick = (recipeId) => {
    window.location.href = `/recipe/${recipeId}`;
  };

  // Helper function to get recipe category (same as SavedRecipes component)
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

  // Filter recipes based on search query and category
  const filteredMyRecipes = myRecipes.filter(recipe =>
    (recipe.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.description?.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (categoryFilter === "all" || getRecipeCategory(recipe) === categoryFilter)
  );

  const filteredSavedRecipes = savedRecipes.filter(recipe =>
    (recipe.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.author?.name?.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (categoryFilter === "all" || getRecipeCategory(recipe) === categoryFilter)
  );

  const categories = [
    { id: "all", name: "All", icon: <Bookmark className="h-4 w-4" /> },
    { id: "veg", name: "Vegetarian", icon: <Salad className="h-4 w-4" /> },
    { id: "nonveg", name: "Non-Veg", icon: <Drumstick className="h-4 w-4" /> },
    { id: "dessert", name: "Desserts", icon: <Cake className="h-4 w-4" /> },
  ];

  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">Approved</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">Pending</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">Rejected</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full font-medium">Draft</span>;
    }
  };

  const getCategoryBadge = (category) => {
    switch(category) {
      case 'veg':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Vegetarian</span>;
      case 'nonveg':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Non-Veg</span>;
      case 'dessert':
        return <span className="px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full">Dessert</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Other</span>;
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">Profile not found</h3>
          <p className="text-gray-500 mt-2">Unable to load profile data</p>
        </div>
      </div>
    );
  }

  const { user, stats } = data;

  const tabs = [
    { id: "overview", label: "Overview", icon: <User className="h-4 w-4" /> },
    { id: "recipes", label: "My Recipes", icon: <BookOpen className="h-4 w-4" /> },
    { id: "saved", label: "Saved", icon: <Bookmark className="h-4 w-4" /> },
    { id: "activity", label: "Activity", icon: <Bell className="h-4 w-4" /> },
    { id: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
  ];

  const approvalRate = stats?.totalRecipes > 0 
    ? Math.round((stats.approved / stats.totalRecipes) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-20 w-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                  {user.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt={user.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-10 w-10 text-white" />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <UserCheck className="h-3 w-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{user.name}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full">
                    <Shield className="h-3 w-3" />
                    <span className="text-sm font-medium capitalize">{user.role}</span>
                  </div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => window.location.href = "/profile/edit"} 
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Navigation</h3>
              </div>
              <nav className="space-y-1 p-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSearchQuery("");
                      setCategoryFilter("all");
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-orange-50 text-orange-600 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-600">Approval Rate</span>
                  </div>
                  <span className="font-bold text-gray-900">{approvalRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-600">Active Days</span>
                  </div>
                  <span className="font-bold text-gray-900">{stats?.activeDays || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <BookOpen className="h-4 w-4 text-orange-600" />
                    </div>
                    <span className="text-sm text-gray-600">My Recipes</span>
                  </div>
                  <span className="font-bold text-gray-900">{stats?.totalRecipes || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Bookmark className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-sm text-gray-600">Saved Recipes</span>
                  </div>
                  <span className="font-bold text-gray-900">{stats?.savedCount || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Welcome Card */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <ChefHat className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-blue-800 mb-2">
                        Welcome back, {user.name?.split(' ')[0]}! 👋
                      </h3>
                      <p className="text-blue-600">
                        You've been cooking up amazing recipes. Keep sharing your culinary creations!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <StatCard
                    icon={<BookOpen className="h-6 w-6" />}
                    label="Total Recipes"
                    value={stats?.totalRecipes || 0}
                    color="blue"
                    description="Your culinary creations"
                  />
                  <StatCard
                    icon={<CheckCircle className="h-6 w-6" />}
                    label="Approved"
                    value={stats?.approved || 0}
                    color="green"
                    description="Published recipes"
                  />
                  <StatCard
                    icon={<Clock className="h-6 w-6" />}
                    label="Pending"
                    value={stats?.pending || 0}
                    color="orange"
                    description="Awaiting review"
                  />
                  <StatCard
                    icon={<XCircle className="h-6 w-6" />}
                    label="Rejected"
                    value={stats?.rejected || 0}
                    color="red"
                    description="Need adjustments"
                  />
                  <StatCard
                    icon={<ThumbsUp className="h-6 w-6" />}
                    label="Total Likes"
                    value={stats?.totalLikes || 0}
                    color="purple"
                    description="From community"
                  />
                  <StatCard
                    icon={<Bookmark className="h-6 w-6" />}
                    label="Saved Recipes"
                    value={stats?.savedCount || 0}
                    color="indigo"
                    description="Your favorites"
                  />
                </div>

                {/* Performance Metrics */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Performance Overview
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Recipe Engagement</span>
                        <span className="font-bold text-gray-900">
                          {stats?.engagement || "High"}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-3/4"></div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Community Rating</span>
                        <span className="font-bold text-gray-900">{stats?.rating || "4.8"}/5</span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 w-4/5"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {stats?.recentActivity?.length > 0 ? (
                      stats.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{activity.type}</p>
                            <p className="text-xs text-gray-500">{activity.description}</p>
                          </div>
                          <span className="text-xs text-gray-400 ml-auto">{activity.time}</span>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Bell className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">No recent activity</p>
                          <p className="text-xs text-gray-500">Start creating recipes to see activity here</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* My Recipes Tab Content */}
            {activeTab === "recipes" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">My Recipes</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        All recipes you've created ({myRecipes.length})
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search recipes..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                          </button>
                        )}
                      </div>
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
                      <button 
                        onClick={handleCreateRecipe}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Create New
                      </button>
                    </div>
                  </div>

                  {/* Category Filters */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setCategoryFilter(category.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                          categoryFilter === category.id
                            ? "bg-orange-500 text-white"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {category.icon}
                        {category.name}
                      </button>
                    ))}
                    {(searchQuery || categoryFilter !== "all") && (
                      <button
                        onClick={clearFilters}
                        className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>

                  {recipesLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading recipes...</p>
                      </div>
                    </div>
                  ) : filteredMyRecipes.length > 0 ? (
                    <div className={viewMode === "grid" 
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                    }>
                      {filteredMyRecipes.map((recipe) => (
                        viewMode === "grid" ? (
                          <div 
                            key={recipe._id || recipe.id} 
                            onClick={() => handleRecipeClick(recipe._id || recipe.id)}
                            className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                          >
                            <div className="h-48 bg-gray-100 relative">
                              {recipe.image ? (
                                <img 
                                  src={recipe.image} 
                                  alt={recipe.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
                                  <ChefHat className="h-12 w-12 text-orange-300" />
                                </div>
                              )}
                              <div className="absolute top-3 right-3">
                                {getStatusBadge(recipe.status)}
                              </div>
                              <div className="absolute top-3 left-3">
                                {getCategoryBadge(getRecipeCategory(recipe))}
                              </div>
                            </div>
                            <div className="p-4">
                              <h4 className="font-semibold text-gray-800 mb-2 line-clamp-1">
                                {recipe.title}
                              </h4>
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {recipe.description || "No description provided"}
                              </p>
                              <div className="flex items-center justify-between text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                  <ClockIcon className="h-3 w-3" />
                                  <span>{recipe.cookingTime || recipe.cookTime || recipe.totalTime || "N/A"} min</span>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-1">
                                    <Heart className="h-3 w-3" />
                                    <span>{recipe.likes || recipe.likeCount || 0}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    <span>{recipe.views || 0}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div 
                            key={recipe._id || recipe.id} 
                            onClick={() => handleRecipeClick(recipe._id || recipe.id)}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                          >
                            <div className="flex flex-col md:flex-row md:items-center gap-6">
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
                              <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                                  <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                      {recipe.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm line-clamp-2">
                                      {recipe.description}
                                    </p>
                                    <div className="flex gap-2 mt-2">
                                      {getStatusBadge(recipe.status)}
                                      {getCategoryBadge(getRecipeCategory(recipe))}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                      {recipe.cookingTime || recipe.cookTime || recipe.totalTime || "N/A"} min
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-500">
                                      ❤️ {recipe.likes || recipe.likeCount || 0}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      👁️ {recipe.views || 0}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-gray-700 mb-2">
                        {searchQuery || categoryFilter !== "all" ? "No matching recipes" : "No recipes yet"}
                      </h4>
                      <p className="text-gray-600 mb-6">
                        {searchQuery || categoryFilter !== "all" 
                          ? "Try a different search term or clear filters" 
                          : "Create your first recipe and share it with the community!"
                        }
                      </p>
                      <button 
                        onClick={handleCreateRecipe}
                        className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        Create Your First Recipe
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Saved Recipes Tab Content */}
            {activeTab === "saved" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Saved Recipes</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Recipes you've bookmarked ({savedRecipes.length})
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search saved recipes..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                          </button>
                        )}
                      </div>
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
                      <button 
                        onClick={fetchSavedRecipes}
                        disabled={recipesLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        <RefreshCw className={`h-4 w-4 ${recipesLoading ? 'animate-spin' : ''}`} />
                        Refresh
                      </button>
                    </div>
                  </div>

                  {/* Category Filters */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setCategoryFilter(category.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                          categoryFilter === category.id
                            ? "bg-orange-500 text-white"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {category.icon}
                        {category.name}
                      </button>
                    ))}
                    {(searchQuery || categoryFilter !== "all") && (
                      <button
                        onClick={clearFilters}
                        className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>

                  {recipesLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading saved recipes...</p>
                      </div>
                    </div>
                  ) : filteredSavedRecipes.length > 0 ? (
                    <div className={viewMode === "grid" 
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                    }>
                      {filteredSavedRecipes.map((recipe) => (
                        viewMode === "grid" ? (
                          <div 
                            key={recipe._id || recipe.id} 
                            onClick={() => handleRecipeClick(recipe._id || recipe.id)}
                            className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                          >
                            <div className="h-48 bg-gray-100 relative">
                              {recipe.image ? (
                                <img 
                                  src={recipe.image} 
                                  alt={recipe.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                                  <ChefHat className="h-12 w-12 text-blue-300" />
                                </div>
                              )}
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Handle unsave functionality
                                  console.log("Unsave recipe", recipe._id || recipe.id);
                                }}
                                className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"
                              >
                                <Bookmark className="h-4 w-4 text-orange-500 fill-orange-500" />
                              </button>
                              <div className="absolute top-3 left-3">
                                {getCategoryBadge(getRecipeCategory(recipe))}
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="flex items-start gap-3 mb-3">
                                <div className="h-8 w-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                  {recipe.author?.name?.charAt(0) || recipe.authorName?.charAt(0) || recipe.createdBy?.name?.charAt(0) || "U"}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-800 mb-1 line-clamp-1">
                                    {recipe.title}
                                  </h4>
                                  <p className="text-xs text-gray-500">
                                    By {recipe.author?.name || recipe.authorName || recipe.createdBy?.name || "Unknown"}
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {recipe.description || "No description provided"}
                              </p>
                              <div className="flex items-center justify-between text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                  <ClockIcon className="h-3 w-3" />
                                  <span>{recipe.cookingTime || recipe.cookTime || recipe.totalTime || "N/A"} min</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Heart className="h-3 w-3" />
                                  <span>{recipe.likes || recipe.likeCount || 0}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div 
                            key={recipe._id || recipe.id} 
                            onClick={() => handleRecipeClick(recipe._id || recipe.id)}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                          >
                            <div className="flex flex-col md:flex-row md:items-center gap-6">
                              <div className="md:w-48 md:h-32 flex-shrink-0">
                                {recipe.image ? (
                                  <img
                                    src={recipe.image}
                                    alt={recipe.title}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                                    <ChefHat className="h-12 w-12 text-blue-300" />
                                  </div>
                                )}
                              </div>
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
                                      {getCategoryBadge(getRecipeCategory(recipe))}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                      {recipe.cookingTime || recipe.cookTime || recipe.totalTime || "N/A"} min
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-500">
                                      By {recipe.author?.name || recipe.authorName || recipe.createdBy?.name || "Unknown"}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      ❤️ {recipe.likes || recipe.likeCount || 0}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Bookmark className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-gray-700 mb-2">
                        {searchQuery || categoryFilter !== "all" ? "No matching saved recipes" : "No saved recipes"}
                      </h4>
                      <p className="text-gray-600 mb-6">
                        {searchQuery || categoryFilter !== "all" 
                          ? "Try a different search term or clear filters" 
                          : "Save recipes you love to find them easily later!"
                        }
                      </p>
                      <button 
                        onClick={handleBrowseRecipes}
                        className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                      >
                        Browse Recipes
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Activity and Settings Tabs Placeholder */}
            {(activeTab === "activity" || activeTab === "settings") && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {tabs.find(t => t.id === activeTab)?.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {tabs.find(t => t.id === activeTab)?.label}
                </h3>
                <p className="text-gray-600">
                  This section is under development. Check back soon!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-500">Member since</p>
              <p className="font-medium text-gray-900">
                {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long'
                })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-orange-500" />
              <span className="text-sm text-gray-600">Active Contributor</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced StatCard Component
const StatCard = ({ icon, label, value, color, description }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    orange: "bg-orange-100 text-orange-600",
    red: "bg-red-100 text-red-600",
    purple: "bg-purple-100 text-purple-600",
    indigo: "bg-indigo-100 text-indigo-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      
      <div>
        <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
};