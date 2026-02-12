// AI Evaluator Module
// Handles communication with the backend AI API

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000'
  : 'https://your-api-domain.com'; // Update with your deployed API URL

// Request with retry logic
async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

// Generate AI insight for a guitarist
export async function generateInsight(guitarist, distribution, topTechniques, style) {
  try {
    const response = await fetchWithRetry(`${API_BASE_URL}/api/insight`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        guitarist,
        distribution,
        topTechniques,
        style
      })
    });

    return response.insight || response.fallback;
  } catch (error) {
    console.error('Error generating insight:', error);
    return generateFallbackInsight(guitarist, distribution, topTechniques);
  }
}

// Compare multiple guitarists
export async function compareGuitarists(guitarists) {
  try {
    const response = await fetchWithRetry(`${API_BASE_URL}/api/compare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ guitarists })
    });

    return response.comparison || response.fallback;
  } catch (error) {
    console.error('Error comparing guitarists:', error);
    return 'Unable to generate comparison at this time.';
  }
}

// Get recommendations for similar guitarists
export async function getRecommendations(guitarist, allGuitarists) {
  try {
    const response = await fetchWithRetry(`${API_BASE_URL}/api/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        guitarist,
        allGuitarists
      })
    });

    return response.recommendations || [];
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return [];
  }
}

// Fallback insight generation (rule-based)
function generateFallbackInsight(guitarist, distribution, topTechniques) {
  const total = (distribution.Beginner || 0) + (distribution.Intermediate || 0) + (distribution.Advanced || 0);
  const beginnerPct = ((distribution.Beginner || 0) / total * 100).toFixed(0);
  const intermediatePct = ((distribution.Intermediate || 0) / total * 100).toFixed(0);
  const advancedPct = ((distribution.Advanced || 0) / total * 100).toFixed(0);

  let insight = `${guitarist}'s technique signature reveals `;

  if (advancedPct > 40) {
    insight += `a strong emphasis on advanced techniques (${advancedPct}%), demonstrating sophisticated technical mastery. `;
  } else if (intermediatePct > 50) {
    insight += `a balanced approach with emphasis on intermediate expressive techniques (${intermediatePct}%), showing refined musical communication. `;
  } else {
    insight += `a foundation-focused approach (${beginnerPct}% foundational techniques), emphasizing core skills and musical fundamentals. `;
  }

  if (topTechniques && topTechniques.length > 0) {
    insight += `Key techniques include ${topTechniques.slice(0, 3).join(', ')}, which define their distinctive musical voice. `;
  }

  insight += `This distribution reflects intentional choices about musical expression rather than technical limitations, creating a unique sonic signature.`;

  return insight;
}

// Check if API is available
export async function checkAPIHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.ok;
  } catch (error) {
    console.warn('API health check failed:', error);
    return false;
  }
}
