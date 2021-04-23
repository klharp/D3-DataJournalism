// Chart parameters
var svgWidth = 900;
var svgHeight = 500;

var margin = { top: 30, right: 30, bottom: 100, left: 95 };

// Make responsive
//function makeResponsive() {

//remove SVG area if not empty and replace with resized version
var svgArea = d3.select("body").select("svg");

//clear svg not empty
if (!svgArea.empty()) {
    svgArea.remove();
}

//Create the SVG wrapper, append SVG group, move left and top margins
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params (to be used later to switch graphs)
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";
var radius = 15
console.log(chosenYAxis);


// **** Functions to update x and Y scales and axes **** //
//Function to update x-scale var upon clicking label
function xScale(healthRisks, chosenXaxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthRisks, d => d[chosenXaxis]) * .7,
        d3.max(healthRisks, d => d[chosenXAxis]) * 1.1
        ])
        .range([0, width]);
    return xLinearScale;
}

// Function for updating xAxis var upon clicking label
function renderXAxes(newXscale, xAxis) {
    var bottomAxis = d3.axisBottom(newXscale);
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
}

//Function to update y-scale var upon clicking label
function yScale(healthRisks, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(healthRisks, d => d[chosenYAxis]) * .7,
        d3.max(healthRisks, d => d[chosenYAxis]) * 1.1
        ])
        .range([height, 0]);
    return yLinearScale;
}

// Function for updating yAxis var upon clicking label
function renderYAxes(newYscale, yAxis) {
    var leftAxis = d3.axisLeft(newYscale);
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;
}



// **** Functions to update circles **** //
// Function for updating circles group with x-axis transtion 
function renderXCircles(circlesGroup, newXscale, chosenXAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXscale(d[chosenXAxis]));
    return circlesGroup;
}

// Function for updating circles text group with transtion 
function renderXText(circlesTextGroup, newXscale, chosenXAxis) {
    circlesTextGroup.transition()
        .duration(1000)
        .attr("x", d => newXscale(d[chosenXAxis]));
    return circlesTextGroup;
}

// Function for updating circles group with y-axis transtion 
function renderYCircles(circlesGroup, newYscale, chosenYAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cy", d => newYscale(d[chosenYAxis]));
    return circlesGroup;
}

// Function for updating circles text group with transtion 
function renderYText(circlesTextGroup, newYscale, chosenYAxis) {
    circlesTextGroup.transition()
        .duration(1000)
        .attr("y", d => newYscale(d[chosenYAxis]));
    return circlesTextGroup;
}

// **** Function to update tooltip **** //
// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {
//function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    var label;

    if (chosenXAxis === "poverty") {
        label = "In Poverty (%):";
    }
    else if (chosenXAxis === "age") {
        label = "Average Age (years)";
    }
    else {
        label = "Average Income ($)";
    }

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([65, 65])
        .html(function (d) {
            return (`<b>${d.state}</b><br>${label} ${d[chosenXAxis]}`);
           // return (`${d.state}<br>${label} ${d[chosenXAxis]} $chosenYAxis`);
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data, this);
    })
        // onmouseout event
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    return circlesGroup;
}



// **** Load CSV, parse the data and create initial axes **** //
// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function (healthRisks, err) {
    if (err) throw err;

    console.log(healthRisks);

    // Parse the data
    healthRisks.forEach(function (data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.abbr = data.abbr;
        data.smokes = +data.smokes;
        data.age = +data.age;
        data.obesity = +data.obesity;
        data.income = +data.income;
    });

    // Create x and y scale function
    var xLinearScale = xScale(healthRisks, chosenXAxis);
    var yLinearScale = yScale(healthRisks, chosenYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);



    // **** Append data **** //
    // Append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // Append y axis
    var yAxis = chartGroup.append("g")
        .call(leftAxis);

    // Append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthRisks)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        //.attr("cx", d => xLinearScale(d.poverty))
        //.attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", radius)
        .attr("fill", "#a8bae8")
        .attr("stroke", "#021e66")
        .attr("opacity", ".6");

    // Append initial state abbreviations in circles
    var circlesLabelsGroup = chartGroup.selectAll(".stateAbbr")
        .data(healthRisks)
        .enter()
        .append("text")
        .classed("stateAbbr", true)
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        //.attr("x", d => xLinearScale(d.poverty))
        //.attr("y", d => yLinearScale(d.healthcare))
        .attr("text-anchor", "middle")
        .attr("dy", 4)
        .text(data => data.abbr)
        .style("font-size", 10)
        .style("font-weight", "bold")

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);


    // **** Axis Label Groups **** //
    // Create group for three x-axis labels
    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 10})`);

    var povertyLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 30)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)");

    var ageLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 50)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Average Age (Years)");

    var incomeLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 70)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Average Income ($)");

    // Create group for three y-axis labels
    var ylabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)");

    var healthcareLabel = ylabelsGroup.append("text")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", 60)
        .classed("active", true)
        .text("Lacks Healthcare (%)");

    var smokesLabel = ylabelsGroup.append("text")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", 40)
        .classed("inactive", true)
        .text("People Who Smoke (%)");

    var obeseLabel = ylabelsGroup.append("text")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", 20)
        .classed("inactive", true)
        .text("People Who Are Obese  (%)");

    // **** Event Listeners **** //
    // x axis labels event listener
    xlabelsGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

                // Replace chosenXAxis with value
                chosenXAxis = value;

                console.log(chosenXAxis)

                // Functions here found above csv import
                // Update x scale for new data
                xLinearScale = xScale(healthRisks, chosenXAxis);

                // Update x axis with transition
                xAxis = renderXAxes(xLinearScale, xAxis);

                // Update circles with new x values
                circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);
                circlesLabelsGroup = renderXText(circlesLabelsGroup, xLinearScale, chosenXAxis);

                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
                //circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                // Change classes to change bold text
                if (chosenXAxis === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenXAxis === "age") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });

    // y axis labels event listener
    ylabelsGroup.selectAll("text")
        .on("click", function () {
            // Get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenYAxis) {

                // Replace chosenYAxis with value
                chosenYAxis = value;

                console.log(`chosenYAxis =${chosenYAxis}`);
                console.log(chosenYAxis);

                // Functions here found above csv import
                // Update y scale for new data
                yLinearScale = yScale(healthRisks, chosenYAxis);

                // Update y axis with transition
                yAxis = renderYAxes(yLinearScale, yAxis);

                // Update circles with new y values
                circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);
                circlesLabelsGroup = renderYText(circlesLabelsGroup, yLinearScale, chosenYAxis);

                // updates tooltips with new info
                //circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                // changes classes to change bold text
                if (chosenYAxis === "healthcare") {
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obeseLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenYAxis === "smokes") {
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    obeseLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obeseLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });

});
