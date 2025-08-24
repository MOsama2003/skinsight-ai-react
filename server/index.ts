import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { JWT } from "google-auth-library";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const upload = multer({ storage: multer.memoryStorage() });

const USE_VERTEX = (process.env.USE_VERTEX ?? "true") === "true";
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT ?? process.env.PROJECT_ID ?? process.env.PROJECT ?? "";
const LOCATION = process.env.VERTEX_LOCATION ?? process.env.LOCATION ?? "us-central1";
const PROJECT_NUMBER = process.env.PROJECT_NUMBER ?? "";
const ENDPOINT_ID = process.env.ENDPOINT_ID ?? ""; // e.g. 8652720004480892928

// For dedicated endpoints you MUST hit the dedicated domain (not aiplatform.googleapis.com)
const DEDICATED_HOST = `${ENDPOINT_ID}.${LOCATION}-${PROJECT_NUMBER}.prediction.vertexai.goog`;
const PREDICT_URL = `https://${DEDICATED_HOST}/v1/projects/${PROJECT_ID}/locations/${LOCATION}/endpoints/${ENDPOINT_ID}:predict?$alt=json;enum-encoding=int`;

// Service account
const GAC_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GAC || "";
if (!GAC_PATH) {
  console.warn("[WARN] GOOGLE_APPLICATION_CREDENTIALS (GAC) not set; using ADC if available.");
}

let client: JWT | null = null;
async function getClient() {
  if (client) return client;
  client = new JWT({
    keyFile: GAC_PATH || undefined,
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });
  await client.authorize();
  return client;
}

app.get("/status", (_req, res) => {
  res.json({
    mode: USE_VERTEX ? "vertex" : "mock",
    project: PROJECT_ID || "unset",
    location: LOCATION,
    endpointId: ENDPOINT_ID || "unset",
    projectNumber: PROJECT_NUMBER || "unset",
    dedicatedHost: DEDICATED_HOST,
  });
});

// ---- Helper: build minimal schemas (G/H first) ----
function schemaG(imageB64: string, prompt: string) {
  // simple array field "images" + required "prompt"
  return {
    instances: [
      {
        prompt: prompt || "Analyze this medical skin photo and summarize possible conditions in JSON.",
        images: [imageB64],
      },
    ],
  };
}

function schemaH(imageB64: string, prompt: string) {
  // single key "image_base64" + required "prompt"
  return {
    instances: [
      {
        prompt: prompt || "Analyze this medical skin photo and summarize possible conditions in JSON.",
        image_base64: imageB64,
      },
    ],
  };
}

// Fallbacks (only if G/H fail)
function schemaA(imageB64: string, prompt: string) {
  return {
    instances: [
      {
        prompt:
          prompt ||
          "You are assisting with non-diagnostic dermatology triage. Return JSON: condition, explanation, causes[], steps[], doctor.",
        image: imageB64, // very plain
      },
    ],
  };
}

function schemaB(imageB64: string, prompt: string) {
  return {
    instances: [
      {
        prompt:
          prompt ||
          "You are assisting with non-diagnostic dermatology triage. Return JSON: condition, explanation, causes[], steps[], doctor.",
        image_data: imageB64, // another plain wrapper
      },
    ],
  };
}

// Send REST predict
async function vertexPredictREST(body: any) {
  const auth = await getClient();
  const token = await auth.getAccessToken();

  const resp = await fetch(PREDICT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token?.token || token}`,
      "Content-Type": "application/json",
      "x-goog-request-params": `endpoint=projects/${PROJECT_ID}/locations/${LOCATION}/endpoints/${ENDPOINT_ID}`,
      "x-goog-api-client": "custom-dermaai/0.1 rest",
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`${resp.status} ${resp.statusText}: ${text}`);
  }
  return resp.json();
}

app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!USE_VERTEX) {
      return res.json({
        mock: true,
        condition: "acne (mock)",
        risk: "Low",
        explanation: "Mock response for demo.",
        steps: ["Wash with gentle cleanser", "Use OTC benzoyl peroxide 2.5-5%"],
      });
    }

    // image
    if (!req.file?.buffer) {
      return res.status(400).json({ error: "No image uploaded" });
    }
    const imageBuffer = req.file.buffer;
    const imageB64 = imageBuffer.toString("base64");
    const promptFromClient = (req.body?.prompt as string) || "";

    // Try schemas in order: G -> H -> A -> B
    const attempts = [
      { name: "G images[] + prompt", body: schemaG(imageB64, promptFromClient) },
      { name: "H image_base64 + prompt", body: schemaH(imageB64, promptFromClient) },
      { name: "A image + prompt", body: schemaA(imageB64, promptFromClient) },
      { name: "B image_data + prompt", body: schemaB(imageB64, promptFromClient) },
    ];

    let lastErr: any = null;
    for (const attempt of attempts) {
      try {
        console.time(`[MedGemma] ${attempt.name}`);
        const json = await vertexPredictREST(attempt.body);
        console.timeEnd(`[MedGemma] ${attempt.name}`);

        // Return raw predictions; frontend formats
        return res.json({
          ok: true,
          schema: attempt.name,
          vertex: json,
        });
      } catch (e: any) {
        lastErr = e;
        console.warn(`[MedGemma] ${attempt.name} failed:`, e.message || e);
      }
    }

    // If none worked:
    return res.status(502).json({
      error: "All schema attempts failed. See server logs.",
      detail: lastErr?.message || String(lastErr),
    });
  } catch (err: any) {
    console.error("[Analyze] fatal", err);
    return res.status(500).json({ error: err?.message || "Unknown error" });
  }
});

const PORT = process.env.API_PORT ? Number(process.env.API_PORT) : 8000;
app.listen(PORT, () => {
  console.log(`Analyze API running at http://localhost:${PORT}`);
  console.log(
    `[ENV] USE_VERTEX=${USE_VERTEX}, PROJECT=${PROJECT_ID}, LOCATION=${LOCATION}, ENDPOINT_ID=${ENDPOINT_ID}, PROJECT_NUMBER=${PROJECT_NUMBER}, GAC=${GAC_PATH ? "set" : "undefined"}`
  );
});
