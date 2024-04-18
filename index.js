const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const tileW = 40;
const tileH = 40;

const tileRows = 10;
const tileCols = 10;

const updateAll = () => {
  window.requestAnimationFrame(updateAll);
  drawMap();
  player.draw();
  player.getPreviousXandY();
  player.move();
};

window.onload = () => {
  window.requestAnimationFrame(updateAll);
};

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false 
}

window.addEventListener('keydown', (e)=>{
  keys[e.key] = true;
})

window.addEventListener('keyup', (e)=>{
  keys[e.key] = false;
})

const map = [
  1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
  1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 
  0, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 
  0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 
  0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
  0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
  0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 
  0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 
  0, 0, 0, 0, 0, 0, 0, 1, 1, 0,
];


class Wall {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.height = 48;
    this.width = 48;
  }

  draw() {
    let image = new Image();
    image.src = "./fruit1.png";

    ctx.drawImage(image, this.x, this.y);
  }

  isCollision (rect1, rect2) {
    if (rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y) {
        player.x = player.previousX;
        player.y = player.previousY;
      }
  }
}

class Player {
  constructor(x , y) {
    this.x = x;
    this.y = y;
    this.previousX = null;
    this.previousY = null;
    this.height = 40;
    this.width = 40;
    this.speed = 2;
  }

  draw() {
    let image = new Image();
    image.src = "./player.png";

    ctx.drawImage(image, this.x, this.y);
  }

  move () {
    if(keys.ArrowUp && player.y  > 0){
      player.y -= player.speed;
    }
    if(keys.ArrowDown && player.y < canvas.height -  this.height){
      player.y += player.speed;
    }
    if (keys.ArrowLeft &&  player.x > 0) {
      player.x -= player.speed;
    } 
    if (keys.ArrowRight && player.x < canvas.width - this.width) {
      player.x += player.speed;
    }
  }

  getPreviousXandY () {
    this.previousX = this.x;
    this.previousY = this.y;
  }
}  

const player = new Player(50, 40);

const drawMap = () => {
  for (let row = 0; row < tileRows; row++) {
    for (let col = 0; col < tileCols; col++) {
      let arrayIndex = tileRows * row + col;
      if (map[arrayIndex] === 1) {
        ctx.fillStyle = "gray";
        ctx.fillRect(tileW * col, tileH * row, tileW, tileH);
      } else {
        let wall = new Wall(tileW * col, tileH * row);
        wall.draw();
        wall.isCollision(wall,player);
      }
    }
  }
};
