var svgWidth = 800;
var svgHeight = 600;

var margin = {
  top: 40,
  right: 50,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


  // Initial Params
var chosenXAxis = "age";
var chosenYAxis = "obesity";

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
      d3.max(censusData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);
  return xLinearScale;

}

// function used for updating y-scale var upon click on axis label
function yScale(censusData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.9,
      d3.max(censusData, d => d[chosenYAxis]) * 1.1
    ])
    .range([height,0]);

  return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}


// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles

function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.selectAll("circle").transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));

  circlesGroup.selectAll("text").transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  if (chosenXAxis === "age") {
      var xLabel = "Median Age";
  }

  else if (chosenXAxis === "income") {
      var xLabel = "Median Household Income";
  }

  else {
      var xLabel = "Poverty Rate";
  }

  if (chosenYAxis === "obesity") {
      var yLabel = "% Obese";
  }

  else if (chosenYAxis === "smokes") {
      var yLabel = "% Smokes";
  }

  else {
      var yLabel = "% Lacking Healthcare";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${xLabel} ${d[chosenXAxis]} <br>${yLabel} ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Import Data
d3.csv("D3-Challenge/assets/data/censusdata.csv").then(function(censusData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    censusData.forEach(function(data) {
      data.poverty = parseFloat(data.poverty);
      data.age = parseFloat(data.age);
      data.income = +data.income;
      data.healthcare = parseFloat(data.healthcare);
      data.obesity = parseFloat(data.obesity);
      data.smokes = parseFloat(data.smokes);
    });

    // Step 2: Create scale functions
    // ==============================
    // xLinearScale function above csv import
    var xLinearScale = xScale(censusData, chosenXAxis);

    // Create y scale function
    var yLinearScale = yScale(censusData, chosenYAxis);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .attr("transform", `translate(0, 0)`)
        .call(leftAxis);

    // Step 5: Create Circles
    // ==============================

    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("g");
        //.attr("transform", d => "translate("+xLinearScale(d.poverty)+","+yLinearScale(d.healthcare)+")");

    circlesGroup.append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", "15")
        .attr("opacity", "0.75")
        .attr("fill","pink")
        .classed("stateCircle", true);

    circlesGroup.append("text")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .attr("dy",6)
        .classed("stateText", true)
        .attr("text-anchor", "middle")
        .style("font-size",1.5)
        .text(d => d.abbr);
        
        


    // Create group for 3 x- axis labels
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var ageLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 25)
        .attr("value", "age") // value to grab for event listener
        .classed("active", true)
        .text("Age (Median)");

    var incomeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 50)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Household Income (Median)");

    var povertyLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 75)
        .attr("value", "poverty") // value to grab for event listener
        .classed("inactive", true)
        .text("In Poverty (%)");


    // // Create group for three y-axis labels
    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${-margin.left}, ${height / 2}) rotate(-90)`);

    var obesityLabel = yLabelsGroup.append("text")
        .attr("y", 5)
        .attr("x", 0)
        .attr("dy", "1em")
        .attr("value", "obesity")
        .classed("axis-text", true)
        .classed("active", true)
        .text("Obese (%)");

    var smokesLabel = yLabelsGroup.append("text")
        .attr("y", 30)
        .attr("x", 0)
        .attr("dy", "1em")
        .attr("value", "smokes")
        .classed("axis-text", true)
        .classed("inactive", true)
        .text("Smoke (%)");

    var healthcareLabel = yLabelsGroup.append("text")
        .attr("y", 55)
        .attr("x", 0)
        .attr("dy", "1em")
        .attr("value", "healthcare")
        .classed("axis-text", true)
        .classed("inactive", true)
        .text("Lack Healthcare (%)");


  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);


  // X axis labels event listener
  xLabelsGroup.selectAll("text")
      .on("click", function () {
        // Get value of selection
        var xValue = d3.select(this).attr("value");
        if (xValue !== chosenXAxis) {

            // Replace chosenXAxis with value
            chosenXAxis = xValue

            // Below functions also found above CSV import
            // Updates x scale for new data
            xLinearScale = xScale(censusData, chosenXAxis);
//            yLinearScale = yScale(censusData, chosenYAxis);

            // Updates x axis with transition
            xAxis = renderXAxes(xLinearScale, xAxis);

            // Updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            // Updates tooltips with new data
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            // Change classes to change bold text
            xLabelsGroup.selectAll("text")
                .classed("inactive", true)
                .classed("active", false);

            var labelMap = {
              income: incomeLabel,
              age: ageLabel,
              poverty: povertyLabel
            }

          labelMap[chosenXAxis].classed("active", true).classed("inactive", false);
        }
      });

    // Y axis labels event listener
    yLabelsGroup.selectAll("text")
        .on("click", function () {
            // Get value of selection
            var yValue = d3.select(this).attr("value");
            if (yValue !== chosenYAxis) {

            // Replace chosenXAxis with value
            chosenYAxis = yValue

            // Below functions also found above CSV import
            // Updates x scale for new data
            //xLinearScale = xScale(censusData, chosenXAxis);
            yLinearScale = yScale(censusData, chosenYAxis);

            // Updates y axis with transition
            yAxis = renderYAxes(yLinearScale, yAxis);

            // Updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            // Updates tooltips with new data
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            // Change classes to change bold text

            yLabelsGroup.selectAll("text")
                .classed("inactive", true)
                .classed("active", false);

            var labelMap = {
              obesity: obesityLabel,
              smokes: smokesLabel,
              healthcare: healthcareLabel
            }
            labelMap[chosenYAxis].classed("active", true).classed("inactive", false);

          }
      });
}).catch(function (error) {
  console.log(error);
});