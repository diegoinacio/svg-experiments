// * SVG namespaces
let _SVG_NS = "http://www.w3.org/2000/svg";

let DIV = document.getElementById("svg-experiment");
let SVG = document.createElementNS(_SVG_NS, "svg");
let DEFS = document.createElementNS(_SVG_NS, "defs");

DIV.appendChild(SVG);

// ! Global variables
let filterURL, filterID, SELECTED;
let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

// ! Parameters (from index page)
const circle_radiusMin = document.querySelector("input#circle_radiusMin");
const circle_radiusMax = document.querySelector("input#circle_radiusMax");
let RADIUS_MIN_VAR = Math.min(circle_radiusMin.value, circle_radiusMax.value);
let RADIUS_MAX_VAR = Math.max(circle_radiusMin.value, circle_radiusMax.value);

const depth_levels = document.querySelector("input#depth_levels");
let DEPTH_VAR = parseInt(depth_levels.value);

const circle_density = document.querySelector("input#circle_density");
let DENSITY_VAR = circle_density.value;

// ! Parameters
let minRadius = (RADIUS_MIN_VAR * Math.min(WIDTH, HEIGHT)) / 32;
let maxRadius = (RADIUS_MAX_VAR * Math.min(WIDTH, HEIGHT)) / 32;
let N = parseInt((DEPTH_VAR * DENSITY_VAR * Math.sqrt(WIDTH * HEIGHT)) / 64);

let stdMultiplier = 32;
let stdMin = 8;
let stdMax = 64;

// ! Init mouse position object
let MOUSE = {
  x: 0, // ? Position x
  y: 0, // ? Position y
  moving: false, // ? Indicate if mouse is moving or not
};

const isTouch = window.mobileAndTabletCheck();

