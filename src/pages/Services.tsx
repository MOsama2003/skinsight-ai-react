import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, Zap, Shield, Users, Brain, Eye, Activity, ArrowRight } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Brain,
      title: "AI-Powered Skin Analysis",
      description: "Advanced machine learning algorithms analyze your skin images with 99.2% accuracy, detecting conditions from acne to early signs of skin cancer.",
      features: [
        "Instant image analysis",
        "Multiple condition detection",
        "Severity assessment",
        "Personalized insights"
      ],
      price: "Free",
      popular: true
    },
    {
      icon: Eye,
      title: "Comprehensive Diagnosis",
      description: "Get detailed analysis of skin conditions with professional-grade accuracy, including treatment recommendations and prevention strategies.",
      features: [
        "Professional diagnosis",
        "Treatment recommendations",
        "Prevention strategies",
      ],
      price: "$29/month",
      popular: false
    },
    {
      icon: Activity,
      title: "Progress Monitoring",
      description: "Track your skin health journey over time with detailed analytics, progress reports, and treatment effectiveness monitoring.",
      features: [
        "Analytics dashboard",
        "Treatment effectiveness",
        "Health reports"
      ],
      price: "$19/month",
      popular: false
    }
  ];

  const additionalServices = [
    {
      icon: Users,
      title: "Expert Consultation",
      description: "Connect with board-certified dermatologists for personalized advice and treatment plans."
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Your health data is protected with enterprise-grade security and privacy measures."
    },
    {
      icon: Zap,
      title: "24/7 AI Support",
      description: "Get instant answers to your skin health questions anytime, anywhere."
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-emerald-50 to-cyan-50">
          <div className="container mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-200 rounded-full text-emerald-700 font-medium mb-6">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              Our Services
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Comprehensive
              <span className="block bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                Skin Health Solutions
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From AI-powered analysis to expert consultation, we provide everything you need for optimal skin health and beauty.
            </p>
          </div>
        </section>

        {/* Main Services */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div key={index} className={`relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 ${
                  service.popular ? 'border-emerald-500' : 'border-gray-100'
                }`}>
                  {service.popular && (
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-medium rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                      <service.icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                    
                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-gray-900">{service.price}</div>
                      {service.price !== "Free" && (
                        <div className="text-gray-500">per month</div>
                      )}
                    </div>
                    
                    <Button 
                      className={`w-full ${
                        service.popular 
                          ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0'
                          : 'bg-white border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      {service.price === "Free" ? "Get Started" : "Choose Plan"}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Services */}
        <section className="py-20 bg-gradient-to-br from-slate-50 to-gray-100">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Additional Benefits
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Beyond our core services, we provide additional value to enhance your skin health journey.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {additionalServices.map((service, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-emerald-500 to-cyan-500">
          <div className="container mx-auto px-6 text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Transform Your Skin Health?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of users who trust DermaAI for professional-grade skin analysis and personalized care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-4 text-lg"
              >
                Schedule a Demo
              </Button>
              <Button 
                size="lg"
                className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              >
                Get Started Today
              </Button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Services;
