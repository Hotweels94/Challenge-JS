let botImage;

class Bot {
  constructor(speed) {
    this.speed = speed;
    let y = random(mapp.height);
    let x = random(mapp.width);
    this.position = createVector(x, y);
    this.bullets = [];
    this.radius = 20;
  }

  draw() {
    push();
    let angle = atan2(player.position.y - this.position.y, player.position.x - this.position.x);
    translate(this.position.x, this.position.y);
    rotate(angle);
    image(botImage, 0, 0,50,50);
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
    let playerSize = 15;
    for (let i = 0; i < this.bullets.length; i++) {
      let bullet = this.bullets[i];
      let d = dist(bullet.x, bullet.y, player.position.x, player.position.y);
      if (d < playerSize / 2) {
        return true;
      }
    }
    return false;
  }

  hasHitBots(bots) {
    let botsSize = 20;
    for (let i = 0; i < this.bullets.length; i++) {
      let bullet = this.bullets[i];
      for (let j = 0; j < bots.length; j++) {
        let bot = bots[j];
        let d = dist(bullet.x, bullet.y, bot.position.x, bot.position.y);
        if (d < botsSize) {
          this.bullets.splice(i, 1);
          bots.splice(j, 1);
          return true;
        }
      }
    }
    return false;
  }
}




function preload() {
  botImage = loadImage('../img/bot2.png');
}