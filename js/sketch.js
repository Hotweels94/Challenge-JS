let player;
function setup () {
  createCanvas(700, 700);
  player = new Player();
}

function draw () {
  background(100, 100, 100)
  rectMode(CENTER)
  player.draw();
}  
