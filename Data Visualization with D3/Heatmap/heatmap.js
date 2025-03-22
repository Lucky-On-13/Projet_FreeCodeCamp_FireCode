const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

d3.json(url).then(data => {
    const baseTemp = data.baseTemperature;
    const dataset = data.monthlyVariance;
    const margin = { top: 70, right: 30, bottom: 100, left: 80 };
    const width = 1200 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const svg = d3.select("#container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Ajuster le domaine de l'échelle des x pour inclure 2010
    const xScale = d3.scaleTime()
        .domain([
            d3.min(dataset, d => new Date(d.year, 0)),
            new Date(2010, 0) // Forcer l'axe à s'étendre jusqu'à 2010
        ])
        .range([0, width]);

    const yScale = d3.scaleBand()
        .domain(months)
        .range([0, height])
        .padding(0.01);

    // Ajuster le domaine de l'échelle de couleurs pour correspondre à l'image
    const colorScale = d3.scaleQuantize()
        .domain([2.8, 12.8]) // Domaine ajusté pour correspondre à l'image
        .range(d3.schemeRdYlBu[9].reverse()); // 9 couleurs et ordre inversé

    // Ajuster les ticks de l'axe des abscisses pour qu'ils soient espacés de 10 en 10
    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.timeFormat("%Y"))
        .ticks(d3.timeYear.every(10)); // Afficher les ticks tous les 10 ans

    const yAxis = d3.axisLeft(yScale)
        .tickFormat(d => d.substring(0, 3));

    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis);

    svg.append("g")
        .attr("id", "y-axis")
        .call(yAxis);

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
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 60}px`);
    }

    function hideTooltip() {
        tooltip.style("opacity", 0);
    }

    const legendWidth = 400;
    const legendHeight = 30;

    const legend = d3.select("#legend")
        .append("svg")
        .attr("width", legendWidth)
        .attr("height", 60);

    const legendScale = d3.scaleLinear()
        .domain(colorScale.domain()) // Utiliser le même domaine que colorScale
        .range([0, legendWidth - 50]);

    const legendAxis = d3.axisBottom(legendScale)
        .tickSize(15)
        .tickValues(colorScale.thresholds()) // Utiliser les seuils de colorScale
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