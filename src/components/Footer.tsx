import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-500 rounded-lg flex items-center justify-center">
                <Stethoscope className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">DermaAI</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Advanced AI-powered skin analysis platform providing professional-grade dermatological insights and personalized recommendations.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">Home</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">About Us</Link></li>
              <li><Link to="/blogs" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">Blogs</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">Contact</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">Skin Health Guide</a></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">AI Technology</a></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">Research Papers</a></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">Case Studies</a></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">FAQs</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-purple-400" />
                <span className="text-gray-300 text-sm">contact@dermaai.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-purple-400" />
                <span className="text-gray-300 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-purple-400" />
                <span className="text-gray-300 text-sm">123 Medical Center Dr, Suite 100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>© {new Date().getFullYear()} DermaAI. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-purple-400 fill-current" />
              <span>for better skin health</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 