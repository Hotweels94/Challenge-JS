class Player {
    constructor(){
        this.position = createVector(width/2, height/2);
    }
    draw(){
        circle(this.position.x, this.position.y, 20, 20);
    }
}
