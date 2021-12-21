// * SVG namespaces
let _SVG_NS = "http://www.w3.org/2000/svg";
let _XLINK_NS = "http://www.w3.org/1999/xlink";

let DIV = document.getElementById("svg-experiment");
let SVG = document.createElementNS(_SVG_NS, "svg");
let DEFS = document.createElementNS(_SVG_NS, "defs");

DIV.appendChild(SVG);

let grid = document.createElementNS(_SVG_NS, "g");
grid.id = "background-grid";
let BG = document.createElementNS(_SVG_NS, "g");
BG.id = "background-group";
let FG = document.createElementNS(_SVG_NS, "g");
FG.id = "foreground-group";

// ! Global variables
let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

// ! Parameters (from index page)
const grid_horizontal = document.querySelector("input#grid_horizontal");
const grid_vertical = document.querySelector("input#grid_vertical");
let GRID_HOR_VAR = parseInt(grid_horizontal.value);
let GRID_VER_VAR = parseInt(grid_vertical.value);

const pattern_polka = document.querySelector("input#pattern_polka");
const pattern_sprinkles = document.querySelector("input#pattern_sprinkles");
const pattern_zebra = document.querySelector("input#pattern_zebra");
let POLKA_VAR = pattern_polka.checked;
let SPRINKLES_VAR = pattern_sprinkles.checked;
let ZEBRA_VAR = pattern_zebra.checked;

const PATTERN_SPACE = 16;

const shape_horizontal = document.querySelector("input#shape_horizontal");
const shape_vertical = document.querySelector("input#shape_vertical");
let SHAPE_HOR_VAR = parseInt(shape_horizontal.value);
let SHAPE_VER_VAR = parseInt(shape_vertical.value);

const shape_circle = document.querySelector("input#shape_circle");
const shape_square = document.querySelector("input#shape_square");
const shape_triangle = document.querySelector("input#shape_triangle");
let CIRCLE_VAR = shape_circle.checked;
let SQUARE_VAR = shape_square.checked;
let TRIANGLE_VAR = shape_triangle.checked;

const zigzag_horizontal = document.querySelector("input#zigzag_horizontal");
const zigzag_vertical = document.querySelector("input#zigzag_vertical");
let ZIGZAG_HOR_VAR = parseInt(zigzag_horizontal.value);
let ZIGZAG_VER_VAR = parseInt(zigzag_vertical.value);

const show_zigzag = document.querySelector("input#show_zigzag");
let ZIGZAG_VAR = show_zigzag.checked;

let PATTERNS = [];
let SHAPES = [];
let POINTS = [];

// ! Utils
function distance(pa, pb) {
  // ! Calculate euclidean distance between pa and pb
  return Math.sqrt(Math.pow(pa.x - pb.x, 2) + Math.pow(pa.y - pb.y, 2));
}

function drawTriangle(radius) {
  // ! Draw triangles randomly
  const pi2 = 2 * Math.PI;
  // * Create new polygon
  let poly = document.createElementNS(_SVG_NS, "polygon");
  // * Define subperiods for angular frequency
  let t0 = Math.random() + 1;
  let t1 = Math.random() + 1;
  let t2 = Math.random() + 1;
  t2 += t1 += t0;
  t0 /= t2;
  t1 /= t2;
  // * Define points
  let pax = radius * (Math.sin(pi2 * t0) + 1);
  let pay = radius * (Math.cos(pi2 * t0) + 1);
  let pbx = radius * (Math.sin(pi2 * t1) + 1);
  let pby = radius * (Math.cos(pi2 * t1) + 1);
  let pcx = radius * (Math.sin(0) + 1);
  let pcy = radius * (Math.cos(0) + 1);
  poly.setAttribute("points", `${pax},${pay} ${pbx},${pby} ${pcx},${pcy}`);

  // * Output
  return poly;
}

