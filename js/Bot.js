class Bot {
  constructor(speed) {
    this.speed = speed;
    let y = random(width);
    let x = random(height);
    this.position = createVector(x, y);
    this.bullets = [];
    this.radius = 20;
  }

  draw() {
    push();
    fill(100, 255, 100);
    let angle = atan2(player.position.y - this.position.y, player.position.x - this.position.x);
    translate(this.position.x, this.position.y);
    rotate(angle);
    rect(0, -this.radius/2, 30, 20);
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
          this.bullets.splice(i, 1); // Remove the bullet
          bots.splice(j, 1); // Remove the bot
          return true;
        }
      }
    }
    return false;
  }
}
