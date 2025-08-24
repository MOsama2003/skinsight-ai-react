const BASE = (import.meta.env.VITE_API_BASE as string || "").replace(/\/$/, "");

export type ResultShape = {
  condition: string;
  confidence: number;
  risk: "Low" | "Medium" | "High";
  explanation: string;
  possible_causes?: string[];
  recommended_next_steps?: string[];
  when_to_see_doctor?: string;
};

export type AnalyzeResponse = {
  scanId: string;
  imageUrl?: string;
  result: ResultShape;
  created_at?: string;
};

export async function analyzeImage(file: File, userId?: string): Promise<AnalyzeResponse> {
  const form = new FormData();
  form.append("image", file);
  if (userId) form.append("userId", userId);

  const r = await fetch(`${BASE}/analyze`, { method: "POST", body: form });
  if (!r.ok) {
    let msg = "Analyze failed";
    try { const j = await r.json(); msg = j.error || j.detail || msg; } catch {}
    throw new Error(msg);
  }
  return r.json();
}

export async function getProducts() {
  const r = await fetch(`${BASE}/resources/products`);
  return r.ok ? r.json() : { items: [] };
}

export async function getVideos(q: string) {
  const r = await fetch(`${BASE}/resources/videos?q=${encodeURIComponent(q)}`);
  return r.ok ? r.json() : { items: [] };
}

export async function getStatus() {
  const r = await fetch(`${BASE}/status`, { cache: "no-store" as RequestCache });
  return r.ok ? r.json() : { mode: "unknown" };
}