// ! Utils
function randomColor() {
  // ! Return random colors interpolated from gradient
  // ! "flat design colors 1" @ color.adobe.com
  const colors = ["#334D5C", "#45B29D", "#EFC94C", "#E27A3F", "#DF5A49"];
  // * Get interpolation parameters
  let p = Math.random() * (colors.length - 1);
  let t = p % 1;
  let co = colors[Math.floor(p)];
  let ci = colors[Math.ceil(p)];
  // * Color transformation
  co = co.match(/#(.{2})(.{2})(.{2})/);
  let ro = parseInt(co[1], 16),
    go = parseInt(co[2], 16),
    bo = parseInt(co[3], 16);
  ci = ci.match(/#(.{2})(.{2})(.{2})/);
  let ri = parseInt(ci[1], 16),
    gi = parseInt(ci[2], 16),
    bi = parseInt(ci[3], 16);
  // * Color interpolation
  let r = (1 - t) * ro + t * ri;
  let g = (1 - t) * go + t * gi;
  let b = (1 - t) * bo + t * bi;

  // * Output
  return `rgb(${r}, ${g}, ${b})`;
}

function setAttributes(element, attributes) {
  // ! Set multiple attributes at once
  for (let key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// ! Event functions
// * Stop propagation when click on input
function stop_propagation() {
  event.stopPropagation();
}

// * Circle radius parameter events
function set_circle_radius() {
  RADIUS_MIN_VAR = Math.min(circle_radiusMin.value, circle_radiusMax.value);
  RADIUS_MAX_VAR = Math.max(circle_radiusMin.value, circle_radiusMax.value);
  minRadius = (RADIUS_MIN_VAR * Math.min(WIDTH, HEIGHT)) / 32;
  maxRadius = (RADIUS_MAX_VAR * Math.min(WIDTH, HEIGHT)) / 32;
  main();
}

// * Depth levels parameter events
function set_depth_levels() {
  DEPTH_VAR = parseInt(depth_levels.value);
  N = parseInt((DEPTH_VAR * DENSITY_VAR * Math.sqrt(WIDTH * HEIGHT)) / 64);
  main();
}

// * Circle density parameter events
function set_circle_density() {
  DENSITY_VAR = circle_density.value;
  N = parseInt((DEPTH_VAR * DENSITY_VAR * Math.sqrt(WIDTH * HEIGHT)) / 64);
  main();
}

// * Change focus
window.addEventListener(isTouch ? "touchstart" : "mousedown", dragStartEvent);

function dragStartEvent(event) {
  // ? Event which deal with the initial aspects of click down
  // * Mouse position just after mouse down
  MOUSE.x = isTouch ? event.touches[0].clientX : event.clientX;
  MOUSE.y = isTouch ? event.touches[0].clientY : event.clientY;

  SELECTED = event.target;

  // * Start other events
  window.addEventListener(isTouch ? "touchmove" : "mousemove", dragMoveEvent);
  window.addEventListener(isTouch ? "touchend" : "mouseup", dragStopEvent);
}

function dragMoveEvent(event) {
  // ? Event which deal with mouse movement after mouse down
  // * Get mouse position on screen during movement
  let cx = isTouch ? event.touches[0].clientX : event.clientX;
  let cy = isTouch ? event.touches[0].clientY : event.clientY;
  let dx = MOUSE.x - cx;
  let dy = MOUSE.y - cy;

  stdMultiplier += dy / 16;
  stdMultiplier =
    stdMultiplier < stdMin
      ? stdMin
      : stdMultiplier > stdMax
      ? stdMax
      : stdMultiplier;
  changeBlur();

  // * Indicate that mouse is moving
  MOUSE.moving = true;
}

function dragStopEvent(event) {
  // ? Event which deals with the initial aspects of click up
  // * Remove svg events from "dragStartEvent"
  window.removeEventListener(
    isTouch ? "touchmove" : "mousemove",
    dragMoveEvent
  );
  window.removeEventListener(isTouch ? "touchend" : "mouseup", dragStopEvent);

  if (!MOUSE.moving && SELECTED !== SVG) {
    changeFocus(SELECTED);
  }

  // * Turn off mouse movement
  MOUSE.moving = false;
}

function changeBlur() {
  // ! Change gaussian blur parameters
  let FILTERS = DEFS.querySelectorAll("filter");
  FILTERS.forEach((filter) => {
    let filterID_ = parseInt(filter.id.match(/f(\d*)/)[1]);
    let std = Math.pow((filterID - filterID_) / DEPTH_VAR, 2);
    let blur = filter.querySelector(":scope feGaussianBlur");
    blur.setAttribute("stdDeviation", std * stdMultiplier);
  });
}

function changeFocus(element) {
  // ! Change focus
  filterURL = element.getAttribute("filter");
  filterID = parseInt(filterURL.match(/f(\d*)/)[1]);
  let FILTERS = DEFS.querySelectorAll("filter");
  FILTERS.forEach((filter) => {
    let filterID_ = parseInt(filter.id.match(/f(\d*)/)[1]);
    let std = Math.pow((filterID - filterID_) / DEPTH_VAR, 2);
    let blur = filter.querySelector(":scope feGaussianBlur");
    gsap.to(blur, {
      duration: 0.75,
      attr: { stdDeviation: std * stdMultiplier },
    });
  });
}

// * Resize window
window.addEventListener("resize", (event) => {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;

  minRadius = (RADIUS_MIN_VAR * Math.min(WIDTH, HEIGHT)) / 32;
  maxRadius = (RADIUS_MAX_VAR * Math.min(WIDTH, HEIGHT)) / 32;
  N = parseInt((DEPTH_VAR * DENSITY_VAR * Math.sqrt(WIDTH * HEIGHT)) / 64);

  main();
});

// ! Build functions
function setSVG() {
  SVG.setAttribute("version", "1.1");
  SVG.setAttribute("xmlns", _SVG_NS);
  SVG.setAttribute("width", WIDTH);
  SVG.setAttribute("height", HEIGHT);
}

function defineFilters() {
  // ! Define filters
  let focus = Math.random();
  filterID = parseInt(focus * DEPTH_VAR);
  focus = filterID / DEPTH_VAR;
  for (let i = 0; i < DEPTH_VAR; i++) {
    // * Filter
    let filter = document.createElementNS(_SVG_NS, "filter");
    filter.id = `f${i}`;
    let attributes = {
      x: "-200%",
      y: "-200%",
      width: "400%",
      height: "400%",
    };
    setAttributes(filter, attributes);
    DEFS.appendChild(filter);
    // * Gaussian blur
    let blur = document.createElementNS(_SVG_NS, "feGaussianBlur");
    blur.setAttribute("in", "SourceGraphic");
    let std = Math.pow(focus - i / DEPTH_VAR, 2);
    blur.setAttribute("stdDeviation", std * stdMultiplier);
    filter.appendChild(blur);
  }
}

function drawCircles() {
  // ! Draw circles
  for (let i = 0; i < N; i++) {
    let circle = document.createElementNS(_SVG_NS, "circle");
    let attributes = {
      // * Define circle center
      cx: Math.random() * WIDTH,
      cy: Math.random() * HEIGHT,
      // * Radius based on parameters and z-order
      r: minRadius + Math.random() * (maxRadius - minRadius) + (20 * i) / N,
      // * Fill color
      fill: randomColor(),
      "fill-opacity": 0.75,
      // * Stroke based on fill
      // * Self-reference in object literals / initializers
      get stroke() {
        return this.fill;
      },
      "stroke-width": 1 + (3 * i) / N,
      // * Filter definition
      filter: `url(#f${parseInt(DEPTH_VAR * (i / N))})`,
    };
    setAttributes(circle, attributes);
    SVG.appendChild(circle);
  }
}

function main() {
  // ! Main function
  // * Clear SVG
  SVG.innerHTML = "";
  DEFS.innerHTML = "";
  SVG.appendChild(DEFS);

  setSVG();
  defineFilters();
  drawCircles();
}

main();
