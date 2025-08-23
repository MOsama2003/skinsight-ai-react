import SkinSightUploadAnalyze from "@/components/SkinSightUploadAnalyze";

export default function Analyze() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">SkinSight AI</h1>
        <nav className="text-sm text-slate-600 space-x-4">
          <a href="/" className="hover:text-sky-700">Home</a>
          <a href="/analyze" className="hover:text-sky-700">Analyze</a>
        </nav>
      </header>

      <p className="text-slate-600">
        Upload a clear photo (no faces) to see possible conditions, risk level, and next steps—plus resources.
      </p>

      <SkinSightUploadAnalyze userId="demo-user" />
    </div>
  );
}
