document.addEventListener('contextmenu', function(event) {
  event.preventDefault();  // Prevent the default context menu from appearing
});

class Point {
  constructor(x, y) {
      this.x = x;
      this.y = y;
  }

  copy() {
    return new Point(this.x, this.y);
  }

  equals(other) {
    if (this.x != other.x)
      return false;
    if (this.y != other.y)
      return false;
    return true;
  }

  distanceTo() {
    var sum;
    if (arguments.length == 1) {
      sum = (this.x - arguments[0].x) ** 2 + 
            (this.y - arguments[0].y) ** 2;
    }
    else if (arguments.length == 2) {
      sum = (this.x - arguments[0]) ** 2 + 
            (this.y - arguments[1]) ** 2;
    }
    return Math.sqrt(sum);
  }

  moveTo() {
    if (arguments.length == 1) {
      this.x = arguments[0].x;
      this.y = arguments[0].y;
    }
    else if (arguments.length == 2) {
      this.x = arguments[0];
      this.y = arguments[1];
    }
  }
}

/*
There is a list of objects that are drawn
Each objects is a list of points (1 or more) that are connected by lines
There are always a reference point (black) and a target point (red)
The target point is computed in relation to the reference point based on the distance and direction variables
When there is a new line that starts from another point, it is aded to the same object
When there is a new point drawn, a new object is started
*/
class Parameter {
  constructor(value, tag) {
    tag.value = value;
    this._value = value;
    this._tag = tag;
  }

  set value(newValue) {
    this._tag.value = newValue;
    this._value = newValue;
  }

  get value() {
    return this._value;
  }
}

var state = {mouseIsDown: false, keyPressed: null};
var referencePoint = new Point(0, 0);
const distValue = document.getElementById("distValue");
const dirValue = document.getElementById("dirValue");
dirValue.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    direction.value = Number(dirValue.value);
  }
});
distValue.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    distance.value = Number(distValue.value);
  }
});
var distance = new Parameter(300, distValue);
var direction = new Parameter(0, dirValue);
const targetPoint = new Point();
// set x and y to be retrieved based on referencePoint, direction and distance.value
Object.defineProperty(targetPoint, "x", {
  get() {
      return referencePoint.x + distance.value * Math.cos(toRadians(direction.value));
  }
});
Object.defineProperty(targetPoint, "y", {
  get() {
      return referencePoint.y + distance.value * Math.sin(toRadians(direction.value));
  }
});
Object.defineProperty(targetPoint, "x", {
  set(x) {
      ;
  }
});
Object.defineProperty(targetPoint, "y", {
  set(y) {
      ;
  }
});
Object.defineProperty(targetPoint, "drawArrow", {
  value: function() {
    length = 10;
    c.strokeStyle = "red";
    c.lineJoin = "miter";
    c.lineCap = "round";
    c.miterLimit = 100;
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(
      targetPoint.x + length * Math.cos(toRadians(direction.value - 150)),
      targetPoint.y + length * Math.sin(toRadians(direction.value - 150))
    );
    c.lineTo(targetPoint.x, targetPoint.y);
    c.lineTo(
      targetPoint.x + length * Math.cos(toRadians(direction.value + 150)),
      targetPoint.y + length * Math.sin(toRadians(direction.value + 150))
    );
    c.stroke();
  }
})

/*Object.defineProperties(referencePoint, {
  moveTo: {
    value: function() {
      if (arguments.length == 1) {
        this.x = arguments[0].x;
        this.y = arguments[0].y;
      }
      else if (arguments.length == 2) {
        this.x = arguments[0];
        this.y = arguments[1];
      }
    }
  }
});*/

referencePoint.moveTo(200, 200);
console.log(referencePoint);

const objects = [];
Object.defineProperty(objects, "current", {
  get() {
    objects.at(-1);
  }
});
objects.selectedPoints = [];

// define Line class
class Line {
  constructor(A, B) {
      this.A = A;
      this.B = B;
      this.step = 1;
  }
}

/*
The canvas resolution is scaled based on the display scale
The canvas takes up 75% of page width
The toolbar takes up the rest (25%)
*/

const toolBar = document.querySelector('#toolBar');
const canvas = document.querySelector('canvas');
const scale = window.devicePixelRatio;
//console.log(scale);
var w = window.innerWidth;
var h = window.innerHeight;

canvas.width = w * 0.75 * scale;
canvas.height = h * scale;
canvas.style.width = w * 0.75 + "px";
canvas.style.height = h + "px";
toolBar.style.width = w * 0.25 + "px";
toolBar.style.height = h + "px";

