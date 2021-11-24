// * SVG namespaces
let _SVG_NS = "http://www.w3.org/2000/svg";

let DIV = document.getElementById("svg-experiment");
let SVG = document.createElementNS(_SVG_NS, "svg");

DIV.appendChild(SVG);

// ! Global variables
let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

// ! Parameters (from index page)
// * Rule
const rule_options = document.querySelector("select#rule");
const c_rule = document.querySelector("input#c_rule");
// * Neighborhood
const radius_options = document.querySelector("select#radius");
const c_radius = document.querySelector("input#c_radius");
// * Cell size
const size_options = document.querySelector("select#size");
const c_size = document.querySelector("input#c_size");

// ! Local variables
let RULE = rule_options.value;
let CELL_SIZE = size_options.value;
let DIAMETER = 2 * radius_options.value + 1;

let N_width = parseInt(WIDTH / CELL_SIZE);
let N_height = parseInt(HEIGHT / CELL_SIZE);

const isTouch = window.mobileAndTabletCheck();

// ! Utils
// * Roll function (copy array)
Array.prototype.roll = function (n) {
  const roll = this.slice();
  n = n % roll.length;
  while (roll.length && n < 0) n += roll.length;
  roll.push.apply(roll, roll.splice(0, n));
  return roll;
};

function setAttributes(element, attributes) {
  // ! Set multiple attributes at once
  for (let key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// ! Event functions
// * Rule parameter events
function select_rule() {
  // ! Set rule
  const rule = parseInt(rule_options.value);
  // * Deal with custom option
  if (!rule) {
    c_rule.disabled = false;
  } else {
    c_rule.disabled = true;
    RULE = rule;
    main();
  }
}

function select_rule_custom() {
  // ! Set custom rule
  RULE = parseInt(c_rule.value);
  main();
}

// * Neighborhood parameter events
function select_radius() {
  // ! Set neighborhood
  const radius = parseInt(radius_options.value);
  // * Deal with custom option
  if (!radius) {
    c_radius.disabled = false;
  } else {
    const RULE_OPTIONS = rule_options.querySelectorAll("option");
    if (radius > 1) {
      RULE_OPTIONS.forEach((option) => {
        option.disabled = option.value > 0;
        option.selected = !option.value;
      });
      c_rule.disabled = false;
    } else {
      RULE_OPTIONS.forEach((option) => {
        option.disabled = false;
        option.selected = option.value == 225;
      });
      c_rule.disabled = true;
    }
    c_radius.disabled = true;
    DIAMETER = 2 * radius + 1;
    main();
  }
}

function select_radius_custom() {
  // ! Set custom neighborhood
  DIAMETER = 2 * parseInt(c_radius.value) + 1;
  main();
}

// * Cell size parameter events
function select_size() {
  // ! Set cell size
  const size = parseInt(size_options.value);
  // * Deal with custom option
  if (!size) {
    c_size.disabled = false;
  } else {
    c_size.disabled = true;
    CELL_SIZE = size;
    N_width = parseInt(WIDTH / CELL_SIZE);
    N_height = parseInt(HEIGHT / CELL_SIZE);
    main();
  }
}

function select_size_custom() {
  // ! Set custom cell size
  CELL_SIZE = parseInt(c_size.value);
  N_width = parseInt(WIDTH / CELL_SIZE);
  N_height = parseInt(HEIGHT / CELL_SIZE);
  main();
}

// * Resize window event
window.addEventListener("resize", () => {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;

  N_width = parseInt(WIDTH / CELL_SIZE);
  N_height = parseInt(HEIGHT / CELL_SIZE);

  main();
});

// ! Build functions
function setSVG() {
  SVG.setAttribute("version", "1.1");
  SVG.setAttribute("xmlns", _SVG_NS);
  SVG.setAttribute("width", WIDTH);
  SVG.setAttribute("height", HEIGHT);
}

function ruleSet() {
  // ! return the rule set
  const size = 2 ** DIAMETER;
  const rule_limit = RULE % 2 ** size;
  const bin = (rule_limit >>> 0).toString(2).padStart(size, 0);
  return bin
    .split("")
    .reverse()
    .map((e) => {
      return parseInt(e, 10);
    });
}

function cellularAutomata(geno, gers) {
  // ! Build cellular automaton
  const radius = (DIAMETER / 2) >> 0;
  const newState = ruleSet();
  const CA = [];
  for (let ger = 0; ger < gers; ger++) {
    const geni = new Array(N_width);
    for (let i = 0; i < N_width; i++) {
      // * Get neighborhood from past generation
      const neighbors = geno.roll(i - radius).slice(0, DIAMETER);
      const opacities = neighbors.map((e) => e.opacity);
      const index = parseInt(opacities.join(""), 2);
      // * Define colors
      const dg = ger / gers;
      const di = index / newState.length;
      const hue = 360 * (Math.abs(2 * dg - 1) + Math.abs(2 * di - 1));
      // * Register cell
      geni[i] = { opacity: newState[index], color: `hsl(${hue},50%,50%)` };
    }
    CA.push(geni);
    geno = geni;
  }
  return CA;
}

function draw() {
  // ! Draw
  let geno = Array.from({ length: N_width }, () => ({
    opacity: parseInt(Math.random() + 0.5),
  }));
  const CA = cellularAutomata(geno, N_height);
  for (let j = 0; j < N_height; j++) {
    for (let i = 0; i < N_width; i++) {
      let rect = document.createElementNS(_SVG_NS, "rect");
      let attributes = {
        x: i * CELL_SIZE,
        y: j * CELL_SIZE,
        width: CELL_SIZE,
        height: CELL_SIZE,
        rx: CELL_SIZE / 3,
        opacity: CA[j][i].opacity,
        fill: CA[j][i].color,
      };
      setAttributes(rect, attributes);
      SVG.appendChild(rect);
    }
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