function drawZigZag() {
  // ! Draw ZigZag path
  let group = document.createElementNS(_SVG_NS, "g");
  let path = document.createElementNS(_SVG_NS, "path");
  let drop = document.createElementNS(_SVG_NS, "path");
  group.appendChild(drop);
  group.appendChild(path);
  // * Define path
  path.id = "zz-path" + Math.random();
  let x = 0;
  let y = Math.random() * 50 + 25;
  let d = `M ${x} ${y} `;
  while (x < 100) {
    x += Math.random() * 10 + 10;
    y = y < 50 ? 50 + Math.random() * 25 : 25 + Math.random() * 25;
    d += `L ${x} ${y} `;
  }
  path.setAttribute("d", d);
  path.setAttribute("level", Math.floor(Math.random() * 4));
  // * Define drop shadow
  drop.id = "drop-shadow";
  drop.setAttribute("d", d);
  drop.setAttribute("transform", "translate(3 3)");

  // * Output
  return group;
}

// ! Event listeners
// * Grid parameter events
function set_grid_horizontal() {
  GRID_HOR_VAR = parseInt(grid_horizontal.value);
  main();
}

function set_grid_vertical() {
  GRID_VER_VAR = parseInt(grid_vertical.value);
  main();
}

// * Patterns parameter events
function set_pattern_polka() {
  POLKA_VAR = pattern_polka.checked;
  main();
}

function set_pattern_sprinkles() {
  SPRINKLES_VAR = pattern_sprinkles.checked;
  main();
}

function set_pattern_zebra() {
  ZEBRA_VAR = pattern_zebra.checked;
  main();
}

// * Shape parameter events
function set_shape_horizontal() {
  SHAPE_HOR_VAR = parseInt(shape_horizontal.value);
  main();
}

function set_shape_vertical() {
  SHAPE_VER_VAR = parseInt(shape_vertical.value);
  main();
}

function set_shape_circle() {
  CIRCLE_VAR = shape_circle.checked;
  main();
}

function set_shape_square() {
  SQUARE_VAR = shape_square.checked;
  main();
}

function set_shape_triangle() {
  TRIANGLE_VAR = shape_triangle.checked;
  main();
}

// * Zigzag parameter events
function set_zigzag_horizontal() {
  ZIGZAG_HOR_VAR = parseInt(zigzag_horizontal.value);
  main();
}

function set_zigzag_vertical() {
  ZIGZAG_VER_VAR = parseInt(zigzag_vertical.value);
  main();
}

function set_show_zigzag() {
  ZIGZAG_VAR = show_zigzag.checked;
  main();
}

