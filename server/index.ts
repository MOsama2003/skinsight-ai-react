import cors from "cors";
app.use(cors({
  origin: ["http://localhost:8080"], // your Vite dev origin
  methods: ["POST", "GET", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// server/index.ts
import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import crypto from 'crypto';

const app = express();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

// ---------- helpers ----------
function toDataUrl(buf: Buffer, mime = 'image/jpeg') {
  const b64 = buf.toString('base64');
  return `data:${mime};base64,${b64}`;
}

type Risk = 'Low' | 'Medium' | 'High';
function riskFromText(text: string): Risk {
  // extremely naive triage—replace with classifier if you have one
  const t = text.toLowerCase();
  if (/emergency|urgent|severe|infection|rapidly|bleeding|fever/.test(t)) return 'High';
  if (/moderate|monitor|worsen|weeks/.test(t)) return 'Medium';
  return 'Low';
}

// ---------- MOCK (fallback) ----------
function mockAnalyze(imageB64: string) {
  const samples = [
    {
      condition: "Acne",
      explanation:
        "Clogged pores and inflammation can lead to comedones or pustules in oily areas.",
      possible_causes: ["Hormonal changes", "Oily skin", "Certain cosmetics"],
      recommended_next_steps: [
        "Gentle cleanser 2×/day",
        "Non-comedogenic moisturizer",
        "Benzoyl peroxide 2.5% or adapalene 0.1%",
        "Daily broad-spectrum SPF 30+",
      ],
      when_to_see_doctor: "See a clinician if no improvement after 2–4 weeks or if symptoms worsen.",
      confidence: 0.78
    },
    {
      condition: "Eczema (Atopic Dermatitis)",
      explanation: "Dry, itchy patches from a disrupted skin barrier.",
      possible_causes: ["Genetics", "Irritants", "Cold/dry weather"],
      recommended_next_steps: [
        "Thick fragrance-free moisturizer",
        "Short lukewarm showers",
        "Hydrocortisone 1% short term for flares"
      ],
      when_to_see_doctor: "Seek care if skin cracks/oozes or sleep is affected.",
      confidence: 0.71
    },
    {
      condition: "Psoriasis (possible)",
      explanation: "Overactive turnover causing thick, scaly plaques.",
      possible_causes: ["Immune triggers", "Stress", "Infections"],
      recommended_next_steps: [
        "Moisturize often",
        "Avoid harsh scrubs",
        "Salicylic acid shampoo for scalp plaques"
      ],
      when_to_see_doctor: "If widespread, painful, or affecting nails/joints.",
      confidence: 0.69
    }
  ];
  const pick = samples[Math.floor(Math.random() * samples.length)];
  const risk = riskFromText(pick.when_to_see_doctor);
  return {
    scanId: crypto.randomUUID(),
    imageUrl: imageB64,
    result: {
      condition: pick.condition,
      confidence: pick.confidence,
      risk,
      explanation: pick.explanation,
      possible_causes: pick.possible_causes,
      recommended_next_steps: pick.recommended_next_steps,
      when_to_see_doctor: pick.when_to_see_doctor
    }
  };
}

// ---------- Vertex AI (MedGemma) ----------
// This path assumes you've deployed *publishers/google/models/medgemma-4b-it*
// to a Vertex AI endpoint in your project/region.
// Notes: MedGemma is a medical multimodal model; see model card & intended-use. :contentReference[oaicite:1]{index=1}
import {helpers, protos, v1} from '@google-cloud/aiplatform'; // npm i @google-cloud/aiplatform
const {PredictionServiceClient} = v1;
const predictionClient = new PredictionServiceClient();

async function callMedGemmaVertex(imageBuf: Buffer, mime: string) {
  const project = process.env.GCP_PROJECT!;
  const location = process.env.GCP_LOCATION || 'us-central1';
  const endpointId = process.env.MEDGEMMA_ENDPOINT_ID!; // your deployed endpoint id

  const endpoint = `projects/${project}/locations/${location}/endpoints/${endpointId}`;

  // System style instruction to keep outputs cautious & non-diagnostic
  const systemPrompt = [
    "You are assisting with *non-diagnostic* dermatology image triage.",
    "Return *possible* conditions, plain-language explanation, and when to see a clinician.",
    "NEVER provide definitive diagnosis. Include uncertainty and self-care tips.",
  ].join(" ");

  // Construct an instance payload. For many Model Garden endpoints using TGI/vLLM,
  // the serving container expects {inputs, parameters}. Check your deployment’s doc.
  const instance: any = {
    // A common pattern for multimodal open-model endpoints is base64 image + prompt
    inputs: {
      prompt: `${systemPrompt}\nImage: <image>. Provide:\n- condition\n- brief explanation\n- 3 possible causes\n- 4 next steps\n- when to see a doctor\nFormat as JSON with keys: condition, explanation, causes[], steps[], doctor.\n`,
      image: {
        bytesBase64Encoded: imageBuf.toString('base64'),
        mimeType: mime || 'image/jpeg',
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
  // Response.s
  const predictions = response.predictions?.[0];
  // Extract text safely (exact field depends on your serving container)
  const text = (predictions as any)?.content || (predictions as any)?.generated_text || JSON.stringify(predictions);

  // Try to parse a JSON block if the model followed instructions
  let parsed: any | null = null;
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) parsed = JSON.parse(match[0]);
  } catch {}

  const condition = parsed?.condition || "Possible skin condition";
  const explanation = parsed?.explanation || text.slice(0, 600);
  const causes = parsed?.causes || [];
  const steps = parsed?.steps || [];
  const doctor = parsed?.doctor || "See a clinician if symptoms worsen or don’t improve in 2–4 weeks.";
  const confidence = 0.65; // Optionally derive from logits if available

  const risk: 'Low'|'Medium'|'High' = riskFromText(doctor);
  return {
    scanId: crypto.randomUUID(),
    imageUrl: null,
    result: {
      condition,
      confidence,
      risk,
      explanation,
      possible_causes: causes,
      recommended_next_steps: steps,
      when_to_see_doctor: doctor
    }
  };
}

// ---------- route ----------
app.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
    const mime = req.file.mimetype || 'image/jpeg';
    const dataUrl = toDataUrl(req.file.buffer, mime);

    // Prefer Vertex if env is present; else fall back to mock so FE can demo
    const useVertex = process.env.MEDGEMMA_ENDPOINT_ID && process.env.GCP_PROJECT;
    const payload = useVertex
      ? await callMedGemmaVertex(req.file.buffer, mime)
      : mockAnalyze(dataUrl);

    // echo back a data URL for preview, unless your storage/CDN is used
    if (!payload.imageUrl) payload.imageUrl = dataUrl;

    // Log + return
    console.log('[Analyze] ok', { condition: payload.result.condition, risk: payload.result.risk });
    res.json(payload);
  } catch (e: any) {
    console.error('[Analyze] error', e);
    res.status(500).json({ error: e?.message || 'Analyze failed' });
  }
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Analyze API listening on http://localhost:${port}`));
