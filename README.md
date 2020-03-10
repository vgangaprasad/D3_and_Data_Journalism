# D3 - Data Journalism and D3

![Newsroom](https://media.giphy.com/media/1mhorntYFPAdccXtKe/giphy.gif)

## Background

Just wanted to analyze current trends that shapes people's lives by creating charts, graphs and interactive elements to help people understand the findings.

This project is to find out stories about the health risks facing particular demographics by sifting through information from the U.S. Census Bureau and the Behavioral Risk Factor Surveillance System.

The data set used for this project is based on 2014 ACS 1-year estimates: [https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml](https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml). Data set incldes data on rates of income, obesity, poverty, etc. by state. MOE stands for "margin of error."

Used D3 to let users interact with your data?

![7-animated-scatter](Images/7-animated-scatter.gif)

#### 1. More Data, More Dynamics

Included more demographics and more risk factors. Placed additional labels in scatter plot and added click events so that users can decide which data to display. Animated the transitions for the circles' locations as well as the range of the axes. Did this for two risk factors for each axis. 

#### 2. Incorporated d3-tip

While the ticks on the axes allow us to infer approximate values for each circle, it's impossible to determine the true value without adding another layer of data. Implemented  in  D3 graphics to reveal a specific element's data when the user hovers their cursor over the element. Added tooltips to the circles and displayed each tooltip with the data that the user has selected. Used the `d3-tip.js` plugin developed by [Justin Palmer](https://github.com/Caged).

![8-tooltip](Images/8-tooltip.gif)

* Check out [David Gotz's example](https://bl.ocks.org/davegotz/bd54b56723c154d25eedde6504d30ad7) to see how to implement tooltips with d3-tip.

- - -

