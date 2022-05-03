//importando os módulos de Matter
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
//declarando as variáveis de configuração
var engine, world

//outras variáveis
var ground;
var backgroundImg
var tower, towerImg
var cannon
var angle = 20
var balls = []
var boats = []
var boatAnimation=[]
var boatSpriteSheet
var boatSpriteData
var brokenBoatAnimation=[]
var brokenBoatSpriteSheet 
var brokenSpriteData
// criar variaveis para animaçao da bala
var warterSplashAnimation = []
var warterSplashData
var warterSplashSpriteSheet
var background_sound
var cannon_explosion
var cannon_water
var pirate_laugh
var isGame_over = false
var isLaugh = false
var score = 0 



function preload() {
  backgroundImg = loadImage("./assets/background.gif")
  towerImg = loadImage("./assets/tower.png")

  //carregando dados do barco 
  boatSpriteData=loadJSON("./assets/boat/boat.json")
  boatSpriteSheet=loadImage("./assets/boat/boat.png")
  brokenSpriteData=loadJSON("./assets/boat/broken_boat.json")
  brokenBoatSpriteSheet=loadImage('./assets/boat/broken_boat.png')
  //carregar os dados da animaçao da bala
   warterSplashData = loadJSON("./assets/water_splash/water_splash.Json")
   warterSplashSpriteSheet  = loadImage("./assets/water_splash/water_splash.png")
  background_sound = loadSound('./assets/sounds/background_music.mp3')
  cannon_explosion = loadSound('./assets/sounds/cannon_explosion.mp3')
  cannon_water = loadSound('./assets/sounds/cannon_water.mp3')
  pirate_laugh = loadSound('./assets/sounds/pirate_laugh.mp3')

}

function setup() {
  canvas = createCanvas(1200, 600);

  engine = Engine.create();
  world = engine.world;
  angleMode(DEGREES)
  angle = 15

  //options dos corpos
  var options = {
    isStatic: true
  }

  //criando o solo
  ground = Bodies.rectangle(0, height - 1, width * 2, 1, options)
  World.add(world, ground)

  //criando a torre
  tower = Bodies.rectangle(160, 350, 160, 310, options)
  World.add(world, tower)

  // criando canhao
  cannon = new Cannon(180, 110, 130, 100, angle)

  //criando animação do barco
  var boatframes = boatSpriteData.frames

  for (let i = 0; i < boatframes.length; i++) {
    var pos = boatframes[i].position
    var img = boatSpriteSheet.get(pos.x,pos.y,pos.w,pos.h)
    boatAnimation.push(img)
  }
  var brokenBoatFrames = brokenSpriteData.frames

  for (let j = 0; j < brokenBoatFrames.length; j++) {
    var pos = brokenBoatFrames[j].position
    var img = brokenBoatSpriteSheet.get(pos.x,pos.y,pos.w,pos.h)
    brokenBoatAnimation.push(img)
  }
  // criar animaçao da bala
  var waterSplashFrames = warterSplashData.frames

for (let i = 0; i < waterSplashFrames.length; i++) {
  var pos = waterSplashFrames[i].position
  var img = warterSplashSpriteSheet.get(pos.x,pos.y,pos.w,pos.h)
  warterSplashAnimation.push(img)
}




}

function draw() {
  background(189);
  //função image para exibir imagens na tela
  image(backgroundImg, 0, 0, width, height)

  if (!background_sound.isPlaying()){
    background_sound.play()
    background_sound.setVolume(0.2)
  }

  Engine.update(engine);

  //exibindo o solo na tela
  rect(ground.position.x, ground.position.y, width * 2, 1)

  //exibindo a torre na tela
  push()//inicializa uma nova configuração
  imageMode(CENTER)
  image(towerImg, tower.position.x, tower.position.y, 160, 310)
  pop()//volta para a configuração antiga

  //exibindo o canhao na tela
  cannon.display()



  for (let i = 0; i < balls.length; i++) {
    showCannonBalls(balls[i], i)
    colisionWithBoat(i)
  }
  showBoats()

  //text(mouseX + " / " + mouseY, mouseX, mouseY)
  fill("#6d4c41")
  textSize(40)
  textAlign(CENTER,CENTER)
  text("Pontuação: "+score ,1040,25)
}
function keyReleased() {
  if (keyCode == DOWN_ARROW) {
    balls[balls.length - 1].shoot()
    cannon_explosion.play()
    cannon_explosion.setVolume(0.2)
  }
}
function keyPressed() {
  if (keyCode == DOWN_ARROW) {
    //criando a bala de canhão
    var cannonball = new CannonBall(cannon.x, cannon.y)
    balls.push(cannonball)
  }
}
function showCannonBalls(ball, i) {
  //exibindo a bala de canhão
  if (ball){
    ball.display()
  if (ball.body.position.x >= width) {
    World.remove(world, balls[i].body)
    delete balls[i]
  }
  if (ball.body.position.y >= height - 50) {
    balls[i].removeBalls(i)
    cannon_water.play()
    cannon_water.setVolume(0.05)
  }
  }
}
function showBoats() {

  if (boats.length > 0) {

    if (boats[boats.length - 1] == undefined || boats[boats.length - 1].body.position.x < width - 300) {

      var positions = [-40, -60, -70, -20]
      var position = random(positions)
      var boat = new Boat(width - 79, height - 60, 170, 170, position,boatAnimation)
      boats.push(boat)

    }

    for (let i = 0; i < boats.length; i++) {
      if (boats[i]) {
        Matter.Body.setVelocity(boats[i].body, { x: -0.9, y: 0 })
        boats[i].display()
        boats[i].animate()
        var colision = Matter.SAT.collides(this.tower,boats[i].body)
        if(colision.collided  && !boats[i].isBroken){
          if(!isLaugh && !pirate_laugh.isPlaying()){
            pirate_laugh.play()
            pirate_laugh.setVolume(0.2)
            isLaugh = true
          }
          isGame_over = true 
          gameOver()
        }


      }

    }

  } else {
    var boat = new Boat(width - 79, height - 60, 170, 170, -80,boatAnimation)
    boats.push(boat)
  }
}
function colisionWithBoat(i) {
  for (let j = 0; j < boats.length; j++) {
    if (balls[i] !== undefined && boats[j] !== undefined) {
      var colision = Matter.SAT.collides(balls[i].body, boats[j].body)
      if (colision.collided) {
        boats[j].removeBoats(j)
        World.remove(world, balls[i].body)
        delete balls[i]
        score += 5
      }
    }

  }

}

function gameOver(){
  swal(
    {
      title: `Fim de Jogo!!!`,
      text: "Obrigada por jogar!!",
      imageUrl:
        "https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
      imageSize: "150x150",
      confirmButtonText: "Jogar Novamente"
    },
    function(isConfirm) {
      if (isConfirm) {
        location.reload();
      }
    }
  );
}