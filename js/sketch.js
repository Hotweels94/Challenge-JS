let player;
let bot;

function setup() {
  createCanvas(700, 700);
  player = new Player();
  bot = new Bot();
}


function draw() {
  background(100, 100, 100);
  rectMode(CENTER);
  player.draw();
  player.update();
  bot.draw();
}

// function tracking() {
//   bot.direction = bot.angleTo(player);
//   bot.speed = 1;
// }