import { useState } from "react";
import { forgotPassword } from "../../api/authApi";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      toast.success("Reset link sent to email");
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  return (
    <form onSubmit={submitHandler} className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
      <input
        type="email"
        required
        placeholder="Enter email"
        className="border p-2 w-full mb-3"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="bg-orange-600 text-white px-4 py-2 w-full">
        Send Reset Link
      </button>
    </form>
  );
}
