let player;
let bots = [];

function setup() {
  createCanvas(1500, 700);
  player = new Player();
}

function draw() {
  background(100, 100, 100);
  rectMode(CENTER);
  player.draw();
  player.update();
  console.log(player.life); 
  
  for (let i = bots.length - 1; i >= 0; i--) {
    bots[i].draw();
    bots[i].update();

    if (bots[i].hasHit(player) == true) {
      player.life -= 1;
      if (player.life <= 0) {
        console.log(player.life, "hit");
        player = null;
        alert("You are dead.");
      }
    }

    if (bots[i].hasHitBots(bots) == true) {
    bots[i] = null;
    console.log("An enemy is dead.");
   }
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
