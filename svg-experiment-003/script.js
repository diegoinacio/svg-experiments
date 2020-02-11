// SVG namespace
let _SVG_NS = 'http://www.w3.org/2000/svg';

let DIV = document.getElementById("svg-experiment");
let SVG = document.createElementNS(_SVG_NS, 'svg');
let DEFS = document.createElementNS(_SVG_NS, 'defs');

SVG.appendChild(DEFS);

const WIDTH = 800;
const HEIGHT = 450;

SVG.setAttribute('version', '1.1');
SVG.setAttribute('xmlns', _SVG_NS);
SVG.setAttribute("width", WIDTH);
SVG.setAttribute("height", HEIGHT);


// Utils
function randomColor() {
    // Get new random and normalized color
    let r = Math.random();
    let g = Math.random();
    let b = Math.random();
    let n = Math.sqrt(r*r + g*g + b*b);
    return "rgb(" + 255*r/n + ", " + 255*g/n + ", " + 255*b/n + ")";
}


// Classes
class Circle {
    constructor(offset, depth) {
        // Init circle
        this.circle = document.createElementNS(_SVG_NS, 'circle');
        SVG.appendChild(this.circle);

        // Get arguments
        this.offset = offset;
        this.depth = depth;

        // Define position randomly
        this.cx = Math.random()*(WIDTH + 2*offset) - offset;
        this.cx_ = this.cx;
        this.cy = Math.random()*(HEIGHT + 2*offset) - offset;
        this.cy_ = this.cy;

        // Define radius randomly
        this.r = (1 - depth)*40 + Math.random()*15 + 5;
        this.circle.setAttribute('r', this.r);

        // Set attributes
        this.fill = randomColor(this.depth);
        this.circle.setAttribute('fill', this.fill);
        this.circle.setAttribute('stroke', this.fill);
        this.circle.setAttribute('stroke-width', 1 + Math.random()*2);
        this.circle.setAttribute('fill-opacity', 0.75);

        // Init general opacity
        this.opacity = depth*0.9 + 0.1;
        this.opacity_ = this.opacity;
    }

    move(nx, ny) {
        // Define parallax based on mouse position
        let dx = (WIDTH/2 - nx)/WIDTH;
        let dy = (HEIGHT/2 - ny)/HEIGHT;
        this.cx_ = this.cx + this.offset*dx*this.depth;
        this.cy_ = this.cy + this.offset*dy*this.depth;

        // Ordinary frequency
        let f = 1/2 + this.depth/2;
        // Angular frequency
        let w = 2*Math.PI*f;
        // Blink effect
        let blink = (
            Math.sin(w*(dx + 1) + 23 + w*this.depth) +
            Math.cos(w*(dx + 2) + 34 + w*this.depth) *
            Math.sin(w*(dy + 3) + 45 + w*this.depth) +
            Math.cos(w*(dy + 4) + 56 + w*this.depth)
        );
        blink = blink/2 + 1/2;
        this.opacity_ = this.opacity*blink;
    }

    draw() {
        this.circle.setAttribute('cx', this.cx_);
        this.circle.setAttribute('cy', this.cy_);
        this.circle.setAttribute('opacity', this.opacity_);
    }
}


// Mouse events
const mouse = {
    x: WIDTH/2,
    y: HEIGHT/2
};

DIV.onmousemove = function(e) {
    let RECT = DIV.getBoundingClientRect();

    //
    mouse.x = (e.clientX - RECT.left);
    mouse.x /= (RECT.right - RECT.left);
    mouse.x =  mouse.x*WIDTH;

    // 
    mouse.y = (e.clientY - RECT.top);
    mouse.y /= (RECT.bottom - RECT.top);
    mouse.y = mouse.y*HEIGHT;
};


// Parameters
const MAX_OFFSET = 256;  // Maximum parallax offset
const N = 512;           // Number of bokehs

// Init circles
let CIRCLES = [];
for (let i = 0; i < N; i++) {
    let CIRCLE = new Circle(MAX_OFFSET, i/N);
    CIRCLE.move(mouse.x, mouse.y);
    CIRCLES.push(CIRCLE);
}


function animate() {
    // Animation loop
    for (let i = 0; i < N; i++) {
        let CIRCLE = CIRCLES[i];

        CIRCLE.move(mouse.x, mouse.y);
        CIRCLE.draw();
    }

    requestAnimationFrame(animate);
}

DIV.appendChild(SVG);

animate();
