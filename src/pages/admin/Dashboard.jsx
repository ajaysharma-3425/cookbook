import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  FileText, 
  Users, 
  UserPlus,
  AlertTriangle,
  Activity,
  ChefHat,
  TrendingUp
} from "lucide-react";

export default function AdminDashboard() {
  const [approvedCount, setApprovedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [creatorsCount, setCreatorsCount] = useState(0);
  const [activity, setActivity] = useState([]);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchBasicStats();
    fetchDashboardStats();
  }, []);

  const fetchBasicStats = async () => {
    try {
      const [approvedRes, pendingRes] = await Promise.all([
        api.get("/recipes"),
        api.get("/admin/recipes/pending"),
      ]);
      setApprovedCount(approvedRes.data.length);
      setPendingCount(pendingRes.data.length);
    } catch (error) {
      console.error("Basic stats error", error);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      const { recipes, users, activity } = res.data;
      setTotalRecipes(recipes.total);
      setRejectedCount(recipes.rejected);
      setTotalUsers(users.total);
      setCreatorsCount(users.creators);
      setActivity(activity || []);
    } catch (error) {
      console.warn("Dashboard stats failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your platform's performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <StatCard 
          title="Total Recipes" 
          value={totalRecipes} 
          icon={<FileText className="h-6 w-6" />}
          color="blue"
          trend="+12%"
        />
        <StatCard 
          title="Approved" 
          value={approvedCount} 
          icon={<CheckCircle className="h-6 w-6" />}
          color="green"
        />
        <StatCard 
          title="Pending" 
          value={pendingCount} 
          icon={<Clock className="h-6 w-6" />}
          color="orange"
        />
        <StatCard 
          title="Rejected" 
          value={rejectedCount} 
          icon={<XCircle className="h-6 w-6" />}
          color="red"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - User Stats & Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* User Statistics */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Statistics
              </h2>
              <ChefHat className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Users</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{totalUsers}</p>
                  </div>
                  <Users className="h-10 w-10 text-blue-400" />
                </div>
                <div className="mt-4 flex items-center text-sm text-blue-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>All registered users</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Recipe Creators</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{creatorsCount}</p>
                  </div>
                  <UserPlus className="h-10 w-10 text-purple-400" />
                </div>
                <div className="mt-4 flex items-center text-sm text-purple-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>Active content creators</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Approvals Alert */}
          <div className="bg-gradient-to-r from-orange-50 to-orange-50 border border-orange-200 rounded-xl p-5">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-start md:items-center gap-4 mb-4 md:mb-0">
                <div className="bg-orange-100 p-3 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-orange-800">
                    Action Required
                  </h3>
                  <p className="text-sm text-orange-600 mt-1">
                    <span className="font-bold">{pendingCount}</span> recipes are waiting for your review
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => navigate("/admin/pending")}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                Review Now
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </h2>
            <span className="text-xs font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
              Latest
            </span>
          </div>
          
          <div className="space-y-4">
            {activity.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No recent activity</p>
                <p className="text-sm text-gray-400 mt-1">Activity will appear here</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {activity.map((item, index) => (
                  <div
                    key={index}
                    className="border-l-2 border-blue-500 pl-4 py-3 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-gray-800">{item.title}</p>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{item.message}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(item.createdAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
            
            {activity.length > 0 && (
              <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                View All Activity
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Approval Rate</p>
              <p className="text-xl font-bold text-gray-800">
                {totalRecipes > 0 
                  ? `${Math.round((approvedCount / totalRecipes) * 100)}%` 
                  : '0%'}
              </p>
            </div>
            <div className="bg-green-50 p-2 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Ratio</p>
              <p className="text-xl font-bold text-gray-800">
                {totalRecipes > 0 
                  ? `${Math.round((pendingCount / totalRecipes) * 100)}%` 
                  : '0%'}
              </p>
            </div>
            <div className="bg-orange-50 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-orange-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Creator Percentage</p>
              <p className="text-xl font-bold text-gray-800">
                {totalUsers > 0 
                  ? `${Math.round((creatorsCount / totalUsers) * 100)}%` 
                  : '0%'}
              </p>
            </div>
            <div className="bg-purple-50 p-2 rounded-lg">
              <UserPlus className="h-5 w-5 text-purple-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced StatCard Component
const StatCard = ({ title, value, icon, color, trend }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color] || colorClasses.blue}`}>
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 mt-2">{value ?? 0}</p>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center text-xs text-gray-500">
          <span>Updated just now</span>
        </div>
      </div>
    </div>
  );
};  