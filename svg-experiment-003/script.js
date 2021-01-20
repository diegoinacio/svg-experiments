// * SVG namespace
let _SVG_NS = "http://www.w3.org/2000/svg";

let DIV = document.getElementById("svg-experiment");
let SVG = document.createElementNS(_SVG_NS, "svg");

DIV.appendChild(SVG);

// ! Global variables
let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

const MOUSE = {
  x: WIDTH / 2,
  y: HEIGHT / 2,
};

let CIRCLES = [];

// ! Parameters
// * Number of bokehs
let N = parseInt(Math.sqrt(WIDTH * HEIGHT) / 2);
// * Maximum parallax offset
let MAX_OFFSET = Math.max(WIDTH, HEIGHT) / 4;
// * Circles
const radiusMin = 5;
let radiusMax = Math.min(WIDTH, HEIGHT) / 48;
let radiusDepth = radiusMax * 4;

const isTouch = window.mobileAndTabletCheck();

// ! Utils
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

// ! Classes
class Circle {
  constructor(offset, depth) {
    // * Init circle
    this.circle = document.createElementNS(_SVG_NS, "circle");
    SVG.appendChild(this.circle);

    // * Get arguments
    this.offset = offset;
    this.depth = depth;

    // * Define position randomly
    this.cx = Math.random() * (WIDTH + 2 * offset) - offset;
    this.cx_ = this.cx;
    this.cy = Math.random() * (HEIGHT + 2 * offset) - offset;
    this.cy_ = this.cy;

    // * Define radius randomly
    this.r = (1 - depth) * radiusDepth + Math.random() * radiusMax + radiusMin;
    this.circle.setAttribute("r", this.r);

    // * Set attributes
    this.fill = randomColor(this.depth);
    this.circle.setAttribute("fill", this.fill);
    this.circle.setAttribute("stroke", this.fill);
    this.circle.setAttribute("stroke-width", 1 + Math.random() * 2);
    this.circle.setAttribute("fill-opacity", 0.75);

    // * Init general opacity
    this.opacity = depth * 0.9 + 0.1;
    this.opacity_ = this.opacity;
  }

  move(nx, ny) {
    // * Define parallax based on mouse position
    let dx = (WIDTH / 2 - nx) / WIDTH;
    let dy = (HEIGHT / 2 - ny) / HEIGHT;
    this.cx_ = this.cx + this.offset * dx * this.depth;
    this.cy_ = this.cy + this.offset * dy * this.depth;

    // * Ordinary frequency
    let f = 1 / 2 + this.depth / 2;
    // * Angular frequency
    let w = 2 * Math.PI * f;
    // * Blink effect
    let blink =
      Math.sin(w * (dx + 1) + 23 + w * this.depth) +
      Math.cos(w * (dx + 2) + 34 + w * this.depth) *
        Math.sin(w * (dy + 3) + 45 + w * this.depth) +
      Math.cos(w * (dy + 4) + 56 + w * this.depth);
    blink = blink / 2 + 1 / 2;
    this.opacity_ = this.opacity * blink;
  }

  draw() {
    // * Draw circles method
    this.circle.setAttribute("cx", this.cx_);
    this.circle.setAttribute("cy", this.cy_);
    this.circle.setAttribute("opacity", this.opacity_);
  }
}

// ! Build functions
function setSVG() {
  SVG.setAttribute("version", "1.1");
  SVG.setAttribute("xmlns", _SVG_NS);
  SVG.setAttribute("width", WIDTH);
  SVG.setAttribute("height", HEIGHT);
}

function initCircles() {
  // ! Init circles
  CIRCLES = [];
  for (let i = 0; i < N; i++) {
    let CIRCLE = new Circle(MAX_OFFSET, i / N);
    CIRCLE.move(MOUSE.x, MOUSE.y);
    CIRCLES.push(CIRCLE);
  }
}

function animate() {
  // ! Animation loop
  for (let i = 0; i < N; i++) {
    let CIRCLE = CIRCLES[i];

    CIRCLE.move(MOUSE.x, MOUSE.y);
    CIRCLE.draw();
  }

  requestAnimationFrame(animate);
}

function main() {
  // ! Main function
  // * Clear SVG
  SVG.innerHTML = "";

  setSVG();
  initCircles();
  animate();
}

main();

// ! Event listeners
window.addEventListener(isTouch ? "touchmove" : "mousemove", (event) => {
  let RECT = DIV.getBoundingClientRect();

  let clientX = isTouch ? event.touches[0].clientX : event.clientX;
  let clientY = isTouch ? event.touches[0].clientY : event.clientY;

  // * Relative x
  MOUSE.x = clientX - RECT.left;
  MOUSE.x /= RECT.right - RECT.left;
  MOUSE.x = MOUSE.x * WIDTH;

  // * Relative y
  MOUSE.y = clientY - RECT.top;
  MOUSE.y /= RECT.bottom - RECT.top;
  MOUSE.y = MOUSE.y * HEIGHT;
});

window.addEventListener("resize", () => {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;

  N = parseInt(Math.sqrt(WIDTH * HEIGHT) / 2);
  MAX_OFFSET = Math.max(WIDTH, HEIGHT) / 4;
  radiusMax = Math.min(WIDTH, HEIGHT) / 48;
  radiusDepth = radiusMax * 4;

  main();
});
