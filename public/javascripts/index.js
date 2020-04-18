//

import * as GameLoop from './game-loop.js';

var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute("viewBox", "0 0 256 256");
svg.setAttribute("preserveAspectRatio", "xMinYMax slice");
//svg.setAttribute("preserveAspectRatio", "slice");
//svg.setAttribute("preserveAspectRatio", "XMaxYMax");
svg.setAttribute("version", "1.1");
svg.setAttribute("width", "256");
svg.setAttribute("height", "256");
svg.setAttribute("aria-hidden", "true");

var path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
path.setAttribute('fill', "red");
path.setAttribute('stroke', "blue");
path.setAttribute('stroke-width', "1px");
path.setAttribute('id', "arrow1");

svg.appendChild(path);

document.body.appendChild(svg);

var allPoints = [];
var lastX = 0;

var pointsToPath = function(points) {
  var d = ``;

  var lastPoint = points[0];

  points.forEach(function(point) {
    d += `M ${lastPoint[0]} ${lastPoint[1]} `;
		d += `L ${point[0]} ${point[1]} `;
    lastPoint = point;
	});

  d += `z`;

  return d;
}

var plotTest = function() {
  var newPoint = [];
  newPoint[0] = lastX;
  newPoint[1] = (Math.sin(lastX) * 10.0) + 128;
  lastX += 1;

  allPoints.push(newPoint);

	path.setAttribute('d', pointsToPath(allPoints));

  if (allPoints.length > 64) {
    svg.setAttribute("viewBox", `${allPoints[allPoints.length-31][0]} 0 ${allPoints[allPoints.length-1][0]+256} 256`);
  }
//}, 100);

  window.requestAnimationFrame(plotTest);
};

plotTest();

//window.setInterval(function() {
