class Fruit {
    constructor(){
        let y = random(maps.height);
        let x = random(maps.width);
        this.position = createVector(x, y);
        this.compteur = 0;
    }

    draw() {
        push();
        translate(this.position.x, this.position.y);
        circle(this.position.x, this.position.y, 10);
        pop();
    }
    
    hasHitFruit(player) {
        let playerHitBox = 15;
        for (let i = 0; i < fruits.compteur; i++) {
          let fruit = this.fruits[i];
          let d = dist(fruit.x, fruit.y, player.position.x, player.position.y);
          if (d < playerHitBox / 2) {
            this.fruits.splice(i, 1);
            return true;
          }
        }
        return false;
    }
}