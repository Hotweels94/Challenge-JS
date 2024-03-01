// import { addImage } from "../libraries/quicksettings";

// addImage(bot,"./img/bot.png",{name:"Bot"});
class Bot {
  constructor(speed) {
    this.speed = speed;
    let y = random(width);
    let x = random(height);
    this.position = createVector(x, y);
    this.bullets = [];
  }

  draw() {
    push();
    fill(100, 255, 100);
    let angle = atan2(player.position.y - this.position.y, player.position.x - this.position.x);
    translate(this.position.x, this.position.y);
    rotate(angle);
    rect(0, 0, 30, 20);
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
    this.bullets.push(new Bullet(this.position.x, this.position.y, angle));
  }

  hasHit(player) {
    for (let i = 0; i < this.bullets.length; i++) {
      if (dist(this.bullets[i].x, this.bullets[i].y, player.position.x, player.position.y < 15)) {
        this.bullets.splice(i, 1);
        return true;
      }
    }
    return false;  
  }
}
