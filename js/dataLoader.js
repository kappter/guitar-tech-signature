export async function loadCSV(path) {
  const response = await fetch(path);
  const text = await response.text();

  const lines = text.trim().split("\n");
  const headers = lines.shift().split(",");

  return lines.map(line => {
    const values = line.split(",");
    const entry = {};
    headers.forEach((h, i) => {
      entry[h.trim()] = values[i]?.trim();
    });
    return entry;
  });
}

