// src/pages/Index.tsx
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">SkinSight AI</h1>
        <nav className="text-sm text-slate-600 space-x-4">
          <Link className="hover:text-sky-700" to="/">Home</Link>
          <Link className="hover:text-sky-700" to="/analyze">Analyze</Link>
        </nav>
      </header>

      <section className="grid gap-6 md:grid-cols-2 items-start">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Spot issues early—get plain-language guidance</h2>
          <p className="text-slate-600">
            Upload a clear photo (no faces) and we’ll suggest possible conditions, risk level, and next steps.
            This is not medical advice.
          </p>
          <Link
            to="/analyze"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-black text-white font-semibold"
          >
            Try the demo
          </Link>
        </div>
        <div className="border rounded-2xl p-6 bg-white">
          <div className="text-slate-500 text-sm">Demo preview</div>
          <div className="mt-3 h-48 rounded-lg border border-dashed grid place-items-center text-slate-400">
            Upload area
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
