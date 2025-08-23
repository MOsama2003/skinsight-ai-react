import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Award, Globe, Shield, Zap, Target, Heart } from "lucide-react";

const AboutSection = () => {
  const stats = [
    { number: "10,000+", label: "Users Served", icon: Users },
    { number: "95%", label: "Accuracy Rate", icon: Award },
    { number: "25+", label: "Countries", icon: Globe },
    { number: "24/7", label: "AI Support", icon: Shield },
  ];

  const values = [
    {
      icon: Target,
      title: "Precision & Accuracy",
      description: "Our AI algorithms are trained on diverse skin images to provide reliable analysis and recommendations."
    },
    {
      icon: Heart,
      title: "Patient-Centered Care",
      description: "We focus on providing helpful guidance and educational resources for better skin health management."
    },
    {
      icon: Zap,
      title: "Innovation First",
      description: "We continuously improve our technology to better serve our users' skin health needs."
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Your health data is protected with industry-standard security measures and privacy controls."
    }
  ];

  const team = [
    {
      name: "Dr. Sarah Chen",
      role: "Medical Advisor",
      expertise: "Dermatologist",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec0?w=200&h=200&fit=crop&crop=face",
      bio: "Experienced dermatologist providing medical oversight and validation for our AI recommendations."
    },
    {
      name: "Michael Rodriguez",
      role: "AI Development Lead",
      expertise: "Machine Learning Engineer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      bio: "Specializes in developing AI systems for medical applications and user experience optimization."
    },
    {
      name: "Emily Watson",
      role: "Clinical Research",
      expertise: "Research Coordinator",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=200&fit=crop&crop=face",
      bio: "Coordinates research initiatives and helps ensure our platform meets clinical standards."
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-200 rounded-full text-purple-700 font-medium mb-6">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            About DermaAI
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Advancing
            <span className="block bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              Skin Health Care
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            DermaAI combines artificial intelligence with dermatological expertise to provide accessible and helpful skin health guidance. We're building tools that can assist users in understanding their skin better.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900">Our Mission</h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              To make skin health information more accessible by providing AI-powered analysis tools and educational resources that help users make informed decisions about their skin care.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We believe that technology can complement traditional dermatological care by providing initial guidance and education.
            </p>
            <Button className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white border-0">
              Learn More About Our Mission
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900">Our Vision</h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              To become a trusted companion in skin health, offering reliable tools and information that support users in their skin care journey.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We aim to help users better understand their skin and make informed decisions about when to seek professional medical advice.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">2025</div>
                <div className="text-sm text-purple-700">Platform Enhancement</div>
              </div>
              <div className="text-center p-4 bg-violet-50 rounded-lg">
                <div className="text-2xl font-bold text-violet-600">2030</div>
                <div className="text-sm text-violet-700">Expanded Features</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Core Values</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h4>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>


      </div>
    </section>
  );
};

export default AboutSection;
