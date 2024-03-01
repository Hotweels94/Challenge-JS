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
  
  if (frameCount % 400 == 0) {
    bots.push(new Bot(1));
  }

  for (let i = 0; i < bots.length; i++) {
    if (frameCount % 200 == 0 ) {
      bots[i].shoot();
    }
  }
}


// function tracking() {
//   bot.direction = bot.angleTo(player);
//   bot.speed = 1;
// }
