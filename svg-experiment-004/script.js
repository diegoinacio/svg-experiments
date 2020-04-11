// SVG namespaces
let _SVG_NS = "http://www.w3.org/2000/svg";
let _XLINK_NS = "http://www.w3.org/1999/xlink";


let DIV = document.getElementById("svg-experiment");
let SVG = document.createElementNS(_SVG_NS, "svg");
let DEFS = document.createElementNS(_SVG_NS, "defs");

DIV.appendChild(SVG);
SVG.appendChild(DEFS);

let grid = document.createElementNS(_SVG_NS, "g");
grid.id = "background-grid";
SVG.appendChild(grid);
let BG = document.createElementNS(_SVG_NS, "g");
BG.id = "background-group";
SVG.appendChild(BG);
let FG = document.createElementNS(_SVG_NS, "g");
FG.id = "foreground-group";
SVG.appendChild(FG);

const WIDTH = 800;
const HEIGHT = 450;

SVG.setAttribute("version", "1.1");
SVG.setAttribute("xmlns", _SVG_NS);
SVG.setAttribute("width", WIDTH);
SVG.setAttribute("height", HEIGHT);


// ! Utils
function randomColor() {
	// ? Return random normalized colors
	// Get random channels
	let r = Math.random();
	let g = Math.random();
	let b = Math.random();
	// Get norm
	let n = Math.sqrt(r * r + g * g + b * b);
	// Normalize channels
	r = Math.floor(255 * r / n);
	g = Math.floor(255 * g / n);
	b = Math.floor(255 * b / n);
	// Output
	return `rgb(${r}, ${g}, ${b})`;
}

function distance(pa, pb) {
	return Math.sqrt(
		Math.pow(pa.x - pb.x, 2) +
		Math.pow(pa.y - pb.y, 2)
	);
}

function drawTriangle(radius) {
	// ? Draw triangles randomly
	const pi2 = 2 * Math.PI;
	// ? Create new polygon
	let poly = document.createElementNS(_SVG_NS, "polygon");
	// ? Define subperiods for angular frequency
	let t0 = Math.random() + 1;
	let t1 = Math.random() + 1;
	let t2 = Math.random() + 1;
	t2 += t1 += t0;
	t0 /= t2; t1 /= t2;
	// ? Define points
	let pax = radius * (Math.sin(pi2 * t0) + 1);
	let pay = radius * (Math.cos(pi2 * t0) + 1);
	let pbx = radius * (Math.sin(pi2 * t1) + 1);
	let pby = radius * (Math.cos(pi2 * t1) + 1);
	let pcx = radius * (Math.sin(0) + 1);
	let pcy = radius * (Math.cos(0) + 1);
	poly.setAttribute("points", `
	${pax},${pay} ${pbx},${pby} ${pcx},${pcy}
	`);
	return poly;
}

function drawZigZag() {
	// ? Draw ZigZag path
	let group = document.createElementNS(_SVG_NS, "g");
	let path = document.createElementNS(_SVG_NS, "path");
	let drop = document.createElementNS(_SVG_NS, "path");
	group.appendChild(drop);
	group.appendChild(path);
	// ? Define path
	path.id = "zz-path" + Math.random();
	let x = 0;
	let y = Math.random() * 50 + 25;
	let d = `M ${x} ${y} `
	while (x < 100) {
		x += Math.random() * 10 + 10;
		y = y < 50 ? 50 + Math.random() * 25 : 25 + Math.random() * 25;
		d += `L ${x} ${y} `
	}
	path.setAttribute("d", d);
	path.setAttribute("level", Math.floor(Math.random() * 4));
	// ? Define drop shadow
	drop.id = "drop-shadow";
	drop.setAttribute("d", d);
	drop.setAttribute("transform", "translate(3 3)");
	return group;
}


