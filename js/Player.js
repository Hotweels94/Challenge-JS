class Player {
    constructor(){
        this.pos = createVector(width/2, height/2);
        this.angle = 0;
    }
    draw(){
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.angle);
        rect(0, 0, 20, 20);
        pop();
    }

    update(){
        let xSpeed = 0;
        let ySpeed = 0;

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

        this.pos.add(xSpeed, ySpeed);
        this.angle = atan2(mouseY - this.pos.y, mouseX - this.pos.x);
    }
}
