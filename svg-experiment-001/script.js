// * SVG namespace
let _SVG_NS = "http://www.w3.org/2000/svg";

let DIV = document.getElementById("svg-experiment");
let SVG = document.createElementNS(_SVG_NS, "svg");

DIV.appendChild(SVG);

// ! Global variables
let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

let CENTER = { x: WIDTH / 2, y: HEIGHT / 2 };

// ! Parameters
const THETA_VAR = 0.02; // Theta variance factor

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

// ! Build functions
function setSVG() {
  SVG.setAttribute("version", "1.1");
  SVG.setAttribute("xmlns", _SVG_NS);
  SVG.setAttribute("width", WIDTH);
  SVG.setAttribute("height", HEIGHT);
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

  while (radius > 5) {
    // * Create new square
    let rect = document.createElementNS(_SVG_NS, "polygon");

    // * Draw square and fill
    rect.setAttribute("points", getPoints(CENTER.x, CENTER.y, radius, theta));
    rect.setAttribute("fill", randomColor());

    // * Increase theta and define phi randomly
    theta += phi = 2 * Math.PI * (Math.random() * 2 - 1) * THETA_VAR;
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

  setSVG();
  draw();
}

main();

// ! Event listeners
window.addEventListener("click", (event) => {
  CENTER.x = event.clientX;
  CENTER.y = event.clientY;
  main();
});

window.addEventListener("resize", (event) => {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  CENTER.x = WIDTH / 2;
  CENTER.y = HEIGHT / 2;
  main();
});