var c = canvas.getContext('2d');
c.scale(scale, scale);

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

const points = [];
const lines = [];
var step;

var isMoving = false;
var start;
var destination;

const dir0 = document.getElementById("dir0");
dir0.addEventListener("click", () => {
  direction.value = 0;
});

const dir30 = document.getElementById("dir30");
dir30.addEventListener("click", () => {
  direction.value = 30;
});

const dir45 = document.getElementById("dir45");
dir45.addEventListener("click", () => {
  direction.value = 45;
});

const dir60 = document.getElementById("dir60");
dir60.addEventListener("click", () => {
  direction.value = 60;
});

const dir90 = document.getElementById("dir90");
dir90.addEventListener("click", () => {
  direction.value = 90;
});

const dirPlus10 = document.getElementById("dirPlus10");
dirPlus10.addEventListener("click", () => {
  direction.value = (direction.value + 10) % 360;
});

const dirPlus30 = document.getElementById("dirPlus30");
dirPlus30.addEventListener("click", () => {
  direction.value = (direction.value + 30) % 360;
});

const dirPlus90 = document.getElementById("dirPlus90");
dirPlus90.addEventListener("click", () => {
  direction.value = (direction.value + 90) % 360;
});

const dirMinus10 = document.getElementById("dirMinus10");
dirMinus10.addEventListener("click", () => {
  direction.value = (direction.value - 10) % 360;
});

const dirMinus30 = document.getElementById("dirMinus30");
dirMinus30.addEventListener("click", () => {
  direction.value = (direction.value - 30) % 360;
});

const dirMinus90 = document.getElementById("dirMinus90");
dirMinus90.addEventListener("click", () => {
  direction.value = (direction.value - 90) % 360;
});

const dist0 = document.getElementById("dist0");
dist0.addEventListener("click", () => {
  distance.value = 0;
});

const dist10 = document.getElementById("dist10");
dist10.addEventListener("click", () => {
  distance.value = 10;
});

const dist30 = document.getElementById("dist30");
dist30.addEventListener("click", () => {
  distance.value = 30;
});

const dist100 = document.getElementById("dist100");
dist100.addEventListener("click", () => {
  distance.value = 100;
});

const dist300 = document.getElementById("dist300");
dist300.addEventListener("click", () => {
  distance.value = 300;
});

const distPlus10 = document.getElementById("distPlus10");
distPlus10.addEventListener("click", () => {
  distance.value += 10;
});

const distPlus30 = document.getElementById("distPlus30");
distPlus30.addEventListener("click", () => {
  distance.value += 30;
});

const distPlus100 = document.getElementById("distPlus100");
distPlus100.addEventListener("click", () => {
  distance.value += 100;
});

const distPlus300 = document.getElementById("distPlus300");
distPlus300.addEventListener("click", () => {
  distance.value += 300;
});

const distMinus10 = document.getElementById("distMinus10");
distMinus10.addEventListener("click", () => {
  distance.value = Math.max(0, distance.value - 10);
});

const distMinus30 = document.getElementById("distMinus30");
distMinus30.addEventListener("click", () => {
  distance.value = Math.max(0, distance.value - 30);
});

const distMinus100 = document.getElementById("distMinus100");
distMinus100.addEventListener("click", () => {
  distance.value = Math.max(0, distance.value - 100);
});

const distMinus300 = document.getElementById("distMinus300");
distMinus300.addEventListener("click", () => {
  distance.value = Math.max(0, distance.value - 3000);
});

/*canvas.addEventListener("click", (event) => {
  if (event.button == 0) {
    console.log(objects);
    var minDist = 5;
    var closestPoint = null;
    objects.forEach(object => {
      object.forEach(point => {
        //console.log(point.distanceTo(event.clientX, event.clientY));
        if (point.distanceTo(event.clientX, event.clientY) <= minDist) {
          minDist = point.distanceTo(event.clientX, event.clientY);
          closestPoint = point;
        }
      })
    });

    if (closestPoint != null) {
      console.log(referencePoint);
      referencePoint.moveTo(closestPoint);
    }
    else {
      referencePoint.moveTo(event.clientX, event.clientY);
    }
  }
});*/

