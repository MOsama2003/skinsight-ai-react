import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";
import { GoogleAuth } from "google-auth-library";
import { request as gaxiosRequest } from "gaxios";

dotenv.config();

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

// ------------------ ENV + helpers ------------------

const PROJECT_ID = process.env.GCP_PROJECT || "";
const LOCATION = process.env.GCP_LOCATION || "us-central1";
const ENDPOINT_ID = process.env.MEDGEMMA_ENDPOINT_ID || "";
const PROJECT_NUMBER = process.env.GCP_PROJECT_NUMBER || "";
// Note: GOOGLE_APPLICATION_CREDENTIALS or GAC should point to your JSON key file on disk.

function dedicatedHost() {
  // <endpoint>.<location>-<projectNumber>.prediction.vertexai.goog
  if (!ENDPOINT_ID || !LOCATION || !PROJECT_NUMBER) {
    throw new Error(
      "Missing one of MEDGEMMA_ENDPOINT_ID, GCP_LOCATION, or GCP_PROJECT_NUMBER"
    );
  }
  return `${ENDPOINT_ID}.${LOCATION}-${PROJECT_NUMBER}.prediction.vertexai.goog`;
}

function predictUrl() {
  if (!PROJECT_ID) {
    throw new Error("GCP_PROJECT is not set");
  }
  return `https://${dedicatedHost()}/v1/projects/${PROJECT_ID}/locations/${LOCATION}/endpoints/${ENDPOINT_ID}:predict`;
}

function asBase64(buf: Buffer) {
  return buf.toString("base64");
}

function riskFromText(text: string) {
  if (!text) return "low";
  const t = text.toLowerCase();
  if (t.includes("urgent") || t.includes("emergency")) return "high";
  if (t.includes("doctor") || t.includes("specialist") || t.includes("dermatologist")) return "medium";
  return "low";
}

function cleanJsonTextBlock(text: string) {
  return text.replace(/```json|```/g, "").trim();
}

function tryParseJSON(text?: string) {
  if (!text) return null;
  try {
    return JSON.parse(cleanJsonTextBlock(text));
  } catch {
    return null;
  }
}

function extractText(predictions: any): string | null {
  try {
    const p0 = Array.isArray(predictions) ? predictions[0] : predictions;
    if (!p0) return null;

    // Common model shapes
    if (p0?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return p0.candidates[0].content.parts[0].text;
    }
    if (p0?.content?.[0]?.parts?.[0]?.text) {
      return p0.content[0].parts[0].text;
    }
    if (p0?.output) return p0.output;
    if (p0?.text) return p0.text;

    // Last resort
    return typeof p0 === "string" ? p0 : JSON.stringify(p0);
  } catch {
    return null;
  }
}

// ------------------ Vertex REST call ------------------

