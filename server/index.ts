import "dotenv/config";
import express from "express";
import multer from "multer";
import cors from "cors";
import crypto from "crypto";
import { helpers, protos, v1 } from "@google-cloud/aiplatform";

const app = express();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB
app.use(cors({
  origin: ["http://localhost:8080"], // frontend dev origin
  methods: ["POST", "GET", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// --- Helpers ---
function toDataUrl(buf: Buffer, mime = "image/jpeg") {
  return `data:${mime};base64,${buf.toString("base64")}`;
}

type Risk = "Low" | "Medium" | "High";
function riskFromText(text: string): Risk {
  const t = text.toLowerCase();
  if (/emergency|urgent|severe|infection|rapidly|bleeding|fever/.test(t)) return "High";
  if (/moderate|monitor|worsen|weeks/.test(t)) return "Medium";
  return "Low";
}

// --- Mock Analyzer (for demo if Vertex not set up) ---
function mockAnalyze(imageB64: string) {
  const samples = [
    {
      condition: "Acne",
      explanation: "Clogged pores and inflammation can lead to comedones or pustules.",
      possible_causes: ["Hormonal changes", "Oily skin", "Certain cosmetics"],
      recommended_next_steps: [
        "Gentle cleanser twice daily",
        "Non-comedogenic moisturizer",
        "Over-the-counter benzoyl peroxide or adapalene",
        "Daily sunscreen"
      ],
      when_to_see_doctor: "If no improvement after 4 weeks or symptoms worsen.",
      confidence: 0.78
    },
    {
      condition: "Eczema (Atopic Dermatitis)",
      explanation: "Dry, itchy patches from a disrupted skin barrier.",
      possible_causes: ["Genetics", "Irritants", "Dry weather"],
      recommended_next_steps: [
        "Thick fragrance-free moisturizer",
        "Short lukewarm showers",
        "Hydrocortisone 1% cream for flares"
      ],
      when_to_see_doctor: "If skin cracks, oozes, or interferes with sleep.",
      confidence: 0.71
    }
  ];
  const pick = samples[Math.floor(Math.random() * samples.length)];
  return {
    scanId: crypto.randomUUID(),
    imageUrl: imageB64,
    result: {
      condition: pick.condition,
      confidence: pick.confidence,
      risk: riskFromText(pick.when_to_see_doctor),
      explanation: pick.explanation,
      possible_causes: pick.possible_causes,
      recommended_next_steps: pick.recommended_next_steps,
      when_to_see_doctor: pick.when_to_see_doctor
    }
  };
}

// --- Vertex AI MedGemma path ---
const { PredictionServiceClient } = v1;
const predictionClient = new PredictionServiceClient();

async function callMedGemmaVertex(imageBuf: Buffer, mime: string) {
  const project = process.env.GCP_PROJECT!;
  const location = process.env.GCP_LOCATION || "us-central1";
  const endpointId = process.env.MEDGEMMA_ENDPOINT_ID!;
  const endpoint = `projects/${project}/locations/${location}/endpoints/${endpointId}`;

  const systemPrompt = `
You are assisting with *non-diagnostic* dermatology triage.
Return possible conditions, plain-language explanation, and when to see a clinician.
Never provide definitive diagnosis.
`;

  const instance: any = {
    inputs: {
      prompt: `${systemPrompt}\nImage: <image>. Format as JSON with keys: condition, explanation, causes[], steps[], doctor.`,
      image: {
        bytesBase64Encoded: imageBuf.toString("base64"),
        mimeType: mime || "image/jpeg",
      },
    },
    parameters: {
      max_new_tokens: 400,
      temperature: 0.2,
      top_p: 0.9,
    },
  };

  const request: protos.google.cloud.aiplatform.v1.IPredictRequest = {
    endpoint,
    instances: [helpers.toValue(instance)],
  };

  const [response] = await predictionClient.predict(request);
  const predictions = response.predictions?.[0];
  const text = (predictions as any)?.content || (predictions as any)?.generated_text || JSON.stringify(predictions);

  let parsed: any | null = null;
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) parsed = JSON.parse(match[0]);
  } catch {}

  return {
    scanId: crypto.randomUUID(),
    imageUrl: null,
    result: {
      condition: parsed?.condition || "Possible skin condition",
      confidence: 0.65,
      risk: riskFromText(parsed?.doctor || ""),
      explanation: parsed?.explanation || text.slice(0, 600),
      possible_causes: parsed?.causes || [],
      recommended_next_steps: parsed?.steps || [],
      when_to_see_doctor: parsed?.doctor || "See a clinician if symptoms persist.",
    },
  };
}

// --- Route ---
app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });
    const mime = req.file.mimetype || "image/jpeg";
    const dataUrl = toDataUrl(req.file.buffer, mime);

    const useVertex = process.env.MEDGEMMA_ENDPOINT_ID && process.env.GCP_PROJECT;
    const payload = useVertex
      ? await callMedGemmaVertex(req.file.buffer, mime)
      : mockAnalyze(dataUrl);

    if (!payload.imageUrl) payload.imageUrl = dataUrl;
    res.json(payload);
  } catch (e: any) {
    console.error("[Analyze] error", e);
    res.status(500).json({ error: e?.message || "Analyze failed" });
  }
});

// --- Start ---
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Analyze API running at http://localhost:${port}`));
