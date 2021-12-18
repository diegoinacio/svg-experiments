// * SVG namespace
let _SVG_NS = "http://www.w3.org/2000/svg";

let DIV = document.getElementById("svg-experiment");
let SVG = document.createElementNS(_SVG_NS, "svg");
let DEFS = document.createElementNS(_SVG_NS, "defs");

DIV.appendChild(SVG);

// ! Global variables
let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

// ! Parameters (from index page)
const line_slicesMin = document.querySelector("input#line_slicesMin");
const line_slicesMax = document.querySelector("input#line_slicesMax");
let SLICES_MIN_VAR = parseInt(
  Math.min(line_slicesMin.value, line_slicesMax.value)
);
let SLICES_MAX_VAR = parseInt(
  Math.max(line_slicesMin.value, line_slicesMax.value)
);

const line_width = document.querySelector("input#line_width");
const line_round = document.querySelector("input#line_round");
let WIDTH_VAR = parseInt(line_width.value);
let ROUND_VAR = line_round.checked;

const space_between = document.querySelector("input#space_between");
let SPACE_VAR = parseInt(space_between.value);

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
  // * Get random hue channel -> object
  const h = parseInt(Math.random() * 360);

  // * Output
  return `hsl(${h}, 70%, 50%)`;
}

// ! Event listeners
// * Stop propagation when click on input
function stop_propagation() {
  event.stopPropagation();
}

// * Line slices parameter events
function set_line_slices() {
  SLICES_MIN_VAR = parseInt(
    Math.min(line_slicesMin.value, line_slicesMax.value)
  );
  SLICES_MAX_VAR = parseInt(
    Math.max(line_slicesMin.value, line_slicesMax.value)
  );
  main();
}

// * Line width parameter events
function set_line_width() {
  WIDTH_VAR = parseInt(line_width.value);
  main();
}

// * Line round parameter events
function set_line_round() {
  ROUND_VAR = line_round.checked;
  main();
}

// * Space between parameter events
function set_space_between() {
  SPACE_VAR = parseInt(space_between.value);
  main();
}

// * Resize window
window.addEventListener("resize", (event) => {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  main();
});

// ! Build functions
function setSVG() {
  SVG.setAttribute("version", "1.1");
  SVG.setAttribute("xmlns", _SVG_NS);
  SVG.setAttribute("width", WIDTH);
  SVG.setAttribute("height", HEIGHT);
}

function draw() {
  // ! Draw gradient lines
  let y1 = 0; // Init y position
  let id_index = 0; // Global index counter

  while (y1 < HEIGHT + WIDTH_VAR) {
    // * Get number of slices for current row
    let N = parseInt(
      SLICES_MIN_VAR + 1 + Math.random() * (SLICES_MAX_VAR - SLICES_MIN_VAR + 1)
    );
    // * Get slices
    let slices = getSlices(N, 0, WIDTH);

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
      x1 += i ? WIDTH_VAR + SPACE_VAR : 0;
      x2 -= i == N - 1 ? WIDTH_VAR + SPACE_VAR : 0;

      // * Set line/slice attributes
      line.setAttribute("x1", x1);
      line.setAttribute("y1", y1 + 0.0001); // ? Perfectly aligned (horizontal/vertical) lines do not render
      line.setAttribute("x2", x2);
      line.setAttribute("y2", y1);
      line.setAttribute("stroke-width", WIDTH_VAR);
      line.setAttribute("stroke-linecap", ROUND_VAR ? "round" : "square");
      line.setAttribute("stroke", id_url);

      // * Include slice to SVG
      SVG.appendChild(line);

      id_index += 1; // Increment global index counter
    }

    // * Skip to the next row
    y1 += WIDTH_VAR + SPACE_VAR;
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
