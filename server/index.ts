// server/index.ts
import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import sharp from 'sharp';
import { GoogleAuth } from 'google-auth-library';

const app = express();

// ---- Body parsers ----
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// ---- Multer: accept ANY field name, pick the first file ----
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
    files: 1,
  },
});
const anyUpload = upload.any(); // avoids "Unexpected field" errors

// ---- ENV ----
const USE_VERTEX = String(process.env.USE_VERTEX) === 'true';
const PROJECT_ID = process.env.PROJECT_ID || '';
const LOCATION = process.env.LOCATION || 'us-central1';
const ENDPOINT_ID = process.env.ENDPOINT_ID || '';
const PROJECT_NUMBER = process.env.PROJECT_NUMBER || '';
const GAC = process.env.GOOGLE_APPLICATION_CREDENTIALS;

function vertexHost() {
  // Dedicated Private Endpoint host:
  // {ENDPOINT_ID}.{LOCATION}-{PROJECT_NUMBER}.prediction.vertexai.goog
  return `${ENDPOINT_ID}.${LOCATION}-${PROJECT_NUMBER}.prediction.vertexai.goog`;
}

async function getAccessToken() {
  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  if (!token || !token.token) throw new Error('Failed to obtain Google access token');
  return token.token;
}

// --- Build custom container request (chatCompletions with image_url) ---
function buildChatCompletionsPayload(args: {
  prompt: string;
  imageUrlOrData: string;
  maxTokens?: number;
}) {
  return {
    instances: [
      {
        '@requestFormat': 'chatCompletions',
        messages: [
          {
            role: 'system',
            content: [
              {
                type: 'text',
                text: 'You are an expert dermatology assistant. Provide non-diagnostic guidance only.',
              },
            ],
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: args.prompt || 'Describe this image.' },
              { type: 'image_url', image_url: { url: args.imageUrlOrData } },
            ],
          },
        ],
        max_tokens: args.maxTokens ?? 400,
      },
    ],
  };
}

// ---- Status ----
app.get('/status', (_req, res) => {
  res.json({
    mode: USE_VERTEX ? 'vertex' : 'mock',
    project: PROJECT_ID || '(unset)',
    location: LOCATION,
    endpointId: ENDPOINT_ID || '(unset)',
    projectNumber: PROJECT_NUMBER || '(unset)',
    gac: GAC ? 'set' : 'unset',
  });
});

// ---- Analyze ----
app.post('/analyze', (req, res) => {
  // Use Multer any() and handle its errors cleanly
  anyUpload(req as any, res as any, async (err: any) => {
    if (err) {
      // Multer errors (including Unexpected field) get handled here
      const msg =
        err && err.code === 'LIMIT_FILE_SIZE'
          ? 'File too large (max 10MB).'
          : `Upload error: ${err.message || err}`;
      return res.status(400).json({ ok: false, error: msg });
    }

    try {
      const prompt =
        (req.body?.prompt as string) ||
        'Analyze this skin photo for educational purposes. Do NOT diagnose.';

      // Accept either an uploaded file OR imageUrl in the body (multipart or JSON)
      const files = (req as any).files as Express.Multer.File[] | undefined;
      const firstFile = files && files.length > 0 ? files[0] : undefined;

      let imageUrlOrData: string | undefined;

      // 1) If a file was uploaded, convert to data URL (webp) to keep small
      if (firstFile?.buffer) {
        const processed = await sharp(firstFile.buffer)
          .resize({ width: 1024, withoutEnlargement: true })
          .webp({ quality: 85 })
          .toBuffer();

        imageUrlOrData = `data:image/webp;base64,${processed.toString('base64')}`;
      }

      // 2) Else if an imageUrl was provided, use it
      if (!imageUrlOrData) {
        const bodyUrl =
          (req.body?.imageUrl as string) ||
          (req.query?.imageUrl as string) ||
          undefined;
        if (bodyUrl) imageUrlOrData = bodyUrl;
      }

      if (!imageUrlOrData) {
        return res
          .status(400)
          .json({ ok: false, error: 'No image provided. Upload a file or pass imageUrl.' });
      }

      if (!USE_VERTEX) {
        // Local mock for UI testing
        return res.json({
          ok: true,
          source: 'mock',
          mock: {
            condition: 'Possible eczema',
            explanation:
              'Dry, itchy patches with mild redness—consistent with non-diagnostic eczema signs.',
            causes: ['Dry skin barrier', 'Irritants', 'Allergens'],
            steps: [
              'Moisturize 2–3x daily (fragrance-free)',
              'Avoid hot showers & harsh soaps',
              'Short course OTC 1% hydrocortisone if itchy',
            ],
            doctor:
              'See a clinician if worsening, infection signs, or no improvement in 5–7 days.',
          },
        });
      }

      // Build EXACT payload your container expects
      const body = buildChatCompletionsPayload({ prompt, imageUrlOrData });

      // Call your dedicated endpoint host
      const accessToken = await getAccessToken();
      const host = vertexHost();
      const url = `https://${host}/v1/projects/${PROJECT_ID}/locations/${LOCATION}/endpoints/${ENDPOINT_ID}:predict?$alt=json;enum-encoding=int`;

      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body), // only {instances:[...]}
      });

      const text = await resp.text();
      if (!resp.ok) {
        return res.status(502).json({
          ok: false,
          error: `Vertex predict failed ${resp.status} ${resp.statusText}`,
          details: tryParse(text),
        });
      }

      const json = tryParse(text);
      return res.json({ ok: true, raw: json, usedHost: host });
    } catch (e: any) {
      console.error('[Analyze] error', e);
      return res.status(500).json({ ok: false, error: e?.message || String(e) });
    }
  });
});

function tryParse(t: string) {
  try {
    return JSON.parse(t);
  } catch {
    return { _raw: t };
  }
}

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Analyze API running at http://localhost:${PORT}`);
  console.log(
    `[ENV] USE_VERTEX=${USE_VERTEX}, PROJECT=${PROJECT_ID}, LOCATION=${LOCATION}, ENDPOINT_ID=${ENDPOINT_ID}, PROJECT_NUMBER=${PROJECT_NUMBER}, GAC=${GAC ? 'set' : 'unset'}`
  );
});