canvas.addEventListener("mousedown", (event) => {
  state.mouseIsDown = true;
  state.lastMousePosition = new Point(event.clientX, event.clientY);
  state.initialPoints = {...objects.selectedPoints};
  var closestPoint = null;
  var minDist = 5;
  objects.concat([[referencePoint]]).forEach(object => {
    object.forEach(point => {
      //console.log(point.distanceTo(event.clientX, event.clientY));
      if (point.distanceTo(event.clientX, event.clientY) <= minDist) {
        minDist = point.distanceTo(event.clientX, event.clientY);
        closestPoint = point;
      }
    })
  });

  if (closestPoint != null) {
    objects.selectedPoints = [closestPoint];
    console.log("changed selectedPoint", objects);
    return;
  }

  var closestPoints = null;
  minDist = 5;
  objects.concat([[referencePoint, targetPoint]]).forEach(object => {
    for (var i = 1; i < object.length; i++) {
      //distance between mouse and line
      //ecuatia dreptei: ax + by + c = 0
      //a = (y2 - y1) / (x2 - x1)
      //b = -1
      //c = y2 - ax2
      var p1 = object[i - 1];
      var p2 = object[i];
      var a = (p2.y - p1.y) / (p2.x - p1.x);
      var b = -1;
      var c = p2.y - a * p2.x;
      if (p2.x - p1.x == 0) {a = 1; b = 0; c = -p1.x;}
      var d = Math.abs(a * event.clientX + b * event.clientY + c) / Math.sqrt(a ** 2 + b ** 2);
      console.log(a, b, c, d);

      if (d <= minDist) {
        d = minDist;
        closestPoints = [object[i - 1], object[i]];
      }
    }
  });

  if (closestPoints != null) {
    objects.selectedPoints = closestPoints;
  }
  else {
    objects.selectedPoints = [];
  }
  console.log("changed selectedPoints", objects.selectedPoints);
});

canvas.addEventListener("mousemove", (event) => {
  if (state.mouseIsDown) {
    objects.selectedPoints.forEach(point => {
      point.moveTo(point.x + event.clientX - state.lastMousePosition.x, point.y + event.clientY - state.lastMousePosition.y);
    })
    state.lastMousePosition = new Point(event.clientX, event.clientY);
  }
})

canvas.addEventListener("mouseup", (event) => {
  objects.selectedPoints.forEach(s => {
    var minDist = 5;
    var closestPoint = null;
    var sToMove;
    objects.selectedPoints.forEach(s => {
      objects.forEach(object => {
        object.forEach(point => {
          //console.log(point.distanceTo(event.clientX, event.clientY));
          if (point.distanceTo(s) <= minDist) {
            minDist = point.distanceTo(s);
            closestPoint = point;
            sToMove = s;
          }
        })
      })
    })

    if (closestPoint == null) { 
      objects.selectedPoints.forEach(point => {
        point.moveTo(point.x + event.clientX - state.lastMousePosition.x, point.y + event.clientY - state.lastMousePosition.y);
      })
    }
    else {
      objects.selectedPoints.forEach(point => {
        point.moveTo(point.x + closestPoint.x - sToMove.x, point.y + closestPoint.y - sToMove.y);
        console.log("closest point", closestPoint, sToMove);
      })
    }

    state.mouseIsDown = false;
    objects.selectedPoints = [];
  })
  //console.log(objects);
})

/*
function moveReferenceFn(point) {
  isMoving = true;
  step = 1;
  start = { ...referencePoint };
  destination = { ...point };
}*/

function drawPointFn() {
  objects.push([targetPoint.copy()])
}

function drawLineFn() {
  if (objects.length > 0 && objects.at(-1).at(-1).equals(referencePoint.copy())) {
    objects.at(-1).push(targetPoint.copy());
  }
  else {
    objects.push([referencePoint.copy(), targetPoint.copy()]);
  }
  console.log("line drawn", objects);
}

const drawPointBtn = document.getElementById("drawPoint");
drawPointBtn.addEventListener("click", () => {
  drawPointFn();
});

const drawLineBtn = document.getElementById("drawLine");
drawLineBtn.addEventListener("click", () => {
  drawLineFn();
});

const moveReferencePoint = document.getElementById("moveReferencePoint");
moveReferencePoint.addEventListener("click", () => {
  referencePoint.moveTo(targetPoint);
});

window.addEventListener("wheel", (event) => {
  if (state.keyPressed == 'D') {
    distance.value -= event.deltaY / 10;
  }
  else if (state.keyPressed == 'R') {
    direction.value += event.deltaY / 10;
  }
});

