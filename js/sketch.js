let player;
let bots = [];

function setup() {
  createCanvas(700, 700);
  player = new Player();
}

function draw() {
  background(100, 100, 100);
  rectMode(CENTER);
  player.draw();
  player.update();
  
  for (let bot of bots) {
    bot.draw();
    bot.update();
  }
  
  if (frameCount % 200 == 0) {
    bots.push(new Bot(2));
  }
}


// function tracking() {
//   bot.direction = bot.angleTo(player);
//   bot.speed = 1;
// }
