import React, { useRef, useState } from "react";
import { analyzeImage } from "@/lib/api";

export default function SkinSightUploadAnalyze() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("You are assisting with non-diagnostic dermatology triage. Return JSON: condition, explanation, causes[], steps[], doctor.");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  }

  async function onAnalyze() {
    if (!file) {
      setError("Please select an image first.");
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeImage(file, prompt);
      setResult(data);
      if ((data as any)?.ok !== true) {
        setError((data as any)?.error || "Analyze failed");
      }
    } catch (e: any) {
      setError(e?.message || "Analyze error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">SkinSight AI — Upload & Analyze</h1>

      <div className="space-y-3">
        <label className="block text-sm font-medium">Image</label>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="block w-full border rounded p-2"
        />
        {preview && <img src={preview} alt="preview" className="max-h-64 rounded border" />}
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium">
          Prompt <span className="text-xs text-gray-500">(required by your endpoint)</span>
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          className="w-full border rounded p-2"
          placeholder="Describe how the model should analyze the image…"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={onAnalyze}
          disabled={loading}
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
        >
          {loading ? "Analyzing…" : "Analyze"}
        </button>
        <button
          onClick={() => {
            setFile(null);
            setPreview(null);
            if (inputRef.current) inputRef.current.value = "";
            setResult(null);
            setError(null);
          }}
          className="px-4 py-2 rounded border"
        >
          Reset
        </button>
      </div>

      {error && (
        <div className="p-3 border border-red-300 text-red-700 rounded bg-red-50">
          {error}
        </div>
      )}

      {result && (
        <div className="p-3 border rounded bg-gray-50">
          <h2 className="font-semibold mb-2">Raw Result</h2>
          <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(result, null, 2)}</pre>
          <p className="mt-2 text-xs text-gray-500">
            schema tried: <code>{result?.schema}</code>
          </p>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Disclaimer: This tool provides non-diagnostic, informational output. Always consult a clinician for medical advice.
      </p>
    </div>
  );
}
