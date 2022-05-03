class CannonBall {
    constructor(x, y) {
        var options = {
            isStatic: true
        }

        this.r = 30
        this.image = loadImage("./assets/cannonball.png")
        this.trajectory = []
        this.body = Bodies.circle(x, y, this.r, options)
        World.add(world, this.body)
        this.animation = warterSplashAnimation
        this.speed = 0.05
        this.isSink = false
    }

    shoot() {
        var newAngle = cannon.angle - 28
        newAngle = newAngle * (3.14 / 180)
        var velocity = p5.Vector.fromAngle(newAngle)
        velocity.mult(0.5)
        Matter.Body.setStatic(this.body, false)
        Matter.Body.setVelocity(this.body, {
            x: velocity.x * (180 / 3.14),
            y: velocity.y * (180 / 3.14)
        })
    }
    animate(){
        this.speed += 0.05
    }
    removeBalls(i) {
        this.isSink = true 
        this.speed = 0.05
        this.r = 150
        this.animation=warterSplashAnimation
        Matter.Body.setVelocity(balls[i].body, { x: 0, y: 0 })
        setTimeout(() => {
            World.remove(world, balls[i].body)
            delete balls[i]
        }, 1000)
    }
    display() {
        var pos = this.body.position
        var index = floor(this.speed % this.animation.length)
        if (this.isSink) {
            push()
        imageMode(CENTER)
        image(this.animation[index], pos.x, pos.y, this.r, this.r)
        pop()
        } else {
            push()
            imageMode(CENTER)
            image(this.image, pos.x, pos.y, this.r, this.r)
            pop()  
        }
        
        if (this.body.velocity.x > 0 && this.body.position.x > 300) {
            var position = [this.body.position.x, this.body.position.y]
            this.trajectory.push(position)

        }
        for (let i = 0; i < this.trajectory.length; i++) {
            image(this.image, this.trajectory[i][0], this.trajectory[i][1], 5, 5)

        }
    }

}