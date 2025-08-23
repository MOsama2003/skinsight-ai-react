import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ExternalLink, 
  ShoppingCart,
  Play,
  Star,
  Info
} from "lucide-react";

const ResultsSection = () => {
  const [videos, setVideos] = useState([]);

  // Mock analysis results
  const analysisResult = {
    condition: "Mild Acne (Comedonal)",
    confidence: 87,
    riskLevel: "Low",
    description: "The image shows signs of comedonal acne, characterized by blackheads and whiteheads. This is a common and treatable skin condition.",
    causes: [
      "Excess oil production",
      "Clogged hair follicles",
      "Bacterial growth",
      "Hormonal changes"
    ],
    recommendations: [
      "Use a gentle cleanser twice daily",
      "Apply a salicylic acid treatment",
      "Consider a non-comedogenic moisturizer",
      "Avoid picking or squeezing spots"
    ],
    whenToSeeDoctor: "If the condition persists for more than 6-8 weeks or worsens significantly."
  };

  const products = [
    {
      name: "CeraVe Foaming Facial Cleanser",
      price: "$12.99",
      rating: 4.5,
      reviews: 2847,
      image: "/api/placeholder/150/150"
    },
    {
      name: "The Ordinary Salicylic Acid 2%",
      price: "$7.90",
      rating: 4.3,
      reviews: 1923,
      image: "/api/placeholder/150/150"
    },
    {
      name: "Neutrogena Oil-Free Moisturizer",
      price: "$8.97",
      rating: 4.4,
      reviews: 3421,
      image: "/api/placeholder/150/150"
    }
  ];

  

  useEffect(() => {
    const fetchVideos = async () => {
      // Replace with actual API call
      const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=acne treatment&maxResults=3&type=video&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
      )
      const data = await res.json();


      setVideos(data.items || []);
    };


    fetchVideos();
  }, []);



  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'destructive';
      default: return 'secondary';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return CheckCircle;
      case 'medium': return Clock;
      case 'high': return AlertTriangle;
      default: return Info;
    }
  };

  const RiskIcon = getRiskIcon(analysisResult.riskLevel);

  return (
    <section id="results-section" className="py-20 bg-muted/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            AI Analysis Results
          </h2>
          <p className="text-lg text-muted-foreground">
            Based on your uploaded image, here's what our AI detected
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Main Results */}
          <Card className="p-8 bg-gradient-card shadow-card-medical">
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-2xl font-bold text-foreground">{analysisResult.condition}</h3>
                  <Badge variant="outline" className="text-sm">
                    {analysisResult.confidence}% confidence
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 mb-6">
                  <RiskIcon className={`h-5 w-5 text-${getRiskColor(analysisResult.riskLevel)}`} />
                  <span className="font-medium">Risk Level:</span>
                  <Badge variant={getRiskColor(analysisResult.riskLevel) as any}>
                    {analysisResult.riskLevel}
                  </Badge>
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {analysisResult.description}
                </p>

                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Possible Causes:</h4>
                  <ul className="space-y-2">
                    {analysisResult.causes.map((cause, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {cause}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Recommended Actions:</h4>
                <div className="space-y-3 mb-6">
                  {analysisResult.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </div>

                <Card className="p-4 bg-warning-light border-warning/20">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm mb-1">When to see a doctor:</p>
                      <p className="text-sm text-muted-foreground">{analysisResult.whenToSeeDoctor}</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </Card>

          {/* Product Recommendations */}
          <Card className="p-8 bg-gradient-card shadow-card-medical">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingCart className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-bold">Recommended Products</h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <Card key={index} className="p-4 hover:shadow-hover-medical transition-all duration-300">
                  <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center">
                    <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h4 className="font-semibold mb-2 line-clamp-2">{product.name}</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">{product.price}</span>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Educational Videos */}
 <Card className="p-8 bg-gradient-card shadow-card-medical">
            <div className="flex items-center gap-3 mb-6">
              <Play className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-bold">Educational Resources</h3>
            </div>


            <div className="grid md:grid-cols-3 gap-6">
              {videos.map((video) => (
                <Card
                  key={video.id.videoId}
                  className="overflow-hidden hover:shadow-hover-medical transition-all duration-300"
                >
                  <div className="aspect-video">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${video.id.videoId}`}
                      title={video.snippet.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>


                  <div className="p-4">
                    <h4 className="font-semibold mb-2 line-clamp-2">
                      {video.snippet.title}
                    </h4>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{video.snippet.channelTitle}</span>
                      {/* If you don’t have views from API, remove or mock */}
                      <span>{video.views ? `${video.views} views` : ""}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;