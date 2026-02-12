// Visualizer Module
// Renders charts and visualizations

export function renderBarChart(container, data) {
  container.innerHTML = "";

  const maxValue = Math.max(...Object.values(data));
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);

  Object.entries(data).forEach(([tier, value]) => {
    const barWrapper = document.createElement("div");
    barWrapper.className = "bar-wrapper";

    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
    
    const label = document.createElement("span");
    label.className = "bar-label";
    label.textContent = `${tier} (${value} techniques, ${percentage}%)`;

    const bar = document.createElement("div");
    bar.className = `bar bar-${tier.toLowerCase()}`;
    const barWidth = maxValue > 0 ? (value / maxValue) * 100 : 0;
    bar.style.width = `${barWidth}%`;
    
    // Add count label inside bar if wide enough
    if (barWidth > 15) {
      const countLabel = document.createElement("span");
      countLabel.className = "bar-count";
      countLabel.textContent = value;
      bar.appendChild(countLabel);
    }

    barWrapper.appendChild(label);
    barWrapper.appendChild(bar);
    container.appendChild(barWrapper);
  });
}

// Render category distribution chart
export function renderCategoryChart(container, data) {
  container.innerHTML = "";

  const maxValue = Math.max(...Object.values(data));
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);

  // Sort categories by value
  const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);

  sorted.forEach(([category, value]) => {
    const barWrapper = document.createElement("div");
    barWrapper.className = "bar-wrapper";

    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
    
    const label = document.createElement("span");
    label.className = "bar-label";
    label.textContent = `${category} (${value}, ${percentage}%)`;

    const bar = document.createElement("div");
    bar.className = `bar bar-category`;
    bar.style.width = `${(value / maxValue) * 100}%`;
    bar.style.backgroundColor = getCategoryColor(category);

    barWrapper.appendChild(label);
    barWrapper.appendChild(bar);
    container.appendChild(barWrapper);
  });
}

// Get color for category
function getCategoryColor(category) {
  const colors = {
    'Foundational': '#6fcf97',
    'Expressive': '#f2c94c',
    'Advanced': '#eb5757',
    'Textural': '#bb86fc',
    'Harmonic': '#56ccf2',
    'Rhythmic': '#ff6b6b'
  };
  return colors[category] || '#7aa2f7';
}
