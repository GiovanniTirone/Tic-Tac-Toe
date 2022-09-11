
//---------------------DOM----------------------

let start_div = document.getElementById("start_div");
let start_btn = document.getElementById("start_btn");
let choose_the_symbol = document.createElement("div");
let choose_x_btn = document.createElement("button");
let choose_o_btn = document.createElement("button");
choose_x_btn.id = "choose_x_btn";
choose_o_btn.id = "choose_o_btn";
choose_the_symbol.innerHTML = "Choose your symbol:";
choose_x_btn.innerHTML = "X";
choose_o_btn.innerHTML = "O"; 
let choose_the_starter = document.createElement("div");
let yes_btn = document.createElement("button");
let no_btn = document.createElement("button");
yes_btn.id = "yes_btn";
no_btn.id = "no_btn";
choose_the_starter.innerHTML = "Do you want to start?";
yes_btn.innerHTML = "Yes";
no_btn.innerHTML = "No";
let finish_div = document.createElement("div");
finish_div.id = "finish_div";
let play_again_btn = document.createElement("button");
play_again_btn.id = "play_again_btn";
play_again_btn.innerHTML = "Play again";
let difficulty_div = document.createElement("div");
let easy_btn = document.createElement("button");
let medium_btn = document.createElement("button");
let hard_btn = document.createElement("button");
let impossible_btn = document.createElement("button");
difficulty_div.id="difficulty_div";
easy_btn.id="easy_btn";
medium_btn.id="medium_btn";
hard_btn.id="hard_btn";
impossible_btn.id="impossible_btn";
difficulty_div.innerHTML="Choose the difficulty level:";
easy_btn.innerHTML="Easy";
medium_btn.innerHTML="Medium";
hard_btn.innerHTML="Hard";
impossible_btn.innerHTML="...impossible!";


for(let i=0; i<3; i++){
    for(let j=0; j<3; j++){
        let currentCell= document.getElementById("cell_"+i+"-"+j);
        currentCell.setAttribute("cell_row",i);
        currentCell.setAttribute("cell_col",j); 
        currentCell.setAttribute("full",false);
    }
}


//---------------------Setting the game--------------------

function start (e) {
    if(e.target.id != "start_btn"){return};
    start_div.removeChild(start_btn);
    start_div.appendChild(choose_the_symbol);
    start_div.appendChild(choose_x_btn);
    start_div.appendChild(choose_o_btn);
}

function chooseTheSymbol (e){
    if(e.target.id != "choose_x_btn" && e.target.id != "choose_o_btn"){return};
    if(e.target.id == "choose_x_btn"){You.symbol = "X";Computer.symbol="O";};
    if(e.target.id == "choose_o_btn"){You.symbol = "O";Computer.symbol="X";};
    start_div.removeChild(choose_the_symbol)
    start_div.removeChild(choose_x_btn);
    start_div.removeChild(choose_o_btn);
    start_div.appendChild(choose_the_starter);
    start_div.appendChild(yes_btn);
    start_div.appendChild(no_btn);
}

function chooseTheStarter (e) {
    if(e.target.id != "yes_btn" && e.target.id != "no_btn"){return};
    if(e.target.id == "yes_btn"){You.isYourTurn = true;};
    if(e.target.id == "no_btn"){Computer.isYourTurn = true};
    start_div.removeChild(choose_the_starter);
    start_div.removeChild(yes_btn);
    start_div.removeChild(no_btn);
    start_div.appendChild(difficulty_div);
    start_div.appendChild(easy_btn);
    start_div.appendChild(medium_btn);
    start_div.appendChild(hard_btn);
    start_div.appendChild(impossible_btn);
}

function chooseTheDifficulty (e) {
    let target = e.target;
    let id = target.id ;
    if(id != "easy_btn" && id != "medium_btn" && id != "hard_btn" && id != "impossible_btn"){return};
    if(id == "easy_btn") {GameBoard.difficulty ="easy"}
else if (id == "medium_btn") {GameBoard.difficulty ="medium"}
    else if (id == "hard_btn") {GameBoard.difficulty ="hard"}
    else if (id == "impossible_btn") {GameBoard.difficulty ="impossible"};
    start_div.removeChild(difficulty_div);
    start_div.removeChild(easy_btn);
    start_div.removeChild(medium_btn);
    start_div.removeChild(hard_btn);
    start_div.removeChild(impossible_btn);
    start_div.innerHTML = "In game.";
    GameBoard.inGame = true; 
    GameBoard.playGame();
    console.log(JSON.parse(JSON.stringify(GameBoard.game_table)));
}


