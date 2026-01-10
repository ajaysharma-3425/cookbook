import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserByIdAdmin, updateUserAdmin } from "../../api/adminApi";
import {
  User,
  Shield,
  Lock,
  Unlock,
  Mail,
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  XCircle,
  Calendar,
  Eye,
  UserCheck,
  UserX
} from "lucide-react";
import toast from "react-hot-toast";

export default function EditUserAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    role: "user",
    isBlocked: false,
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userCreatedAt, setUserCreatedAt] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const { data } = await getUserByIdAdmin(id);

        console.log("User data received:", data); // Debug log
        
        setForm({
          name: data.name || "",
          role: data.role || "user",
          isBlocked: data.isBlocked ?? false,
        });
        
        setUserEmail(data.email || "");
        
        // FIX: Check for createdAt field
        if (data.createdAt) {
          setUserCreatedAt(data.createdAt);
        } else if (data.created_date) {
          setUserCreatedAt(data.created_date);
        } else if (data.dateJoined) {
          setUserCreatedAt(data.dateJoined);
        } else {
          // If no date found, use current date
          setUserCreatedAt(new Date().toISOString());
        }
        
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to load user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!form.name.trim()) {
      toast.error("Please enter a valid name");
      return;
    }

    setUpdating(true);
    try {
      await updateUserAdmin(id, form);
      toast.success("User updated successfully!");
      navigate("/admin/users");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(error.response?.data?.message || "Failed to update user");
    } finally {
      setUpdating(false);
    }
  };

  const roleOptions = [
    { value: "user", label: "Regular User", icon: <User className="h-4 w-4" />, color: "bg-blue-100 text-blue-800" },
    { value: "creator", label: "Content Creator", icon: <UserCheck className="h-4 w-4" />, color: "bg-green-100 text-green-800" },
    { value: "admin", label: "Administrator", icon: <Shield className="h-4 w-4" />, color: "bg-purple-100 text-purple-800" },
  ];

  const formatDate = (dateString) => {
    if (!dateString || dateString === "Invalid date") return "Date not available";
    
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Date format error";
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error("Error formatting date:", error, dateString);
      return "Invalid date format";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Back</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Edit User
                  </h1>
                  <p className="text-sm text-gray-600">Update user permissions and status</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">User Information</h2>
              <span className="text-sm text-gray-500">ID: {id?.substring(0, 8)}...</span>
            </div>
          </div>

          <form onSubmit={submitHandler} className="p-6 space-y-8">
            {/* User Info Preview */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="h-20 w-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {form.name?.charAt(0) || "U"}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{form.name}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          {userEmail}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          Joined {formatDate(userCreatedAt)}
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full font-medium ${form.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {form.isBlocked ? (
                        <div className="flex items-center gap-2">
                          <UserX className="h-4 w-4" />
                          Blocked
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4" />
                          Active
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <User className="h-5 w-5 text-purple-500" />
                Basic Information
              </h3>
              
              <div className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter user's full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    required
                  />
                </div>

                {/* Role Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    User Role
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {roleOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setForm({ ...form, role: option.value })}
                        className={`p-4 rounded-xl border transition-all flex items-center gap-3 ${
                          form.role === option.value
                            ? `${option.color} border-transparent`
                            : "bg-white border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${
                          form.role === option.value
                            ? option.color.replace('bg-', 'bg-').replace('text-', 'text-')
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {option.icon}
                        </div>
                        <div className="text-left">
                          <p className="font-medium">{option.label}</p>
                          <p className="text-xs text-gray-500">
                            {option.value === "user" && "Can view and save recipes"}
                            {option.value === "creator" && "Can create and edit recipes"}
                            {option.value === "admin" && "Full system access"}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Role Select (Alternative for mobile) */}
                  <div className="md:hidden mt-4">
                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      {roleOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Block Status */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Account Status
                  </label>
                  
                  <div className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    form.isBlocked
                      ? "bg-red-50 border-red-300"
                      : "bg-green-50 border-green-300"
                  }`}
                  onClick={() => setForm({ ...form, isBlocked: !form.isBlocked })}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          form.isBlocked
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}>
                          {form.isBlocked ? (
                            <Lock className="h-5 w-5" />
                          ) : (
                            <Unlock className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {form.isBlocked ? "Account is Blocked" : "Account is Active"}
                          </p>
                          <p className="text-sm">
                            {form.isBlocked 
                              ? "User cannot login or access their account"
                              : "User has full access to their account"
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors ${
                          form.isBlocked ? "bg-red-600" : "bg-green-600"
                        }`}>
                          <div className={`inline-block h-4 w-4 transform bg-white rounded-full transition-transform ${
                            form.isBlocked ? "translate-x-6" : "translate-x-1"
                          }`} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Info */}
                  <div className={`p-4 rounded-lg ${
                    form.isBlocked
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-green-50 text-green-700 border border-green-200"
                  }`}>
                    <div className="flex items-start gap-3">
                      {form.isBlocked ? (
                        <XCircle className="h-5 w-5 flex-shrink-0" />
                      ) : (
                        <CheckCircle className="h-5 w-5 flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-medium">
                          {form.isBlocked 
                            ? "Blocked Account Consequences"
                            : "Active Account Benefits"
                          }
                        </p>
                        <p className="text-sm mt-1">
                          {form.isBlocked 
                            ? "User cannot login, access recipes, or perform any actions. Their existing content remains visible."
                            : "User can login, browse recipes, save favorites, and create content based on their role."
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Note */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-purple-600 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-purple-800 mb-1">Admin Mode Active</h4>
                  <p className="text-sm text-purple-700">
                    You have full control over this user account. Changes will be applied immediately.
                    Use caution when modifying roles or blocking accounts.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={updating}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-sm"
              >
                {updating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Update User
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-purple-800 mb-3 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            User Management Guidelines
          </h3>
          <ul className="space-y-2 text-purple-700">
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">•</span>
              <span><strong>Regular Users:</strong> Can view, save, and like recipes only</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">•</span>
              <span><strong>Content Creators:</strong> Can create, edit, and manage their own recipes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">•</span>
              <span><strong>Administrators:</strong> Have full access to manage all content and users</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">•</span>
              <span><strong>Blocking Users:</strong> Immediately prevents login and access to account</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}