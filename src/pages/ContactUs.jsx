import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle,
  Users,
  Globe,
  Shield,
  Coffee,
  ArrowRight,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  ChefHat,
  Sparkles
} from "lucide-react";
import toast from "react-hot-toast";

export default function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Message sent successfully! We'll get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
      
      // Reset submitted state after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Us",
      details: ["hello@cookbook.com", "support@cookbook.com"],
      description: "We respond within 24 hours"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Call Us",
      details: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
      description: "Mon-Fri, 9am-6pm EST"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Visit Us",
      details: ["123 Food Street", "New York, NY 10001"],
      description: "Come say hello!"
    }
  ];

  const faqs = [
    {
      question: "How do I submit a recipe?",
      answer: "Click on 'Add Recipe' in the navigation bar, fill in the details, and submit. Our team will review it within 48 hours."
    },
    {
      question: "Can I edit my submitted recipes?",
      answer: "Yes, you can edit pending recipes. Once approved, you cannot edit them to maintain quality consistency."
    },
    {
      question: "How long does recipe approval take?",
      answer: "Typically 24-48 hours. We review each recipe manually to ensure quality and accuracy."
    },
    {
      question: "Do you have a mobile app?",
      answer: "Yes! Our mobile app is available on both iOS and Android stores. Search for 'CookBook Recipes'."
    }
  ];

  const socialLinks = [
    { icon: <Instagram className="h-5 w-5" />, label: "Instagram", url: "#" },
    { icon: <Facebook className="h-5 w-5" />, label: "Facebook", url: "#" },
    { icon: <Twitter className="h-5 w-5" />, label: "Twitter", url: "#" },
    { icon: <Youtube className="h-5 w-5" />, label: "YouTube", url: "#" },
    { icon: <Linkedin className="h-5 w-5" />, label: "LinkedIn", url: "#" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-yellow-500 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 animate-float">
            <Coffee className="h-16 w-16 text-white/20" />
          </div>
          <div className="absolute bottom-20 right-10 animate-float animation-delay-1000">
            <ChefHat className="h-20 w-20 text-white/20" />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-4 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <MessageSquare className="h-8 w-8 text-white" />
              <Sparkles className="h-4 w-4 text-yellow-300 ml-1 animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Get in <span className="text-yellow-300">Touch</span>
            </h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              We're here to help! Whether you have questions, feedback, or just want to say hello, 
              we'd love to hear from you.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            {/* Contact Cards */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="h-6 w-6 text-orange-600" />
                Contact Information
              </h2>
              
              {contactInfo.map((info, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-100 rounded-xl">
                      <div className="text-orange-600">
                        {info.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                      <div className="space-y-1">
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-700">{detail}</p>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-3 flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {info.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Business Hours */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-6 w-6 text-orange-600" />
                <h3 className="text-xl font-semibold text-gray-900">Business Hours</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Monday - Friday</span>
                  <span className="font-semibold text-gray-900">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Saturday</span>
                  <span className="font-semibold text-gray-900">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Sunday</span>
                  <span className="font-semibold text-gray-900">Closed</span>
                </div>
              </div>
              <div className="mt-6 p-3 bg-white/50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Note:</span> Support response times may be longer on weekends.
                </p>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Follow Us</h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-orange-600 rounded-lg transition-colors group"
                  >
                    <div className="group-hover:scale-110 transition-transform">
                      {social.icon}
                    </div>
                    <span className="font-medium">{social.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Message Sent Successfully! 🎉
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Thank you for reaching out! Our team will review your message and get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Send us a Message
                    </h2>
                    <p className="text-gray-600">
                      Fill out the form below and we'll get back to you as soon as possible.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                      </label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white"
                      >
                        <option value="">Select a subject</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Recipe Submission">Recipe Submission</option>
                        <option value="Technical Support">Technical Support</option>
                        <option value="Business Partnership">Business Partnership</option>
                        <option value="Feedback">Feedback</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows="6"
                        placeholder="Tell us how we can help you..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
                        required
                      />
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span>Your information is secure and will never be shared</span>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* FAQ Section */}
            <div className="mt-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  Frequently Asked Questions
                </h2>
                <div className="flex items-center gap-2 text-orange-600">
                  <Globe className="h-5 w-5" />
                  <span className="font-medium">Quick Answers</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-orange-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <span className="text-orange-600 font-bold">{index + 1}</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {faq.question}
                        </h3>
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-12 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-100 rounded-2xl p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">24h</div>
                  <div className="text-sm text-gray-600">Avg Response Time</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">99%</div>
                  <div className="text-sm text-gray-600">Satisfaction Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">50K+</div>
                  <div className="text-sm text-gray-600">Happy Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">100+</div>
                  <div className="text-sm text-gray-600">Countries Served</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Stay Updated with Food Trends
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for weekly recipe inspirations, cooking tips, and exclusive content.
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-yellow-600 transition-all">
              Subscribe
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-4">
            No spam, unsubscribe anytime
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <ChefHat className="h-8 w-8 text-orange-600" />
            <span className="text-2xl font-bold text-gray-900">
              Cook<span className="text-orange-600">Book</span>
            </span>
          </div>
          <p className="text-gray-600 mb-2">
            Making cooking enjoyable and accessible for everyone
          </p>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} CookBook. All rights reserved.
          </p>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
        
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}