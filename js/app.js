import { loadCSV } from "./dataLoader.js";

const guitaristSelect = document.getElementById("guitaristSelect");

async function init() {
  const guitarists = await loadCSV("data/guitarists.csv");
  populateGuitaristSelect(guitarists);
}

function populateGuitaristSelect(guitarists) {
  guitarists.forEach(guitarist => {
    const option = document.createElement("option");
    option.value = guitarist.name;
    option.textContent = guitarist.name;
    guitaristSelect.appendChild(option);
  });
}

init();

