var bg, bgImg
var bottomGround
var topGround
var balloon, balloonImg
var obstacleTop, obstacleTopImg;
var obsBottom1, obsBottom2, obsBottom3;
var gameOver, gameOverImg;
var restart, restartImg;
var bgImg, bgImg2;
var score = 0;
var PLAY = 1;
var END = 0;
var gameState = PLAY;

function preload(){
bgImg = loadImage("assets/bg.png");

balloonImg = loadAnimation("assets/balloon1.png","assets/balloon2.png","assets/balloon3.png");
bgImg2 = loadImage("assets/bgImg2.jpg");
obsTop1 = loadImage("assets/obsTop1.png");
obsTop2 = loadImage("assets/obsTop2.png");
obsBottom1 = loadImage("assets/obsBottom1.png");
obsBottom2 = loadImage("assets/obsBottom2.png");
obsBottom3 = loadImage("assets/obsBottom3.png");
gameOverImg = loadImage("assets/gameOver.png");
restartImg = loadImage("assets/restart.png");
}

function setup(){
createCanvas(400,400);
//background image
bg = createSprite(165,485,1,1);
getBackgroundImg();
bg.addImage(bgImg);
bg.scale = 1.3

//creating top and bottom grounds
bottomGround = createSprite(200,390,800,20);
bottomGround.visible = false;

topGround = createSprite(200,10,800,20);
topGround.visible = false;
      
//creating balloon     
balloon = createSprite(100,200,20,50);
balloon.addAnimation("balloon",balloonImg);
balloon.scale = 0.2;
topObstaclesGroup = new Group();
bottomObstaclesGroup = new Group();
barGroup = new Group();
gameOver = createSprite(220,200);
gameOver.addImage(gameOverImg);
gameOver.scale = 0.5;
gameOver.visible = false;
restart = createSprite(220,240);
restart.addImage(restartImg);
restart.scale = 0.5;
restart.visible = false;
}

function draw() {
  
  background("black");
        if(gameState===PLAY) {
          if(keyDown("space")) {
            balloon.velocityY = -6;

          }
          balloon.velocityY = balloon.velocityY + 2;
          Bar();
          spawnObstaclesTop();
          spawnObstaclesBottom();
          if(topObstaclesGroup.isTouching(balloon)|| balloon.isTouching(topGround)||
          balloon.isTouching(bottomGround)|| bottomObstaclesGroup.isTouching(balloon)) {
            gameState = END;
          }
        }
        if(gameState === END) {
          gameOver.visible = true;
          gameOver.depth = gameOver.depth + 1;
          restart.visible = true;
          restart.depth = restart.depth + 1;
          balloon.velocityX = 0;
          balloon.velocityY = 0;
          topObstaclesGroup.setVelocityXEach(0);
          bottomObstaclesGroup.setVelocityXEach(0);
          barGroup.setVelocityXEach(0);
          balloon.y = 200;
          if(mousePressedOver(restart)) {
            reset();
          }
        }
        drawSprites();
        Score();
}
function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  topObstaclesGroup.destroyEach();
  bottomObstaclesGroup.destroyEach();
  score = 0;
}

function spawnObstaclesTop() {
  if(World.frameCount%60===0) {
    obstacleTop = createSprite(400,50,40,50);
    obstacleTop.scale = 0.1;
    obstacleTop.velocityX = -4;
    obstacleTop.y = Math.round(random(10,100));
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1:obstacleTop.addImage(obsTop1);
      break;
      case 2:obstacleTop.addImage(obsTop2);
      break;
      default:break;
    }
    balloon.depth = balloon.depth + 1;
    topObstaclesGroup.add(obstacleTop);
  }
}

function spawnObstaclesBottom() {
  if(World.frameCount%60===0) {
    obstacleBottom = createSprite(400,350,40,50);
    obstacleBottom.scale = 0.07;
    obstacleBottom.velocityX = -4;
    var rand = Math.round(random(1,3));
    obstacleBottom.addImage(obsBottom1);
    switch(rand) {
      case 1:obstacleBottom.addImage(obsBottom1);
      break;
      case 2:obstacleBottom.addImage(obsBottom2);
      break;
      case 3:obstacleBottom.addImage(obsBottom3);
      break;
    default:break;
    }
    balloon.depth = balloon.depth + 1;
    bottomObstaclesGroup.add(obstacleBottom);
  }
  }

function Bar() {
  if(World.frameCount%60===0) {
    var bar = createSprite(400,200,10,800);
    bar.velocityX = -6;
    bar.depth = balloon.depth;
    bar.visible = false;
    barGroup.add(bar);
  }
}

function Score() {
  if(balloon.isTouching(barGroup)) {
    score = score +1;
  }
  textFont("algerian");
  textSize(30);
  fill("yellow");
  text("Score"+score, 250, 50);
}

async function getBackgroundImg() {
  var response = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata");
  var responseJSON = await response.json();
  var datetime = responseJSON.datetime;
  var hour = datetime.slice(11,13);
  if(hour>=06 && hour<=19) {
    bg.addImage(bgImg2);
    bg.scale = 1.3;
  }
  else {
    bg.addImage(bgImg);
    bg.scale = 1.5;
    bg.x = 200;
    bg.y = 200;
  }
}