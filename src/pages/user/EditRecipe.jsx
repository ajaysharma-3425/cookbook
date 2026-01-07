import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecipeById, updateMyRecipe } from "../../api/recipeApi";
import toast from "react-hot-toast";

export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    ingredients: "",
    steps: "",
  });

  useEffect(() => {
    fetchRecipe();
  }, []);

  const fetchRecipe = async () => {
    try {
      const res = await getRecipeById(id);
      setForm({
        title: res.data.title,
        description: res.data.description,
        ingredients: res.data.ingredients.join(", "),
        steps: res.data.steps.join(", "),
      });
    } catch (err) {
      toast.error("Cannot edit this recipe");
      navigate("/my-recipes");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateMyRecipe(id, {
        ...form,
        ingredients: form.ingredients.split(","),
        steps: form.steps.split(","),
      });

      toast.success("Recipe updated ✅");
      navigate("/my-recipes");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Recipe</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full border p-2"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2"
          required
        />

        <input
          name="ingredients"
          value={form.ingredients}
          onChange={handleChange}
          placeholder="Ingredients (comma separated)"
          className="w-full border p-2"
          required
        />

        <input
          name="steps"
          value={form.steps}
          onChange={handleChange}
          placeholder="Steps (comma separated)"
          className="w-full border p-2"
          required
        />

        <button className="bg-orange-600 text-white px-4 py-2 rounded">
          Update Recipe
        </button>
      </form>
    </div>
  );
}
