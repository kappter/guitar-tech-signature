export function evaluateTechniqueDistribution(sources, techniques) {
  const tierCounts = {
    Beginner: 0,
    Intermediate: 0,
    Advanced: 0
  };

  sources.forEach(entry => {
    const tech = techniques.find(t => t.technique === entry.technique);
    if (tech) {
      tierCounts[tech.tier]++;
    }
  });

  return tierCounts;
}


// Get top techniques for a guitarist based on confidence scores
export function getTopTechniques(sources, techniques, limit = 5) {
  // Sort sources by confidence score
  const sorted = [...sources].sort((a, b) => {
    const confA = parseFloat(a.confidence) || 0;
    const confB = parseFloat(b.confidence) || 0;
    return confB - confA;
  });
  
  // Get top N techniques
  return sorted.slice(0, limit).map(source => ({
    technique: source.technique,
    confidence: parseFloat(source.confidence) || 0,
    notes: source.notes
  }));
}

// Calculate category distribution
export function getCategoryDistribution(sources, techniques) {
  const categoryCounts = {};
  
  sources.forEach(entry => {
    const tech = techniques.find(t => t.technique === entry.technique);
    if (tech && tech.category) {
      categoryCounts[tech.category] = (categoryCounts[tech.category] || 0) + 1;
    }
  });
  
  return categoryCounts;
}

// Get technique statistics
export function getTechniqueStats(sources, techniques) {
  const distribution = evaluateTechniqueDistribution(sources, techniques);
  const categoryDist = getCategoryDistribution(sources, techniques);
  const topTechniques = getTopTechniques(sources, techniques, 5);
  
  const total = distribution.Beginner + distribution.Intermediate + distribution.Advanced;
  
  return {
    distribution,
    categoryDistribution: categoryDist,
    topTechniques,
    total,
    percentages: {
      Beginner: total > 0 ? ((distribution.Beginner / total) * 100).toFixed(1) : 0,
      Intermediate: total > 0 ? ((distribution.Intermediate / total) * 100).toFixed(1) : 0,
      Advanced: total > 0 ? ((distribution.Advanced / total) * 100).toFixed(1) : 0
    }
  };
}