function drawSquareFn() {
  var square = [referencePoint.copy(), new Point(targetPoint.x, targetPoint.y)];
  square.push(new Point(targetPoint.x + distance.value * Math.cos(toRadians(direction.value + 90)), targetPoint.y + distance.value * Math.sin(toRadians(direction.value + 90))));
  square.push(new Point(referencePoint.x + distance.value * Math.cos(toRadians(direction.value + 90)), referencePoint.y + distance.value * Math.sin(toRadians(direction.value + 90))));
  square.push(referencePoint.copy())
  objects.push(square);
}
const drawSquareBtn = document.querySelector('#drawSquare');
drawSquareBtn.addEventListener("click", () => {
  drawSquareFn();
})

window.addEventListener("keydown", (event) => {
  state.keyPressed = event.key.toUpperCase();
  switch(event.key.toLowerCase()) {
    case 'p': drawPointFn(); break;
    case 'l': drawLineFn(); break;
    //case 'ArrowUp': direction.value = direction.value - 10; break;
    //case 'ArrowDown': direction.value += 10; break;
    case 'ArrowLeft': distance.value = Math.max(distance.value - 10, 0);; break;
    case 'ArrowRight': distance.value += 10; break;
    case 'm': referencePoint.moveTo(targetPoint); break;
    case 's': drawSquareFn(); break;
    /*case 'r': 
      if (event.shiftKey == true) direction.value -= 10; 
      else direction.value += 10;
      break;
    case 'd': 
      if (event.shiftKey == true) distance.value -= 10; 
      else distance.value += 10;
      break;*/
  }
});

window.addEventListener("keyup", (event) => {
  state.keyPressed = null;
})

function animate() {
    requestAnimationFrame(animate);
    
    // clear canvas
    c.clearRect(0, 0, innerWidth, innerHeight);

    // move reference point
    if (isMoving) {
      referencePoint.x = start.x + (destination.x - start.x) * step / 4;
      referencePoint.y = start.y + (destination.y - start.y) * step / 4;
      step++;
      if (step > 4) isMoving = false;
    }
    
    // draw refernce point
    /*c.fillStyle = "black";
    c.beginPath();
    c.arc(referencePoint.x, referencePoint.y, 3, 0, Math.PI * 2);
    c.fill();*/

    objects.forEach(object => {
      lastPoint = null;
      object.forEach(point => {
        //set color
        if (objects.selectedPoints.includes(point)) {
          c.fillStyle = "green";
          if (objects.selectedPoints.includes(lastPoint)) {
            c.strokeStyle = "green";
          }
        }
        else {
          c.strokeStyle = "dimgray";
          c.fillStyle = "dimgray";
        }

        c.beginPath();
        c.arc(point.x, point.y, 4, 0, Math.PI * 2);
        c.fill();

        if (lastPoint != null) {
          c.lineWidth = 2;
          c.beginPath();
          c.moveTo(lastPoint.x, lastPoint.y);
          c.lineTo(point.x, point.y);
          c.stroke(); 
        }

        lastPoint = point;
      })
    })

    // draw lines in array
   /*lines.forEach(line => {
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(line.A.x, line.A.y);
      if (line.step < 20) {
        c.lineTo(line.A.x + (line.B.x - line.A.x) * line.step / 20, line.A.y + (line.B.y - line.A.y) * line.step / 20);
        line.step++;
      }
      else c.lineTo(line.B.x, line.B.y);
      c.stroke();  
    });*/

    if (!referencePoint.equals(targetPoint)) {
      // draw ref point
      c.fillStyle = "rgba(240, 64, 64, 1)";
      c.beginPath();
      c.arc(referencePoint.x, referencePoint.y, 2, 0, Math.PI * 2);
      c.fill();

      // draw line to target point
      c.strokeStyle = "red";
      c.setLineDash([2, 2]);
      c.lineWidth = (objects.selectedPoints.includes(referencePoint) == true) ? 2 : 1;
      c.beginPath();
      c.moveTo(referencePoint.x, referencePoint.y);
      c.lineTo(targetPoint.x, targetPoint.y);
      c.stroke();
      c.setLineDash([]);
    }

    //draw arrow
    targetPoint.drawArrow();
    
    // draw target point
    /*c.fillStyle = "rgba(240, 64, 64, 1)";
    c.beginPath();
    c.arc(targetPoint.x, targetPoint.y, 1.5, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "rgba(240, 64, 64, 0.4)";
    c.beginPath();
    c.arc(targetPoint.x, targetPoint.y, 7, 0, Math.PI * 2);
    c.fill();*/

}

animate();
