// Declaration of all necessary variables
let player;
let bots = [];
let bossDead = false;
let fruits = [];
let heart = [];
let maps;
let stepBoss = 50;

// Declaration of all necessary variables for images, sounds, and font
let playerImage;
let botImage;
let botSniperImage;
let fruitImage;
let goldenFruitImage;
let heartImage;
let bossImage;

let music;

let font;

// Declaration of constant and variable of the different caracteres
const SIZE_PLAYER = 30;
const SIZE_BOT = 25;
let speedPlayer = 2.2;

// function that load all of what we need before lauching the game
function preload() {
  soundFormats("mp3");
  music = loadSound("sound/music");
  splat = loadSound("sound/splat");
  playerHitSound = loadSound("sound/playerHit");
  fruitSound = loadSound("sound/fruitTake");
}

// function setup (from p5.js) used to define initial properties of the game
function setup() {
  // Create a canvas responsive.
  maps = createCanvas(windowWidth, windowHeight);

  // Creation of the player
  player = new Player();

  // We load all of the images
  playerImage = loadImage("img/player.png");
  botImage = loadImage("img/bot2.png");
  fruitImage = loadImage("img/fruit1.png");
  goldenFruitImage = loadImage("img/goldenFruit.png");
  botSniperImage = loadImage("img/bot1.png");
  bossImage = loadImage("img/ananas_boss.png");
  heartImage = loadImage("img/heart.png");
  soundImage = loadImage("img/monter-le-son.png");
  muteImage = loadImage("img/muet.png");

  // We load the font
  font = loadFont("font/Minecraft.ttf");

  // Added a background music.
  button = createImg("img/monter-le-son.png");
  button.mousePressed(backgroundMusic);
  button.position(width - 50, 10);
  music.play();
  music.loop();
  music.setVolume(0.02);
  userStartAudio();
}

// Added mute functionality.
function backgroundMusic() {
  if (!music.isPlaying()) {
    music.play();
    music.loop();
    music.setVolume(0.02);
    userStartAudio();
    button.attribute("src", "img/monter-le-son.png");
  } else {
    music.stop();
    button.attribute("src", "img/muet.png");
  }
}

// Creation of th class Player 
class Player {
  // We create the constructor with of the player info
  constructor() {
    this.position = createVector(width / 2, height / 2);
    this.angle = 0;
    this.life = 3;
    this.score = 0;
    this.xSpeed = 1;
    this.ySpeed = 1;
  }
  // We use draw to draw the player
  draw() {
    push(); // Save the current drawing style settings and transformation 
    translate(this.position.x, this.position.y); // Translate the coordinate system to the position of the player
    rotate(this.angle);
    imageMode(CENTER);
    image(playerImage, 0, 0, 58, 58);
    pop(); // Restore the previous drawing style settings and transformation matrix
  }

  // Function update use every frame to know if the player press a button
  update() {
    this.xSpeed *= 0;
    this.ySpeed *= 0;

    // If the player press z or up arrow he moves up 
    if ((keyIsDown(90) || keyIsDown(UP_ARROW)) && this.position.y > 0) {
      this.ySpeed = -speedPlayer;
    }

    // If the player press s or down arrow he moves up
    if ((keyIsDown(83) || keyIsDown(DOWN_ARROW)) &&this.position.y < windowHeight) {
      this.ySpeed = speedPlayer;
    }

    // If the player press d or right arrow he moves up
    if ((keyIsDown(68) || keyIsDown(RIGHT_ARROW)) &&this.position.x < windowWidth) {
      this.xSpeed = speedPlayer;
    }

    // If the player press q or left arrow he moves up
    if ((keyIsDown(81) || keyIsDown(LEFT_ARROW)) && this.position.x > 0) {
      this.xSpeed = -speedPlayer;
    }

    // We add the speed to the position to move the player
    this.position.add(this.xSpeed, this.ySpeed);
    // And we update the angle of the player in relation to the mouse
    this.angle = atan2(mouseY - this.position.y, mouseX - this.position.x);
  }
}

