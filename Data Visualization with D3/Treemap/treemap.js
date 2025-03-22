// Data URL
const movieDataUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

// Fetch the dataset
d3.json(movieDataUrl).then(data => {
  // Set up the SVG container
  const svg = d3.select("#treemap");
  const width = svg.attr("width");
  const height = svg.attr("height");
