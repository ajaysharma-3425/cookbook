import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { getRecipeById, saveRecipe, unsaveRecipe, toggleLike } from "../../api/recipeApi";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import {
  ChefHat,
  Clock,
  Users,
  Calendar,
  Heart,
  Bookmark,
  Share2,
  Printer,
  ArrowLeft,
  ChefHat as ChefIcon,
  Thermometer,
  ChefHat as DifficultyIcon,
  BookOpen,
  ShoppingBag,
  Utensils,
  Clock as TimerIcon,
  Flame,
  ChefHat as ServingIcon
} from "lucide-react";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [liking, setLiking] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    setLoading(true);
    try {
      const res = await getRecipeById(id);
      setRecipe(res.data);
    } catch (error) {
      console.error("Error fetching recipe:", error);
      toast.error("Failed to load recipe");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (liking) return;

    try {
      setLiking(true);
      await toggleLike(recipe._id);
      setRecipe(prev => ({
        ...prev,
        likes: prev.likes.includes(user._id) 
          ? prev.likes.filter(id => id !== user._id)
          : [...prev.likes, user._id]
      }));
      toast.success(
        recipe.likes.includes(user._id) 
          ? "Recipe unliked" 
          : "Recipe liked!"
      );
    } catch (error) {
      toast.error("Failed to like recipe");
    } finally {
      setLiking(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (saving) return;

    try {
      setSaving(true);
      const isSaved = user.savedRecipes?.includes(recipe._id);
      
      if (isSaved) {
        await unsaveRecipe(recipe._id);
        toast.success("Recipe removed from saved");
      } else {
        await saveRecipe(recipe._id);
        toast.success("Recipe saved successfully!");
      }
      
      // Refresh user data or update UI as needed
    } catch (error) {
      toast.error("Failed to save recipe");
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: `Check out this delicious recipe: ${recipe.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Sharing cancelled', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isLiked = user && recipe?.likes?.includes(user._id);
  const isSaved = user && user.savedRecipes?.includes(recipe._id);

  const getDifficultyLevel = () => {
    const time = recipe?.cookingTime;
    if (!time) return "Easy";
    if (time <= 30) return "Easy";
    if (time <= 60) return "Medium";
    return "Advanced";
  };

  const getCategory = () => {
    const title = recipe?.title?.toLowerCase() || '';
    const description = recipe?.description?.toLowerCase() || '';
    
    if (title.includes('non-veg') || title.includes('meat') || title.includes('chicken') || 
        title.includes('fish') || title.includes('mutton') || title.includes('beef') ||
        description.includes('non-veg') || description.includes('meat') || 
        description.includes('chicken') || description.includes('fish')) {
      return { name: 'Non-Veg', color: 'bg-red-100 text-red-700' };
    }
    if (title.includes('dessert') || title.includes('sweet') || title.includes('ice cream') || 
        title.includes('cake') || title.includes('pastry')) {
      return { name: 'Dessert', color: 'bg-pink-100 text-pink-700' };
    }
    return { name: 'Vegetarian', color: 'bg-green-100 text-green-700' };
  };

  const category = getCategory();

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

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">Recipe not found</h3>
          <p className="text-gray-500 mt-2">The recipe you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Browse Recipes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Navigation */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recipe Image & Stats */}
          <div className="lg:col-span-2">
            {/* Recipe Image - Fixed Size */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 mb-8">
              {recipe.image ? (
                <div className="relative h-[400px] md:h-[500px] w-full">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }}
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      setImageLoaded(false);
                    }}
                  />
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ChefHat className="h-16 w-16 text-gray-400 animate-pulse" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-[400px] md:h-[500px] flex items-center justify-center">
                  <div className="text-center">
                    <ChefHat className="h-20 w-20 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No image available</p>
                  </div>
                </div>
              )}
              
              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${category.color}`}>
                  {category.name}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={handlePrint}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm"
                  title="Print Recipe"
                >
                  <Printer className="h-5 w-5 text-gray-700" />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm"
                  title="Share Recipe"
                >
                  <Share2 className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Recipe Title & Description */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {recipe.title}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${category.color}`}>
                    {category.name}
                  </span>
                </div>
              </div>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
                  {recipe.description}
                </p>
              </div>
            </div>

            {/* Recipe Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cooking Time</p>
                    <p className="font-semibold text-gray-900">{recipe.cookingTime || recipe.time} min</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Thermometer className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Difficulty</p>
                    <p className="font-semibold text-gray-900">{getDifficultyLevel()}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <ServingIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Servings</p>
                    <p className="font-semibold text-gray-900">4 people</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Flame className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Calories</p>
                    <p className="font-semibold text-gray-900">~350 kcal</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ingredients Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Ingredients</h2>
                <span className="text-gray-500 text-sm">
                  ({recipe.ingredients?.length || 0} items)
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recipe.ingredients?.map((ingredient, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="h-2 w-2 mt-2 rounded-full bg-orange-500 flex-shrink-0"></div>
                    <span className="text-gray-700">{ingredient}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Steps Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Utensils className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Cooking Instructions</h2>
                <span className="text-gray-500 text-sm">
                  ({recipe.steps?.length || 0} steps)
                </span>
              </div>
              
              <div className="space-y-6">
                {recipe.steps?.map((step, index) => (
                  <div key={index} className="flex gap-4 group">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-gray-700 leading-relaxed">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Author & Actions */}
          <div className="space-y-6">
            {/* Author Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Recipe by</h3>
                  <p className="text-gray-700">{recipe.createdBy?.name || "Unknown Chef"}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Posted on {new Date(recipe.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BookOpen className="h-4 w-4" />
                  <span>{recipe.likes?.length || 0} people liked this</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="space-y-3">
                <button
                  onClick={handleLike}
                  disabled={liking}
                  className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isLiked 
                      ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' 
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  } ${liking ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-600' : ''}`} />
                  <span className="font-medium">
                    {isLiked ? 'Liked' : 'Like Recipe'} ({recipe.likes?.length || 0})
                  </span>
                </button>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isSaved 
                      ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200' 
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-blue-600' : ''}`} />
                  <span className="font-medium">
                    {isSaved ? 'Saved' : 'Save Recipe'}
                  </span>
                </button>

                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all border border-orange-500"
                >
                  <Share2 className="h-5 w-5" />
                  <span className="font-medium">Share Recipe</span>
                </button>
              </div>
            </div>

            {/* Tips & Notes */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <ChefIcon className="h-5 w-5" />
                Chef's Tips
              </h3>
              <ul className="space-y-3 text-sm text-blue-700">
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 mt-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                  <span>Adjust spices according to your taste preference</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 mt-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                  <span>Let the dish rest for 5 minutes before serving for better flavor</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 mt-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                  <span>Use fresh ingredients for the best results</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 mt-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                  <span>Cook on medium heat for even cooking</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 mt-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                  <span>Taste and adjust seasoning before serving</span>
                </li>
              </ul>
            </div>

            {/* Nutritional Info */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-6">
              <h3 className="font-semibold text-green-800 mb-3">📊 Nutritional Info (per serving)</h3>
              <div className="space-y-2 text-sm text-green-700">
                <div className="flex justify-between">
                  <span>Calories:</span>
                  <span className="font-medium">~350 kcal</span>
                </div>
                <div className="flex justify-between">
                  <span>Protein:</span>
                  <span className="font-medium">15g</span>
                </div>
                <div className="flex justify-between">
                  <span>Carbs:</span>
                  <span className="font-medium">45g</span>
                </div>
                <div className="flex justify-between">
                  <span>Fat:</span>
                  <span className="font-medium">12g</span>
                </div>
                <div className="flex justify-between">
                  <span>Fiber:</span>
                  <span className="font-medium">5g</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}