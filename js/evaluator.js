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

