class Cannon{
    constructor(x,y,width,height,angle){
        this.x = x
        this.y = y
        this.w = width
        this.h = height
        this.angle = angle
        this.baseimg = loadImage("./assets/cannonBase.png")
        this.cannonimg = loadImage("./assets/canon.png")
        
    }


    display(){
       console.log(this.angle)
       if(keyIsDown(RIGHT_ARROW)&& this.angle <60){
        this.angle +=1
        
       }
       if(keyIsDown(LEFT_ARROW)&& this.angle >-37){
           this.angle -=1
       }
        //cano do canhao
        push ()
        translate (this.x,this.y)
        rotate (this.angle)
        imageMode(CENTER)
        image(this.cannonimg,0,0,this.w,this.h) 
        pop ()
       // base do canhao
       
        image(this.baseimg,70,20,200,200)
    }
}