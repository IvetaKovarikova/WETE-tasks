/*
1. BAR / DOT / LINE GRAPH

To draw a bar/dot/line graph it is needed to:

  - have a type of graph (typeOfGraph)
  - have a parent element class (htmlParentClass)
  - have array of data (testdata) with index of cell and value [index, value]

  also you can:
  - decide to highlight some values (toHighlight)
  - draw name of graph (drawLabel())
  - draw the legend (drawLegend())
*/

//variables to set
const testData = [
  [0, 1],
  [1, 5],
  [2, 8],
  [3, 9],
  [4, 10],
  [5, 9],
  [6, 8],
  [7, 5],
  [8, 4],
  [9, 9],
  [10, 11],
  [11, 4],
];
const typeOfGraph = "line"; //"bar", "dot", "line"
const htmlParentClass = ".graph";

// main functions
const Y = Math.max(...testData.map(d => d[1])); //max vertically
const X = testData.length; //to have cell for each given value
const { canvas, context } = getCanvas(htmlParentClass,X,Y);
drawGrid(canvas, context);

const toHighlight = []; //[testData[9], testData[3]];
drawGraph(canvas, context, testData, typeOfGraph, toHighlight);

// optional functions
const labelText = "Values of something";
const labelColor = "blue";
drawLabel(labelText, labelColor, htmlParentClass);

drawLegend(canvas, X, htmlParentClass, Y);


/*
2. PIE CHART

To draw a pie graph it is needed to:

  - have a parent element class (htmlParentClass)
  - have array of data (testdata) with label, value and color of circle sector

  also you can:
  - decide to highlight some values (toHiglight)
  - draw name of graph (drawLabel())
  - draw the legend (drawPieLegend())
*/

// variables to set
const testPieData = [
  ["flour", 300, "#D6F49D"],
  ["butter", 120, "#D6C3C9"],
  ["filling", 80, "#AAC0AA"],
  ["sugar", 75, "#B49082"],
  ["eggs", 50, "#D6C3C0"],
];
const htmlParentClassPie = ".pie";

// main functions
const typeOfGraphPie = "pie";
const { canvas: canvasPie, context: contextPie } = getCanvas(htmlParentClassPie);

const toHighlightPie = []; //[testPieData[4], testPieData[1]];
drawGraph(canvasPie, contextPie, testPieData, typeOfGraphPie, toHighlightPie);

// optional functions
const labelTextPie = "Pie ingredients";
const labelColorPie = "#98473E";
drawLabel(labelTextPie, labelColorPie, htmlParentClassPie);

drawPieLegend(canvasPie, testPieData,htmlParentClassPie);