// We create the class Bot
class Bot {
  // We create the constructor with of the bot info
  constructor(speed, life) {
    this.speed = speed;
    let y = random(maps.height);
    let x = random(maps.width);
    this.position = createVector(x, y);
    this.bullets = [];
    this.radius = 20;
    this.life = life;
  }

  // We draw it to see it 
  draw() {
    push(); // Save the current drawing style settings and transformation 
    // We calculate the angle in relation to the player position to follow the player
    let angle = atan2(
      player.position.y - this.position.y,
      player.position.x - this.position.x
    );
    translate(this.position.x, this.position.y);
    rotate(angle);
    imageMode(CENTER);
    image(botImage, 0, 0, 45, 45);
    pop(); // Restore the previous drawing style settings and transformation matrix

    // It updates the position of bot's bullets (when he shots)
    for (let bullet of this.bullets) {
      bullet.draw();
      bullet.update();
    }
  }

  // It updates the position of the object based on the player's position
  update() {

    // Calculate the difference vector between the player's position and the bot's position
    let difference = p5.Vector.sub(player.position, this.position);

    // Limit the magnitude of the difference vector to the bot's speed
    difference.limit(this.speed);

    // Update the bot's position by adding the difference vector
    this.position.add(difference);
  }

  // Function called when the bots shoot
  shoot() {
    // We calculate the shoot angle
    let angle = atan2(
      player.position.y - this.position.y,
      player.position.x - this.position.x
    );
    // We calculate an offset (without the bot shoots himself to death)
    let xOffset = cos(angle) * this.radius;
    let yOffset = sin(angle) * this.radius;
    // We create the bullet thanks to Bullet Class
    this.bullets.push(
      new Bullet(this.position.x + xOffset, this.position.y + yOffset, angle)
    );
  }

  //Function to know if the bot shots the player
  hasHit(player) {
    let playerHitBox = SIZE_PLAYER;
    // for every bullet we very if it touches  the player
    for (let i = 0; i < this.bullets.length; i++) {
      let bullet = this.bullets[i];
      let d = dist(bullet.x, bullet.y, player.position.x, player.position.y);
      // if the bullet touches  the player
      if (d < playerHitBox / 2) {
        playerHitSound.play(); // We play hit sound
        playerHitSound.setVolume(0.25);
        this.bullets.splice(i, 1); // And we destroy the bullet
        return true;
      }
    }
    return false;
  }

  //Function to know if the bot shots the player
  hasHitBots(bots) {
    let botsHitBox = SIZE_BOT;
    // for every bullet we very if it touches  another bot
    for (let i = 0; i < this.bullets.length; i++) {
      let bullet = this.bullets[i];
      for (let j = 0; j < bots.length; j++) {
        let bot = bots[j];
        let d = dist(bullet.x, bullet.y, bot.position.x, bot.position.y);
        // If a bot touches  another bot
        if (d < botsHitBox) {
          // The bot lose one health point, we destroy the bullet, and we play the sound
          bot.life -= 1;
          this.bullets.splice(i, 1);
          splat.play();
          splat.setVolume(0.2);
          // If the bot life equals 0
          if (bot.life <= 0) {
            // We destroy the bullet, the bot, and play sound
            this.bullets.splice(i, 1);
            bots.splice(j, 1);
            splat.play();
            splat.setVolume(0.2);
            return true;
          }
        }
      }
    }
    return false;
  }
}

// We create the class Bot Sniper that herites from the Bot class
class BotSniper extends Bot {
  constructor(speed, life) {
    super(speed, life);
  }

