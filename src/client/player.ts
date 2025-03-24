import { boundaries } from './CollisionBlocks';
const canvas: HTMLCanvasElement = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
interface player{
    x: number,
    y: number,
    width: number,
    height: number,
    leftBorder: number,
    rightBorder: number, 
    topBorder: number,
    bottomBorder: number ,
    color: string,
}
var player = {
    // x og y er positionen af spilleren. Jeg har pt sat start positionen til at være midt i canvas
   x: (canvas.width/2),
   y: (canvas.height/2),
   //Dette er størrelsen på karakteren
   width: 20,
   height: 20,
   //Border er til hit collesion så man kan tjekke om en af kanterne er inde i en eventuel collesion block
   leftBorder:0, 
   rightBorder:0, 
   topBorder:0,
   bottomBorder:0 ,
   color: "red",
};
function updateBorders() {
    player.leftBorder = player.x;
    player.rightBorder = player.x + player.width
    player.topBorder = player.y 
    player.bottomBorder = player.y + player.height
    
}
function drawPlayer(){
    //først sættes fill style til at være  spillerens farve
    ctx.fillStyle = player.color;
    //en firkant på spillerens koordinater bliver tegnet med spillerens størrelse
    ctx.fillRect(player.x, player.y, player.width, player.height)
    //obdatere positionen på spillerens hjørner
    updateBorders();
    drawHitbox();
}
function drawHitbox() {
    //Tegner hitboxen midlertidigt så vi kan teste collision blocks 

    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;

    
    ctx.strokeRect(player.leftBorder, player.topBorder, player.width, player.height);
}
function moveRight() {
    //når man bevæger sig til højre slettes den gamle firkant
    ctx.clearRect(player.x, player.y, player.width, player.height);    
    // spillerens position rykkes på x aksen
    player.x += 5;
    // spilleren printes igen
    drawPlayer();
    
}
function moveLeft() {  
    ctx.clearRect(player.x, player.y, player.width, player.height);    
   
    player.x -= 5;

    drawPlayer();
    
}
function moveUp() {
    ctx.clearRect(player.x, player.y, player.width, player.height);    
    
    player.y -= 5;

    drawPlayer();
   
}
function moveDown() {
    ctx.clearRect(player.x, player.y, player.width, player.height);    

    player.y += 5;

    drawPlayer();
    
}




//Tegner den første model af spilleren
drawPlayer();

//Lytter efter W,A,S,D bliver trykket og flytter karakteren derefter
document.addEventListener("keydown", function(event) {
    if (event.key === "d") {
        moveRight();
    }else if (event.key === "a") {
        moveLeft();
    }else if (event.key === "w") {
        moveUp();
    }else if (event.key === "s") {
        moveDown();
    }
});

