import { Link } from "react-router-dom";
import { Upload, Brain, Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-12">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">SkinSight AI</h1>
          <nav className="text-sm text-muted-foreground space-x-4">
            <Link className="hover:text-primary transition-colors" to="/">Home</Link>
            <Link className="hover:text-primary transition-colors" to="/analyze">Analyze</Link>
            <Link className="hover:text-primary transition-colors" to="/about">About</Link>
          </nav>
        </header>

        <section className="grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground leading-tight animate-slide-up">
                Spot issues early—get plain-language guidance
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed animate-fade-in">
                Upload a clear photo (no faces) and we'll suggest possible conditions, risk level, and next steps.
                This is not medical advice.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
              <Link
                to="/analyze"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-medical hover:shadow-hover-medical text-primary-foreground font-semibold transition-all duration-200 gap-2"
              >
                <Brain className="w-5 h-5" />
                Try the Analysis
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border text-foreground hover:bg-accent font-medium transition-colors"
              >
                Learn More
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="text-center p-4 bg-card rounded-lg border shadow-card-medical animate-fade-in">
                <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-medium text-foreground">Easy Upload</h3>
                <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
              </div>
              <div className="text-center p-4 bg-card rounded-lg border shadow-card-medical animate-fade-in">
                <Brain className="w-8 h-8 text-secondary mx-auto mb-2" />
                <h3 className="font-medium text-foreground">AI Analysis</h3>
                <p className="text-sm text-muted-foreground">Powered by MedGemma AI</p>
              </div>
              <div className="text-center p-4 bg-card rounded-lg border shadow-card-medical animate-fade-in">
                <Shield className="w-8 h-8 text-success mx-auto mb-2" />
                <h3 className="font-medium text-foreground">Educational</h3>
                <p className="text-sm text-muted-foreground">For learning purposes only</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-8 shadow-card-medical border animate-slide-up">
            <div className="text-muted-foreground text-sm mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse-medical"></div>
              Live AI Analysis Demo
            </div>
            <div className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center bg-accent/30">
              <div className="text-4xl text-primary mb-4 animate-pulse-medical">📸</div>
              <p className="text-foreground font-medium">Upload area</p>
              <p className="text-sm text-muted-foreground mt-2">Your analysis will appear here</p>
            </div>
            <Link
              to="/analyze"
              className="block w-full mt-4 text-center py-3 bg-muted hover:bg-accent text-foreground rounded-lg transition-colors font-medium"
            >
              Start Analysis →
            </Link>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="bg-warning-light border border-warning/20 rounded-xl p-6 animate-fade-in">
          <div className="flex gap-3 text-warning-foreground">
            <Shield className="w-6 h-6 flex-shrink-0 mt-1 text-warning" />
            <div>
              <h3 className="font-semibold mb-2 text-foreground">Important Medical Disclaimer</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                SkinSight AI provides educational information only and is not intended to diagnose, treat, cure, or prevent any disease. 
                Always consult with a qualified healthcare professional for medical advice, diagnosis, or treatment. 
                Do not delay seeking medical attention based on information from this AI tool.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;