// ! Background grid
let N = 20;
for (let i = 0; i < WIDTH; i += N) {
	let line = document.createElementNS(_SVG_NS, "line");
	// ? Set attributes
	line.setAttribute("x1", i);
	line.setAttribute("x2", i + 0.0001);
	line.setAttribute("y1", 0);
	line.setAttribute("y2", HEIGHT);
	// ? Append
	grid.appendChild(line);
}
for (let j = 0; j < HEIGHT; j += N) {
	let line = document.createElementNS(_SVG_NS, "line");
	// ? Set attributes
	line.setAttribute("x1", 0);
	line.setAttribute("x2", WIDTH);
	line.setAttribute("y1", j);
	line.setAttribute("y2", j + 0.0001);
	// ? Append
	grid.appendChild(line);
}


// ! Patterns
let PATTERN;
let PATTERNS = new Array;

// ? Pattern 1 - Circles
PATTERN = document.createElementNS(_SVG_NS, "g");
PATTERN.id = "pattern-circles";
PATTERN.setAttribute("width", 1);
PATTERN.setAttribute("height", 1);

DEFS.appendChild(PATTERN);
PATTERNS.push(PATTERN.id);

for (let i = 0; i < WIDTH + 1; i += 10) {
	for (let j = 0; j < HEIGHT + 1; j += 10) {
		let circle = document.createElementNS(_SVG_NS, "circle");
		circle.setAttribute("r", Math.random() * 3 + 1);
		circle.setAttribute("cx", i);
		circle.setAttribute("cy", j);
		PATTERN.appendChild(circle);
	}
}

// ? Pattern 2 - Paths
PATTERN = document.createElementNS(_SVG_NS, "g");
PATTERN.id = "pattern-paths";
PATTERN.setAttribute("width", 1);
PATTERN.setAttribute("height", 1);

DEFS.appendChild(PATTERN);
PATTERNS.push(PATTERN.id);

let space = 10;
for (let i = 0; i < WIDTH + 1; i += space) {
	for (let j = 0; j < HEIGHT + 1; j += space) {
		let path = document.createElementNS(_SVG_NS, "path");
		// ? Random Xs
		let x1 = Math.random();
		let x2 = Math.random();
		let x1x2 = x1 + x2;
		x1 = space * x1 / x1x2 + i;
		x2 = space * x2 / x1x2 + i;
		// ? Random Ys
		let y1 = Math.random();
		let y2 = Math.random();
		let y1y2 = y1 + y2;
		y1 = space * y1 / y1y2 + j;
		y2 = space * y2 / y1y2 + j;
		// ? Random middle
		let t, mx, my;
		if (Math.abs(x1 - x2) > Math.abs(y1 - y2)) {
			t = Math.random();
			mx = t * x1 + (1 - t) * x2;
			my = Math.random() * space + j;
		} else {
			t = Math.random();
			my = t * y1 + (1 - t) * y2;
			mx = Math.random() * space + i;
		}
		// ? Set attributes
		path.setAttribute("d", `M ${x1} ${y1} Q ${mx} ${my}, ${x2} ${y2}`);
		// ? Append
		PATTERN.appendChild(path);
	}
}

// ? Pattern 3 - Lines
PATTERN = document.createElementNS(_SVG_NS, "g");
PATTERN.id = "pattern-lines";
PATTERN.setAttribute("width", 1);
PATTERN.setAttribute("height", 1);

DEFS.appendChild(PATTERN);
PATTERNS.push(PATTERN.id);

for (let i = 0; i < HEIGHT + 1; i += 10) {
	let line = document.createElementNS(_SVG_NS, "line");
	// ? Set attributes
	line.setAttribute("x1", 0);
	line.setAttribute("x2", WIDTH);
	line.setAttribute("y1", i);
	line.setAttribute("y2", i + 0.0001);
	line.setAttribute("stroke-width", 7 * Math.random() + 1);
	// ? Append
	PATTERN.appendChild(line);
}


// ! Shapes
let SHAPE;
let SHAPES = new Array;

// ? Shape 1 - Circle
SHAPE = document.createElementNS(_SVG_NS, "circle");
SHAPE.id = "shape-circle";
SHAPE.setAttribute("r", 50);
SHAPE.setAttribute("cx", 50);
SHAPE.setAttribute("cy", 50);

