var player1,player2;
var yellowLine,redLine;
var p1Animation,p2Animation;
var database;
var gameState = 0; 
var position={};
var position2={};
var player1Score=0;
var player2Score=0;
function preload(){
    p1Animation = loadAnimation("assets/player1a_flip.png","assets/player1b_flip.png","assets/player1a_flip.png");
    p2Animation = loadAnimation("assets/player2a.png","assets/player2b.png","assets/player2a.png");
}
function setup(){

   database = firebase.database();
     createCanvas(600,600);



player1=createSprite(450,300,10,10);
player1.addAnimation("dancing",p1Animation);
player1.scale=0.5;

player1.debug=true;
player1.setCollider("circle",0,0,60);


var player1Position = database.ref('player1/position');
    player1Position.on("value", function(data){
        position = data.val();
        console.log(position);        
        player1.x = position.x;
        player1.y = position.y;
    }, showError());
    
        
player2=createSprite(150,300,10,10);
player2.addAnimation("singing",p2Animation);
player2.scale=0.5;

player2.debug=true;
player2.setCollider("circle",0,0,60);

var player2Position = database.ref('player2/position');
player2Position.on("value",function(data){
position2 = data.val();
console.log(position2);
player2.x = position2.x;
player2.y = position2.y;
},showError());


if ((position2.y<0)||(position.y<0)||(player1.y<0)||(player2.y<0)){
    database.ref('player1/position').update({
        'x': 450,
        'y': 300
     });
     database.ref('player2/position').update({
        'x': 150,
        'y': 300
     });
     player1.y=300;
     player2.y=300;
}

database.ref('/').update({
    'gameState': 0,
    'player1Score':0,
    'player2Score':0

});
var player1Scores = database.ref('player1Score');
player1Scores.on("value", function(data){
    player1Score = data.val();
    
});
var player2Scores = database.ref('player2Score');
player2Scores.on("value", function(data){
    player2Score = data.val();
    
});
}   
function draw (){

    background("white");
    var gameStateRef  = database.ref('gameState');
    gameStateRef.on("value",function(data){
       gameState = data.val();
       
    });
    text('Yellow Scores::'+player2Score,200,10);
    text('Red Scores::'+player1Score,350,10);

    if (gameState === 0){
        text("Press space to toss",250,300);
    
      if (keyDown("space")){
      var strike = Math.round(random(1,2))
       if (strike == 1){
        alert('Red Chance');

        database.ref('/').update({
            'gameState': 1
        });
        gameState = 1;
        
        }else if(strike == 2 ){
         alert('Yellow Chance');
            database.ref('/').update({
                'gameState': 2
                
            });
            gameState = 2;
        }
    }   
        database.ref('player1/position').update({
            'x': 450,
            'y': 300
         });
           database.ref('player2/position').update({
            'x': 150,
            'y': 300
         });

    }  
       else if (gameState === 1){
            
            if (keyDown(LEFT_ARROW)){
                writePosition(-5,0);
            }
            else if (keyDown(RIGHT_ARROW)){
               writePosition(5,0);
            }
            else if (keyDown(UP_ARROW)){
              writePosition(0,-5);
            }
            else if (keyDown(DOWN_ARROW)){
              writePosition(0,5);
            }
            else if (keyDown("s")){
              writePosition2(0,5);
            } 
            else if (keyDown("a")){
            writePosition2(0,-5);
            }
         
            if (player1.isTouching(player2) && frameCount%160==0){
                alert("Red Lost");
                database.ref('/').update({
                    'gameState':3,
                    'player1Score': player1Score - 5,
                    'player2Score': player2Score + 5,
                });
                
            }
            
            if (player1.isTouching(redLine)){
                alert("Red Won");
                database.ref('/').update({
                'gameState' : 3,
                'player1Score': player1Score + 5,
                'player2Score': player2Score - 5,
                });
            
                database.ref('player1/position').update({
                    'x': 450,
                    'y': 300
                 });
                 player1.x=450;
                 player1.y=300;
                 player2.x=150;
                 player2.y=300;
                 
            }
           
           
            
            
        }
    
        else if (gameState === 2){
            //up arrow for player2
            if (keyDown("w")){
                writePosition2(0,-5);
            }
            //down arrow for player2
            else if (keyDown("d")){
                writePosition2(0,5);
            }
            //right arrow for player2
            else if (keyDown("s")){
                writePosition2(5,0);
            }
            //left arrow for player2
            else if (keyDown("a")){
                writePosition2(-5,0);  
            }
            else if (keyDown(LEFT_ARROW)){
                writePosition(0,5);
            }
            else if (keyDown(RIGHT_ARROW)){
               writePosition(0,-5);
            } 
            
            if (player2.isTouching(player1) && frameCount%160==0){
                alert("Yellow Lost");
                database.ref('/').update({
                    'gameState':3,
                    'player1Score': player1Score + 5,
                   'player2Score': player2Score - 5,
                });
                
            }
            if (player2.isTouching(yellowLine)){
                alert("Yellow Won");
                database.ref('/').update({
                'gameState' : 3,
                'player1Score': player1Score - 5,
                'player2Score': player2Score + 5,
            });
            database.ref('player2/position').update({
                'x': 150,
                'y': 300
             });
             player1.x=450;
             player1.y=300;
             player2.x=150;
             player2.y=300;
             
            }
            
            

        }else if(gameState === 3){
            text("Game Over",250,270);
            text("press r to restart",250,300);

            if (keyDown("r")){
                database.ref('/').update({
                    'gameState' : 0
            });
            gameState = 0;
            }
        }
      
    drawLine();
    drawLine1();
    drawLine2();   
    drawSprites();

}

function drawLine(){
    
for(var i = 0; i<=600; i = i + 20 ){
line(300,i,300,i+10);
}

}
function drawLine1 (){
    stroke("red");
    strokeWeight(4);
    for(var i=0;i<=600;i=i+20){
        line(500,i,500,i+10);
    }
    redLine = createSprite(498,0,2,1200);
    redLine.visible = false;
}
function drawLine2 (){
    stroke("yellow");
    strokeWeight(4);
    for(var i=0;i<=600;i=i+20){
        line(100,i,100,i+10);
    }
    yellowLine = createSprite(98,0,2,1200);
    yellowLine.visible = false;

}

function writePosition(x,y){
    database.ref('player1/position').update({
        'x': position.x + x,
        'y': position.y + y
    })
}

function showError(){
    console.log("ERROR IN WRITING/Reading IN THE DATABASE");
}

function writePosition2(x,y){
    database.ref('player2/position').update({
        'x': position2.x + x,
        'y': position2.y + y
    })
}
