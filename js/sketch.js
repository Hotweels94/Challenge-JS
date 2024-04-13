let player;
let bots = [];
let bossAdded = false;
let bossDead = false; 
let fruits = [];
let heart = [];
let maps;

let playerImage;
let botImage;
let botSniperImage;
let fruitImage;
let goldenFruitImage;
let heartImage;
let bossImage;

let music;

let font;

const SIZE_PLAYER = 30;
const SIZE_BOT = 25;zqzqzqsd
let speedPlayer = 2.2;

function preload() {
  soundFormats("mp3");
  music = loadSound("sound/music");
}

function setup() {
  maps = createCanvas(windowWidth, windowHeight);
  player = new Player();

  playerImage = loadImage("img/player.png");
  botImage = loadImage("img/bot2.png");
  fruitImage = loadImage("img/fruit1.png");
  goldenFruitImage = loadImage("img/goldenFruit.png");
  botSniperImage = loadImage("img/bot1.png");
  bossImage = loadImage("img/ananas_boss.png");
  heartImage = loadImage("img/heart.png");

  font = loadFont("font/Minecraft.ttf");

  backgroundMusic();
}

function backgroundMusic() {
  
  music.play();
  music.loop();
  music.setVolume(0.025);
  userStartAudio();
}

class Player {
  constructor() {
    this.position = createVector(width / 2, height / 2);
    this.angle = 0;
    this.life = 3;
    this.score = 0;
    this.xSpeed = 1;
    this.ySpeed = 1;
  }
  draw() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.angle);
    imageMode(CENTER);
    image(playerImage, 0, 0, 58, 58);
    pop();
  }

  update() {
    this.xSpeed *= 0;
    this.ySpeed *= 0;

    if ((keyIsDown(90) || keyIsDown(UP_ARROW)) && this.position.y > 0) {
      this.ySpeed = -speedPlayer;
    }

    if ((keyIsDown(83) || keyIsDown(DOWN_ARROW)) && this.position.y < windowHeight) {
      this.ySpeed = speedPlayer;
    }

    if ((keyIsDown(68) || keyIsDown(RIGHT_ARROW)) && this.position.x < windowWidth) {
      this.xSpeed = speedPlayer;
    }

    if ((keyIsDown(81) || keyIsDown(LEFT_ARROW)) && this.position.x > 0) {
      this.xSpeed = -speedPlayer;
    }

    this.position.add(this.xSpeed, this.ySpeed);
    this.angle = atan2(mouseY - this.position.y, mouseX - this.position.x);
  }
}

class Bot {
  constructor(speed, life) {
    this.speed = speed;
    let y = random(maps.height);
    let x = random(maps.width);
    this.position = createVector(x, y);
    this.bullets = [];
    this.radius = 20;
    this.life = life;
  }

  draw() {
    push();
    let angle = atan2(
      player.position.y - this.position.y,
      player.position.x - this.position.x,
    );
    translate(this.position.x, this.position.y);
    rotate(angle);
    imageMode(CENTER);
    image(botImage, 0, 0, 45, 45);
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
    let angle = atan2(
      player.position.y - this.position.y,
      player.position.x - this.position.x,
    );
    let xOffset = cos(angle) * this.radius;
    let yOffset = sin(angle) * this.radius;
    this.bullets.push(
      new Bullet(this.position.x + xOffset, this.position.y + yOffset, angle),
    );
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
          bot.life -= 1;
          this.bullets.splice(i, 1);
          if (bot.life <= 0) {
            this.bullets.splice(i, 1);
            bots.splice(j, 1);
            if (bot instanceof Boss) {
              bossDead = true;
            }
            return true;
          }
        }
      }
    }
    return false;
  }

}

class BotSniper extends Bot {
  constructor(speed, life) {
    super(speed, life);
  }

  draw() {
    push();
    let angle = atan2(
      player.position.y - this.position.y,
      player.position.x - this.position.x,
    );
    translate(this.position.x, this.position.y);
    rotate(angle);
    imageMode(CENTER);
    image(botSniperImage, 0, 0, 45, 60);
    pop();

    for (let bullet of this.bullets) {
      bullet.draw();
      bullet.update();
    }
  }

  shoot() {
    let angle = atan2(
      player.position.y - this.position.y,
      player.position.x - this.position.x,
    );
    let xOffset = cos(angle) * this.radius;
    let yOffset = sin(angle) * this.radius;
    this.bullets.push(
      new SniperBullet(
        this.position.x + xOffset,
        this.position.y + yOffset,
        angle,
      ),
    );
  }
}

class Boss extends Bot {
  constructor(speed, life) {
    super(speed, life);
  }

