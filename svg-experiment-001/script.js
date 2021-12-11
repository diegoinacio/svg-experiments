// * SVG namespace
const _SVG_NS = "http://www.w3.org/2000/svg";

const DIV = document.getElementById("svg-experiment");
const SVG = document.createElementNS(_SVG_NS, "svg");
const DEFS = document.createElementNS(_SVG_NS, "defs");

DIV.appendChild(SVG);

// ! Global variables
let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

let CENTER = { x: WIDTH / 2, y: HEIGHT / 2 };

let minimumRadius = Math.min(WIDTH, HEIGHT) / 100;

// ! Parameters (from index page)
const theta_factor = document.querySelector("input#theta_factor");
let THETA_VAR = parseFloat(theta_factor.value);

// ! Drop Shadow
if (!window.mobileAndTabletCheck()) {
  // * Include drop shadow filter if it isn't a mobile device
  document.head.querySelector("style").innerHTML += `
    svg polygon {
      filter: url(#drop-shadow);
    }
  `;
}

// ! Utils
function rotate(p, cx, cy, theta) {
  // * Rotate polygon -> object
  rx = (p[0] - cx) * Math.cos(theta) - (p[1] - cy) * Math.sin(theta) + cx;
  ry = (p[0] - cx) * Math.sin(theta) + (p[1] - cy) * Math.cos(theta) + cy;

  // * Output
  return { x: rx, y: ry };
}

function getPoints(cx, cy, r, theta) {
  // * Get points -> string
  let pa = rotate([cx + r, cy], cx, cy, theta);
  let pb = rotate([cx, cy + r], cx, cy, theta);
  let pc = rotate([cx - r, cy], cx, cy, theta);
  let pd = rotate([cx, cy - r], cx, cy, theta);

  // * Output
  return `${pa.x}, ${pa.y} ${pb.x}, ${pb.y} ${pc.x}, ${pc.y} ${pd.x}, ${pd.y}`;
}

function randomColor() {
  // * Get random channels -> object
  let r = Math.random();
  let g = Math.random();
  let b = Math.random();
  // * Get norm
  let n = Math.sqrt(r * r + g * g + b * b);
  // * Normalize channels
  r = Math.floor((255 * r) / n);
  g = Math.floor((255 * g) / n);
  b = Math.floor((255 * b) / n);

  // * Output
  return `rgb(${r}, ${g}, ${b})`;
}

// ! Event functions
// * Stop propagation when click on input
function stop_propagation() {
  event.stopPropagation();
}

// * Theta factor parameter events
function set_theta_factor() {
  THETA_VAR = parseFloat(theta_factor.value);
  main();
}

// * Change center/axis
window.addEventListener("click", (event) => {
  CENTER.x = event.clientX;
  CENTER.y = event.clientY;
  main();
});

// * Resize window
window.addEventListener("resize", () => {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  CENTER.x = WIDTH / 2;
  CENTER.y = HEIGHT / 2;
  minimumRadius = Math.min(WIDTH, HEIGHT) / 100;
  main();
});

// ! Build functions
function setSVG() {
  SVG.setAttribute("version", "1.1");
  SVG.setAttribute("xmlns", _SVG_NS);
  SVG.setAttribute("width", WIDTH);
  SVG.setAttribute("height", HEIGHT);
}

