import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Image as ImageIcon, X, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UploadSection = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      toast({
        title: "Image uploaded successfully",
        description: "Click 'Analyze Now' to begin skin analysis",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsAnalyzing(false);
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 3000);
  };

  const clearImage = () => {
    setUploadedImage(null);
    setIsAnalyzing(false);
  };

  return (
    <section id="upload-section" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Upload Your Skin Photo
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Take a clear photo of your skin concern. Our AI will analyze it instantly and provide professional insights.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-gradient-card shadow-card-medical">
            {!uploadedImage ? (
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${
                  dragActive 
                    ? "border-primary bg-accent/50" 
                    : "border-border hover:border-primary/50 hover:bg-accent/20"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 rounded-full bg-primary/10">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Drop your image here</h3>
                    <p className="text-muted-foreground mb-4">
                      Or click to browse from your device
                    </p>
                    <Button variant="outline" asChild>
                      <label className="cursor-pointer">
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Choose File
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileInput}
                        />
                      </label>
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground mt-4">
                    Supported formats: JPEG, PNG, WebP • Max size: 5MB
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative">
                  <img
                    src={uploadedImage}
                    alt="Uploaded skin image"
                    className="w-full max-w-md mx-auto rounded-lg shadow-medical object-cover"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                    onClick={clearImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="text-center">
                  {!isAnalyzing ? (
                    <Button 
                      variant="medical" 
                      size="lg" 
                      onClick={handleAnalyze}
                      className="min-w-40"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Analyze Now
                    </Button>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                        <span className="text-lg font-medium">Analyzing your image...</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Our AI is examining your skin condition. This may take a few moments.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>

          {/* Safety Notice */}
          <Card className="mt-6 p-4 bg-warning-light border-warning/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-warning-foreground mb-1">Medical Disclaimer</p>
                <p className="text-muted-foreground">
                  This AI analysis is for informational purposes only and should not replace professional medical advice. 
                  Always consult with a dermatologist for serious skin concerns.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default UploadSection;