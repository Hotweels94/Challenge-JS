let playerImage;

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
        rect(0, 0, 20, 20);
        //image(playerImage, 0, 0,45,45);
        pop();
    }

    update(){
        let xSpeed = 0
        let ySpeed = 0

        if (keyIsDown(90)) {
            ySpeed = -2;
        }

        if (keyIsDown(83)) {
            ySpeed = 2;
        }

        if (keyIsDown(68)) {
            xSpeed = 2;
        }

        if (keyIsDown(81)) {
            xSpeed = -2;
        }

        this.position.add(xSpeed, ySpeed);
        this.angle = atan2(mouseY - this.position.y, mouseX - this.position.x);
    }
}

function preload() {
    playerImage = loadImage('../img/player.png');
}