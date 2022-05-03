class Boat {
    constructor(x, y, w, h, boatPos,boatAnimation) {

        
        this.w = w
        this.h = h
        this.image = loadImage("./assets/boat.png")
        this.boatPos = boatPos
        this.body = Bodies.rectangle(x, y, w, h)
        World.add(world, this.body)
        this.animation=boatAnimation
        this.speed = 0.05
        this.isBroken = false
    }
    animate(){
        this.speed += 0.05
    }
    removeBoats(j) {
        this.animation=brokenBoatAnimation
        this.speed = 0.05
        this.w = 300
        this.h = 300
        this.isBroken =true
        setTimeout(() => {
            World.remove(world, boats[j].body)
            delete boats[j]
        },2000)

    }
    display() {
        var pos = this.body.position
        var angle = this.body.angle
        var index = floor(this.speed % this.animation.length)
        push()
        translate(pos.x, pos.y)
        rotate(angle)
        imageMode(CENTER)
        image(this.animation[index], 0, this.boatPos, this.w, this.h)
        pop()
    
    }



}
