import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Brain, AlertCircle, User, CheckCircle, Info, Zap, ArrowLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface AnalysisResult {
  ok: boolean;
  condition?: string;
  explanation?: string;
  causes?: string[];
  steps?: string[];
  doctor?: string;
  source?: string;
  usage?: {
    total_tokens: number;
    completion_tokens: number;
    prompt_tokens: number;
  };
  error?: string;
}

const Analyze = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleFileSelect = useCallback((file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    setResult(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('prompt', 'Analyze this skin photo for educational purposes. Provide information about potential conditions, causes, care steps, and when to see a doctor.');

      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      });

      const data: AnalysisResult = await response.json();

      if (data.ok) {
        setResult(data);
        toast({
          title: "Analysis complete",
          description: "Your skin photo has been analyzed successfully.",
        });
      } else {
        toast({
          title: "Analysis failed",
          description: data.error || "An error occurred during analysis.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Network error",
        description: `Failed to connect to analysis service: ${err instanceof Error ? err.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-card-medical">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </Link>
              <h1 className="text-2xl font-bold text-foreground">SkinSight AI Analysis</h1>
            </div>
            <nav className="text-sm text-muted-foreground space-x-4">
              <Link className="hover:text-primary transition-colors" to="/">Home</Link>
              <Link className="hover:text-primary transition-colors" to="/about">About</Link>
              <Link className="hover:text-primary transition-colors" to="/contact">Contact</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-card rounded-2xl shadow-card-medical border p-8">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Upload Skin Photo
            </h2>

            {/* Upload Area */}
            <div
              className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-accent/30 group"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              {preview ? (
                <div className="space-y-4">
                  <img
                    src={preview}
                    alt="Selected skin photo"
                    className="max-w-full max-h-64 mx-auto rounded-lg shadow-medical border"
                  />
                  <div className="text-sm text-muted-foreground bg-card rounded-lg p-2 inline-block border">
                    📁 {selectedFile?.name} ({((selectedFile?.size || 0) / 1024 / 1024).toFixed(2)} MB)
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-5xl text-primary group-hover:scale-110 transition-transform animate-pulse-medical">📸</div>
                  <div>
                    <p className="text-lg font-medium text-foreground">Drop your skin photo here</p>
                    <p className="text-muted-foreground">or click to select a file</p>
                    <p className="text-xs text-muted-foreground mt-2">JPG, PNG, WebP • Max 10MB</p>
                  </div>
                </div>
              )}
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileInput}
              />
            </div>

            {/* Analyze Button */}
            <button
              onClick={analyzeImage}
              disabled={!selectedFile || isAnalyzing}
              className="w-full mt-6 bg-gradient-medical hover:shadow-hover-medical disabled:opacity-50 disabled:shadow-none text-primary-foreground font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Analyze Skin Photo
                </>
              )}
            </button>

            {/* Disclaimer */}
            <div className="mt-6 p-4 bg-warning-light border border-warning/20 rounded-xl">
              <div className="flex gap-3 text-warning-foreground text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-warning" />
                <div>
                  <p className="font-medium mb-1 text-foreground">Educational Use Only</p>
                  <p className="text-muted-foreground">This AI analysis is for educational purposes and should not replace professional medical advice. Always consult a healthcare provider for medical concerns.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-card rounded-2xl shadow-card-medical border p-8">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Brain className="w-5 h-5 text-secondary" />
              Analysis Results
            </h2>

            {result ? (
              <div className="space-y-6 animate-fade-in">
                {/* Source Info */}
                {result.source && (
                  <div className="bg-success-light border border-success/20 rounded-lg p-3">
                    <div className="flex items-center justify-center gap-2 text-success-foreground text-sm font-medium">
                      <Zap className="w-4 h-4 text-success" />
                      <span className="text-foreground">
                        {result.source === 'medgemma' ? '🤖 AI-Powered Analysis (MedGemma)' : '🔧 Mock Analysis'}
                        {result.usage && ` • ${result.usage.total_tokens} tokens used`}
                      </span>
                    </div>
                  </div>
                )}

                {/* Condition Card */}
                <div className="bg-gradient-medical text-primary-foreground p-6 rounded-xl shadow-medical">
                  <h3 className="text-xl font-bold mb-2">{result.condition}</h3>
                  <p className="text-primary-foreground/80 text-sm">⚠️ For educational purposes only - not a medical diagnosis</p>
                </div>

                {/* Explanation */}
                <div className="bg-muted rounded-xl p-6 border shadow-card-medical">
                  <h4 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-3">
                    <Info className="w-5 h-5 text-primary" />
                    Explanation
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">{result.explanation}</p>
                </div>

                {/* Causes */}
                {result.causes && result.causes.length > 0 && (
                  <div className="bg-muted rounded-xl p-6 border shadow-card-medical">
                    <h4 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4">
                      <AlertCircle className="w-5 h-5 text-warning" />
                      Possible Causes
                    </h4>
                    <div className="space-y-3">
                      {result.causes.map((cause, index) => (
                        <div
                          key={index}
                          className="bg-card p-4 rounded-lg border-l-4 border-warning shadow-card-medical"
                        >
                          <p className="text-muted-foreground">{cause}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Steps */}
                {result.steps && result.steps.length > 0 && (
                  <div className="bg-muted rounded-xl p-6 border shadow-card-medical">
                    <h4 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4">
                      <CheckCircle className="w-5 h-5 text-success" />
                      Recommended Steps
                    </h4>
                    <div className="space-y-3">
                      {result.steps.map((step, index) => (
                        <div
                          key={index}
                          className="bg-card p-4 rounded-lg border-l-4 border-success shadow-card-medical"
                        >
                          <p className="text-muted-foreground">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Doctor Recommendation */}
                {result.doctor && (
                  <div className="bg-gradient-to-r from-success to-success-light text-success-foreground p-6 rounded-xl text-center shadow-medical">
                    <div className="text-3xl mb-3">👨‍⚕️</div>
                    <h4 className="text-lg font-semibold mb-2">Professional Recommendation</h4>
                    <p className="text-success-foreground/90">Consult with: <span className="font-semibold text-success-foreground">{result.doctor}</span></p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setResult(null);
                      setPreview('');
                      setSelectedFile(null);
                    }}
                    className="flex-1 border border-border text-muted-foreground hover:text-foreground hover:bg-accent font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Analyze Another Photo
                  </button>
                  <Link
                    to="/contact"
                    className="flex-1 bg-secondary hover:bg-secondary-light text-secondary-foreground font-medium py-2 px-4 rounded-lg text-center transition-colors shadow-medical hover:shadow-hover-medical"
                  >
                    Get Professional Help
                  </Link>
                </div>
              </div>
            ) : !isAnalyzing && (
              <div className="text-center text-muted-foreground py-16">
                <div className="text-6xl mb-6 animate-pulse-medical">🩺</div>
                <h3 className="text-lg font-medium mb-2 text-foreground">Upload a photo to get started</h3>
                <p className="text-muted-foreground">Get AI-powered educational insights about skin conditions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyze;