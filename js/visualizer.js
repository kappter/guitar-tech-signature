export function renderBarChart(container, data) {
  container.innerHTML = "";

  const maxValue = Math.max(...Object.values(data));

  Object.entries(data).forEach(([tier, value]) => {
    const barWrapper = document.createElement("div");
    barWrapper.className = "bar-wrapper";

    const label = document.createElement("span");
    label.className = "bar-label";
    label.textContent = `${tier} (${value})`;

    const bar = document.createElement("div");
    bar.className = `bar bar-${tier.toLowerCase()}`;
    bar.style.width = `${(value / maxValue) * 100}%`;

    barWrapper.appendChild(label);
    barWrapper.appendChild(bar);
    container.appendChild(barWrapper);
  });
}

