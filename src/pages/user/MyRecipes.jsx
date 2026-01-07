import { useEffect, useState } from "react";
import { getMyRecipes, deleteMyRecipe } from "../../api/recipeApi";
import RecipeCard from "../../components/RecipeCard";
import { useNavigate } from "react-router-dom";

export default function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();


  const fetchMyRecipes = async () => {
    const res = await getMyRecipes();
    setRecipes(res.data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this Recipe ?")) return;
    await deleteMyRecipe(id);
    fetchMyRecipes();
  };


  useEffect(() => {
    fetchMyRecipes();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">
        My Recipes
      </h1>

      {recipes.length === 0 && <p>No recipes yet</p>}

      <div className="grid md:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <div key={recipe._id}>
            <RecipeCard
              recipe={recipe}
              refresh={fetchMyRecipes}
              showUnsave={false}
              showStatus={true}
            />

            {/* EDIT / DELETE — ONLY IF PENDING */}
            {recipe.status === "pending" && (
              <div className="flex gap-4 mt-2">
                <button
                  className="text-blue-600 text-sm"
                  onClick={() => navigate(`/edit-recipe/${recipe._id}`)}
                >
                  ✏️ Edit
                </button>

              <button
                  className="text-red-600 text-sm"
                  onClick={() => handleDelete(recipe._id)}
                >
                  🗑️ Delete
                </button>
              </div>
            )}
            {recipe.status === "rejected" && (
              <button
                onClick={() => handleDelete(recipe._id)}
                className="text-red-600 flex items-center gap-1"
              >
                🗑 Delete
              </button>
            )}

          </div>
        ))}

      </div>
    </div>
  );
}