window.addEventListener("click",start);
window.addEventListener("click",chooseTheSymbol);
window.addEventListener("click",chooseTheStarter);
window.addEventListener("click",chooseTheDifficulty);


// ------------------------OBJECTS-----------------------------

//-------------------------GameBoard----------------------------

let  GameBoard = (()=> {
    let inGame = false;
    let game_table = [["","",""],["","",""],["","",""]]; 
    let empty_cells = 9; 
    let difficulty = ""; 

    let resetGameBoard = () => {
        for(let i=0; i<3; i++){
            for(let j=0; j<3; j++){
                game_table[i][j]="";
                document.getElementById("cell_"+i+"-"+j).setAttribute("full",false);
                document.getElementById("cell_"+i+"-"+j).innerHTML="";
            };
        };
        empty_cells=9;
        inGame=false;
        difficulty = undefined;
    };

    let addToWindow =  (i,j,sym) => {
        document.getElementById("cell_"+i+"-"+j).innerHTML=sym;
        document.getElementById("cell_"+i+"-"+j).setAttribute("full",true);
    }


    let checkGlobalVictory = () => {
        console.log("checkGlobalVictory");
        console.log(JSON.parse(JSON.stringify(game_table)));
        if(You.isYourTurn){
            window.removeEventListener("click",You.play);
            if(checkVictoryDirectly(game_table,You.symbol)) {endGame(true,false)} 
            else if (empty_cells==0){endGame(false,false)} //empty_cells
            else {changeTurn() ; playGame()};
        } else {
            if(checkVictoryDirectly(game_table,Computer.symbol)) {endGame(false,true)} 
            else if(empty_cells==0){endGame(false,false)} //empty_cells
            else {changeTurn(); playGame()};
        }; 
    };

    let addPlay = (rowPlay,colPlay,sym) => {
        console.log("addPlay");
        game_table[rowPlay][colPlay] = sym ; 
        console.log(JSON.parse(JSON.stringify(game_table)));
        addToWindow(rowPlay,colPlay,sym);
        empty_cells -=1; //empty_cells
        checkGlobalVictory(rowPlay,colPlay);
    };

   

    let changeTurn = () => {
        console.log("cambio turno");
        if(You.isYourTurn){
            You.isYourTurn=false;
            Computer.isYourTurn=true
        } else if (Computer.isYourTurn){
            Computer.isYourTurn = false;
            You.isYourTurn = true; 
        }
    };

    let endGame = (youWin, compWin) => {
        console.log("finish");
        if(youWin){finish_div.innerHTML="You win!"}
        else if (compWin){finish_div.innerHTML="Computer win."}
        else{finish_div.innerHTML="Patta."}
        start_div.innerHTML="";
        start_div.appendChild(finish_div);  
        start_div.appendChild(play_again_btn);
        play_again_btn.addEventListener("click",restart);
    };

    let restart = () => {
        console.log("restart");
        play_again_btn.removeEventListener("click",restart);
        start_div.removeChild(play_again_btn);
        start_div.removeChild(finish_div);
        start_div.appendChild(start_btn);
        You.resetPlayer();
        Computer.resetPlayer();
        resetGameBoard();
    }

    let playGame = () => {
        if(You.isYourTurn){
            console.log("play your turn");
            window.addEventListener("click",You.play);
        } 
        if(Computer.isYourTurn){
            console.log("play comp turn");
            let target = undefined; 
            switch (GameBoard.difficulty){
                case "easy":
                    target = choosePlay(GameBoard.game_table,empty_cells,1);
                    break;
                case "medium":
                    target = choosePlay(GameBoard.game_table,empty_cells,3);
                    break;
                case "hard":
                    target = choosePlay(GameBoard.game_table,empty_cells,5);
                    break;
                case "impossible":
                    target = choosePlay(GameBoard.game_table,empty_cells,7);
                    break;
            }       
            Computer.play(target);
        };
    };

    let addPossiblePlay = (rowPlay,colPlay,sym) => {
        game_table[rowPlay][colPlay] = sym ; 
    }

    let removePossiblePlay = (rowPlay,colPlay) => {
        game_table[rowPlay][colPlay] = "" ; 
    }

    let obj = {inGame,addPlay,game_table,playGame,difficulty,addPossiblePlay,removePossiblePlay};
    return obj;

})();



//--------------------------------- Player -----------------------------------

let  Player = () => {
    let symbol = "";
    let isYourTurn = false;

    function resetPlayer () {
        this.symbol="";
        this.isYourTurn = false;
    };

    let obj = {symbol,isYourTurn,resetPlayer};
    return obj ; 
};

