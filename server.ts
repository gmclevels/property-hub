import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// 1. Natural Language Search Parser Endpoint
app.post('/api/ai/parse-search', async (req, res) => {
  const { query } = req.body;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  // Attempt using Gemini API if key is available
  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Analyze this Nigerian real-estate property search query and extract structured search parameters into JSON: "${query}".
Rules:
- transactionType must be either "sale" or "rent" (or undefined if not specified).
- propertyType: e.g. "Duplex", "Bungalow", "Apartment", "Flat", "Mansion", "Residential land", "Commercial land", "Shop", "Office", "Land", "House".
- state: Nigerian state e.g. "FCT - Abuja", "Lagos", "Enugu", "Rivers", etc.
- city or area: e.g. "Gwagwalada", "Guzape", "Maitama", "Lekki", "Ikeja", "Independence Layout", etc.
- minPrice and maxPrice in Nigerian Naira numbers (e.g. 15 million is 15000000).
- bedrooms: integer if specified.
- bathrooms: integer if specified.
- keywords: array of key search terms.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              transactionType: { type: Type.STRING },
              propertyType: { type: Type.STRING },
              state: { type: Type.STRING },
              city: { type: Type.STRING },
              area: { type: Type.STRING },
              minPrice: { type: Type.NUMBER },
              maxPrice: { type: Type.NUMBER },
              bedrooms: { type: Type.INTEGER },
              bathrooms: { type: Type.INTEGER },
              keywords: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            }
          }
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ criteria: parsed, source: 'gemini-3.8-flash' });
    } catch (err: any) {
      console.warn('Gemini parser error, switching to rule-based parser:', err?.message);
    }
  }

  // Rule-based fallback parser for high reliability
  const lower = query.toLowerCase();
  const criteria: any = { rawQuery: query, keywords: [] };

  if (lower.includes('rent') || lower.includes('to let') || lower.includes('lease')) {
    criteria.transactionType = 'rent';
  } else if (lower.includes('sale') || lower.includes('buy') || lower.includes('purchase')) {
    criteria.transactionType = 'sale';
  }

  if (lower.includes('land') || lower.includes('plot')) {
    criteria.propertyType = 'Land';
  } else if (lower.includes('duplex')) {
    criteria.propertyType = 'Duplex';
  } else if (lower.includes('apartment') || lower.includes('flat')) {
    criteria.propertyType = 'Apartment';
  } else if (lower.includes('shop')) {
    criteria.propertyType = 'Shop';
  } else if (lower.includes('office')) {
    criteria.propertyType = 'Office';
  } else if (lower.includes('mansion')) {
    criteria.propertyType = 'Mansion';
  } else if (lower.includes('bungalow')) {
    criteria.propertyType = 'Bungalow';
  } else if (lower.includes('house')) {
    criteria.propertyType = 'House';
  }

  // Nigerian Locations
  if (lower.includes('gwagwalada')) {
    criteria.area = 'Gwagwalada';
    criteria.state = 'FCT - Abuja';
  } else if (lower.includes('guzape')) {
    criteria.area = 'Guzape';
    criteria.state = 'FCT - Abuja';
  } else if (lower.includes('maitama')) {
    criteria.area = 'Maitama';
    criteria.state = 'FCT - Abuja';
  } else if (lower.includes('kubwa')) {
    criteria.area = 'Kubwa';
    criteria.state = 'FCT - Abuja';
  } else if (lower.includes('abuja') || lower.includes('fct')) {
    criteria.state = 'FCT - Abuja';
    criteria.city = 'Abuja';
  } else if (lower.includes('lekki')) {
    criteria.area = 'Lekki Phase 1';
    criteria.state = 'Lagos';
  } else if (lower.includes('ikeja')) {
    criteria.area = 'Ikeja GRA';
    criteria.state = 'Lagos';
  } else if (lower.includes('lagos')) {
    criteria.state = 'Lagos';
  } else if (lower.includes('enugu')) {
    criteria.state = 'Enugu';
    criteria.city = 'Enugu';
  } else if (lower.includes('port harcourt') || lower.includes('rivers')) {
    criteria.state = 'Rivers';
    criteria.city = 'Port Harcourt';
  }

  // Bedrooms pattern (e.g., "3 bedroom", "3 bed", "2-bedroom", "4 bd")
  const bedMatch = lower.match(/(\d+)\s*(?:bed|bedroom|bdr)/);
  if (bedMatch) {
    criteria.bedrooms = parseInt(bedMatch[1], 10);
  }

  // Price pattern (e.g. "under 15 million", "under ₦60m", "between 8m and 15m")
  const underMatch = lower.match(/(?:under|below|less than|max)\s*(?:₦|naira)?\s*(\d+(?:\.\d+)?)\s*(m|million|k|thousand|b|billion)?/i);
  if (underMatch) {
    const num = parseFloat(underMatch[1]);
    const unit = (underMatch[2] || '').toLowerCase();
    if (unit.startsWith('m')) criteria.maxPrice = num * 1_000_000;
    else if (unit.startsWith('b')) criteria.maxPrice = num * 1_000_000_000;
    else if (unit.startsWith('k')) criteria.maxPrice = num * 1_000;
    else criteria.maxPrice = num;
  }

  const betweenMatch = lower.match(/(?:between)\s*(?:₦|naira)?\s*(\d+(?:\.\d+)?)\s*(m|million)?\s*(?:and|to)\s*(?:₦|naira)?\s*(\d+(?:\.\d+)?)\s*(m|million)?/i);
  if (betweenMatch) {
    const minVal = parseFloat(betweenMatch[1]) * 1_000_000;
    const maxVal = parseFloat(betweenMatch[3]) * 1_000_000;
    criteria.minPrice = minVal;
    criteria.maxPrice = maxVal;
  }

  return res.json({ criteria, source: 'rule-based-fallback' });
});

