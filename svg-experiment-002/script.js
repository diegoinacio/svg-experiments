// * SVG namespace
let _SVG_NS = "http://www.w3.org/2000/svg";

let DIV = document.getElementById("svg-experiment");
let SVG = document.createElementNS(_SVG_NS, "svg");
let DEFS = document.createElementNS(_SVG_NS, "defs");

DIV.appendChild(SVG);

// ! Global variables
let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

// ! Parameters
const MIN_RADIUS = 16; // Minimum radius
const SPACE_BTW = 4; // Space between lines

// ! Utils
function getSlices(N, min, max) {
  // * Define slices for each row
  let slices = [];
  let vary = (max - min) / N / 2;
  for (let i = 0; i < N; i++) {
    let offset = min + ((max - min) * i) / (N - 1);
    if (i > 0 && i < N - 1) {
      offset += Math.random() * 2 * vary - vary;
    }
    slices[i] = offset;
  }
  return slices;
}

function randomColor() {
  // * Get random channels
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
  // ! Draw gradient lines
  // * Define line radius based on number of rows
  let steps = Math.floor(HEIGHT / MIN_RADIUS); // Number of rows

  // * Define actual radius
  let radius = (HEIGHT - (steps + 1) * SPACE_BTW) / steps / 2;

  let x_min = SPACE_BTW + radius; // Define x minimum
  let x_max = WIDTH - radius - SPACE_BTW; // Define x maximum

  let y1 = SPACE_BTW + radius; // Init y position
  let id_index = 0; // Global index counter

  while (y1 < HEIGHT) {
    // * Get number of slices for current row
    let N = Math.floor(4 + Math.random() * 4);
    // * Get slices
    let slices = getSlices(N, x_min, x_max);

    // ! Loop over slices of current row
    for (let i = 0; i < N - 1; i++) {
      // * Create new linear gradient for current slice
      let grad = document.createElementNS(_SVG_NS, "linearGradient");

      // * Define gradient id and url
      grad.id = `Gradient${id_index}`;
      let id_url = `url(#${grad.id})`;

      // * Set first stop (0%) for current gradient + color
      let stop1 = document.createElementNS(_SVG_NS, "stop");
      stop1.setAttribute("offset", "0%");
      stop1.setAttribute("stop-color", randomColor());

      // * Set second stop (100%) for current gradient + color
      let stop2 = document.createElementNS(_SVG_NS, "stop");
      stop2.setAttribute("offset", "100%");
      stop2.setAttribute("stop-color", randomColor());

      // * Include stops to gradient and
      // * include gradient to global defs
      grad.appendChild(stop1);
      grad.appendChild(stop2);
      DEFS.appendChild(grad);

      // * Draw current slice
      let line = document.createElementNS(_SVG_NS, "line");

      // * Define x points
      let x1 = slices[i];
      let x2 = slices[i + 1];

      // * Compensate position by radius and space between
      x1 += i ? 2 * radius + SPACE_BTW / 2 : 0;
      x2 -= i == N - 1 ? 2 * radius + SPACE_BTW / 2 : 0;

      // * Set line/slice attributes
      line.setAttribute("x1", x1);
      line.setAttribute("y1", y1 + 0.0001); // ? Perfectly horizontal/vertical line does not render
      line.setAttribute("x2", x2);
      line.setAttribute("y2", y1);
      line.setAttribute("stroke-width", 2 * radius);
      line.setAttribute("stroke-linecap", "round");
      line.setAttribute("stroke", id_url);

      // * Include slice to SVG
      SVG.appendChild(line);

      id_index += 1; // Increment global index counter
    }

    // * Skip to the next row
    y1 += 2 * radius + SPACE_BTW;
  }
}

function main() {
  // ! Main function
  // * Clear SVG
  SVG.innerHTML = "";
  DEFS.innerHTML = "";
  SVG.appendChild(DEFS);

  setSVG();
  draw();
}

main();

// ! Event listeners
window.addEventListener("click", (event) => {
  main();
});

window.addEventListener("resize", (event) => {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  main();
});
