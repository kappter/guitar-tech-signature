import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.use(cors());
app.use(express.json());

// In-memory cache for AI responses
const cache = new Map();
const CACHE_TTL = 3600000; // 1 hour in milliseconds

// Helper function to generate cache key
function getCacheKey(endpoint, data) {
  return `${endpoint}:${JSON.stringify(data)}`;
}

// Helper function to get cached response
function getCached(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

// Helper function to set cache
function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

// POST /api/insight - Generate AI insight for a guitarist
app.post('/api/insight', async (req, res) => {
  try {
    const { guitarist, distribution, topTechniques, style } = req.body;

    if (!guitarist || !distribution) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check cache
    const cacheKey = getCacheKey('insight', { guitarist, distribution });
    const cached = getCached(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Construct prompt for AI
    const prompt = `You are analyzing a guitarist's technique profile for the "Guitar Tech Signature" project. This project focuses on technique distribution, not rankings or skill hierarchies.

Guitarist: ${guitarist}
Style: ${style || 'Unknown'}
Technique Distribution:
- Beginner techniques: ${distribution.Beginner || 0}
- Intermediate techniques: ${distribution.Intermediate || 0}
- Advanced techniques: ${distribution.Advanced || 0}

Top Techniques: ${topTechniques ? topTechniques.join(', ') : 'Not specified'}

Generate a thoughtful, 2-3 paragraph insight about this guitarist's technique signature. Focus on:
1. What makes their technique choice unique or distinctive
2. How their technique distribution reflects their musical identity
3. The balance between foundational, expressive, and advanced techniques
4. Avoid ranking or judging skill level - focus on technique choice and musical expression

Keep the tone educational and appreciative. Write in a professional, engaging style.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a knowledgeable music analyst specializing in guitar techniques and playing styles. You provide insightful, non-judgmental analysis focused on technique choice and musical expression.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const insight = completion.choices[0].message.content;

    const response = {
      insight,
      guitarist,
      distribution
    };

    // Cache the response
    setCache(cacheKey, response);

    res.json(response);
  } catch (error) {
    console.error('Error generating insight:', error);
    res.status(500).json({ 
      error: 'Failed to generate insight',
      fallback: 'This guitarist demonstrates a unique approach to technique selection, balancing foundational skills with expressive choices that define their musical signature.'
    });
  }
});

// POST /api/compare - Compare two or more guitarists
app.post('/api/compare', async (req, res) => {
  try {
    const { guitarists } = req.body;

    if (!guitarists || guitarists.length < 2) {
      return res.status(400).json({ error: 'Need at least 2 guitarists to compare' });
    }

    // Check cache
    const cacheKey = getCacheKey('compare', guitarists);
    const cached = getCached(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Construct comparison prompt
    const guitaristSummaries = guitarists.map(g => 
      `${g.name} (${g.style}): ${g.topTechniques.join(', ')}`
    ).join('\n');

    const prompt = `Compare these guitarists based on their technique profiles. Focus on technique choice and musical approach, not skill rankings.

${guitaristSummaries}

Provide:
1. A brief comparison highlighting their similarities and differences
2. What makes each guitarist's approach distinctive
3. How their technique choices reflect different musical philosophies

Keep it concise (2-3 paragraphs) and insightful.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a music analyst comparing guitarists based on technique choice and musical approach, not skill level.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 600
    });

    const comparison = completion.choices[0].message.content;

    const response = {
      comparison,
      guitarists: guitarists.map(g => g.name)
    };

    // Cache the response
    setCache(cacheKey, response);

    res.json(response);
  } catch (error) {
    console.error('Error generating comparison:', error);
    res.status(500).json({ 
      error: 'Failed to generate comparison',
      fallback: 'These guitarists demonstrate different approaches to technique selection, each creating a unique musical signature through their choices.'
    });
  }
});

// POST /api/recommend - Get similar guitarist recommendations
app.post('/api/recommend', async (req, res) => {
  try {
    const { guitarist, allGuitarists } = req.body;

    if (!guitarist || !allGuitarists) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check cache
    const cacheKey = getCacheKey('recommend', { guitarist: guitarist.name, allGuitarists: allGuitarists.map(g => g.name) });
    const cached = getCached(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const prompt = `Based on ${guitarist.name}'s technique profile (${guitarist.topTechniques.join(', ')}), recommend 3 similar guitarists from this list and explain why:

${allGuitarists.map(g => `- ${g.name} (${g.style}): ${g.topTechniques.join(', ')}`).join('\n')}

For each recommendation, provide:
1. The guitarist's name
2. A brief explanation of the similarity (1-2 sentences)
3. What a fan of ${guitarist.name} might appreciate about them

Format as JSON array with objects containing: name, reason, appeal`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a music recommendation engine. Provide recommendations based on technique similarities and musical approach. Return valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 800,
      response_format: { type: "json_object" }
    });

    let recommendations;
    try {
      const parsed = JSON.parse(completion.choices[0].message.content);
      recommendations = parsed.recommendations || parsed;
    } catch (e) {
      // Fallback if JSON parsing fails
      recommendations = [];
    }

    const response = {
      recommendations,
      forGuitarist: guitarist.name
    };

    // Cache the response
    setCache(cacheKey, response);

    res.json(response);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ 
      error: 'Failed to generate recommendations',
      recommendations: []
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Guitar Tech Signature API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
