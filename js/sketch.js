let player;
let bots = [];
let fruits = [];
let maps;
let playerImage;
let botImage;
let fruitImage;
let font;

const SIZE_PLAYER = 30;
const SIZE_BOT = 25;


function setup() {
  maps = createCanvas(windowWidth, windowHeight);
  player = new Player();
  playerImage = loadImage('img/player.png');
  botImage = loadImage('img/bot2.png');
  fruitImage = loadImage('img/fruit1.png');
  font = loadFont('font/Minecraft.ttf');
}

class Player {
  constructor(){
      this.position = createVector(width/2, height/2);
      this.angle = 0;
      this.life = 3;
      this.score = 0;
  }
  draw(){
      push();
      translate(this.position.x, this.position.y);
      rotate(this.angle);
      imageMode(CENTER);
      image(playerImage, 0, 0,58,58);
      pop();
  }

  update(){
      let xSpeed = 0
      let ySpeed = 0

      if (keyIsDown(90) && this.position.y > 0) {
          ySpeed = -2;
      }

      if (keyIsDown(83) && this.position.y < windowHeight) {
          ySpeed = 2;
      }

      if (keyIsDown(68) && this.position.x < windowWidth) {
          xSpeed = 2;
      }

      if (keyIsDown(81) && this.position.x > 0) {
          xSpeed = -2;
      }

      this.position.add(xSpeed, ySpeed);
      this.angle = atan2(mouseY - this.position.y, mouseX - this.position.x);
  }
}

class Bot {
  constructor(speed) {
    this.speed = speed;
    let y = random(maps.height);
    let x = random(maps.width);
    this.position = createVector(x, y);
    this.bullets = [];
    this.radius = 20;
  }

  draw() {
    push();
    let angle = atan2(player.position.y - this.position.y, player.position.x - this.position.x);
    translate(this.position.x, this.position.y);
    rotate(angle);
    imageMode(CENTER);
    image(botImage, 0, 0,45,45);
    pop();

    for (let bullet of this.bullets) {
      bullet.draw();
      bullet.update();
    }
  }

  update() {
    let difference = p5.Vector.sub(player.position, this.position);
    difference.limit(this.speed);
    this.position.add(difference);
  }

  shoot() {
    let angle = atan2(player.position.y - this.position.y, player.position.x - this.position.x);
    let xOffset = cos(angle) * this.radius;
    let yOffset = sin(angle) * this.radius;
    this.bullets.push(new Bullet(this.position.x + xOffset, this.position.y + yOffset, angle));
  }

  hasHit(player) {
    let playerHitBox = SIZE_PLAYER;
    for (let i = 0; i < this.bullets.length; i++) {
      let bullet = this.bullets[i];
      let d = dist(bullet.x, bullet.y, player.position.x, player.position.y);
      if (d < playerHitBox / 2) {
        this.bullets.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  hasHitBots(bots) {
    let botsHitBox = SIZE_BOT;
    for (let i = 0; i < this.bullets.length; i++) {
      let bullet = this.bullets[i];
      for (let j = 0; j < bots.length; j++) {
        let bot = bots[j];
        let d = dist(bullet.x, bullet.y, bot.position.x, bot.position.y);
        if (d < botsHitBox) {
          this.bullets.splice(i, 1);
          bots.splice(j, 1);
          return true;
        }
      }
    }
    return false;
  }
}


class Fruit {
  constructor(){
      let y = random(maps.height);
      let x = random(maps.width);
      this.position = createVector(x, y);
      this.compteur = 0;
  }

  draw() {
      push();
      imageMode(CENTER);
      image(fruitImage, this.position.x, this.position.y,62,62);
      pop();
  }
  
  hasHitFruit(player) {
      let playerHitBox = SIZE_PLAYER;
      let d = dist(this.position.x, this.position.y, player.position.x, player.position.y);
      if (d < playerHitBox / 2) {
          return true;
      }
      return false;
  }
}

class Bullet {
  constructor(x, y, angle) {
      this.x = x;
      this.y = y;
      this.angle = angle;
      this.speed = 10;
  }

  draw () {
      push();
      fill(0);
      circle(this.x, this.y, 5);
      pop();
  }

  update () {
      this.x += this.speed * cos(this.angle);
      this.y += this.speed * sin(this.angle);
  }
}

function draw() {
  background(100, 100, 100);
  rectMode(CENTER);
  player.draw();
  player.update();
  
  textFont(font,30);
  textSize(23);
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
