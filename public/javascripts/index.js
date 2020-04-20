//

import * as GameLoop from './game-loop.js';

var allPoints = [];
var lastTime = 0;
var halted = false;
var globalScale = 1.0;
var balance = 0.0;
var graphSize = [512, 256];
var graphDatum = [0, 0];
var elapsedTime = 0.0;

var path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
path.setAttribute('stroke', "blue");

var basePath = document.createElementNS("http://www.w3.org/2000/svg", 'path');
basePath.setAttribute('stroke', "black");

var pathGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g');
pathGroup.setAttribute("transform", `scale(1, -1)`);
pathGroup.appendChild(path);
pathGroup.appendChild(basePath);

var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute("width", graphSize[0]);
svg.setAttribute("height", graphSize[1]);
svg.setAttribute("preserveAspectRatio", "none");
svg.setAttribute("version", "1.1");
svg.setAttribute("aria-hidden", "true");
svg.appendChild(pathGroup);

var haltButton = document.createElement('button');
haltButton.innerText = "halt";
haltButton.addEventListener('click', function() {
  halted = !halted;
});

var zoomOutButton = document.createElement('button');
zoomOutButton.innerText = "-";
zoomOutButton.addEventListener('click', function() {
  globalScale *= 1.1;
});

var zoomInButton = document.createElement('button');
zoomInButton.innerText = "+";
zoomInButton.addEventListener('click', function() {
  globalScale *= 0.9;
  if (globalScale < 1.0) {
    globalScale = 1.0;
  }
});

document.body.appendChild(svg);
document.body.appendChild(haltButton);
document.body.appendChild(zoomOutButton);
document.body.appendChild(zoomInButton);

var debugSpan = document.createElement("span");
document.body.appendChild(debugSpan);

var getFarX = function() {
  var fx = 0;
  if (allPoints.length > 0) {
    fx = allPoints[allPoints.length-1][0];
  }

  return fx;
};

var getOffX = function() {
  var ox = (graphSize[0]) - getFarX();
  return ox;
};

var pointsToPath = function() {
  var d = ``;

  var pointCount = 0;

  var lastPoint = null;
  
  var fx = getFarX();

  for (var i=allPoints.length-1; i>0; i-=1) {
    var point = allPoints[i];

    var cx = (point[0]);
    var cy = (point[1]); // + (0.5 * graphSize[1]);

    if (lastPoint) {
      var lx = (lastPoint[0]);
      var ly = (lastPoint[1]); // + (0.5 * graphSize[1]);

      //if (cx > (fx - (graphSize[0] * globalScale))) {
        d += `M ${lx} ${ly} `;
        d += `L ${cx} ${cy} `;
        pointCount += 1;
      //}
    }
      
    lastPoint = point;
  }

  d += `z`;

  return d;
}

var addTestPoint = function(globalTime, frequency, amplitude) {
  var newPoint = [];
  newPoint[0] = globalTime;

  //newPoint[1] = (Math.sin(globalTime * frequency) * amplitude) + amplitude;
  newPoint[1] = (Math.sin(globalTime * frequency) * amplitude);

  //newPoint[1] = balance;
  //balance += 1.0;

  allPoints.push(newPoint);
};

var addFpsPoint = function(globalTime, deltaTime) {
  var newPoint = [];
  newPoint[0] = globalTime;
  newPoint[1] = deltaTime - ((1.0 / 60.0) * 1000.0);

  allPoints.push(newPoint);
};

var plotWindow = function(globalTime) {
  path.setAttribute('d', pointsToPath());


  var ox = getOffX();
  var fx = globalTime; //getFarX();
  var rx = parseInt(fx);
  var lx = parseInt(rx - (graphSize[0] * globalScale));
  var sw = graphSize[0] * globalScale;

  //debugSpan.innerText = `${debugSpan.innerText} 1xy ${allPoints[0]} ox:${ox} scale:${scale} fx:${fx}`;

  basePath.setAttribute('d', `M ${lx} 0 L ${rx} 0 z`);

  svg.setAttribute("viewBox", `${lx} ${graphDatum[1] - (graphSize[1] * globalScale * 0.5)} ${sw} ${(graphSize[1] * globalScale)}`);

  path.setAttribute("stroke-width", globalScale);
  basePath.setAttribute("stroke-width", globalScale);
};

var plotTest = function(globalTime) {
  var frameTime = globalTime - lastTime;

  elapsedTime += frameTime;

  if (!halted) {
    //&& (elapsedTime > ((1/24) * 1000))) {
    //addTestPoint(globalTime, (0.0125), 100.0);
    //debugSpan.innerText = `${elapsedTime}`;
    addTestPoint(globalTime, (0.0125), 100.0);
    addFpsPoint(globalTime, elapsedTime);
    plotWindow(globalTime);

    elapsedTime = 0.0;
  }

  lastTime = globalTime;

  window.requestAnimationFrame(plotTest);
};

plotTest(0);
