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
  Info
} from "lucide-react";

interface ResultsSectionProps {
  result: any;          // comes from UploadSection (parsed JSON)
  image: string | null; // uploaded image
}

const ResultsSection = ({ result, image }: ResultsSectionProps) => {
  const [videos, setVideos] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": `${import.meta.env.VITE_PRODUCTS_API_KEY}`,
      "x-rapidapi-host": "real-time-amazon-data.p.rapidapi.com",
    },
  };

  // Fetch when result changes
  useEffect(() => {
    if (result?.diseaseDetection?.diseaseFound) {
      fetchVideos(result.diseaseDetection.diseaseName);
      fetchProducts(result.diseaseDetection.recommendedProductsQueries);
    }
  }, [result]);

  const fetchVideos = async (diseaseName: string) => {
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${diseaseName} treatment&maxResults=3&type=video&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
      );
      const data = await res.json();
      setVideos(data.items || []);
    } catch (err) {
      console.error("Error fetching videos:", err);
    }
  };

  const fetchProducts = async (queries: string[]) => {
    try {
      const results = await Promise.all(
        queries.map(async (query) => {
          const url = `https://real-time-amazon-data.p.rapidapi.com/search?query=${encodeURIComponent(
            query
          )}&page=1&country=US&sort_by=RELEVANCE&product_condition=ALL&is_prime=false&deals_and_discounts=NONE`;

          const res = await fetch(url, options);
          const data = await res.json();

          const p = data?.data?.products?.[0];
          return p
            ? {
                id: p.asin,
                name: p.product_title,
                rating: p.product_star_rating || "N/A",
                reviews: p.product_num_ratings || 0,
                price: p.product_price || "See on Amazon",
                image: p.product_photo,
                url: p.product_url,
              }
            : null;
        })
      );
      setProducts(results.filter(Boolean));
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "success";
      case "medium":
        return "warning";
      case "high":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return CheckCircle;
      case "medium":
        return Clock;
      case "high":
        return AlertTriangle;
      default:
        return Info;
    }
  };

  if (!result) return null;

  const analysis = result.analysisResult;
  const disease = result.diseaseDetection;
  const RiskIcon = getRiskIcon(analysis.riskLevel);

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
                  <h3 className="text-2xl font-bold text-foreground">
                    {analysis.condition}
                  </h3>
                  <Badge variant="outline" className="text-sm">
                    {analysis.confidence}% confidence
                  </Badge>
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <RiskIcon
                    className={`h-5 w-5 text-${getRiskColor(
                      analysis.riskLevel
                    )}`}
                  />
                  <span className="font-medium">Risk Level:</span>
                  <Badge variant={getRiskColor(analysis.riskLevel) as any}>
                    {analysis.riskLevel}
                  </Badge>
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {analysis.description}
                </p>

                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Possible Causes:</h4>
                  <ul className="space-y-2">
                    {analysis.causes.map((cause: string, index: number) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
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
                  {analysis.recommendations.map(
                    (rec: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{rec}</span>
                      </div>
                    )
                  )}
                </div>

                <Card className="p-4 bg-warning-light border-warning/20">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm mb-1">
                        When to see a doctor:
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {analysis.whenToSeeDoctor}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </Card>

          {disease?.diseaseFound && (
            <>
              {/* Recommended Products */}
              <Card className="p-8 bg-gradient-card shadow-card-medical">
                <div className="flex items-center gap-3 mb-6">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                  <h3 className="text-2xl font-bold">Recommended Products</h3>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Card
                      key={product.id}
                      className="p-4 hover:shadow-hover-medical"
                    >
                      <div className="aspect-square rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="object-contain h-full w-full"
                          />
                        ) : (
                          <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <h4 className="font-semibold mb-2 line-clamp-2">
                        {product.name}
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                          {product.price}
                        </span>
                        <Button asChild variant="outline" size="sm">
                          <a
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View
                          </a>
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
                    <Card key={video.id.videoId} className="overflow-hidden">
                      <div className="aspect-video">
                        <iframe
                          className="w-full h-full"
                          src={`https://www.youtube.com/embed/${video.id.videoId}`}
                          title={video.snippet.title}
                          frameBorder="0"
                          allowFullScreen
                        ></iframe>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold mb-2 line-clamp-2">
                          {video.snippet.title}
                        </h4>
                        <span className="text-sm text-muted-foreground">
                          {video.snippet.channelTitle}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
