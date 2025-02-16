const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

d3.json(url).then(data => {
    const dataset = data.data;

    const margin = { top: 60, right: 30, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
        .domain([new Date(dataset[0][0]), new Date(dataset[dataset.length - 1][0])])
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d[1])])
        .range([height, 0]);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis);

    svg.append("g")
        .attr("id", "y-axis")
        .call(yAxis);

    svg.selectAll(".bar")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("data-date", d => d[0])
        .attr("data-gdp", d => d[1])
        .attr("x", d => x(new Date(d[0])))
        .attr("y", d => y(d[1]))
        .attr("width", width / dataset.length)
        .attr("height", d => height - y(d[1]))
        .on("mouseover", (event, d) => {
            const tooltip = d3.select("#tooltip");
            tooltip.transition().duration(200).style("opacity", .9);
            tooltip.html(`Date: ${d[0]}<br>GDP: ${d[1]}`)
                .attr("data-date", d[0])
                .style("left", `${event.pageX + 5}px`)
                .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", () => {
            const tooltip = d3.select("#tooltip");
            tooltip.transition().duration(500).style("opacity", 0);
        });
});
