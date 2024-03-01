// import { addImage } from "../libraries/quicksettings";

// addImage(bot,"./img/bot.png",{name:"Bot"});
class Bot {
  constructor(speed) {
    this.speed = speed;
    let y = random(width);
    let x = random(height);
    this.position = createVector(x, y);
  }

  draw() {
    push();
    fill(100, 255, 100);
    let angle = atan2(player.position.y - this.position.y, player.position.x - this.position.x);
    translate(this.position.x, this.position.y);
    rotate(angle);
    rect(0, 0, 30, 20);
    pop();
  }

  update() {
    let difference = p5.Vector.sub(player.position, this.position);
    difference.limit(this.speed);
    this.position.add(difference);
  }
}
