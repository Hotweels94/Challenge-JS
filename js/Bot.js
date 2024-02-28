// import { addImage } from "../libraries/quicksettings";

// addImage(bot,"./img/bot.png",{name:"Bot"});
class Bot {
  constructor() {
    this.position = createVector(width / 2, height / 2);
    this.angle = 0;
  }

  player = new Player();

  draw(){
    push();
    translate(this.position.x, this.position.y);
    rotate(this.angle);
    rect(50, 50, 30, 30, 20);
    pop();
}

  tracking() { 
    player = new  Player();

    let distance = dist(player.x, player.y, bot.x, bot.y);
  
    if (distance > 40) {
      bot.direction = bot.angleTo(player);
      bot.speed = 1;
    } else if (distance < 30) {
      bot.speed = 0;
    }
  }
}
