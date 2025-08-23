import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight, Eye, Heart, Share2 } from "lucide-react";
import { Link } from "react-router-dom";

const BlogsSection = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Understanding AI-Powered Skin Analysis: A Complete Guide",
      excerpt: "Discover how artificial intelligence is revolutionizing dermatology and providing accurate skin condition assessments in seconds.",
      author: "Dr. Sarah Chen",
      authorRole: "Dermatologist & AI Researcher",
      date: "2024-01-15",
      readTime: "8 min read",
      category: "AI Technology",
      tags: ["AI", "Dermatology", "Technology"],
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
      views: 1247,
      likes: 89,
      featured: true
    },
    {
      id: 2,
      title: "Top 10 Skincare Myths Debunked by Dermatologists",
      excerpt: "Separate fact from fiction with evidence-based insights from leading dermatologists about common skincare misconceptions.",
      author: "Dr. Michael Rodriguez",
      authorRole: "Board-Certified Dermatologist",
      date: "2024-01-12",
      readTime: "6 min read",
      category: "Skincare Tips",
      tags: ["Skincare", "Myths", "Education"],
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=250&fit=crop",
      views: 892,
      likes: 67,
      featured: false
    },

    {
      id: 4,
      title: "Seasonal Skincare: Adapting Your Routine Throughout the Year",
      excerpt: "Learn how to adjust your skincare routine based on seasonal changes and environmental factors for optimal skin health.",
      author: "Dr. Lisa Park",
      authorRole: "Cosmetic Dermatologist",
      date: "2024-01-08",
      readTime: "5 min read",
      category: "Seasonal Care",
      tags: ["Seasonal", "Skincare", "Routine"],
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=250&fit=crop",
      views: 634,
      likes: 43,
      featured: false
    },
    {
      id: 5,
      title: "Understanding Acne: Causes, Types, and AI-Powered Solutions",
      excerpt: "A comprehensive guide to different types of acne, their causes, and how AI technology is improving treatment recommendations.",
      author: "Dr. James Thompson",
      authorRole: "Acne Specialist",
      date: "2024-01-05",
      readTime: "9 min read",
      category: "Acne Treatment",
      tags: ["Acne", "Treatment", "AI"],
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
      views: 1123,
      likes: 78,
      featured: false
    },
    {
      id: 6,
      title: "The Science Behind Skin Aging and Prevention Strategies",
      excerpt: "Dive into the biological processes of skin aging and discover evidence-based prevention strategies backed by research.",
      author: "Dr. Amanda Foster",
      authorRole: "Anti-Aging Specialist",
      date: "2024-01-03",
      readTime: "10 min read",
      category: "Anti-Aging",
      tags: ["Aging", "Prevention", "Science"],
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=250&fit=crop",
      views: 987,
      likes: 72,
      featured: false
    }
  ];

  const categories = ["All", "AI Technology", "Skincare Tips", "Telemedicine", "Seasonal Care", "Acne Treatment", "Anti-Aging"];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-200 rounded-full text-purple-700 font-medium mb-6">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            Latest Insights
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Expert Knowledge &
            <span className="block bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              Industry Insights
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Stay updated with the latest developments in dermatology, AI technology, and skincare science from leading experts in the field.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                index === 0
                                  ? "bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-purple-50 border border-gray-200 hover:border-purple-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Blog Post */}
        <div className="mb-16">
          {blogPosts.filter(post => post.featured).map(post => (
            <div key={post.id} className="relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-violet-500 text-white text-sm font-medium rounded-full">
                  Featured
                </span>
                  </div>
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center bg-white">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                  {post.category}
                </span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center text-white font-bold">
                        {post.author}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{post.author}</p>
                        <p className="text-sm text-gray-500">{post.authorRole}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {post.views.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {post.likes}
                      </div>
                    </div>
                    <Link to={`/blog/${post.id}`}>
                      <Button className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white border-0">
                        Read Full Article
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.filter(post => !post.featured).map(post => (
            <article key={post.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-sm font-medium rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {post.readTime}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-purple-600 transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center gap-2 mb-4">
                  {post.tags.slice(0, 2).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full border border-purple-200">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {post.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm text-gray-600 font-medium">{post.author}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button className="text-gray-400 hover:text-purple-500 transition-colors">
                      <Heart className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-purple-500 transition-colors">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <Link to={`/blog/${post.id}`} className="block">
                                      <Button variant="outline" className="w-full border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300">
                      Read Full Article
                      <ArrowRight className="h-4 ml-2" />
                    </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogsSection;
