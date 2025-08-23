import { Button } from "@/components/ui/button";
import { ArrowRight, Stethoscope, Shield, Users, Sparkles, CheckCircle, Brain, Zap, Eye, Activity } from "lucide-react";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center overflow-hidden pt-16">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMDMiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEuNSIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="animate-fade-in space-y-8">
            {/* Brand Badge */}
                          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/90 mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">AI-Powered Technology</span>
                </div>
              </div>
            
            {/* Logo and Title */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-2xl">
                    <Stethoscope className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
                    DermaAI
                  </span>
                  <p className="text-sm text-white/70">Advanced Skin Analysis</p>
                </div>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                Transform Your
                <span className="block bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
                  Skin Health
                </span>
                <span className="block text-3xl lg:text-4xl text-white/80 font-normal mt-2">
                  with AI Precision
                </span>
              </h1>
            </div>
            
            <p className="text-xl text-white/80 leading-relaxed max-w-lg">
              Experience the future of dermatology. Upload a photo and receive instant, professional-grade analysis with personalized treatment recommendations powered by cutting-edge AI technology.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="group bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white border-0 px-8 py-6 text-lg font-semibold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
                onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Start Free Analysis
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="flex items-center gap-3 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">HIPAA Compliant</p>
                  <p className="text-white/60 text-xs">100% Secure & Private</p>
                </div>
              </div>
             
            </div>
            
            {/* Features */}
            <div className="flex flex-wrap gap-4 pt-4">
              {[
                "Instant Results",
                "AI-Powered Analysis", 
                "Expert Recommendations",
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-white/80 text-sm">
                  <CheckCircle className="h-4 w-4 text-purple-400" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* AI-Themed Hero Illustration */}
          <div className="animate-slide-up lg:animate-fade-in">
            <div className="relative group">
              {/* Glowing background */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20 rounded-3xl transform rotate-2 scale-105 blur-2xl group-hover:blur-3xl transition-all duration-500" />
              
              {/* Main illustration container */}
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/20 min-h-[500px] flex items-center justify-center">
                
                {/* Central AI Brain */}
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                    <Brain className="h-16 w-16 text-white" />
                  </div>
                  
                  {/* Neural network connections */}
                  <div className="absolute inset-0 w-32 h-32 border-2 border-emerald-400/30 rounded-full animate-spin-slow"></div>
                  <div className="absolute inset-0 w-40 h-40 border-2 border-cyan-400/20 rounded-full animate-spin-slow-reverse"></div>
                  <div className="absolute inset-0 w-48 h-48 border-2 border-blue-400/20 rounded-full animate-spin-slow"></div>
                </div>
                
                {/* Floating data points */}
                <div className="absolute top-8 left-8 w-6 h-6 bg-emerald-400 rounded-full animate-bounce"></div>
                <div className="absolute top-16 right-12 w-4 h-4 bg-cyan-400 rounded-full animate-bounce delay-300"></div>
                <div className="absolute bottom-20 left-16 w-5 h-5 bg-blue-400 rounded-full animate-bounce delay-700"></div>
                <div className="absolute bottom-12 right-8 w-3 h-3 bg-purple-400 rounded-full animate-bounce delay-500"></div>
                
                {/* Analysis grid */}
                <div className="absolute top-1/4 left-1/4 w-20 h-20 border border-emerald-400/20 rounded-lg transform rotate-12">
                  <div className="w-full h-full bg-gradient-to-br from-emerald-400/10 to-transparent rounded-lg"></div>
                </div>
                <div className="absolute bottom-1/4 right-1/4 w-16 h-16 border border-cyan-400/20 rounded-lg transform -rotate-12">
                  <div className="w-full h-full bg-gradient-to-br from-cyan-400/10 to-transparent rounded-lg"></div>
                </div>
                
                {/* Floating icons */}
                <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-xl animate-bounce">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                
                <div className="absolute bottom-1/3 left-1/3 w-14 h-14 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-xl animate-pulse">
                  <Activity className="h-7 w-7 text-white" />
                </div>
                
                {/* Data flow lines */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 300">
                  <defs>
                    <linearGradient id="flow1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.6"/>
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6"/>
                    </linearGradient>
                    <linearGradient id="flow2" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6"/>
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.6"/>
                    </linearGradient>
                  </defs>
                  <path d="M50,100 Q150,50 250,100" stroke="url(#flow1)" strokeWidth="2" fill="none" className="animate-pulse"/>
                  <path d="M50,200 Q150,150 250,200" stroke="url(#flow2)" strokeWidth="2" fill="none" className="animate-pulse delay-1000"/>
                </svg>
                
                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl animate-bounce">
                  <div className="text-white text-xs font-bold text-center">
                    <div className="text-lg">AI</div>
                    <div className="text-xs">Powered</div>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
                  <div className="text-white text-center">
                    <div className="text-2xl font-bold">99%</div>
                    <div className="text-xs">Accuracy</div>
                  </div>
                </div>
                
                {/* Scan lines effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-400/5 to-transparent animate-scan"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 text-white/60">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center relative">
            <div className="w-1 h-3 bg-gradient-to-b from-emerald-400 to-cyan-400 rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;