  // Function draw to draw the sniper with the same caracteristics as the classic bot but with another image 
  draw() {
    push();
    let angle = atan2(
      player.position.y - this.position.y,
      player.position.x - this.position.x
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

  // Function shot to shot with the same caracteristics as the classic bot but with another bullet 
  shoot() {
    let angle = atan2(
      player.position.y - this.position.y,
      player.position.x - this.position.x
    );
    let xOffset = cos(angle) * this.radius;
    let yOffset = sin(angle) * this.radius;
    this.bullets.push(
      new SniperBullet(
        this.position.x + xOffset,
        this.position.y + yOffset,
        angle
      )
    );
  }
}

// We create the class Boss that herites from the Bot class
class Boss extends Bot {
  constructor(speed, life) {
    super(speed, life);
  }

  // Function draw to draw the Boss with the same caracteristics as the classic bot but with another image 
  draw() {
    push();
    let angle = atan2(
      player.position.y - this.position.y,
      player.position.x - this.position.x
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

  // Function shot to shot with the same caracteristics as the classic bot but with another bullet 
  shoot() {
    let angle = atan2(
      player.position.y - this.position.y,
      player.position.x - this.position.x
    );
    let xOffset = cos(angle) * this.radius;
    let yOffset = sin(angle) * this.radius;
    this.bullets.push(
      new BossBullet(
        this.position.x + xOffset,
        this.position.y + yOffset,
        angle
      )
    );
  }
}

// We create the class SniperBullet 
class SniperBullet {
  // Creation of the constructor with all of the necessary properties
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = 18;
  }

  // We draw the bullet
  draw() {
    push();
    fill(0);
    rect(this.x, this.y, 4);
    pop();
  }

  // We update bullet's position
  update() {
    this.x += this.speed * cos(this.angle);
    this.y += this.speed * sin(this.angle);
  }
}

// We create the class BossBullet 
class BossBullet {
  // Creation of the constructor with all of the necessary properties
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = 17;
  }

  // We draw the bullet
  draw() {
    push();
    fill(0);
    circle(this.x, this.y, 15);
    pop();
  }

  // We update bullet's position
  update() {
    this.x += this.speed * cos(this.angle);
    this.y += this.speed * sin(this.angle);
  }
}

// Creation of the Fruit class
class Fruit {
  // Creation of the constructor with all of the necessary properties
  constructor() {
    let y = random(maps.height);
    let x = random(maps.width);
    this.position = createVector(x, y);
    this.compteur = 0;
  }

  // We draw the bullet
  draw() {
    push();
    imageMode(CENTER);
    image(fruitImage, this.position.x, this.position.y, 62, 62);
    pop();
  }

  // Function to know if the player touches  the fruit
  hasHitFruit(player) {
    let playerHitBox = SIZE_PLAYER;
    let d = dist(
      this.position.x,
      this.position.y,
      player.position.x,
      player.position.y
    );
    // If the player hit the fruit then it play sound
    if (d < playerHitBox) {
      fruitSound.play();
      fruitSound.setVolume(0.2);
      return true;
    }
    return false;
  }
}

// We create the class GoldenFruit that herites from the Fruit class
class GoldenFruit extends Fruit {
  constructor() {
    super();
  }

  // We draw it
  draw() {
    push();
    imageMode(CENTER);
    image(goldenFruitImage, this.position.x, this.position.y, 62, 62);
    pop();
  }
}

// Creation of the Heart class
class Heart {
  constructor() {
    let y = random(maps.height);
    let x = random(maps.width);
    this.position = createVector(x, y);
    this.compteur = 0;
  }

  // We draw it
  draw() {
    push();
    imageMode(CENTER);
    image(heartImage, this.position.x, this.position.y, 62, 62);
    pop();
  }

  // Function to know if the player touches  the Heart
  hasHitHeart(player) {
    let playerHitBox = SIZE_PLAYER;
    let d = dist(
      this.position.x,
      this.position.y,
      player.position.x,
      player.position.y
    );
    // If the player hit the fruit then it play sound
    if (d < playerHitBox) {
      return true;
    }
    return false;
  }
}

// We create the class Bullet
class Bullet {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = 10;
  }

  // We draw it
  draw() {
    push();
    fill(0);
    circle(this.x, this.y, 5);
    pop();
  }

  // We update the position
  update() {
    this.x += this.speed * cos(this.angle);
    this.y += this.speed * sin(this.angle);
  }
}

// We create the function draw to show all of the information
function draw() {
  background(100, 100, 100); // We color the background
  rectMode(CENTER);
  player.draw();
  player.update();

  // We create the text
  textFont(font, 30);
  textSize(23);
  text("Player life : " + player.life, 35, 40);
  text("Score : " + player.score, 35, 70);

  // For all of the bot
  for (let i = bots.length - 1; i >= 0; i--) {
    // We draw and update them
    bots[i].draw();
    bots[i].update();

    // If a bot has touched the player
    if (bots[i].hasHit(player) == true) {
      player.life -= 1; // He lost a life point
      // If he dies
      if (player.life <= 0) {
        console.log(player.life, "hit");
        // Page display lost with a restart button.
        background(0);
        textAlign(CENTER);
        fill(255);
        textSize(25);
        text("YOU LOSE", width / 2, height / 2.20);
        text("Your Score : " + player.score, width / 2, height / 2);
        button = createButton("Restart", "Restart");
        button.position(width / 2.15, height / 1.90);
        button.mousePressed(function () {
          // Reload the page.
          document.location.reload();
        });

        // And we recreate the player of another game
        player = null;
        player.life = 3;
      }
    }

    // if a bot touches  a bot he player score increases
    if (bots[i].hasHitBots(bots) == true) {
      player.score += 1;
    }
  }

  // We show every fruit
  for (let i = fruits.length - 1; i >= 0; i--) {
    fruits[i].draw();
  }

  // Every 300 frames we create a Bot
  if (frameCount % 300 == 0) {
    bots.push(new Bot(1, 1));
  }

  // Every 2000 frames we create a Sniper
  if (frameCount % 2000 == 0) {
    bots.push(new BotSniper(1, 1));
  }

  // Every 50 points we create a Boss
  if (player.score >= stepBoss) {
    bots.push(new Boss(1, 3));
    stepBoss += 50;
  }

  // Every 600 frames we create a Fruit
  if (frameCount % 600 == 0) {
    fruits.push(new Fruit(1));
  }

  // When a boss dies we create a Golden apple
  if (bossDead == true) {
    fruits.push(new GoldenFruit(1));
    bossDead = false;
  }

  // For every fruit
  for (let i = fruits.length - 1; i >= 0; i--) {
    // We verify if the player touches  a Fruit
    if (fruits[i].hasHitFruit(player) == true) {
      // If it's a golden fruit it's 10 points
      if (fruits[i] instanceof GoldenFruit) {
        player.score += 10;
        fruits.splice(i, 1);
        console.log("Golden has been hit");
      
      // And if a regular fruit it's 3 points  
      } else {
        player.score += 3;
        fruits.splice(i, 1);
        console.log("Fruit has been hit");
      }
    }
  }

  // We show every heart
  for (let i = heart.length - 1; i >= 0; i--) {
    heart[i].draw();
  }

  // Every 3000 frames we create a Heart
  if (frameCount % 3000 == 0) {
    heart.push(new Heart(1));
  }

  // For every Heart We verify if the player touches  a fruit
  for (let i = heart.length - 1; i >= 0; i--) {
    // If he touches  it he win one life and the heart is destroyed
    if (heart[i].hasHitHeart(player) == true) {
      player.life += 1;
      heart.splice(i, 1);
    }
  }

  // For every bot
  for (let i = 0; i < bots.length - 1; i++) {
    // Every 150 frames all the bots shots at the same time
    if (frameCount % 150 == 0) {
      bots[i].shoot();
    }
  }
}
