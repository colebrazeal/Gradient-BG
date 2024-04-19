// const circleElement = document.querySelector('.interactive');

// const mouse = { x: 0, y: 0 };
// const previousMouse = { x: 0, y: 0 }
// const circle = { x: 0, y: 0 };
// let currentScale = 0;
// let currentAngle = 0;

// window.addEventListener('mousemove', (e) => {
//     mouse.x = e.x;
//     mouse.y = e.y;
// });

// const speed = 0.17;

// const tick = () => {
//     circle.x += (mouse.x - circle.x) * speed;
//     circle.y += (mouse.y - circle.y) * speed;

//    const translateTransform = `translate(${circle.x}px, ${circle.y}px)`;

// //    squeeze
// const deltaMouseX = mouse.x - previousMouse.x;
// const deltaMouseY = mouse.y - previousMouse.y;
// previousMouse.x = mouse.x;
// previousMouse.y = mouse.y;

// const mouseVelocity = Math.min(Math.sqrt(deltaMouseX**2 + deltaMouseY**2) * 4, 150);
// const scaleValue = (mouseVelocity / 150) * 0.5;

// currentScale += (scaleValue - currentScale) * speed;

// const scaleTransform = `scale(${1 + currentScale}, ${1 - currentScale})`;

// // Rotate
// const angle = Math.atan2(deltaMouseY, deltaMouseX) * 180 / Math.PI;

// if (mouseVelocity > 20) {
//     currentAngle = angle;
// }

// const rotateTransform = `rotate(${currentAngle}deg)`;

// // Apply all transformations 
// circleElement.style.transform = `${translateTransform} ${rotateTransform} ${scaleTransform}`;

//     window.requestAnimationFrame(tick);
// }

// tick();


// TEST FUNCTION

// Get the canvas element and its 2D rendering context
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

// Flag to track mouse movement
let mouseMoved = false

// Current mouse/touch position
// initialized at screen center
const pointer = {
  x: 0.5 * window.innerWidth,
  y: 0.5 * window.innerHeight,
}

// Parameters for the animation
const params = {
  pointsNumber: 40,       // Number of points in the trail
  widthFactor: 10,        // Width factor for strokes
  mouseThreshold: 0.5,    // Threshold for considering mouse movement
  spring: 0.25,           // Controls the springiness of the animation
  friction: 0.5,          // Introduces damping to simulate resistance
}

// Initialize an array to store the trail of points
const trail = new Array(params.pointsNumber)
for(let i = 0; i < params.pointsNumber; i++) {
  trail[i] = {
    x: pointer.x,
    y: pointer.y,
    dx: 0,
    dy: 0,
  }
}

// Event listeners for mouse and touch events
window.addEventListener('click', (event) => {
  updateMousePosition(event.pageX, event.pageY);
})

window.addEventListener('mousemove', (event) => {
  mouseMoved = true
  updateMousePosition(event.pageX, event.pageY);
})

window.addEventListener('touchmove', (event) => {
  mouseMoved = true
  updateMousePosition(event.tagetTouches[0].pageX, event.tagetTouches[0].pageY);
})

// Function to update the mouse/touch position
function updateMousePosition(eX, eY) {
  pointer.x = eX
  pointer.y = eY
}

// Initial setup of the canvas and start the animation loop
setupCanvas()
update(0)

// Event listener for window resize
window.addEventListener('resize', setupCanvas)

function update(t) {
  
  // Gradient animation when mouse isn't being used 
//   if(!mouseMoved) {
//     pointer.x = (0.5 + 0.3 * Math.cos(0.002 * t) * Math.sin(0.005 * t)) * window.innerWidth
//     pointer.y = (0.5 + 0.2 * Math.cos(0.005 * t) + 0.1 * Math.cos(0.001 * t)) * window.innerHeight
//   }
  
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // Update and draw the trail of points
  trail.forEach((p, pIdx) => {
    const prev = pIdx === 0 ? pointer : trail[pIdx - 1]
    const spring = pIdx === 0 ? 0.4 * params.spring : params.spring
    p.dx += (prev.x - p.x) * spring
    p.dy += (prev.y - p.y) * spring
    p.dx *= params.friction
    p.dy *= params.friction
    p.x += p.dx
    p.y += p.dy
  })
  
  // Create a gradient for the stroke color
  let gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
  gradient.addColorStop(0, "rgba(255, 93, 252, 1)")
  gradient.addColorStop(1, "rgba(57, 34, 115, 1)")
  
  // Set the stroke style and line cap
  ctx.strokeStyle = gradient
  ctx.lineCap = "round"

  // Begin drawing the path
  ctx.beginPath();
  ctx.moveTo(trail[0].x, trail[0].y)
  
  // Draw quadratic Bezier curves to create the trail
  for(let i = 1; i < trail.length - 1; i++) {
    const xc = 0.5 * (trail[i].x + trail[i + 1].x)
    const yc = 0.5 * (trail[i].y + trail[i + 1].y)
    ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc)
    ctx.lineWidth = params.widthFactor * (params.pointsNumber - i)
    ctx.stroke()
  }
  
  window.requestAnimationFrame(update)
}

function setupCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}