let You = Player ();
let Computer = Player (); 

// -------------------------------- You-----------------------------------

You.play = (e) => {
    // console.log("YouPlay");
    let target = e.target;
    if(target.getAttribute("class")!="cell" || target.getAttribute("full").toString()=="true"){
        return
    };
    let rowPlay = target.getAttribute("cell_row");
    let colPlay = target.getAttribute("cell_col");
    GameBoard.addPlay(rowPlay,colPlay,You.symbol);
};

//---------------------------Computer ---------------------------------------

Computer.play = function (target)  {
    // console.log("ComputerPlay");
    // console.log(target);
    let rowPlay = target[0];
    let colPlay = target[1];
    GameBoard.addPlay(rowPlay,colPlay,Computer.symbol);
};

//-------------------------------Random choice ------------------------------

Computer.randomChoice = () => {
    // console.log("random choice");
    let i=null;
    let j=null;
    let full='true';
    let target=undefined;
    while(full == 'true'){
        i = Math.floor(Math.random()*3); 
        j = Math.floor(Math.random()*3);
        target = GameBoard.game_table[i][j];
        full = target.getAttribute("full");   
        // console.log(target);
        // console.log("full:"+full);
    } 
    return [i,j];
};

//-----------------------------Check the victory ----------------------------------

let checkVictoryDirectly = (tab,sym) => {
    for(let i=0; i<3; i++){
        if(tab[i][0]==sym && tab[i][1]==sym && tab[i][2]==sym){
            return true; 
        };
    };
    for(let j=0; j<3; j++){
        if(tab[0][j]==sym && tab[1][j]==sym && tab[2][j]==sym){
            return true; 
        };
    };
    if(tab[0][0]==sym && tab[1][1]==sym && tab[2][2]==sym){
        return true; 
    };
    if(tab[0][2]==sym && tab[1][1]==sym && tab[2][0]==sym){
        return true; 
    }
    return false;
};



//----------------------------- Minimax ------------------------------------

check = (table) => {
    
    if(checkVictoryDirectly(table,Computer.symbol)){
        return 10;
    }
     
    if(checkVictoryDirectly(table,You.symbol)){
        return -10;
    }

    return 0;
}; 



function minimax (table,depth,isCompTurn,maxDepth){
    let value = check(table);
    if(Math.abs(value)==10){
        return Math.sign(value)*(Math.abs(value)-depth);
    }
    if(depth==maxDepth){return 0}
    if(isCompTurn){
        let a = -Infinity;
        for(let i=0; i<3; i++){
            for(let j=0; j<3; j++){
                if(table[i][j]==""){
                    addPossiblePlay(table,i,j,Computer.symbol);
                    let value = minimax(table,depth+1,false,maxDepth);
                    a = max(a,value);
                    console.log("Il valore assegnato alla mossa "+"("+i+","+j+") e' "+value);
                    console.log("il massimo e' "+a);
                    console.log(JSON.parse(JSON.stringify(table)));
                    removePossiblePlay(table,i,j);
                }
            }
        }
        return a; 
    } else {
        let a = Infinity;
        for(let i=0; i<3; i++){
            for(let j=0; j<3; j++){
                if(table[i][j]==""){
                    addPossiblePlay(table,i,j,You.symbol);
                    let value = minimax(table,depth+1,true,maxDepth);
                    a = min(a,value);
                    console.log("Il valore assegnato alla mossa "+"("+i+","+j+") e' "+value);
                    console.log("il minimo e' "+a);
                    console.log(JSON.parse(JSON.stringify(table)));
                    removePossiblePlay(table,i,j);
                }
            }
        }
        return a; 
    }
}

function choosePlay (table,empty_cells,maxDepth) {
    console.log("empty cells: "+empty_cells);
    let bestValue = -Infinity; 
    let bestMove = [];
    for(let i=0; i<3; i++){
        for(let j=0; j<3; j++){
            if(table[i][j]==""){
                addPossiblePlay(table,i,j,Computer.symbol);
                let value = (minimax(table,8-empty_cells,false,maxDepth));
                removePossiblePlay(table,i,j);
                if (value>bestValue){
                    bestValue=value;
                    bestMove = [i,j];
                }
            }
        }
    }
    return bestMove; 

}

function max (a,b) {
    if (a>=b){return a}
    else {return b}
}

function min (a,b) {
    if (a>=b){return b}
    else {return a}
}


function addPossiblePlay (table,i,j,sym){
    table[i][j] = sym;
}

function removePossiblePlay (table,i,j){
    table[i][j] = "" ;
}