async function vertexRestPredict(body: any) {
  const auth = new GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });
  const client = await auth.getClient();
  const accessToken = await client.getAccessToken();

  const url = predictUrl();
  const t = `[REST] POST ${url}`;
  console.time(t);

  const resp = await gaxiosRequest({
    url,
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken.token || accessToken as any}`,
      "Content-Type": "application/json",
      "X-Goog-User-Project": PROJECT_ID, // helps with quota/billing scoping
    },
    data: body,
    responseType: "json",
    timeout: 60_000,
  });

  console.timeEnd(t);
  return resp.data;
}

// ------------------ Body schemas to try ------------------

// A) content[] (Gemini-like)
function schemaA(imageB64: string, mime: string) {
  return {
    instances: [
      {
        content: [
          {
            role: "user",
            parts: [
              {
                text:
                  "You are assisting with non-diagnostic dermatology triage.\n" +
                  "Return possible conditions, plain-language explanation, and when to see a clinician.\n" +
                  "Never provide a definitive diagnosis. Output JSON with keys:\n" +
                  "condition, explanation, causes[], steps[], doctor.\n",
              },
              {
                inlineData: { mimeType: mime, data: imageB64 },
              },
            ],
          },
        ],
      },
    ],
  };
}

// B) inputs + image
function schemaB(imageB64: string, mime: string) {
  return {
    instances: [
      {
        inputs: {
          prompt:
            "You are assisting with *non-diagnostic* dermatology triage.\n" +
            "Return possible conditions, plain-language explanation, and when to see a clinician.\n" +
            "Never provide definitive diagnosis.\n\n" +
            "Image: <image>. Format as JSON with keys: condition, explanation, causes[], steps[], doctor.",
          image: { bytesBase64Encoded: imageB64, mimeType: mime },
        },
        parameters: { max_new_tokens: 400, temperature: 0.2, top_p: 0.9 },
      },
    ],
  };
}

// C) input_bytes + prompt
function schemaC(imageB64: string, mime: string) {
  return {
    instances: [
      {
        prompt:
          "You are assisting with non-diagnostic dermatology triage.\n" +
          "Return possible conditions, plain-language explanation, and when to see a clinician.\n" +
          "Never provide a definitive diagnosis. Output JSON with keys:\n" +
          "condition, explanation, causes[], steps[], doctor.\n",
        input_bytes: { b64: imageB64, mime_type: mime },
        parameters: { max_new_tokens: 400, temperature: 0.2, top_p: 0.9 },
      },
    ],
  };
}

// ------------------ Main call (tries multiple shapes) ------------------

async function callMedModel(image: Buffer, mime: string) {
  const b64 = asBase64(image);

  const candidates = [
    { name: "A: content[]", body: schemaA(b64, mime) },
    { name: "B: inputs+image", body: schemaB(b64, mime) },
    { name: "C: input_bytes", body: schemaC(b64, mime) },
  ];

  let lastErr: any = null;

  for (const c of candidates) {
    try {
      console.log(`[MedModel] Trying ${c.name}`);
      const data = await vertexRestPredict(c.body);
      const predictions = (data && (data.predictions || data)) as any;
      const text = extractText(predictions);
      const structured = tryParseJSON(text || "");

      const result = {
        condition: structured?.condition || "Possible skin condition",
        confidence: typeof structured?.confidence === "number" ? structured.confidence : 0.65,
        risk: structured?.risk || riskFromText(structured?.doctor || structured?.explanation || text || ""),
        explanation:
          structured?.explanation ||
          (text ? String(text).slice(0, 1200) : "No explanation provided by the model."),
        possible_causes: Array.isArray(structured?.causes) ? structured.causes : [],
        recommended_next_steps: Array.isArray(structured?.steps) ? structured.steps : [],
        when_to_see_doctor:
          structured?.doctor || "Consider a clinician if symptoms persist, spread, or worsen.",
      };

      console.log(`[MedModel] Success with ${c.name}`);
      return { scanId: crypto.randomUUID(), imageUrl: null, result };
    } catch (e: any) {
      lastErr = e;
      const status = e?.response?.status || e?.code || e?.status || "unknown";
      const msg =
        e?.response?.data?.error?.message ||
        e?.response?.data ||
        e?.message ||
        String(e);
      console.warn(`[MedModel] ${c.name} failed:`, status, msg);
      // keep looping to try next schema
    }
  }

  throw lastErr || new Error("All schema attempts failed.");
}

// ------------------ Routes ------------------

app.get("/status", (_req, res) => {
  let host = "unset";
  try {
    host = dedicatedHost();
  } catch {
    // ignore
  }
  res.json({
    mode: "vertex-rest",
    project: PROJECT_ID || "unset",
    location: LOCATION,
    endpointId: ENDPOINT_ID || "unset",
    projectNumber: PROJECT_NUMBER || "unset",
    dedicatedHost: host,
    credsFrom: process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GAC || "ADC/default",
  });
});

app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    const out = await callMedModel(req.file.buffer, req.file.mimetype || "image/jpeg");
    return res.json(out);
  } catch (err: any) {
    console.error("[Analyze] error", err);
    const safeStatus =
      (err?.response?.status && Number(err.response.status)) ||
      (err?.code && Number(err.code) >= 400 && Number(err.code) < 600 && Number(err.code)) ||
      502;

    return res.status(safeStatus).json({
      error: "Analysis failed",
      details:
        err?.response?.data?.error?.message ||
        err?.response?.data ||
        err?.message ||
        String(err),
    });
  }
});

// ------------------ Start ------------------

app.listen(port, () => {
  console.log(`Analyze API running at http://localhost:${port}`);
  console.log(
    `[ENV] USE_VERTEX=true, PROJECT=${PROJECT_ID}, LOCATION=${LOCATION}, ENDPOINT_ID=${ENDPOINT_ID}, PROJECT_NUMBER=${PROJECT_NUMBER}, GAC=${process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GAC}`
  );
});
