// server/medgemmaParse.ts
export type MedGemmaParsed = {
  condition: string;
  explanation: string;
  causes: string[];
  steps: string[];
  doctor?: string;
};

function stripCodeFences(text: string): string {
  // Remove ```json ... ``` or ``` ... ```
  return text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*$/gi, "")
    .replace(/^\s*```/gi, "")
    .trim();
}

function tryJsonParse<T = any>(text: string): T | null {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function extractJsonChunk(text: string): string {
  // If there’s a fenced block, prefer its contents
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence && fence[1]) return fence[1].trim();

  // Else try to locate a { ... } region
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return text.slice(firstBrace, lastBrace + 1);
  }

  return text.trim();
}

function normalizeKeys(obj: any): MedGemmaParsed {
  // Accept a variety of key spellings
  const condition =
    obj.condition ??
    obj.diagnosis ??
    obj.prediction ??
    "";

  const explanation =
    obj.explanation ??
    obj.summary ??
    obj.description ??
    "";

  const causes =
    obj["causes[]"] ??
    obj.causes ??
    obj.possible_causes ??
    [];

  const steps =
    obj["steps[]"] ??
    obj.steps ??
    obj.recommendations ??
    obj.next_steps ??
    [];

  const doctor =
    obj.doctor ??
    obj.specialist ??
    obj.referral ??
    undefined;

  // Ensure arrays
  const toArray = (val: any) =>
    Array.isArray(val) ? val : (val ? [String(val)] : []);

  return {
    condition: String(condition || "").trim(),
    explanation: String(explanation || "").trim(),
    causes: toArray(causes).map(String),
    steps: toArray(steps).map(String),
    doctor: doctor ? String(doctor).trim() : undefined,
  };
}

export function parseMedGemmaContent(rawContent: string): MedGemmaParsed {
  // 1) pull out JSON-ish content
  const jsonish = stripCodeFences(extractJsonChunk(rawContent));

  // 2) parse
  const parsed = tryJsonParse<any>(jsonish) ?? {};

  // 3) normalize keys + coerce types
  return normalizeKeys(parsed);
}
