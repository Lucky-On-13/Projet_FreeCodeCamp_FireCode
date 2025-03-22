
const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

d3.json(url).then(data => {
    const baseTemp = data.baseTemperature;
    const dataset = data.monthlyVariance;
    const margin = { top: 70, right: 30, bottom: 100, left: 80 };
    const width = 1200 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Configuration des mois
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Création du SVG
    const svg = d3.select("#container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(${margin.left},${margin.top})");

    // Échelles
    const xScale = d3.scaleTime()
        .domain([
            d3.min(dataset, d => new Date(d.year, 0)),
            d3.max(dataset, d => new Date(d.year, 0))
        ])
        .range([0, width]);

    const yScale = d3.scaleBand()
        .domain(months)
        .range([0, height])
        .padding(0.01);

    const tempRange = [baseTemp + d3.min(dataset, d => d.variance), 
                     baseTemp + d3.max(dataset, d => d.variance)];
    
    const colorScale = d3.scaleQuantize()
        .domain(tempRange)
        .range(d3.schemeRdYlBu[9].reverse());

    // Axes
    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.timeFormat("%Y"));

    const yAxis = d3.axisLeft(yScale)
        .tickFormat(d => d.substring(0, 3));

    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", "translate(0,${height})")
        .call(xAxis);

    svg.append("g")
        .attr("id", "y-axis")
        .call(yAxis);

    // Cellules
    const cellWidth = width / (2015 - 1753);
    const cellHeight = height / 12;

    svg.selectAll(".cell")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "cell")
        .attr("data-month", d => d.month - 1)
        .attr("data-year", d => d.year)
        .attr("data-temp", d => baseTemp + d.variance)
        .attr("x", d => xScale(new Date(d.year, 0)))
        .attr("y", d => yScale(months[d.month - 1]))
        .attr("width", cellWidth)
        .attr("height", yScale.bandwidth())
        .attr("fill", d => colorScale(baseTemp + d.variance))
        .on("mouseover", showTooltip)
        .on("mouseout", hideTooltip);

    // Tooltip
    const tooltip = d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .style("opacity", 0);

    function showTooltip(event, d) {
        const temp = (baseTemp + d.variance).toFixed(2);
        tooltip.style("opacity", 0.9)
            .attr("data-year", d.year)
            .html(`
                ${d.year} - ${months[d.month - 1]}<br>
                Temp: ${temp}℃<br>
                Variance: ${d.variance.toFixed(2)}℃
            `)
            .style("left", "${event.pageX + 10}px")
            .style("top", "${event.pageY - 60}px");
    }

    function hideTooltip() {
        tooltip.style("opacity", 0);
    }

    // Légende
    const legendWidth = 400;
    const legendHeight = 30;

    const legend = d3.select("#legend")
        .append("svg")
        .attr("width", legendWidth)
        .attr("height", 60);

    const legendScale = d3.scaleLinear()
        .domain(colorScale.domain())
        .range([0, legendWidth - 50]);

    const legendAxis = d3.axisBottom(legendScale)
        .tickSize(15)
        .tickValues(colorScale.thresholds())
        .tickFormat(d3.format(".1f"));

    legend.append("g")
        .attr("transform", "translate(50, 20)")
        .call(legendAxis);

    legend.selectAll("rect")
        .data(colorScale.range())
        .enter()
        .append("rect")
        .attr("x", (d, i) => 50 + (i * (legendWidth - 50) / colorScale.range().length))
        .attr("y", 0)
        .attr("width", (legendWidth - 50) / colorScale.range().length)
        .attr("height", 15)
        .attr("fill", d => d);
});
