// Chart parameters
var svgWidth = 960;
var svgHeight = 500;

var margin = {top: 30, right: 30, bottom: 80, left: 60};

// Make responsive
//function makeResponsive() {

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

    // Retrieve data from the CSV file and execute everything below
    d3.csv("assets/data/data.csv").then(function (healthRisks, err) {
        if (err) throw err;

        console.log(healthRisks);

        // Parse the data
        healthRisks.forEach(function (data) {
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
            //data.smokes = +data.smokes;
            //data.age = +data.age;
        });

        // xLinearScale function above csv import
        // var xLinearScale = xScale(healthRisks, chosenXAxis);
        var xLinearScale = d3.scaleLinear()
            .domain([8, d3.max(healthRisks, d => d.poverty)])
            .range([0, width]);

        // Create y scale function
        var yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(healthRisks, d => d.healthcare)])
            .range([height, 0]);

        // Create initial axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // append x axis
        var xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        // append y axis
        chartGroup.append("g")
            .call(leftAxis);

        // append initial circles
        var circlesGroup = chartGroup.selectAll("circle")
            .data(healthRisks)
            .enter()
            .append("circle")
            //.attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cx", d => xLinearScale(d.poverty))
            .attr("cy", d => yLinearScale(d.healthcare))
            .attr("r", 20)
            .attr("fill", "blue")
            .attr("opacity", ".5");

        // Create group for two x-axis labels
        var labelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${width / 2}, ${height + 10})`);

        var povertyLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "poverty") // value to grab for event listener
            .classed("active", true)
            .text("In Poverty (%)");

        //var albumsLabel = labelsGroup.append("text")
            //.attr("x", 0)
            //.attr("y", 40)
            //.attr("value", "smokes") // value to grab for event listener
            //.classed("inactive", true)
            //.text("# of Albums Released");

        // append y axis
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .classed("axis-text", true)
            .text("Lacks Healthcare (%)");

    });


// Call function when browser loads
//makeResponsive();

// Call function when browser window is resized
//d3.select(window).on("resize", makeResponsive);



// // Initial Params
// var chosenXAxis = "poverty";

// // function used for updating x-scale var upon click on axis label
// function xScale(healthRisks, chosenXAxis) {
//   // create scales
//   var xLinearScale = d3.scaleLinear()
//     .domain([d3.min(healthRisks, d => d[chosenXAxis]) * 0.8,
//       d3.max(healthRisks, d => d[chosenXAxis]) * 1.2
//     ])
//     .range([0, width]);

//   return xLinearScale;

// }

// // function used for updating xAxis var upon click on axis label
// function renderAxes(newXScale, xAxis) {
//   var bottomAxis = d3.axisBottom(newXScale);

//   xAxis.transition()
//     .duration(1000)
//     .call(bottomAxis);

//   return xAxis;
// }

// // function used for updating circles group with a transition to
// // new circles
// function renderCircles(circlesGroup, newXScale, chosenXAxis) {

//   circlesGroup.transition()
//     .duration(1000)
//     .attr("cx", d => newXScale(d[chosenXAxis]));

//   return circlesGroup;
// }

// // function used for updating circles group with new tooltip
// function updateToolTip(chosenXAxis, circlesGroup) {

//   var label;

//   if (chosenXAxis === "poverty") {
//     label = "Hair Length:";
//   }
//   else {
//     label = "# of Albums:";
//   }

//   var toolTip = d3.tip()
//     .attr("class", "tooltip")
//     .offset([80, -60])
//     .html(function(d) {
//       return (`${d.rockband}<br>${label} ${d[chosenXAxis]}`);
//     });

//   circlesGroup.call(toolTip);

//   circlesGroup.on("mouseover", function(data) {
//     toolTip.show(data);
//   })
//     // onmouseout event
//     .on("mouseout", function(data, index) {
//       toolTip.hide(data);
//     });

//   return circlesGroup;
// }



//   // updateToolTip function above csv import
//   var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

//   // x axis labels event listener
//   labelsGroup.selectAll("text")
//     .on("click", function() {
//       // get value of selection
//       var value = d3.select(this).attr("value");
//       if (value !== chosenXAxis) {

//         // replaces chosenXAxis with value
//         chosenXAxis = value;

//         // console.log(chosenXAxis)

//         // functions here found above csv import
//         // updates x scale for new data
//         xLinearScale = xScale(healthRisks, chosenXAxis);

//         // updates x axis with transition
//         xAxis = renderAxes(xLinearScale, xAxis);

//         // updates circles with new x values
//         circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

//         // updates tooltips with new info
//         circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

//         // changes classes to change bold text
//         if (chosenXAxis === "smokes") {
//           albumsLabel
//             .classed("active", true)
//             .classed("inactive", false);
//         r povertyLabel
//             .classed("active", false)
//             .classed("inactive", true);
//         }
//         else {
//           albumsLabel
//             .classed("active", false)
//             .classed("inactive", true);
//         r povertyLabel
//             .classed("active", true)
//             .classed("inactive", false);
//         }
//       }
//     });
// }).catch(function(error) {
//   console.log(error);
// });
