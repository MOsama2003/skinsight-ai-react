export type AnalyzeResult =
  | {
      ok: true;
      schema: string;
      vertex: any;
    }
  | {
      ok?: false;
      error: string;
      detail?: string;
    };

export async function analyzeImage(file: File, prompt: string): Promise<AnalyzeResult> {
  const fd = new FormData();
  fd.append("image", file);
  if (prompt && prompt.trim().length > 0) {
    fd.append("prompt", prompt.trim());
  }

  const resp = await fetch("http://localhost:8000/analyze", {
    method: "POST",
    body: fd,
  });

  const data = await resp.json();
  if (!resp.ok) {
    return { ok: false, error: data?.error || "Analyze failed", detail: data?.detail };
  }
  return data as AnalyzeResult;
}