// * Resize window
window.addEventListener("resize", () => {
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

function drawGrid() {
  // ! Draw background grid
  // ? Vertical lines
  for (let i = 0; i < WIDTH; i += GRID_HOR_VAR) {
    let line = document.createElementNS(_SVG_NS, "line");
    // * Set attributes
    line.setAttribute("x1", i);
    line.setAttribute("x2", i + 0.0001);
    line.setAttribute("y1", 0);
    line.setAttribute("y2", HEIGHT);
    // * Append
    grid.appendChild(line);
  }

  // ? Horizontal lines
  for (let j = 0; j < HEIGHT; j += GRID_VER_VAR) {
    let line = document.createElementNS(_SVG_NS, "line");
    // * Set attributes
    line.setAttribute("x1", 0);
    line.setAttribute("x2", WIDTH);
    line.setAttribute("y1", j);
    line.setAttribute("y2", j + 0.0001);
    // * Append
    grid.appendChild(line);
  }
}

function drawPatterns() {
  // ! Patterns
  let PATTERN;
  PATTERNS = [];

  // ? Pattern 1 - Polka Dot
  if (POLKA_VAR) {
    PATTERN = document.createElementNS(_SVG_NS, "g");
    PATTERN.id = "pattern-circles";
    PATTERN.setAttribute("width", 1);
    PATTERN.setAttribute("height", 1);

    DEFS.appendChild(PATTERN);
    PATTERNS.push(PATTERN.id);

    for (let i = 0; i < WIDTH + 1; i += PATTERN_SPACE) {
      for (let j = 0; j < HEIGHT + 1; j += PATTERN_SPACE) {
        let circle = document.createElementNS(_SVG_NS, "circle");
        // * Set attributes
        circle.setAttribute("r", Math.random() * 3 + 1);
        circle.setAttribute("cx", i);
        circle.setAttribute("cy", j);
        // * Append
        PATTERN.appendChild(circle);
      }
    }
  }

  // ? Pattern 2 - Sprinkles
  if (SPRINKLES_VAR) {
    PATTERN = document.createElementNS(_SVG_NS, "g");
    PATTERN.id = "pattern-paths";
    PATTERN.setAttribute("width", 1);
    PATTERN.setAttribute("height", 1);

    DEFS.appendChild(PATTERN);
    PATTERNS.push(PATTERN.id);

    for (let i = 0; i < WIDTH + 1; i += PATTERN_SPACE) {
      for (let j = 0; j < HEIGHT + 1; j += PATTERN_SPACE) {
        let path = document.createElementNS(_SVG_NS, "path");
        // * Random Xs
        let x1 = Math.random();
        let x2 = Math.random();
        let x1x2 = x1 + x2;
        x1 = (PATTERN_SPACE * x1) / x1x2 + i;
        x2 = (PATTERN_SPACE * x2) / x1x2 + i;
        // * Random Ys
        let y1 = Math.random();
        let y2 = Math.random();
        let y1y2 = y1 + y2;
        y1 = (PATTERN_SPACE * y1) / y1y2 + j;
        y2 = (PATTERN_SPACE * y2) / y1y2 + j;
        // * Random middle
        let t, mx, my;
        if (Math.abs(x1 - x2) > Math.abs(y1 - y2)) {
          t = Math.random();
          mx = t * x1 + (1 - t) * x2;
          my = Math.random() * PATTERN_SPACE + j;
        } else {
          t = Math.random();
          my = t * y1 + (1 - t) * y2;
          mx = Math.random() * PATTERN_SPACE + i;
        }
        // * Set attributes
        path.setAttribute("d", `M ${x1} ${y1} Q ${mx} ${my}, ${x2} ${y2}`);
        // * Append
        PATTERN.appendChild(path);
      }
    }
  }

  // ? Pattern 3 - Zebra
  if (ZEBRA_VAR) {
    PATTERN = document.createElementNS(_SVG_NS, "g");
    PATTERN.id = "pattern-lines";
    PATTERN.setAttribute("width", 1);
    PATTERN.setAttribute("height", 1);

    DEFS.appendChild(PATTERN);
    PATTERNS.push(PATTERN.id);

    for (let i = 0; i < HEIGHT + 1; i += PATTERN_SPACE) {
      let line = document.createElementNS(_SVG_NS, "line");
      // * Set attributes
      line.setAttribute("x1", 0);
      line.setAttribute("x2", WIDTH);
      line.setAttribute("y1", i);
      line.setAttribute("y2", i + 0.0001);
      line.setAttribute("stroke-width", 7 * Math.random() + 1);
      // * Append
      PATTERN.appendChild(line);
    }
  }
}

function drawShapes() {
  // ! Shapes
  let SHAPE;
  SHAPES = [];

  // ? Shape 1 - Circle
  if (CIRCLE_VAR) {
    SHAPE = document.createElementNS(_SVG_NS, "circle");
    SHAPE.id = "shape-circle";
    SHAPE.setAttribute("r", 50);
    SHAPE.setAttribute("cx", 50);
    SHAPE.setAttribute("cy", 50);

    DEFS.appendChild(SHAPE);
    SHAPES.push(SHAPE.id);
  }

  // ? Shape 2 - Square
  if (SQUARE_VAR) {
    SHAPE = document.createElementNS(_SVG_NS, "rect");
    SHAPE.id = "shape-square";
    SHAPE.setAttribute("x", 15);
    SHAPE.setAttribute("y", 15);
    SHAPE.setAttribute("width", 70);
    SHAPE.setAttribute("height", 70);

    DEFS.appendChild(SHAPE);
    SHAPES.push(SHAPE.id);
  }

  // ? Shape 3 - Triangle
  if (TRIANGLE_VAR) {
    SHAPE = drawTriangle(50);
    SHAPE.id = "shape-triangle";

    DEFS.appendChild(SHAPE);
    SHAPES.push(SHAPE.id);
  }
}

function scatterShapes() {
  // ! Scatter shapes
  let POINT;
  POINTS = [];

  // * Finding points
  for (let i = 1; i < WIDTH + 1; i += SHAPE_HOR_VAR) {
    for (let j = 1; j < HEIGHT + 1; j += SHAPE_VER_VAR) {
      POINT = {};
      POINT.x = i + (Math.random() * 2 - 1) * 20;
      POINT.y = j + (Math.random() * 2 - 1) * 20;
      POINT.r = Math.random() + 1;
      POINTS.push(POINT);
    }
  }

  POINTS.forEach((point) => {
    // * Create mask
    let MASK = document.createElementNS(_SVG_NS, "mask");
    MASK.id = "mask" + Math.random();
    SVG.appendChild(MASK);
    // * Include shape into mask
    let USE1 = document.createElementNS(_SVG_NS, "use");
    SHAPE = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    USE1.setAttributeNS(_XLINK_NS, "href", `#${SHAPE}`);
    let theta = Math.random() * 360;
    USE1.setAttribute(
      "transform",
      `
			translate(${point.x} ${point.y})
			scale(${point.r})
			rotate(${theta} 50 50)
			`
    );
    USE1.setAttribute("fill", "white");
    MASK.appendChild(USE1);
    // * Define pattern group
    let G1 = document.createElementNS(_SVG_NS, "g");
    G1.setAttribute("mask", `url(#${MASK.id})`);
    // * Include pattern into group
    let USE2 = document.createElementNS(_SVG_NS, "use");
    PATTERN = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];
    USE2.setAttributeNS(_XLINK_NS, "href", `#${PATTERN}`);
    G1.appendChild(USE2);
    // * Define fill color group
    let G2 = document.createElementNS(_SVG_NS, "g");
    G2.setAttribute("mask", `url(#${MASK.id})`);
    let osx = Math.random() * 30 - 15;
    let osy = Math.random() * 30 - 15;
    G2.setAttribute("transform", `translate(${osx} ${osy})`);
    // * Include shape
    let rect = document.createElementNS(_SVG_NS, "rect");
    rect.id = "fill-shape";
    rect.setAttribute("level", Math.floor(Math.random() * 4));
    rect.setAttribute("width", WIDTH);
    rect.setAttribute("height", HEIGHT);
    G2.appendChild(rect);
    // * Foreground or background definition
    let definer = Math.random();
    if (definer > 0.5) {
      BG.appendChild(G1);
      FG.appendChild(G2);
    } else {
      BG.appendChild(G2);
      FG.appendChild(G1);
    }
  });

  // ! Scatter zigzags
  if (ZIGZAG_VAR) {
    for (let i = 1; i < WIDTH + 1; i += ZIGZAG_HOR_VAR) {
      for (let j = 1; j < HEIGHT + 1; j += ZIGZAG_VER_VAR) {
        SHAPE = drawZigZag();
        let x = i + (Math.random() * 2 - 1) * 20 + 50;
        let y = j + (Math.random() * 2 - 1) * 20 + 50;
        let r = Math.random() * 0.5 + 0.75;
        let theta = Math.random() * 360;
        SHAPE.setAttribute(
          "transform",
          `
          translate(${x} ${y})
          scale(${r})
          rotate(${theta} 50 50)
          `
        );
        SVG.appendChild(SHAPE);
      }
    }
  }
}

function main() {
  // ! Main function
  // * Clear SVG
  SVG.innerHTML = "";
  DEFS.innerHTML = "";
  SVG.appendChild(DEFS);

  grid.innerHTML = "";
  SVG.appendChild(grid);
  BG.innerHTML = "";
  SVG.appendChild(BG);
  FG.innerHTML = "";
  SVG.appendChild(FG);

  setSVG();
  drawGrid();
  drawPatterns();
  drawShapes();
  scatterShapes();
}

main();