DEFS.appendChild(SHAPE);
SHAPES.push(SHAPE.id);

// ? Shape 2 - Square
SHAPE = document.createElementNS(_SVG_NS, "rect");
SHAPE.id = "shape-square";
SHAPE.setAttribute("x", 15);
SHAPE.setAttribute("y", 15);
SHAPE.setAttribute("width", 70);
SHAPE.setAttribute("height", 70);

DEFS.appendChild(SHAPE);
SHAPES.push(SHAPE.id);

// ? Shape 3 - Triangle
SHAPE = drawTriangle(50);
SHAPE.id = "shape-triangle";

DEFS.appendChild(SHAPE);
SHAPES.push(SHAPE.id);


// ! Scatter shapes
let POINT;
let POINTS = new Array;

// ? Finding points
for (let i = 1; i < WIDTH + 1; i += 150) {
	for (let j = 1; j < WIDTH + 1; j += 150) {
		POINT = {};
		POINT.x = i + (Math.random() * 2 - 1) * 20;
		POINT.y = j + (Math.random() * 2 - 1) * 20;
		POINT.r = Math.random() * 0.75 + 0.75;
		POINTS.push(POINT);
	}
}

POINTS.forEach(point => {
	// ? Create mask
	let MASK = document.createElementNS(_SVG_NS, "mask");
	MASK.id = "mask" + Math.random();
	SVG.appendChild(MASK);
	// ? Include shape into mask
	let USE1 = document.createElementNS(_SVG_NS, "use");
	SHAPE = SHAPES[Math.floor(Math.random() * SHAPES.length)];
	USE1.setAttributeNS(_XLINK_NS, "href", `#${SHAPE}`);
	let theta = Math.random() * 360;
	USE1.setAttribute("transform", `
		translate(${point.x} ${point.y})
		scale(${point.r})
		rotate(${theta} 50 50)
	`);
	USE1.setAttribute("fill", "white");
	MASK.appendChild(USE1);
	// ? Define pattern group
	let G1 = document.createElementNS(_SVG_NS, "g");
	G1.setAttribute("mask", `url(#${MASK.id})`);
	// ? Include pattern into group
	let USE2 = document.createElementNS(_SVG_NS, "use");
	PATTERN = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];
	USE2.setAttributeNS(_XLINK_NS, "href", `#${PATTERN}`);
	G1.appendChild(USE2);
	// ? Define fill color group
	let G2 = document.createElementNS(_SVG_NS, "g");
	G2.setAttribute("mask", `url(#${MASK.id})`);
	let osx = Math.random() * 30 - 15;
	let osy = Math.random() * 30 - 15;
	G2.setAttribute("transform", `translate(${osx} ${osy})`);
	// ? Include shape
	let rect = document.createElementNS(_SVG_NS, "rect");
	rect.id = "fill-shape";
	rect.setAttribute("level", Math.floor(Math.random() * 4));
	rect.setAttribute("width", WIDTH);
	rect.setAttribute("height", HEIGHT);
	G2.appendChild(rect)
	// ? Foreground or background definition
	let definer = Math.random();
	if (definer > 0.5) {
		BG.appendChild(G1);
		FG.appendChild(G2);
	} else {
		BG.appendChild(G2);
		FG.appendChild(G1);
	}
});


// ! Scatter paths
for (let i = 1; i < WIDTH + 1; i += 140) {
	for (let j = 1; j < WIDTH + 1; j += 140) {
		SHAPE = drawZigZag();
		let x = i + (Math.random() * 2 - 1) * 20 + 50;
		let y = j + (Math.random() * 2 - 1) * 20 + 50;
		let r = Math.random()*0.5 + 0.75;
		let theta = Math.random()*360;
		SHAPE.setAttribute("transform", `
			translate(${x} ${y})
			scale(${r})
			rotate(${theta} 50 50)
		`);
		SVG.appendChild(SHAPE)
	}
}
