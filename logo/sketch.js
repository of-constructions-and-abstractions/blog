let boxes = [];
let lines = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noiseDetail(24, 0.5);

  // Generate initial and target dimensions for each box
  for (let i = 0; i < 40; i++) {
    let pos = createVector(random(-width / 6, width / 6), random(-height / 4, height / 6), random(-200, 200));
    boxes.push({
      position: pos,
      current: createVector(random(10, 100), random(10, 200), random(10, 200)),
      target: createVector(random(10, 100), random(10, 200), random(10, 200)),
      lerpAmount: 0,
      noiseOffset: random(1000) // Offset for noise function
    });

    // Occasionally add vertical lines
    if (i % 10 == 0) { // Adds a line for every tenth box
      lines.push({
        position: pos,
        length: random(100, 300) // Random length for vertical lines
      });
    }
  }

  // Set the initial camera view
  camera(0, 0, (height / 1.6) / tan(PI / 6), 0, 0, 0, 0, 1, 0);
}

function draw() {
  background(10); // Dark background to highlight the boxes

  ambientLight(150);
  directionalLight(255, 255, 255, 0.25, -0.25, -0.25);
  rotateY(frameCount * 0.005);

  // Draw the boxes with enhancements
  for (let ibox of boxes) {
    // Increment lerp amount
    ibox.lerpAmount += 0.01;
    if (ibox.lerpAmount > 1) {
      // Reset lerp amount and set a new target dimension
      ibox.lerpAmount = 0;
      ibox.current = ibox.target.copy();
      ibox.target = createVector(random(10, 100), random(10, 200), random(10, 200));
    }

    // Apply noise to position and dimensions for a rugged look
    let n = noise(ibox.noiseOffset + frameCount * 0.01);
    let jitter = map(n, 0, 1, -1, 1);
    let w = lerp(ibox.current.x, ibox.target.x, ibox.lerpAmount) + jitter * 2;
    let h = lerp(ibox.current.y, ibox.target.y, ibox.lerpAmount) + jitter * 2;
    let d = lerp(ibox.current.z, ibox.target.z, ibox.lerpAmount) + jitter * 2;

    // Calculate distance from the center and adjust color based on distance
    let dista = dist(0, 0, ibox.position.x, ibox.position.y);
    let grayScale = map(dista, 0, max(width, height) / 6, 50, 255); // Gray to white gradient

    // Draw the box with adjusted color
    push();
    translate(ibox.position.x + jitter, ibox.position.y + jitter, ibox.position.z + jitter);
    rotateX(radians(random(-0.5, 0.5)));
    rotateY(radians(random(-0.5, 0.5)));
    rotateZ(radians(random(-0.5, 0.5)));
    fill(grayScale);
    noStroke(); // Removes the edges
    box(w, h, d);
    pop();
  }

  // Draw the vertical lines
  for (let line of lines) {
    push();
    translate(line.position.x, line.position.y, line.position.z);
    fill(0); // White lines
    // noStroke();
    box(10, line.length, 10); // Very thin box to act like a line
    pop();
  }
}

