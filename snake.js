
// the snake is divided into small segments, which are drawn and edited on each 'draw' call
let numSegments = 10;
let direction = 'right';
// const canvas = document.getElementById('myCanvas');

const xStart = 0; //starting x coordinate for snake
const yStart = 250; //starting y coordinate for snake
const diff = 10;

let xCor = [];
let yCor = [];

let xFruit = 0;
let yFruit = 0;
let scoreElem;
let title_element;

function setup() {
  var title = select('title');
  var title_width = title.style.width;
  var score = select('score');
  var score_width = title.style.width;

  title_element = createDiv('Snake Game');
  title_element.position(title_width, windowHeight / 8);
  // title_element.center('horizontal');
  title_element.style('color', 'white');
  title_element.style('font-size', '40px');
  title_element.id = 'title';

  scoreElem = createDiv('Score = 0');
  scoreElem.position(score_width, windowHeight - (windowHeight / 8));
  scoreElem.id = 'score';
  scoreElem.style('color', 'red');
  scoreElem.style('font-size', '30px');


  // let div = createDiv('').size(windowWidth, windowHeight);
  // div.style('background-color', 'orange');
  // div.center();

  var cnv = createCanvas(500, 500);
  cnv.style('display', 'block');
  frameRate(10);
  stroke(255);
  strokeWeight(10);
  updateFruitCoordinates();

  for (let i = 0; i < numSegments; i++) {
    xCor.push(xStart + i * diff);
    yCor.push(yStart);
  }
}

// function draw_snake() {
//   const canvas = document.getElementById('myCanvas');
//   if (canvas.getContext) {
//     const ctx = canvas.getContext('2d');
// }

function draw() {
  background(0);
  // title_element.style('font-size', '15')
  for (let i = 0; i < numSegments - 1; i++) {
    // line(xCor[i], yCor[i], xCor[i + 1], yCor[i + 1]);
    point(xCor[i],yCor[i])
    let headx = xCor[xCor.length - 1];
    let heady = yCor[xCor.length - 1];
    stroke('red')
    point(headx, heady)
    stroke('white')
    
  }
  updateSnakeCoordinates();
  checkGameStatus();
  checkForFruit();
}

/*
 The segments are updated based on the direction of the snake.
 All segments from 0 to n-1 are just copied over to 1 till n, i.e. segment 0
 gets the value of segment 1, segment 1 gets the value of segment 2, and so on,
 and this results in the movement of the snake.

 The last segment is added based on the direction in which the snake is going,
 if it's going left or right, the last segment's x coordinate is increased by a
 predefined value 'diff' than its second to last segment. And if it's going up
 or down, the segment's y coordinate is affected.
*/
function updateSnakeCoordinates() {
  for (let i = 0; i < numSegments - 1; i++) {
    xCor[i] = xCor[i + 1];
    yCor[i] = yCor[i + 1];
    if (
        xCor[i] > width
        ) {
        xCor[i] = xCor[i] - width
      }
    if (
        xCor[i] < 0
        ) {
        xCor[i] = xCor[i] + width
      }
    if (
        yCor[i] > height
        ) {
        yCor[i] = yCor[i] - height
      }
    if (
        yCor[i] < 0
        ) {
        yCor[i] = yCor[i] + height
      }
  }
  switch (direction) {
    case 'right':
      xCor[numSegments - 1] = xCor[numSegments - 2] + diff;
      // yCor[numSegments - 1] = yCor[numSegments - 2];
      break;
    case 'up':
      // xCor[numSegments - 1] = xCor[numSegments - 2];
      yCor[numSegments - 1] = yCor[numSegments - 2] - diff;
      break;
    case 'left':
      xCor[numSegments - 1] = xCor[numSegments - 2] - diff;
      // yCor[numSegments - 1] = yCor[numSegments - 2];
      break;
    case 'down':
      // xCor[numSegments - 1] = xCor[numSegments - 2];
      yCor[numSegments - 1] = yCor[numSegments - 2] + diff;
      break;
  }
}

/*
 I always check the snake's head position xCor[xCor.length - 1] and
 yCor[yCor.length - 1] to see if it touches the game's boundaries
 or if the snake hits itself.
*/

function checkGameStatus() {
  if (
    xCor[xCor.length - 1] > width ||
    xCor[xCor.length - 1] < 0 ||
    yCor[yCor.length - 1] > height ||
    yCor[yCor.length - 1] < 0 ||
    checkSnakeCollision()
  ) {
  noLoop();
  const scoreVal = parseInt(scoreElem.html().substring(8));
  scoreElem.html('Game ended! Your score was : ' + scoreVal);
}
}

/*
 If the snake hits itself, that means the snake head's (x,y) coordinate
 has to be the same as one of its own segment's (x,y) coordinate.
*/
function checkSnakeCollision() {
  const snakeHeadX = xCor[xCor.length - 1];
  const snakeHeadY = yCor[yCor.length - 1];
  for (let i = 0; i < xCor.length - 1; i++) {
    if (xCor[i] === snakeHeadX && yCor[i] === snakeHeadY) {
      return true;
    }
  }
}

/*
 Whenever the snake consumes a fruit, I increment the number of segments,
 and just insert the tail segment again at the start of the array (basically
 I add the last segment again at the tail, thereby extending the tail)
*/
function checkForFruit() {
  stroke(67, 163, 67)
  point(xFruit, yFruit);
  stroke(0)
  if (xCor[xCor.length - 1] === xFruit && yCor[yCor.length - 1] === yFruit) {
    const prevScore = parseInt(scoreElem.html().substring(8));
    scoreElem.html('Score = ' + (prevScore + 1));
    xCor.unshift(xCor[0]);
    yCor.unshift(yCor[0]);
    numSegments++;
    updateFruitCoordinates();
  }
}

function updateFruitCoordinates() {
  /*
    The complex math logic is because I wanted the point to lie
    in between 100 and width-100, and be rounded off to the nearest
    number divisible by 10, since I move the snake in multiples of 10.
  */
  xFruit = floor(random(10, (width - 100) / 10)) * 10;
  yFruit = floor(random(10, (height - 100) / 10)) * 10;
}

function keyPressed() {
  switch (keyCode) {
    case LEFT_ARROW:
      if (direction !== 'right') {
        direction = 'left';
      }
      break;
    case RIGHT_ARROW:
      if (direction !== 'left') {
        direction = 'right';
      }
      break;
    case UP_ARROW:
      if (direction !== 'down') {
        direction = 'up';
      }
      break;
    case DOWN_ARROW:
      if (direction !== 'up') {
        direction = 'down';
      }
      break;
  }
}
