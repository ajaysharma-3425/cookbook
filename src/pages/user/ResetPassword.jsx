import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { resetPassword } from "../../api/authApi";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(token, password);
      toast.success("Password updated");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  return (
    <form onSubmit={submitHandler} className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>
      <input
        type="password"
        required
        placeholder="New password"
        className="border p-2 w-full mb-3"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="bg-green-600 text-white px-4 py-2 w-full">
        Update Password
      </button>
    </form>
  );
}
