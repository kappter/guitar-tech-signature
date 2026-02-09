import { loadCSV } from "./dataLoader.js";
import { evaluateTechniqueDistribution } from "./evaluator.js";
import { renderBarChart } from "./visualizer.js";
import { loadGuitarists } from './dataLoader.js';

const guitaristSelect = document.getElementById("guitaristSelect");
const chartContainer = document.getElementById("chartContainer");
const insightText = document.getElementById("insightText");

let techniques = [];
let sources = [];

const select = document.getElementById('guitaristSelect');

async function init() {
  const guitarists = await loadGuitarists();

  guitarists.forEach(g => {
    const option = document.createElement('option');
    option.value = g.id;       // or g.name
    option.textContent = g.name;
    select.appendChild(option);
  });
}

function populateGuitaristSelect(guitarists) {
  guitarists.forEach(guitarist => {
    const option = document.createElement("option");
    option.value = guitarist.name;
    option.textContent = guitarist.name;
    guitaristSelect.appendChild(option);
  });
}

guitaristSelect.addEventListener("change", () => {
  const selected = guitaristSelect.value;
  if (!selected) return;

  const guitaristSources = sources.filter(s => s.guitarist === selected);
  const distribution = evaluateTechniqueDistribution(guitaristSources, techniques);

  renderBarChart(chartContainer, distribution);

  insightText.textContent =
    "This guitarist emphasizes foundational and textural techniques over speed-driven expression.";
});

init();
