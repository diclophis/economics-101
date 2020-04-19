//

import * as GameLoop from './game-loop.js';

var allPoints = [];
var lastTime = 0;
var halted = false;

var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
//svg.setAttribute("viewBox", "0 0 256 256");
svg.setAttribute("preserveAspectRatio", "xMinYMax slice");
//svg.setAttribute("preserveAspectRatio", "slice");
//svg.setAttribute("preserveAspectRatio", "XMaxYMax");
svg.setAttribute("version", "1.1");
svg.setAttribute("width", "512");
svg.setAttribute("height", "256");
svg.setAttribute("aria-hidden", "true");

var path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
path.setAttribute('fill', "red");
path.setAttribute('stroke', "blue");
path.setAttribute('stroke-width', "1px");
path.setAttribute('id', "arrow1");

svg.appendChild(path);

document.body.appendChild(svg);

var button = document.createElement('button');
button.innerText = "halt";
button.addObserver('click', function() {
  halted = !halted;
});

document.body.appendChild(button);

var pointsToPath = function(points, scale, graphSize) {
  var d = ``;

  var pointCount = 0;

  var lastPoint = null;

  var fx = 0;
  
  if (allPoints.length > 0) {
    fx = allPoints[allPoints.length-1][0] * scale;
  }

  //points.forEach(function(point, index) {
  for (var i=points.length-1; i>0; i-=1) {
    var point = points[i];

    var cx = point[0] * scale;
    var cy = point[1] * scale;

    if (lastPoint) {
    //(points.length < windowSize) || (points.length > windowSize && index > (points.length - windowSize))) {
      var lx = lastPoint[0] * scale;
      var ly = lastPoint[1] * scale;

      //if (i == allPoints.length -2) {
      //  console.log(lx);
      //}

      if (cx > (fx - graphSize)) {
        d += `M ${lx} ${ly} `;
        d += `L ${cx} ${cy} `;
        pointCount += 1;
      }
    }
      
    lastPoint = point;
  }

  d += `z`;

  //console.log(pointCount);

  return d;
}

var addTestPoint = function(globalTime, frequency, amplitude) {
  var newPoint = [];
  newPoint[0] = globalTime;
  newPoint[1] = (Math.sin(globalTime * frequency) * amplitude) + 128;

  allPoints.push(newPoint);
};

var plotWindow = function(scale, graphSize) {
  path.setAttribute('d', pointsToPath(allPoints, scale, graphSize));

  if (allPoints.length > 0) {
    var fx = allPoints[allPoints.length-1][0] * scale;
    //if (allPoints.length > windowSize) {
    //if (allPoints.length
    //  //svg.setAttribute("viewBox", `${allPoints[allPoints.length-windowSize-1][0]} 0 ${allPoints[allPoints.length-1][0]+parseInt(svg.getAttribute('width'))} 256`);
    if (fx > graphSize) {
      svg.setAttribute("viewBox", `${fx - graphSize} 0 ${fx} 256`);
    }
  }
};

var plotTest = function(globalTime) {
  var graphSize = 512;
  var scale = 1.0;

  var frameTime = globalTime - lastTime;

  //elapsed += frameTime;

  if (!halted) {
    addTestPoint(globalTime, 0.025, 100.0);
    plotWindow(scale, graphSize);
  }

  lastTime = globalTime;

  window.requestAnimationFrame(plotTest);
  //window.setTimeout(plotTest, 1);
};

plotTest(0);

//window.setInterval(function() {
