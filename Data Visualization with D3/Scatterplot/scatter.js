const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

d3.json(url).then(data => {
    const margin = { top: 50, right: 100, bottom: 50, left: 50 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.Year) - 1, d3.max(data, d => d.Year) + 1])
        .range([0, width]);

    const yScale = d3.scaleTime()
        .domain([d3.min(data, d => new Date(d.Seconds * 1000)), d3.max(data, d => new Date(d.Seconds * 1000))])
        .range([0, height]);

    // Correction de l'ordre des couleurs
    const colorScale = d3.scaleOrdinal()
        .domain([false, true]) // "false" pour "No Doping", "true" pour "Doping"
        .range(["orange", "blue"]); // "blue" pour "No Doping", "orange" pour "Doping"

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis);

    svg.append("g")
        .attr("id", "y-axis")
        .call(yAxis);

    svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d.Year))
        .attr("cy", d => yScale(new Date(d.Seconds * 1000)))
        .attr("r", 5)
        .attr("data-xvalue", d => d.Year)
        .attr("data-yvalue", d => new Date(d.Seconds * 1000))
        .attr("fill", d => colorScale(d.Doping !== "")) 
        .on("mouseover", (event, d) => {
            d3.select("#tooltip")
                .style("opacity", 1)
                .attr("data-year", d.Year)
                .html(`${d.Name}: ${d.Time}<br>Year: ${d.Year}<br>${d.Doping}`)
                .style("left", `${event.pageX + 5}px`)
                .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", () => {
            d3.select("#tooltip")
                .style("opacity", 0);
        });

    // Ajout de la légende avec un meilleur placement et des couleurs correctes
    const legend = svg.append("g")
        .attr("id", "legend")
        .attr("transform", `translate(${width - 80},${20})`); // Déplacé vers le haut à droite

    
    const legendData = [
        { label: "No Doping Allegations", color: colorScale(false) },
        { label: "Riders with doping allegations", color: colorScale(true) }
    ];

    legend.selectAll("rect")
        .data(legendData)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", (d, i) => i * 20)
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", d => d.color);

    legend.selectAll("text")
        .data(legendData)
        .enter()
        .append("text")
        .attr("x", 24)
        .attr("y", (d, i) => i * 20 + 9)
        .attr("dy", "0.35em")
        .text(d => d.label);
});