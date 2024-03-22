let player;
let bots = [];
let fruits = [];
let maps;

function setup() {
  maps = createCanvas(windowWidth, windowHeight);
  player = new Player();
}

function draw() {
  background(100, 100, 100);
  rectMode(CENTER);
  player.draw();
  player.update();
  
  textSize(20);
  text("Player life : " + player.life, 35, 40);
  text("Score : " + player.score, 35, 70)

  for (let i = bots.length - 1; i >= 0; i--) {
    bots[i].draw();
    bots[i].update();

    if (bots[i].hasHit(player) == true) {
      player.life -= 1;
      if (player.life <= 0) {
        console.log(player.life, "hit");
        player = null;
        alert("You are dead.");
        document.location.reload();
        clearInterval(interval);
        player.life = 3;
      }
    }

    if (bots[i].hasHitBots(bots) == true) {
      bots.splice(i, 1);
      console.log("An enemy is dead.");
      player.score += 1;
    }
    
  }

  for (let i = fruits.length - 1; i >= 0; i--) {
    fruits[i].draw();
  }

  
  if (frameCount % 400 == 0) {
    bots.push(new Bot(1));
  }

  if (frameCount % 600 == 0) {
    fruits.push(new Fruit(1));
    fruits.compteur += 1;
  }

  for (let i = fruits.length - 1; i >= 0; i--) {
  
    if (fruits[i].hasHitFruit(player) == true) {
     player.score += 3;
     fruits.splice(i, 1);
     console.log("Fruit has been hit");
   } 
 }
    

  for (let i = 0; i < bots.length - 1; i++) {
    if (frameCount % 200 == 0) {
      bots[i].shoot();
    }
  }
}
