// SVG namespaces
let _SVG_NS = "http://www.w3.org/2000/svg";
let _XLINK_NS = "http://www.w3.org/1999/xlink";


let DIV = document.getElementById("svg-experiment");
let SVG = document.createElementNS(_SVG_NS, "svg");
let DEFS = document.createElementNS(_SVG_NS, "defs");

DIV.appendChild(SVG);
SVG.appendChild(DEFS);

const WIDTH = 800;
const HEIGHT = 450;

SVG.setAttribute("version", "1.1");
SVG.setAttribute("xmlns", _SVG_NS);
SVG.setAttribute("width", WIDTH);
SVG.setAttribute("height", HEIGHT);


// ! Utils
function randomColor() {
	// ? Return random colors interpolated from gradient
	// ? "flat design colors 1" @ color.adobe.com
	const colors = [
		"#334D5C",
		"#45B29D",
		"#EFC94C",
		"#E27A3F",
		"#DF5A49"
	]
	// Get interpolation parameters
	let p = Math.random() * (colors.length - 1);
	let t = p % 1;
	let co = colors[Math.floor(p)];
	let ci = colors[Math.ceil(p)];
	// Color transformation
	co = co.match(/#(.{2})(.{2})(.{2})/);
	let ro = parseInt(co[1], 16),
		go = parseInt(co[2], 16),
		bo = parseInt(co[3], 16);
	ci = ci.match(/#(.{2})(.{2})(.{2})/);
	let ri = parseInt(ci[1], 16),
		gi = parseInt(ci[2], 16),
		bi = parseInt(ci[3], 16);
	// Color interpolation
	let r = (1 - t) * ro + t * ri;
	let g = (1 - t) * go + t * gi;
	let b = (1 - t) * bo + t * bi;
	// Output
	return `rgb(${r}, ${g}, ${b})`;
}

function setAttributes(element, attributes) {
	// ? Set multiple attributes at once
	for (let key in attributes) {
		element.setAttribute(key, attributes[key]);
	}
}


// ! Parameters
const maxDepth = 64;
const stdMultiplier = 20;
const numCircles = 64;
const minRadius = 10;
const maxRadius = 30;


// ! Define filters
for (let i = 0; i < maxDepth; i++) {
	// Filter
	let filter = document.createElementNS(_SVG_NS, "filter");
	filter.id = `f${i}`;
	let attributes = {
		x: "-100%",
		y: "-100%",
		width: "300%",
		height: "300%"
	}
	setAttributes(filter, attributes);
	DEFS.appendChild(filter);
	// Gaussian blur
	let blur = document.createElementNS(_SVG_NS, "feGaussianBlur");
	blur.setAttribute("in", "SourceGraphic");
	let focus = Math.random();
	let std = Math.pow(focus - i / maxDepth, 2);
	blur.setAttribute("stdDeviation", std * stdMultiplier);
	filter.appendChild(blur);
}


// ! Draw circles
for (let i = 0; i < numCircles; i++) {
	let circle = document.createElementNS(_SVG_NS, "circle");
	let attributes = {
		// Define circle center
		cx: Math.random() * WIDTH,
		cy: Math.random() * HEIGHT,
		// Radius based on parameters and z-order
		r: minRadius + Math.random() *
			(maxRadius - minRadius) +
			20 * i / numCircles,
		// Fill color
		fill: randomColor(),
		"fill-opacity": 0.75,
		// Stroke based on fill
		// Self-reference in object literals / initializers
		get stroke() { return this.fill; },
		"stroke-width": 1 + 3 * i / numCircles,
		// Filter definition
		filter: `url(#f${parseInt(maxDepth * (1 - i / numCircles))})`
	};
	setAttributes(circle, attributes);
	circle.addEventListener("mouseover", changeFocus);
	SVG.appendChild(circle);
}


function changeFocus(element) {
	// ? Change focus
	filterURL = element.currentTarget.getAttribute("filter");
	filterID = parseInt(filterURL.match(/f(\d*)/)[1]);
	let FILTERS = DEFS.querySelectorAll("filter");
	FILTERS.forEach(filter => {
		let filterID_ = parseInt(filter.id.match(/f(\d*)/)[1]);
		let blur = filter.querySelector(":scope feGaussianBlur");
		let std = Math.pow((filterID - filterID_) / maxDepth, 2);
		gsap.to(blur, {
			duration: 0.75,
			attr: { stdDeviation: std * stdMultiplier }
		});
	});
}