function dropShadow() {
  // ! Build drop shadow filter
  let filter, blur, offset, flood, composite;

  // * Init filter
  filter = document.createElementNS(_SVG_NS, "filter");
  filter.id = "drop-shadow";
  filter.setAttribute("x", `-50%`);
  filter.setAttribute("y", `-50%`);
  filter.setAttribute("width", `200%`);
  filter.setAttribute("height", `200%`);

  // ? Drop Shadow A

  // * Blur 1
  blur = document.createElementNS(_SVG_NS, "feGaussianBlur");
  blur.setAttribute("in", "SourceAlpha");
  blur.setAttribute("stdDeviation", "7");
  blur.setAttribute("result", "blur1");

  filter.appendChild(blur);

  // * Composite 1
  composite = document.createElementNS(_SVG_NS, "feComposite");
  composite.setAttribute("in2", "SourceAlpha");
  composite.setAttribute("operator", "arithmetic");
  composite.setAttribute("k2", -1);
  composite.setAttribute("k3", 1);
  composite.setAttribute("result", "composite1");

  filter.appendChild(composite);

  // * Flood 1
  flood = document.createElementNS(_SVG_NS, "feFlood");
  flood.setAttribute("flood-color", "black");
  flood.setAttribute("flood-opacity", 0.75);

  filter.appendChild(flood);

  // * Composite 2
  composite = document.createElementNS(_SVG_NS, "feComposite");
  composite.setAttribute("in2", "composite1");
  composite.setAttribute("operator", "in");
  composite.setAttribute("result", "composite2");

  filter.appendChild(composite);

  // * Composite 3
  composite = document.createElementNS(_SVG_NS, "feComposite");
  composite.setAttribute("in2", "SourceGraphic");
  composite.setAttribute("operator", "over");
  composite.setAttribute("result", "composite3");

  filter.appendChild(composite);

  // ? Drop Shadow B

  // * Blur 2
  blur = document.createElementNS(_SVG_NS, "feGaussianBlur");
  blur.setAttribute("in", "SourceAlpha");
  blur.setAttribute("stdDeviation", "5");
  blur.setAttribute("result", "blur2");

  filter.appendChild(blur);

  // * Offset 2
  offset = document.createElementNS(_SVG_NS, "feOffset");
  offset.setAttribute("dx", 5);
  offset.setAttribute("dy", 7);

  filter.appendChild(offset);

  // * Composite 4
  composite = document.createElementNS(_SVG_NS, "feComposite");
  composite.setAttribute("in2", "SourceAlpha");
  composite.setAttribute("operator", "arithmetic");
  composite.setAttribute("k2", -1);
  composite.setAttribute("k3", 1);
  composite.setAttribute("result", "composite4");

  filter.appendChild(composite);

  // * Flood 2
  flood = document.createElementNS(_SVG_NS, "feFlood");
  flood.setAttribute("flood-color", "black");
  flood.setAttribute("flood-opacity", 0.75);

  filter.appendChild(flood);

  // * Composite 5
  composite = document.createElementNS(_SVG_NS, "feComposite");
  composite.setAttribute("in2", "composite4");
  composite.setAttribute("operator", "in");
  composite.setAttribute("result", "composite5");

  filter.appendChild(composite);

  // * Composite 6
  composite = document.createElementNS(_SVG_NS, "feComposite");
  composite.setAttribute("in2", "SourceGraphic");
  composite.setAttribute("operator", "over");
  composite.setAttribute("result", "composite6");

  filter.appendChild(composite);

  DEFS.appendChild(filter);
}

function draw() {
  // ! Draw new squares based on the idea of
  // ! squares inscribed in another square
  // * Incremental variables
  let phi = 0; // Current angle
  let phi_a = 0; // Current angle (absolute value)
  let theta = 0; // Incremental angle

  // * Define initial radius
  let radius = 2 * Math.max(WIDTH, HEIGHT);

  while (radius > minimumRadius) {
    // * Create new square
    let rect = document.createElementNS(_SVG_NS, "polygon");

    // * Draw square and fill
    rect.setAttribute("points", getPoints(CENTER.x, CENTER.y, radius, theta));
    rect.setAttribute("fill", randomColor());

    // * Increase theta and define phi randomly
    theta += phi = Math.PI * (Math.random() * 2 - 1) * THETA_VAR;
    phi_a = Math.abs(phi);

    // * Find the opposite of phi based on the inscribed square
    let x = (2 * radius * Math.tan(phi_a)) / (Math.tan(phi_a) + 1);

    // * Define the new radius based on the sine function definition
    // * The new radius is in the hypotenuse
    radius = x / (2 * Math.sin(phi_a));

    SVG.appendChild(rect);
  }
}

function main() {
  // ! Main function
  // * Clear SVG
  SVG.innerHTML = "";
  DEFS.innerHTML = "";
  SVG.appendChild(DEFS);

  setSVG();

  if (!window.mobileAndTabletCheck()) {
    // * Do not build drop shadow filter in mobile devices
    dropShadow();
  }

  draw();
}

main();
