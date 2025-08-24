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
                text: 'You are an expert dermatology assistant providing non-diagnostic educational guidance. Always respond with valid JSON in this exact format: {"condition": "...", "explanation": "...", "causes": ["...", "..."], "steps": ["...", "..."], "doctor": "..."}. Do not wrap the JSON in markdown code blocks.',
              },
            ],
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: args.prompt || 'Analyze this skin photo and provide educational information about potential conditions.' },
              { type: 'image_url', image_url: { url: args.imageUrlOrData } },
            ],
          },
        ],
        max_tokens: args.maxTokens ?? 400,
      },
    ],
  };
}

// Helper function to extract JSON from model response
function extractJsonFromResponse(content: string): any {
  try {
    // Try to parse directly first
    return JSON.parse(content);
  } catch {
    // If direct parsing fails, try to extract from markdown code blocks
    const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch {
        // Fallback: try to find JSON-like content
        const objectMatch = content.match(/\{[\s\S]*\}/);
        if (objectMatch) {
          return JSON.parse(objectMatch[0]);
        }
      }
    }
    throw new Error('No valid JSON found in response');
  }
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
        'Analyze this skin photo for educational purposes. Provide information about potential conditions, causes, care steps, and when to see a doctor.';

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
          condition: 'Possible eczema',
          explanation: 'Dry, itchy patches with mild redness—consistent with non-diagnostic eczema signs.',
          causes: ['Dry skin barrier', 'Irritants', 'Allergens'],
          steps: [
            'Moisturize 2–3x daily (fragrance-free)',
            'Avoid hot showers & harsh soaps',
            'Short course OTC 1% hydrocortisone if itchy',
          ],
          doctor: 'See a clinician if worsening, infection signs, or no improvement in 5–7 days.',
          source: 'mock'
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

      const responseJson = tryParse(text);
      
      // Extract the actual model response
      const modelContent = responseJson?.predictions?.choices?.[0]?.message?.content;
      if (!modelContent) {
        return res.status(502).json({
          ok: false,
          error: 'No content in model response',
          raw: responseJson
        });
      }

      // Parse the JSON from the model's response
      try {
        const analyzedData = extractJsonFromResponse(modelContent);
        
        return res.json({
          ok: true,
          condition: analyzedData.condition,
          explanation: analyzedData.explanation,
          causes: analyzedData.causes || [],
          steps: analyzedData.steps || [],
          doctor: analyzedData.doctor,
          source: 'medgemma',
          usage: responseJson?.predictions?.usage
        });
      } catch (parseError) {
        console.error('Failed to parse model JSON response:', parseError);
        return res.status(502).json({
          ok: false,
          error: 'Failed to parse model response as JSON',
          rawContent: modelContent,
          parseError: parseError.message
        });
      }

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