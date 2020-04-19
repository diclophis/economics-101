//

import * as GameLoop from './game-loop.js';

var allPoints = [];
var lastTime = 0;
var halted = false;
var globalScale = 1.0;
var balance = 0.0;

var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute("preserveAspectRatio", "xMinYMax slice");
svg.setAttribute("version", "1.1");
svg.setAttribute("aria-hidden", "true");

var path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
path.setAttribute('fill', "red");
path.setAttribute('stroke', "blue");
path.setAttribute('stroke-width', "1px");
path.setAttribute('id', "arrow1");

svg.appendChild(path);

document.body.appendChild(svg);

var haltButton = document.createElement('button');
haltButton.innerText = "halt";
haltButton.addEventListener('click', function() {
  halted = !halted;
});
document.body.appendChild(haltButton);

var zoomOutButton = document.createElement('button');
zoomOutButton.innerText = "-";
zoomOutButton.addEventListener('click', function() {
  globalScale *= 0.9;
});
document.body.appendChild(zoomOutButton);
var zoomInButton = document.createElement('button');
zoomInButton.innerText = "+";
zoomInButton.addEventListener('click', function() {
  globalScale *= 1.1;
});
document.body.appendChild(zoomInButton);

var debugSpan = document.createElement("span");
document.body.appendChild(debugSpan);

var getFarX = function(points, scale) {
  var fx = 0;
  if (allPoints.length > 0) {
    fx = allPoints[allPoints.length-1][0] * scale;
  }

  return fx;
};

var getOffX = function(points, graphSize, scale) {
  var ox = graphSize[0] - getFarX(points, scale);
  return ox;
};

var pointsToPath = function(points, scale, graphSize) {
  var d = ``;

  var pointCount = 0;

  var lastPoint = null;

  for (var i=points.length-1; i>0; i-=1) {
    var point = points[i];

    var cx = (point[0] * scale);
    var cy = (point[1] * scale) + (0.5 * graphSize[1]);

    if (lastPoint) {
      var lx = (lastPoint[0] * scale);
      var ly = (lastPoint[1] * scale) + (0.5 * graphSize[1]);

      if (lx > 0 && cx > 0) {
        d += `M ${lx} ${ly} `;
        d += `L ${cx} ${cy} `;
        pointCount += 1;
      }
    }
      
    lastPoint = point;
  }

  d += `z`;

  debugSpan.innerText = pointCount;

  return d;
}

var addTestPoint = function(globalTime, frequency, amplitude) {
  var newPoint = [];
  newPoint[0] = globalTime;

  newPoint[1] = (Math.sin(globalTime * frequency) * amplitude);

  //newPoint[1] = balance;
  //balance += 1.0;

  allPoints.push(newPoint);
};

var plotWindow = function(points, scale, graphSize) {
  path.setAttribute('d', pointsToPath(points, scale, graphSize));
  var ox = getOffX(points, graphSize, scale);
  var rx = parseInt(ox * -1);
  var lx = parseInt(rx - graphSize[0]); //parseInt(graphSize[0] - ox);
  debugSpan.innerText = `${debugSpan.innerText} ${ox}`;
  svg.setAttribute("viewBox", `${lx} 0 ${rx} 256`);
};

var plotTest = function(globalTime) {
  var graphSize = [512, 256];

  svg.setAttribute("width", graphSize[0]);
  svg.setAttribute("height", graphSize[1]);

  var frameTime = globalTime - lastTime;

  if (!halted) {
    addTestPoint(globalTime, (0.01), 100.0);
  }

  plotWindow(allPoints, globalScale, graphSize);

  lastTime = globalTime;

  window.requestAnimationFrame(plotTest);
};

plotTest(0);