// 2. AI Conversational Assistant Endpoint Grounded Strictly in DB
app.post('/api/ai/assistant', async (req, res) => {
  const { message, propertiesContext } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  const propertiesSummary = (propertiesContext || []).map((p: any) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    propertyType: p.propertyType,
    transactionType: p.transactionType,
    price: p.price,
    rentalFrequency: p.rentalFrequency,
    state: p.state,
    city: p.city,
    area: p.area,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    landSize: p.landSize,
    documentType: p.documentType,
    verificationStatus: p.verificationStatus,
    status: p.status,
    sellerName: p.sellerName
  }));

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `User message: "${message}"

Available property database context:
${JSON.stringify(propertiesSummary, null, 2)}`,
        config: {
          systemInstruction: `You are the official assistant for Gerald Property Hub, a Nigerian proptech marketplace founded by Mr Gerald N. Uzor ("Find It. Verify It. Own It.").
CRITICAL RULES:
1. Ground your answers strictly on the property database context provided above.
2. NEVER invent properties, prices, phone numbers, owners, documents, or locations.
3. If information is unavailable or not in the listing, clearly say: "I don't have verified information for that detail."
4. Never claim a property is legally verified unless its verificationStatus in the database is "VERIFIED".
5. Always quote prices in Nigerian Naira (₦).
6. Mention clearly whether rent is monthly or yearly.
7. Be polite, concise, professional, and helpful.`
        }
      });

      return res.json({ reply: response.text, source: 'gemini-3.8-flash' });
    } catch (err: any) {
      console.warn('Gemini assistant error, falling back to assistant logic:', err?.message);
    }
  }

  // Graceful rule-based response grounded in current properties
  const lowerMsg = message.toLowerCase();
  const matching = propertiesSummary.filter((p: any) => {
    if (lowerMsg.includes('abuja') && !p.state.toLowerCase().includes('abuja')) return false;
    if (lowerMsg.includes('lagos') && !p.state.toLowerCase().includes('lagos')) return false;
    if (lowerMsg.includes('enugu') && !p.state.toLowerCase().includes('enugu')) return false;
    if (lowerMsg.includes('gwagwalada') && !p.area.toLowerCase().includes('gwagwalada')) return false;
    if (lowerMsg.includes('land') && p.category !== 'Land') return false;
    if (lowerMsg.includes('rent') && p.transactionType !== 'rent') return false;
    if (lowerMsg.includes('sale') && p.transactionType !== 'sale') return false;
    return true;
  });

  if (matching.length > 0) {
    const top = matching.slice(0, 3);
    const list = top
      .map((p: any) => `• ${p.title} in ${p.area}, ${p.state} - ₦${p.price.toLocaleString('en-NG')}${p.transactionType === 'rent' ? `/${p.rentalFrequency}` : ''} [${p.verificationStatus}]`)
      .join('\n');
    return res.json({
      reply: `Here are properties currently listed within your criteria:\n\n${list}\n\nWould you like more details or want to send an enquiry to the seller?`,
      source: 'database-fallback'
    });
  }

  return res.json({
    reply: "I couldn't find an exact match for that specific inquiry in our current database. You can try adjusting your location or budget, or submit a request via our 'I'm Looking for Property' service so verified agents and owners can contact you.",
    source: 'database-fallback'
  });
});

// Setup Vite in Dev or serve static in Prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Gerald Property Hub server running on port ${PORT}`);
  });
}

startServer();