  draw() {
    push();
    let angle = atan2(
      player.position.y - this.position.y,
      player.position.x - this.position.x,
    );
    translate(this.position.x, this.position.y);
    rotate(angle);
    imageMode(CENTER);
    image(bossImage, 0, 0, 150, 150);
    pop();

    for (let bullet of this.bullets) {
      bullet.draw();
      bullet.update();
    }
  }

  shoot() {
    let angle = atan2(
      player.position.y - this.position.y,
      player.position.x - this.position.x,
    );
    let xOffset = cos(angle) * this.radius;
    let yOffset = sin(angle) * this.radius;
    this.bullets.push(
      new BossBullet(
        this.position.x + xOffset,
        this.position.y + yOffset,
        angle,
      ),
    );
  }
}

class SniperBullet {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = 18;
  }

  draw() {
    push();
    fill(0);
    rect(this.x, this.y, 4);
    pop();
  }

  update() {
    this.x += this.speed * cos(this.angle);
    this.y += this.speed * sin(this.angle);
  }
}

class BossBullet {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = 17;
  }

  draw() {
    push();
    fill(0);
    circle(this.x, this.y, 15);
    pop();
  }

  update() {
    this.x += this.speed * cos(this.angle);
    this.y += this.speed * sin(this.angle);
  }
}

class Fruit {
  constructor() {
    let y = random(maps.height);
    let x = random(maps.width);
    this.position = createVector(x, y);
    this.compteur = 0;
  }

  draw() {
    push();
    imageMode(CENTER);
    image(fruitImage, this.position.x, this.position.y, 62, 62);
    pop();
  }

  hasHitFruit(player) {
    let playerHitBox = SIZE_PLAYER;
    let d = dist(
      this.position.x,
      this.position.y,
      player.position.x,
      player.position.y,
    );
    if (d < playerHitBox) {
      return true;
    }
    return false;
  }
}

class GoldenFruit extends Fruit {
  constructor(){
    super();
  }

  draw() {
    push();
    imageMode(CENTER);
    image(goldenFruitImage, this.position.x, this.position.y, 62, 62);
    pop();
  }
}

class Heart {
  constructor() {
    let y = random(maps.height);
    let x = random(maps.width);
    this.position = createVector(x, y);
    this.compteur = 0;
  }

  draw() {
    push();
    imageMode(CENTER);
    image(heartImage, this.position.x, this.position.y, 62, 62);
    pop();
  }

  hasHitHeart(player) {
    let playerHitBox = SIZE_PLAYER;
    let d = dist(
      this.position.x,
      this.position.y,
      player.position.x,
      player.position.y,
    );
    if (d < playerHitBox) {
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

  draw() {
    push();
    fill(0);
    circle(this.x, this.y, 5);
    pop();
  }

  update() {
    this.x += this.speed * cos(this.angle);
    this.y += this.speed * sin(this.angle);
  }
}

function draw() {
  background(100, 100, 100);
  rectMode(CENTER);
  player.draw();
  player.update();

  textFont(font, 30);
  textSize(23);
  text("Player life : " + player.life, 35, 40);
  text("Score : " + player.score, 35, 70);

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
    bots.push(new Bot(1, 1));
  }
  
  if (frameCount % 2000 == 0) {
    bots.push(new BotSniper(1, 1));
  }

  if (player.score >= 50 && player.score <= 53 && bossAdded == false) {
    bots.push(new Boss(1, 3));
    bossAdded = true;
  }

  if (frameCount % 600 == 0) {
    fruits.push(new Fruit(1));
    fruits.compteur += 1;
  }

  if (bossDead == true) {
    fruits.push(new GoldenFruit(1));
    bossDead = false;
  }

  for (let i = fruits.length - 1; i >= 0; i--) {
    if (fruits[i].hasHitFruit(player) == true) {
      if (fruits[i] instanceof GoldenFruit) {
        player.score += 10;
        fruits.splice(i, 1);
        console.log("Golden has been hit");
      } else {
        player.score += 3;
        fruits.splice(i, 1);
        console.log("Fruit has been hit");
      }
    }
  }

  for (let i = heart.length - 1; i >= 0; i--) {
    heart[i].draw();
  }

  if (frameCount % 3000 == 0) {
    heart.push(new Heart(1));
  }

  for (let i = heart.length - 1; i >= 0; i--) {
    if (heart[i].hasHitHeart(player) == true) {
      player.life += 1;
      heart.splice(i, 1);
      console.log("heart has been hit");
    }
  }

  for (let i = 0; i < bots.length - 1; i++) {
    if (frameCount % 150 == 0) {
      bots[i].shoot();
    }
  }
}
