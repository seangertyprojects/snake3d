let scl = 20;
let w = scl - 4;

let x = 0;
let y = 0;
let xspeed =  0;
let yspeed = 0;
let total = 0;
let tail = [];

let score = '';
let scoreNum;

let playing = true;

let scorefont;

let slider;
let yrotation = 0;


function preload() {
  scorefont = loadFont('assets/modernbold.otf');
}

function newGame() {
  playing = true;
  x = 0;
  y = 0;
  xspeed = 0;
  yspeed = 0;
  total = 0;
  tail = [];
  pickLocation();
}

function playAgain() {
  push();
  rotateX(PI/2);
  translate(0, -10, 0);
  textFont(scorefont);
  textSize(72);
  textAlign(CENTER, CENTER);
  text('press space\nto play again', 0, 0);
  pop();
}

function makeScoreBoard() {
  push();
  translate(0, 0, -(height / 2 + scl * 6 + 10));
  normalMaterial();
  box(width/3.5, 100, 10);
  pop();

  textFont(scorefont);
  textSize(30);
  textAlign(CENTER, CENTER);
  //stroke(255);
  push();
  translate(0, 0, -(height / 2 + scl * 6));
  let scoreText = 'score \n' + scoreNum;
  text(scoreText.toString(), 0,0);
  pop();

}

function grid() {
  for (let x = -width/2 + scl * 5; x <= width/2 - scl * 4; x += scl) {
    for (let y = -height/2 + scl * 5; y <= height/2 - scl * 4; y += scl) {
      push();
      translate(-scl + (scl/2) + 2, 10, -scl + (scl/2) - 2);
      rotateX(PI / 2);
      stroke(210);
      strokeWeight(3);
      line(x, -height/2 + scl * 4, x, height/2 - scl * 3); // vertical lines
      line(-width/2 + scl * 4, y, width/2 - scl * 3, y); // horizontal lines
      pop();
    }
  }
}

function makeBoard() {
  push(); // flat table
  translate(0,scl,0);
  normalMaterial();
  box(width - (scl * 6), 10,height - (scl * 6));
  pop();

  //walls
  push();
  translate(0,scl / 2, height / 2 - (scl * 3));
  normalMaterial();
  box(width - (scl * 6) + 10, 30, 10);
  pop();

  push();
  translate(0, scl/2, -height / 2 + (scl * 3));
  normalMaterial();
  box(width - (scl * 6) + 10, 30, 10);
  pop();

  push();
  translate(-width / 2 + (scl * 3), scl/2, 0);
  normalMaterial();
  box(10, 30, width - (scl * 6) + 10);
  pop();

  push();
  translate(width / 2 - (scl * 3), scl/2, 0);
  normalMaterial();
  box(10, 30, width - (scl * 6) + 10);
  pop();
}

function pickLocation() {
	var cols = floor((width - (scl * 6))/scl);
	var rows = floor((height - (scl * 6))/scl);
  food = createVector(floor(random(-cols/2 + 1, cols/2 - 1)), 0, floor(random(-rows/2 + 1, rows/2 - 1)));
  food.mult(scl);
}

function setup() {
  createCanvas(600, 600, WEBGL);
  frameRate(10);

  slider = createSlider(0, 90, 0);
  slider.position(width / 2 - 50, height * .85);
  yrotation = map(slider.value(), 0, 90, PI / 6, -PI / 6);

  ortho(-400, 400, -400, 400, 0, 1000);

  pickLocation();
}

function draw() {
  background(254, 230, 255);
  smooth();

  if (eat(food)) {
		pickLocation();
	}

  yrotation = map(slider.value(), 0, 90, PI / 6, -PI / 6);

  rectMode(CENTER);
  rotateX(-PI / 6);
  //rotateX(-PI/2);
  //rotateY(PI / 6);
  rotateY(yrotation);
	rotateZ(0);

  makeBoard();
  makeScoreBoard();

  //grid();

  stroke(0);

  die();
  if (playing === false) {
    playAgain();
  }
  if (playing === true) {
    update();
  }
  show();

  push();
  fill(255, 0, 100);
  translate(food.x, 0, food.z);
  box(w);
  pop();
}

function update() {
  if (total === tail.length) {
    for (let i = 0; i < total - 1; i++) {
      tail[i] = tail[i + 1];
    }
  }
  tail[total - 1] = createVector(x, 0, y);

  x += xspeed * scl; // movement in x and y
  y += yspeed * scl;

  scoreNum = total + 1;
  score = scoreNum.toString();

  x = constrain(x, -width/2 + scl * 4, width/2 - scl * 4); // bounds
  y = constrain(y, -height/2 + scl * 4, height/2 - scl * 4);
}

function show() {
  for (let i = 0; i < total; i++) {
    push();
    fill(255);
    //translate(tail[i].x, 0, tail[i].z - floor(tail[i].z / 6));
    translate(tail[i].x, 0, tail[i].z);
    box(w, w, w);
    pop();
  }

  push();
  fill(110, 228, 255);
  //translate(x, 0, y - floor(y/6));
  translate(x, 0, y);
  box(w, w, w);
  pop();
}

function dir(xdir, ydir) {
  if (xspeed !== -xdir) {
    xspeed = xdir;
  }
  if (yspeed !== -ydir) {
    yspeed = ydir;
  }
}

function eat(food) {
  let dx = dist(x, 0, 0, food.x, 0, 0);
  let dy = dist(0, 0, y, 0, 0, food.z);
  if (dx < 1 && dy < 1){
    total++;
    return true;
  } else {
    return false;
  }
}

function die() {
  for (let i = 0; i < tail.length; i++) {
    let pos = tail[i];
    let dTail = dist(x, 0, y, pos.x, 0, pos.z);
    if (dTail < 1) {
      playing = false;
      return;
    }
  }
  let drwall = dist(x, 0, 0, width/2 - scl * 4, 0, 0);
  let dlwall = dist(x, 0, 0, -width/2 + scl * 4, 0, 0);
  let dtwall = dist(0, 0, y, 0, 0, -height/2 + scl * 4);
  let dbwall = dist(0, 0, y, 0, 0, height/2 - scl * 4);
  if (drwall < 1 || dlwall < 1 || dtwall < 1 || dbwall < 1) {
    playing = false;
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    dir(0, -1);
  } else if (keyCode === DOWN_ARROW) {
    dir(0, 1);
  } else if (keyCode === LEFT_ARROW) {
    dir(-1, 0);
  } else if (keyCode === RIGHT_ARROW) {
    dir(1, 0);
  } else if (keyCode === 32) {
    newGame();
  }
}
