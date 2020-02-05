// SVG namespace
let _SVG_NS = 'http://www.w3.org/2000/svg';

let DIV = document.getElementById("svg-experiment");
let SVG = document.createElementNS(_SVG_NS, 'svg');

const WIDTH = 800;
const HEIGHT = 450;

SVG.setAttribute('version', '1.1');
SVG.setAttribute('xmlns', _SVG_NS);
SVG.setAttribute("width", WIDTH);
SVG.setAttribute("height", HEIGHT);


// Utils
function rotate(p, cx, cy, theta) {
    // Rotate polygon
    rx = (p[0] - cx)*Math.cos(theta) - (p[1] - cy)*Math.sin(theta) + cx;
    ry = (p[0] - cx)*Math.sin(theta) + (p[1] - cy)*Math.cos(theta) + cy;
    return [rx, ry];
}

function getPoints(cx, cy, r, theta) {
    // Get points -> String
    let pa = rotate([cx + r, cy], cx, cy, theta);
    let pb = rotate([cx, cy + r], cx, cy, theta);
    let pc = rotate([cx - r, cy], cx, cy, theta);
    let pd = rotate([cx, cy - r], cx, cy, theta);
    return pa[0] + ", " + pa[1] + " " + pb[0] + ", " + pb[1] + " " + pc[0] + ", " + pc[1] + " " + pd[0] + ", " + pd[1] + "";
}

function randomColor() {
    // Get new random and normalized color
    let r = Math.random();
    let g = Math.random();
    let b = Math.random();
    let n = Math.sqrt(r*r + g*g + b*b);
    return "rgb(" + 255*r/n + ", " + 255*g/n + ", " + 255*b/n + ")";
}


// Parameters
let phi = 0;           // Current angle
let phi_a = 0;         // Current angle (absolute value)
let theta = 0;         // Incremental angle
let theta_var = 0.02;  // Theta variance factor
let radius = 800;      // Initial radius


// Define new squares based on the idea of squares inscribed in another square
while (radius > 1) {
    // Create new square
    let rect = document.createElementNS(_SVG_NS, 'polygon');

    // Draw square and fill
    rect.setAttribute(
        'points', 
        getPoints(WIDTH/2, HEIGHT/2, radius, theta)
    );
    rect.setAttribute('fill', randomColor());

    // Increase theta and define phi randomly
    theta += phi = 2*Math.PI*(Math.random()*2 - 1)*theta_var;
    phi_a = Math.abs(phi);
    // Find the opposite of angle phi based on the inscribed square
    let x = 2*radius*Math.tan(phi_a)/(Math.tan(phi_a) + 1);
    // Define the new radius based on the sine function definition
    // The new radius is in the hypotenuse
    radius = x/(2*Math.sin(phi_a));

    SVG.appendChild(rect);
}

DIV.appendChild(SVG);
