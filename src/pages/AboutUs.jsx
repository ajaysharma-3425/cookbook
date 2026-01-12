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
  Coffee,
  Sparkles,
  CookingPot,
  Salad,
  Cake,
  Timer,
  Users as Community,
  CheckCircle,
  ArrowRight,
  Smile
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function AboutUs() {
  const [animatedStats, setAnimatedStats] = useState({
    users: 0,
    recipes: 0,
    countries: 0,
    saved: 0
  });
  const statsRef = useRef();

  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "Head Chef & Founder",
      bio: "15+ years culinary experience, MasterChef winner 2018",
      image: "👩‍🍳",
      color: "from-orange-100 to-orange-200"
    },
    {
      name: "Michael Rodriguez",
      role: "Nutrition Expert",
      bio: "Registered Dietitian, specializes in healthy recipes",
      image: "🥗",
      color: "from-green-100 to-green-200"
    },
    {
      name: "Emma Thompson",
      role: "Content Director",
      bio: "Food blogger with 500K+ followers, cookbook author",
      image: "📝",
      color: "from-blue-100 to-blue-200"
    },
    {
      name: "David Park",
      role: "Tech Lead",
      bio: "Making cooking accessible through technology",
      image: "💻",
      color: "from-purple-100 to-purple-200"
    }
  ];

  const stats = [
    { icon: <Users className="h-8 w-8" />, label: "Active Users", value: "50,000+", key: "users" },
    { icon: <BookOpen className="h-8 w-8" />, label: "Recipes", value: "2,500+", key: "recipes" },
    { icon: <Globe className="h-8 w-8" />, label: "Countries", value: "150+", key: "countries" },
    { icon: <Heart className="h-8 w-8" />, label: "Recipes Saved", value: "1M+", key: "saved" },
  ];

  const values = [
    {
      icon: <Target className="h-10 w-10" />,
      title: "Our Mission",
      description: "To make cooking accessible, enjoyable, and stress-free for everyone, from beginners to expert chefs.",
      color: "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
    },
    {
      icon: <Star className="h-10 w-10" />,
      title: "Quality First",
      description: "Every recipe is tested, reviewed, and approved by our culinary experts before publishing.",
      color: "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200"
    },
    {
      icon: <Heart className="h-10 w-10" />,
      title: "Community Driven",
      description: "Built by food lovers, for food lovers. Our community shares and improves recipes together.",
      color: "bg-gradient-to-br from-red-50 to-red-100 border-red-200"
    },
    {
      icon: <TrendingUp className="h-10 w-10" />,
      title: "Continuous Growth",
      description: "We constantly update and expand our collection with trending and classic recipes from around the world.",
      color: "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
    }
  ];

  // Animate stats counter
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Start counting animation
          const interval = setInterval(() => {
            setAnimatedStats(prev => ({
              users: Math.min(prev.users + 500, 50000),
              recipes: Math.min(prev.recipes + 50, 2500),
              countries: Math.min(prev.countries + 3, 150),
              saved: Math.min(prev.saved + 10000, 1000000)
            }));
          }, 20);

          setTimeout(() => clearInterval(interval), 2000);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section with Parallax */}
      <div className="relative bg-gradient-to-br from-orange-50 via-orange-100 to-yellow-50 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 animate-float">
            <Salad className="h-16 w-16 text-orange-300 opacity-30" />
          </div>
          <div className="absolute top-40 right-1/4 animate-float animation-delay-1000">
            <CookingPot className="h-20 w-20 text-yellow-300 opacity-30" />
          </div>
          <div className="absolute bottom-20 left-1/3 animate-float animation-delay-2000">
            <Cake className="h-24 w-24 text-pink-300 opacity-30" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full mb-8 shadow-lg hover:scale-105 transition-transform duration-300">
              <ChefHat className="h-16 w-16 text-white animate-bounce-slow" />
              <Sparkles className="h-8 w-8 text-yellow-300 absolute -top-2 -right-2 animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 animate-fade-in-up">
              About <span className="text-orange-600">Cook</span><span className="text-yellow-600">Book</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-8 animate-fade-in-up animation-delay-300">
              Where passion for food meets the joy of cooking.
              <span className="block mt-2 text-orange-600 font-semibold animate-pulse">
                Building the world's most loved recipe community.
              </span>
            </p>
            <div className="animate-fade-in-up animation-delay-500">
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
                <Smile className="h-6 w-6 text-orange-500" />
                <span className="text-gray-700 font-medium">Made with ❤️ for food lovers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section with Counter Animation */}
      <div ref={statsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 lg:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-center shadow-lg sm:shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform"
            >
              <div className="text-orange-500 flex justify-center mb-3 sm:mb-4">
                {stat.icon}
              </div>
              <div className={`
          font-bold text-gray-900 mb-2 font-mono 
          ${animatedStats[stat.key] > 9999 ? 'text-lg sm:text-xl md:text-2xl' :
                  animatedStats[stat.key] > 999 ? 'text-xl sm:text-2xl md:text-3xl' :
                    'text-2xl sm:text-3xl md:text-4xl'}
        `}>
                {animatedStats[stat.key].toLocaleString()}+
              </div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600 font-medium truncate px-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Our Story with Floating Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in-left">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Our <span className="text-orange-600">Journey</span>
            </h2>
            <div className="space-y-6 text-gray-700 text-lg">
              <p className="leading-relaxed">
                CookBook was born in 2020 from a simple realization: cooking should bring joy, not frustration.
                Our founder, a home cook turned professional chef, saw that most recipe sites were either overly complex or lacked clear guidance.
              </p>
              <p className="leading-relaxed">
                What started as a humble blog sharing family recipes has blossomed into a global community of passionate food enthusiasts.
                Today, we're honored to be the trusted kitchen companion for thousands of home cooks worldwide.
              </p>
              <p className="leading-relaxed text-orange-700 font-semibold">
                We believe great food has the power to connect people, and everyone deserves to experience the magic of home-cooked meals.
              </p>
            </div>
          </div>

          <div className="relative animate-fade-in-right">
            <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-3xl p-8 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-gradient-to-br from-orange-500 to-yellow-500 p-4 rounded-2xl">
                  <Coffee className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Fun Fact</h3>
                  <p className="text-gray-700">Our very first recipe was "Perfect Scrambled Eggs" 🍳</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 transform hover:scale-[1.02] transition-transform duration-300">
                  <p className="text-gray-800 text-lg italic">
                    "CookBook transformed me from someone who burned toast to a confident sourdough baker!"
                  </p>
                  <div className="flex items-center gap-3 mt-4">
                    <div className="h-10 w-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">M</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Maria</p>
                      <p className="text-sm text-gray-600">Home Cook & Food Enthusiast</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <Timer className="h-5 w-5 text-orange-500" />
                  <span>Average time saved per recipe: 15 minutes</span>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 h-20 w-20 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full blur-xl opacity-30"></div>
            <div className="absolute -bottom-4 -left-4 h-16 w-16 bg-gradient-to-br from-pink-400 to-red-400 rounded-full blur-xl opacity-30"></div>
          </div>
        </div>
      </div>

      {/* Our Values - Animated Grid */}
      <div className="bg-gradient-to-b from-white to-gray-50 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fade-in-up">
              Our <span className="text-orange-600">Core Values</span>
            </h2>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto">
              The principles that guide every recipe, every feature, and every decision at CookBook
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className={`${value.color} border rounded-3xl p-8 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 transform animate-fade-in-up`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="inline-flex items-center justify-center p-4 bg-white rounded-2xl mb-6 shadow-lg">
                  <div className="text-orange-600">
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-700 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Meet the Team - Interactive Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Meet Our <span className="text-orange-600">Dream Team</span>
          </h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            Passionate foodies and tech enthusiasts dedicated to revolutionizing your cooking experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4"
            >
              {/* Background Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${member.color} rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>

              <div className="relative z-10">
                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-500">
                  {member.image}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-orange-600 font-semibold mb-4">{member.role}</p>
                <p className="text-gray-700 mb-6">{member.bio}</p>

                <div className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-orange-600 transition-colors">
                  <Community className="h-4 w-4" />
                  <span>Active contributor</span>
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-orange-400 rounded-3xl transition-all duration-500"></div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section with Particles */}
      <div className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-yellow-500 overflow-hidden">
        {/* Animated Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 10}s`
              }}
            ></div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center relative z-10">
          <Award className="h-16 w-16 text-white mx-auto mb-8 animate-bounce-slow" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Culinary Journey?
          </h2>
          <p className="text-orange-100 text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of food enthusiasts who are already creating, sharing, and enjoying amazing recipes
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="/signup"
              className="group inline-flex items-center justify-center gap-3 px-10 py-4 bg-white text-orange-600 font-bold rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 transform"
            >
              <Sparkles className="h-5 w-5" />
              Start Cooking Free
              <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
            </a>
            <a
              href="/recipes"
              className="inline-flex items-center justify-center gap-3 px-10 py-4 border-2 border-white/50 text-white font-bold rounded-2xl hover:bg-white/10 hover:border-white transition-all duration-300 backdrop-blur-sm"
            >
              <BookOpen className="h-5 w-5" />
              Explore Recipes
            </a>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-6 text-white/80">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-300" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-300" />
              <span>Free forever plan</span>
            </div>
            <div className="flex items-center gap-3 md:col-span-1">
              <CheckCircle className="h-5 w-5 text-green-300" />
              <span>Join 50,000+ food lovers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Animation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="animate-pulse-slow">
          <p className="text-2xl text-gray-700 mb-4">
            From our kitchen to yours —
            <span className="text-orange-600 font-bold"> Happy Cooking!</span> 🍳
          </p>
        </div>
        <p className="text-gray-500 mt-6">
          © {new Date().getFullYear()} CookBook. All recipes are tested with love and care.
        </p>
        <div className="mt-8 flex justify-center gap-6">
          <div className="h-1 w-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full animate-pulse"></div>
          <div className="h-1 w-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full animate-pulse animation-delay-200"></div>
          <div className="h-1 w-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full animate-pulse animation-delay-400"></div>
        </div>
      </div>

      {/* Add custom animations to tailwind.config.js */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulseSlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out;
        }
        
        .animate-fade-in-left {
          animation: fadeInLeft 1s ease-out;
        }
        
        .animate-fade-in-right {
          animation: fadeInRight 1s ease-out;
        }
        
        .animate-bounce-slow {
          animation: bounceSlow 3s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulseSlow 3s ease-in-out infinite;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        
        .animation-delay-500 {
          animation-delay: 500ms;
        }
        
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
        
        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
        
        .animation-delay-3000 {
          animation-delay: 3000ms;
        }
        
        .animation-delay-4000 {
          animation-delay: 4000ms;
        }
      `}</style>
    </div>
  );
}