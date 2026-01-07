import { 
  ChefHat, 
  Users, 
  Heart, 
  Target, 
  Award, 
  BookOpen,
  Globe,
  TrendingUp,
  Star,
  Coffee
} from "lucide-react";

export default function AboutUs() {
  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "Head Chef & Founder",
      bio: "15+ years culinary experience, MasterChef winner 2018",
      image: "👩‍🍳"
    },
    {
      name: "Michael Rodriguez",
      role: "Nutrition Expert",
      bio: "Registered Dietitian, specializes in healthy recipes",
      image: "🥗"
    },
    {
      name: "Emma Thompson",
      role: "Content Director",
      bio: "Food blogger with 500K+ followers, cookbook author",
      image: "📝"
    },
    {
      name: "David Park",
      role: "Tech Lead",
      bio: "Making cooking accessible through technology",
      image: "💻"
    }
  ];

  const stats = [
    { icon: <Users className="h-8 w-8" />, label: "Active Users", value: "50,000+" },
    { icon: <BookOpen className="h-8 w-8" />, label: "Recipes", value: "2,500+" },
    { icon: <Globe className="h-8 w-8" />, label: "Countries", value: "150+" },
    { icon: <Heart className="h-8 w-8" />, label: "Recipes Saved", value: "1M+" },
  ];

  const values = [
    {
      icon: <Target className="h-10 w-10" />,
      title: "Our Mission",
      description: "To make cooking accessible, enjoyable, and stress-free for everyone, from beginners to expert chefs."
    },
    {
      icon: <Star className="h-10 w-10" />,
      title: "Quality First",
      description: "Every recipe is tested, reviewed, and approved by our culinary experts before publishing."
    },
    {
      icon: <Heart className="h-10 w-10" />,
      title: "Community Driven",
      description: "Built by food lovers, for food lovers. Our community shares and improves recipes together."
    },
    {
      icon: <TrendingUp className="h-10 w-10" />,
      title: "Continuous Growth",
      description: "We constantly update and expand our collection with trending and classic recipes from around the world."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full mb-6">
              <ChefHat className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              About Cook<span className="text-orange-600">Book</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Where passion for food meets the joy of cooking. 
              We're building the world's most loved recipe community.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="text-orange-500 flex justify-center mb-3">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                CookBook started in 2020 with a simple idea: cooking should be fun, not frustrating. 
                Our founder, a home cook turned professional chef, noticed that many recipe websites 
                were either too complicated or lacked clear instructions.
              </p>
              <p>
                What began as a small blog with family recipes has grown into a global community 
                of food enthusiasts. Today, we're proud to be the trusted kitchen companion for 
                thousands of home cooks around the world.
              </p>
              <p>
                We believe that great food brings people together, and everyone deserves to enjoy 
                delicious, home-cooked meals regardless of their cooking experience.
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <Coffee className="h-12 w-12 text-orange-600" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Fun Fact</h3>
                <p className="text-gray-600">Our first recipe was "Perfect Scrambled Eggs"</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4">
                <p className="text-gray-700">
                  "CookBook helped me go from burning toast to making my own sourdough bread!"
                </p>
                <p className="text-sm text-gray-500 mt-2">— Maria, Home Cook</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="bg-white border-t border-b border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Believe In</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do at CookBook
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-full mb-4">
                  <div className="text-orange-600">
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Meet the Team */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Passionate foodies dedicated to bringing you the best cooking experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">{member.image}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
              <p className="text-orange-600 font-medium mb-3">{member.role}</p>
              <p className="text-gray-600 text-sm">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Award className="h-12 w-12 text-white mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Community</h2>
          <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">
            Share your recipes, discover new favorites, and connect with fellow food lovers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="inline-block px-8 py-3 bg-white text-orange-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start Cooking
            </a>
            <a
              href="/recipes"
              className="inline-block px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Browse Recipes
            </a>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-500">
          From our kitchen to yours — Happy Cooking! 🍳
        </p>
        <p className="text-gray-400 text-sm mt-2">
          © {new Date().getFullYear()} CookBook. All recipes are tested with love.
        </p>
      </div>
    </div>
  );
}