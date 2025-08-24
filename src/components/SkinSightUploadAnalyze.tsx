import { useRef, useState, useMemo, useCallback, useEffect } from "react";
import { analyzeImage, getProducts, getVideos, getStatus, type AnalyzeResponse } from "@/lib/api";

function RiskBadgeInline({ level }: { level: "Low"|"Medium"|"High" }) {
  const map = { Low:"bg-emerald-100 text-emerald-800", Medium:"bg-amber-100 text-amber-800", High:"bg-red-100 text-red-800" } as const;
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${map[level]}`}>{level} risk</span>;
}
const prettyPercent = (x?: number) => `${Math.round((x ?? 0) * 100)}%`;

export default function SkinSightUploadAnalyze({ userId = "demo-user", fetchResources = true }: { userId?: string; fetchResources?: boolean; }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyzeResponse | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [mode, setMode] = useState<string>("unknown");

  useEffect(() => {
    getStatus().then(s => setMode(s.mode)).catch(()=>{});
  }, []);

  const choose = () => inputRef.current?.click();

  const onFile = (f?: File | null) => {
    if (!f) return;
    console.groupCollapsed("[SkinSight] File selected");
    console.log("name:", f.name, "type:", f.type, "size:", f.size);
    console.groupEnd();
    setFile(f);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(f));
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); const f = e.dataTransfer.files?.[0]; if (f) onFile(f); };
  const prevent = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };

  const analyze = useCallback(async () => {
    if (!file) return;
    console.group("[SkinSight] Analyze");
    console.log("Starting analysis for:", file.name);
    console.time("[SkinSight] Analyze duration");
    setBusy(true); setError(null); setData(null); setProducts([]); setVideos([]);
    try {
      const res = await analyzeImage(file, userId);
      console.log("✓ Analysis response:", res);
      setData(res);
      if (fetchResources && res?.result?.condition) {
        const query = `${res.result.condition} treatment dermatology`;
        console.groupCollapsed("[SkinSight] Fetch resources");
        console.log("Query:", query);
        try {
          const [prods, vids] = await Promise.all([getProducts(), getVideos(query)]);
          console.log("Products:", prods); console.log("Videos:", vids);
          setProducts(prods.items || []); setVideos(vids.items || []);
        } catch (e) { console.warn("Resource fetch failed (continuing):", e); }
        console.groupEnd();
      }
      console.log("✓ Done");
    } catch (e:any) {
      console.error("✗ Analysis failed:", e);
      setError(e?.message || "Analyze failed");
    } finally {
      setBusy(false);
      console.timeEnd("[SkinSight] Analyze duration");
      console.groupEnd();
    }
  }, [file, userId, fetchResources]);

  const riskClass = useMemo(() => (data?.result?.risk === "High" ? "bg-red-50" : data?.result?.risk === "Medium" ? "bg-amber-50" : "bg-emerald-50"), [data?.result?.risk]);

  return (
    <div className="grid gap-6 lg:grid-cols-2 items-start">
      {/* Uploader */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgba(2,132,199,0.08)]">
        <div className="p-6">
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center"
               onDragEnter={prevent} onDragOver={prevent} onDragLeave={prevent} onDrop={onDrop}>
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e)=>onFile(e.target.files?.[0] || null)} />
            <div className="text-sm text-slate-600">Drag & drop an image here, or</div>
            <button onClick={choose} className="mt-3 inline-flex items-center px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-semibold">Browse files</button>
            <div className="text-xs text-slate-500 mt-3">Avoid faces/tattoos. Not medical advice.</div>
          </div>

          {file && (
            <div className="mt-4 grid gap-3">
              <div className="text-sm">Selected: <span className="text-slate-600">{file.name}</span></div>
              {preview && <img src={preview} alt="preview" className="w-full aspect-video object-cover rounded-lg border" />}
            </div>
          )}

          <div className="mt-5 flex gap-3">
            <button onClick={analyze} disabled={!file || busy} className="inline-flex items-center px-4 py-2 rounded-lg bg-black text-white font-semibold disabled:opacity-50">{busy ? "Analyzing…" : "Analyze photo"}</button>
            <button onClick={()=>{ console.log("[SkinSight] Reset UI state"); setFile(null); setPreview(null); setData(null); setError(null); setProducts([]); setVideos([]); }}
                    className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50">Reset</button>
          </div>

          {error && <div className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>}

          <p className="mt-4 text-xs text-slate-500">Backend mode: <b>{mode}</b> • This is not medical advice.</p>
        </div>
      </div>

      {/* Results */}
      <div className="grid gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgba(2,132,199,0.08)]">
          <div className="p-6">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-xl font-semibold">{data?.result?.condition ?? "Result"}</h2>
              {data?.result?.risk && <RiskBadgeInline level={data.result.risk} />}
            </div>
            {!data && <p className="text-slate-500 text-sm mt-1">Upload an image and click Analyze to see the findings.</p>}
            {data && (
              <div className={`mt-3 rounded-xl p-4 ${riskClass}`}>
                <div className="text-sm text-slate-600">Confidence: {prettyPercent(data.result.confidence)}</div>
                <p className="mt-2">{data.result.explanation}</p>
                {!!data.result.possible_causes?.length && <p className="mt-2 text-sm"><b>Possible causes:</b> {data.result.possible_causes.join(", ")}</p>}
                {!!data.result.recommended_next_steps?.length && (
                  <div className="mt-3">
                    <b className="text-sm">Next steps:</b>
                    <ul className="list-disc ml-5 text-sm mt-1">
                      {data.result.recommended_next_steps.map((s) => <li key={s}>{s}</li>)}
                    </ul>
                  </div>
                )}
                {data.result.when_to_see_doctor && <p className="mt-2 italic text-sm">{data.result.when_to_see_doctor}</p>}
                <p className="text-xs text-slate-500 mt-3">Disclaimer: Not medical advice.</p>
              </div>
            )}
          </div>
        </div>

        {/* Resources */}
        {fetchResources && data && (
          <>
            <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgba(2,132,199,0.08)] p-6">
              <h3 className="text-lg font-semibold mb-2">Over-the-counter products</h3>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {products.length ? products.map((p:any)=>(
                  <a key={p.id} href={p.link} target="_blank" rel="noreferrer"
                     className="min-w-[240px] p-4 border rounded-xl hover:shadow-md transition-shadow">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-slate-500 mt-1">For: {p.use}</div>
                    <div className="text-xs mt-2">{p.notes}</div>
                  </a>
                )) : <div className="text-sm text-slate-500">No products yet.</div>}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgba(2,132,199,0.08)] p-6">
              <h3 className="text-lg font-semibold mb-2">Educational videos</h3>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {videos.length ? videos.map((v:any)=>(
                  <a key={v.videoId} href={`https://youtube.com/watch?v=${v.videoId}`} target="_blank" rel="noreferrer"
                     className="min-w-[260px] border rounded-xl hover:shadow-md transition-shadow">
                    {v.thumbnail && <img src={v.thumbnail} alt={v.title} className="rounded-t-xl w-full aspect-video object-cover border-b" />}
                    <div className="p-3">
                      <div className="text-sm font-medium line-clamp-2">{v.title}</div>
                      <div className="text-xs text-slate-500">{v.channel}</div>
                    </div>
                  </a>
                )) : <div className="text-sm text-slate-500">No videos yet.</div>}
              </div>
            </div>
          </>
        )}
      </div>

      <p className="lg:col-span-2 text-xs text-slate-500">This is not medical advice.</p>
    </div>
  );
}
