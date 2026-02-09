export async function loadGuitarists() {
  const response = await fetch('data/guitarists.csv');
  const text = await response.text();

  const rows = text.trim().split('\n');
  const headers = rows.shift().split(',');

  return rows.map(row => {
    const values = row.split(',');
    return Object.fromEntries(
      headers.map((h, i) => [h.trim(), values[i].trim()])
    );
  });
}
