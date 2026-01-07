import { useEffect, useState, useContext } from "react";
import { getApprovedRecipes } from "../../api/recipeApi";
import RecipeCard from "../../components/RecipeCard";
import { AuthContext } from "../../context/AuthContext";

export default function AllRecipes() {
  const [recipes, setRecipes] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchRecipes = async () => {
    const res = await getApprovedRecipes();
    setRecipes(res.data);
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">
        All Recipes
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe._id}
            recipe={recipe}
            isLoggedIn={!!user}
            refresh={fetchRecipes}
            showUnsave={false}
          />
        ))}
      </div>
    </div>
  );
}
