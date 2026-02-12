// Data Loader Module
// Loads CSV data for guitarists, techniques, and sources

export async function loadCSV(filename) {
  const response = await fetch(filename);
  const text = await response.text();
  
  const rows = text.trim().split('\n');
  const headers = rows.shift().split(',');
  
  return rows.map(row => {
    const values = row.split(',');
    return Object.fromEntries(
      headers.map((h, i) => [h.trim(), values[i]?.trim() || ''])
    );
  });
}

export async function loadGuitarists() {
  return loadCSV('data/guitarists.csv');
}

export async function loadTechniques() {
  return loadCSV('data/techniques.csv');
}

export async function loadSources() {
  return loadCSV('data/sources.csv');
}

// Load all data at once
export async function loadAllData() {
  const [guitarists, techniques, sources] = await Promise.all([
    loadGuitarists(),
    loadTechniques(),
    loadSources()
  ]);
  
  return { guitarists, techniques, sources };
}
