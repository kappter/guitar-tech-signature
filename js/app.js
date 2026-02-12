import { loadAllData } from "./dataLoader.js";
import { evaluateTechniqueDistribution, getTopTechniques } from "./evaluator.js";
import { renderBarChart } from "./visualizer.js";
import { generateInsight, checkAPIHealth } from "./aiEvaluator.js";

const guitaristSelect = document.getElementById("guitaristSelect");
const chartContainer = document.getElementById("chartContainer");
const insightText = document.getElementById("insightText");

let guitarists = [];
let techniques = [];
let sources = [];
let currentGuitarist = null;
let apiAvailable = false;

// Initialize the application
async function init() {
  try {
    // Show loading state
    insightText.textContent = "Loading data...";
    
    // Load all data
    const data = await loadAllData();
    guitarists = data.guitarists;
    techniques = data.techniques;
    sources = data.sources;
    
    // Check if API is available
    apiAvailable = await checkAPIHealth();
    if (!apiAvailable) {
      console.warn('AI API not available, using fallback insights');
    }
    
    // Populate guitarist dropdown
    populateGuitaristSelect();
    
    // Reset insight text
    insightText.textContent = "Select a guitarist to view their technique signature.";
    
    console.log(`Loaded ${guitarists.length} guitarists, ${techniques.length} techniques, ${sources.length} sources`);
  } catch (error) {
    console.error('Error initializing app:', error);
    insightText.textContent = "Error loading data. Please refresh the page.";
  }
}

// Populate the guitarist dropdown
function populateGuitaristSelect() {
  // Clear existing options except the first one
  guitaristSelect.innerHTML = '<option value="">— Choose —</option>';
  
  guitarists.forEach(guitarist => {
    const option = document.createElement("option");
    option.value = guitarist.name;
    option.textContent = guitarist.name;
    option.dataset.id = guitarist.id;
    option.dataset.style = guitarist.style;
    guitaristSelect.appendChild(option);
  });
}

// Handle guitarist selection
guitaristSelect.addEventListener("change", async () => {
  const selectedName = guitaristSelect.value;
  if (!selectedName) {
    chartContainer.innerHTML = '';
    insightText.textContent = "Select a guitarist to view their technique signature.";
    currentGuitarist = null;
    return;
  }

  // Find the selected guitarist
  currentGuitarist = guitarists.find(g => g.name === selectedName);
  
  // Get sources for this guitarist
  const guitaristSources = sources.filter(s => s.guitarist === selectedName);
  
  if (guitaristSources.length === 0) {
    insightText.textContent = `No technique data available for ${selectedName}.`;
    chartContainer.innerHTML = '';
    return;
  }
  
  // Calculate distribution
  const distribution = evaluateTechniqueDistribution(guitaristSources, techniques);
  
  // Get top techniques
  const topTechniques = getTopTechniques(guitaristSources, techniques, 5);
  
  // Render visualization
  renderBarChart(chartContainer, distribution);
  
  // Generate AI insight
  await generateAndDisplayInsight(selectedName, distribution, topTechniques, currentGuitarist.style);
});

// Generate and display AI-powered insight
async function generateAndDisplayInsight(guitaristName, distribution, topTechniques, style) {
  // Show loading state
  insightText.innerHTML = '<span class="loading">Generating insight...</span>';
  
  try {
    const insight = await generateInsight(
      guitaristName,
      distribution,
      topTechniques.map(t => t.technique),
      style
    );
    
    // Display the insight with fade-in effect
    insightText.innerHTML = '';
    insightText.textContent = insight;
    insightText.classList.add('fade-in');
    
    // Remove fade-in class after animation
    setTimeout(() => {
      insightText.classList.remove('fade-in');
    }, 500);
    
  } catch (error) {
    console.error('Error generating insight:', error);
    insightText.textContent = "Unable to generate insight at this time.";
  }
}

// Initialize on page load
init();
