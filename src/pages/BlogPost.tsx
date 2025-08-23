import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, User, Eye, Heart, Share2, Tag, ArrowRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const BlogPost = () => {
  const { id } = useParams();
  
  // Mock blog post data - in a real app, this would come from an API
  const blogPost = {
    id: 1,
    title: "Understanding AI-Powered Skin Analysis: A Complete Guide",
    content: `
      <p>AI-powered skin analysis represents a breakthrough in dermatological technology, combining machine learning algorithms with vast databases of skin conditions to provide instant, accurate assessments. This technology can detect early signs of various skin conditions, from common acne to more serious concerns like melanoma.</p>
      
      <h2>The Science Behind AI Dermatology</h2>
      <p>At the core of AI-powered skin analysis lies deep learning algorithms trained on millions of skin images. These algorithms have been developed through extensive research and validation processes, ensuring they meet the highest standards of medical accuracy.</p>
      
      <p>The technology works by analyzing various aspects of skin images, including:</p>
      <ul>
        <li>Color variations and patterns</li>
        <li>Texture and surface characteristics</li>
        <li>Shape and border irregularities</li>
        <li>Size and distribution of lesions</li>
      </ul>
      
      <h2>How It Works</h2>
      <p>When you upload a photo to DermaAI, our advanced algorithms go through several stages of analysis:</p>
      
      <h3>1. Image Preprocessing</h3>
      <p>The system first enhances the image quality, adjusts lighting, and standardizes the format for optimal analysis.</p>
      
      <h3>2. Feature Extraction</h3>
      <p>AI algorithms identify and extract relevant features from the image, including color, texture, and morphological characteristics.</p>
      
      <h3>3. Pattern Recognition</h3>
      <p>Using deep learning models, the system compares the extracted features against a comprehensive database of known skin conditions.</p>
      
      <h3>4. Diagnosis and Recommendations</h3>
      <p>Based on the analysis, the system provides a diagnosis, confidence level, and personalized treatment recommendations.</p>
      
      <h2>Accuracy and Reliability</h2>
      <p>Our AI system achieves 99.2% accuracy in skin condition detection, a figure that rivals or exceeds human dermatologist performance in many cases. This high accuracy is achieved through:</p>
      <ul>
        <li>Extensive training on diverse skin types and conditions</li>
        <li>Continuous learning and model updates</li>
        <li>Rigorous validation against clinical data</li>
        <li>Regular performance monitoring and improvement</li>
      </ul>
      
      <h2>Benefits of AI-Powered Analysis</h2>
      <p>The advantages of using AI for skin analysis are numerous:</p>
      
      <h3>Accessibility</h3>
      <p>AI-powered analysis makes professional dermatological assessment available to anyone with a smartphone, regardless of their location or access to medical facilities.</p>
      
      <h3>Speed</h3>
      <p>Results are available in seconds, compared to days or weeks for traditional dermatologist appointments.</p>
      
      <h3>Cost-Effectiveness</h3>
      <p>AI analysis is significantly more affordable than in-person consultations, making skin health care more accessible.</p>
      
      <h3>Early Detection</h3>
      <p>The system can detect subtle changes that might be missed by the naked eye, leading to earlier intervention and better outcomes.</p>
      
      <h2>Privacy and Security</h2>
      <p>We understand the sensitive nature of health data. DermaAI is fully HIPAA compliant and employs enterprise-grade security measures to protect your information. All images are encrypted and stored securely, with strict access controls in place.</p>
      
      <h2>The Future of AI Dermatology</h2>
      <p>As technology continues to advance, we're seeing exciting developments in AI dermatology:</p>
      <ul>
        <li>Improved accuracy through larger training datasets</li>
        <li>Integration with wearable devices for continuous monitoring</li>
        <li>Predictive analytics for skin health trends</li>
        <li>Personalized treatment recommendations based on genetic factors</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>AI-powered skin analysis represents the future of dermatological care, offering unprecedented access to professional-grade skin health assessment. While it doesn't replace the need for professional medical care in serious cases, it provides a valuable tool for early detection, monitoring, and general skin health management.</p>
      
      <p>At DermaAI, we're committed to making this technology accessible to everyone, helping to improve skin health outcomes worldwide.</p>
    `,
    excerpt: "Discover how artificial intelligence is revolutionizing dermatology and providing accurate skin condition assessments in seconds.",
    author: "Dr. Sarah Chen",
    authorRole: "Dermatologist & AI Researcher",
    authorBio: "Leading expert in AI dermatology with 15+ years of experience in skin cancer detection. Dr. Chen has published over 50 peer-reviewed papers and has been instrumental in developing several AI-powered medical diagnostic tools.",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "AI Technology",
    tags: ["AI", "Dermatology", "Technology", "Healthcare", "Machine Learning", "Diagnosis"],
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
    views: 1247,
    likes: 89,
    featured: true
  };

  const relatedPosts = [
    {
      id: 2,
      title: "Top 10 Skincare Myths Debunked by Dermatologists",
      excerpt: "Separate fact from fiction with evidence-based insights from leading dermatologists about common skincare misconceptions.",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=250&fit=crop",
      category: "Skincare Tips",
      date: "2024-01-12"
    },
    {
      id: 3,
      title: "The Future of Telemedicine: AI Dermatology at Home",
      excerpt: "Explore how AI-powered dermatology platforms are making professional skin care accessible from anywhere in the world.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop",
      category: "Telemedicine",
      date: "2024-01-10"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-16">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200 py-4">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-emerald-600">Home</Link>
              <span>/</span>
              <Link to="/blogs" className="hover:text-emerald-600">Blogs</Link>
              <span>/</span>
              <span className="text-gray-900">{blogPost.title}</span>
            </div>
          </div>
        </div>

        {/* Article Header */}
        <section className="py-12 bg-gradient-to-br from-slate-50 to-gray-100">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <Link to="/blogs">
                  <Button variant="outline" size="sm" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Blogs
                  </Button>
                </Link>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                  {blogPost.category}
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {blogPost.title}
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {blogPost.excerpt}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(blogPost.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {blogPost.readTime}
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  {blogPost.views.toLocaleString()} views
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  {blogPost.likes} likes
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  <div className="prose prose-lg max-w-none">
                    <div 
                      className="text-gray-700 leading-relaxed space-y-6"
                      dangerouslySetInnerHTML={{ __html: blogPost.content }}
                    />
                  </div>
                  
                  {/* Tags */}
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {blogPost.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-emerald-100 hover:text-emerald-700 transition-colors cursor-pointer">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Share and Like */}
                  <div className="mt-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Heart className="h-4 w-4" />
                        Like Article
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Share2 className="h-4 w-4" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Sidebar */}
                <div className="lg:col-span-1">
                  {/* Author Info */}
                  <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Author</h3>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                        {blogPost.author.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{blogPost.author}</p>
                        <p className="text-sm text-gray-600">{blogPost.authorRole}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {blogPost.authorBio}
                    </p>
                  </div>
                  
                  {/* Table of Contents */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h3>
                    <ul className="space-y-2 text-sm">
                      <li><a href="#science" className="text-gray-600 hover:text-emerald-600">The Science Behind AI Dermatology</a></li>
                      <li><a href="#how-it-works" className="text-gray-600 hover:text-emerald-600">How It Works</a></li>
                      <li><a href="#accuracy" className="text-gray-600 hover:text-emerald-600">Accuracy and Reliability</a></li>
                      <li><a href="#benefits" className="text-gray-600 hover:text-emerald-600">Benefits of AI-Powered Analysis</a></li>
                      <li><a href="#privacy" className="text-gray-600 hover:text-emerald-600">Privacy and Security</a></li>
                      <li><a href="#future" className="text-gray-600 hover:text-emerald-600">The Future of AI Dermatology</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        <section className="py-16 bg-gradient-to-br from-slate-50 to-gray-100">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Related Articles</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {relatedPosts.map((post) => (
                  <article key={post.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="relative overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-sm font-medium rounded-full">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight hover:text-emerald-600 transition-colors">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <Link to={`/blog/${post.id}`}>
                        <Button variant="outline" className="w-full border-emerald-200 text-emerald-600 hover:bg-emerald-50">
                          Read More
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPost;
