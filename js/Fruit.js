let fruitImage;

function preload() {
    fruitImage = loadImage('../img/fruit1.png');
}

class Fruit {
    constructor(){
        let y = random(maps.height);
        let x = random(maps.width);
        this.position = createVector(x, y);
        this.compteur = 0;
    }

    draw() {
        push();
        imageMode(CENTER);
        image(fruitImage, this.position.x, this.position.y,62,62);
        pop();
    }
    
    hasHitFruit(player) {
        let playerHitBox = 30;
        let d = dist(this.position.x, this.position.y, player.position.x, player.position.y);
        if (d < playerHitBox / 2) {
            return true;
        }
        return false;
    }
}
