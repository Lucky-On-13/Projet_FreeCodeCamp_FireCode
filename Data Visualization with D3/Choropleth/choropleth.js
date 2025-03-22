const width = 1000, height = 600, legendWidth = 300;

const svg = d3.select("#choropleth")
    .attr("width", width)
    .attr("height", height);

const tooltip = d3.select("#tooltip");

const legendSvg = d3.select("#legend")
    .attr("width", legendWidth)
    .attr("height", 50);

const educationDataUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const countyDataUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
