var empty = "minesweeper_00.png"
var flag = "minesweeper_02.png"
var one = "minesweeper_08.png"
var two = "minesweeper_09.png"
var three = "minesweeper_10.png"
var four = "minesweeper_11.png"
var five = "minesweeper_12.png"
var six = "minesweeper_13.png"
var seven = "minesweeper_14.png"
var eight = "minesweeper_15.png"
var mine = "minesweeper_05.png"
var numbers = {
   1:one,2:two,3:three,4:four,5:five,6:six,7:seven,8:eight
}

var realBoard = []
var visited = []
var numberboard = []
var flags = []
var SIDE = 9
var MINES = 15
var moves = 0
var visitcount = 0
var flagcount = 0
var gameover = false
var winner = false

for(let i=0;i<SIDE;i++) {
   realBoard[i] = []
   visited[i] = []
   numberboard[i] = []
   flags[i] = []
}

var ids = [
   ["00","01","02","03","04","05","06","07","08"],
   ["10","11","12","13","14","15","16","17","18"],
   ["20","21","22","23","24","25","26","27","28"],
   ["30","31","32","33","34","35","36","37","38"],
   ["40","41","42","43","44","45","46","47","48"],
   ["50","51","52","53","54","55","56","57","58"],
   ["60","61","62","63","64","65","66","67","68"],
   ["70","71","72","73","74","75","76","77","78"],
   ["80","81","82","83","84","85","86","87","88"],
];


function setMine() {
   var x = Math.floor((Math.random() * SIDE) + 0)
   var y = Math.floor((Math.random() * SIDE) + 0)
   if(realBoard[x][y] == false) realBoard[x][y] = true;
   else setMine();
}
function createMines() {
   for(var i=0;i<MINES;i++) setMine();
}
function createBoard() {
   for(let i=0;i<SIDE;i++) {
      for(let j=0;j<SIDE;j++) {
         realBoard[i][j] = false;
         visited[i][j] = false;
         flags[i][j] = false
      }
   }
   createMines();
}
function createNumberboard() {
   for(let i=0;i<SIDE;i++) {
      for(let j=0;j<SIDE;j++) {
         numberboard[i][j] = 0
      }
   }
   for(let i=0;i<SIDE;i++) {
      for(let j=0;j<SIDE;j++) {
         if(realBoard[i][j] == true) {
            if((i-1 >= 0) && (realBoard[i-1][j] == false)) numberboard[i-1][j]++;
            if((i-1 >= 0) && (j-1 >= 0) && (realBoard[i-1][j-1] == false)) numberboard[i-1][j-1]++;
            if((i-1 >= 0) && (j+1 < SIDE) && (realBoard[i-1][j+1] == false)) numberboard[i-1][j+1]++;
            if((j-1 >= 0) && (realBoard[i][j-1] == false)) numberboard[i][j-1]++;
            if((j+1 < SIDE) && (realBoard[i][j+1] == false)) numberboard[i][j+1]++;
            if((i+1 < SIDE) && (j-1 >= 0) && (realBoard[i+1][j-1] == false)) numberboard[i+1][j-1]++;
            if((i+1 < SIDE) && (realBoard[i+1][j] == false)) numberboard[i+1][j]++;
            if((i+1 < SIDE) && (j+1 < SIDE) && (realBoard[i+1][j+1] == false)) numberboard[i+1][j+1]++;
         }
      }
   }
}
function adjacent(i,j) {
   if((i >= 0 && i < SIDE) && (j >= 0 && j < SIDE) && (visited[i][j] == false) && (realBoard[i][j] == false)) {
      visited[i][j] = true
      visitcount++;
      let curr = document.getElementById(ids[i][j])
      if(numberboard[i][j] > 0) {
         let num = numberboard[i][j]
         if(num == 1) curr.src=one
         else if(num == 2) curr.src=two
         else if(num == 3) curr.src=three
         else if(num == 4) curr.src=four
         else if(num == 5) curr.src=five
         else if(num == 6) curr.src=six
         else if(num == 7) curr.src=seven
         else if(num == 8) curr.src=eight
      }
      else {
         curr.src = "minesweeper_01.png"
         adjacent(i-1,j);
         adjacent(i-1,j-1);
         adjacent(i-1,j+1);
         adjacent(i,j-1);
         adjacent(i,j+1);
         adjacent(i+1,j-1);
         adjacent(i+1,j);
         adjacent(i+1,j+1);
      }
   }
   else return
}
function changePlayerBoard(idd) {
   var checkBox = document.getElementById("toggler")
   var check = checkBox.checked
   var currentElement = document.getElementById(idd)
   if(check == false && flags[idd[0]][idd[1]] == true && gameover == false) {
      visited[idd[0]][idd[1]] = false
      flags[idd[0]][idd[1]] = false
      // if(realBoard[idd[0]][idd[1]] == false) visitcount--;
      flagcount--;
      currentElement.src = empty
      return
   }
   if(visited[idd[0]][idd[1]] == false && gameover == false) {
      // if(moves == 0 || flagcount >= MINES) check = false
      if(moves == 0) check = false
      if(moves == 0) {
         // do {
         //    realBoard[idd[0]][idd[1]] = false
         //    setMine();
         // }while(realBoard[idd[0]][idd[1]] == true);
         firstTime(parseInt(idd[0]),parseInt(idd[1]))
         createNumberboard();
      }
      else if(realBoard[idd[0]][idd[1]] == true && check == false) {
         gameover = true;
         document.getElementById(ids[idd[0]][idd[1]]).src = "minesweeper_06.png"
         loseBoard(idd[0],idd[1])
         document.getElementById("result_text").innerHTML = "YOU LOSE !!!"
         return
      }
      if(check) {
         currentElement.src = flag
         visited[idd[0]][idd[1]] = true
         flags[idd[0]][idd[1]] = true
         // if(realBoard[idd[0]][idd[1]] == false) visitcount++
         flagcount++
      }
      adjacent(parseInt(idd[0]),parseInt(idd[1]));
      moves++;
      if(visitcount == (SIDE*SIDE - MINES)) {
         gameover = true;
         winBoard()
         document.getElementById("result_text").innerHTML = "YOU WON !!!"
      }
   }
}
function winBoard() {
   for(let i=0;i<SIDE;i++) {
      for(let j=0;j<SIDE;j++) {
         if(realBoard[i][j] == true) {
            document.getElementById(ids[i][j]).src=flag
         }
         else if(numberboard[i][j] > 0) document.getElementById(ids[i][j]).src=numbers[numberboard[i][j]]
         else document.getElementById(ids[i][j]).src = "minesweeper_01.png"
      }
   }
}
function loseBoard(a,b) {
   for(let i=0;i<SIDE;i++) {
      for(let j=0;j<SIDE;j++) {
         if(i == a && j == b) continue
         if(realBoard[i][j] == true) {
            if(flags[i][j] == true) document.getElementById(ids[i][j]).src=flag
            else document.getElementById(ids[i][j]).src=mine
         }
         else if(numberboard[i][j] > 0) document.getElementById(ids[i][j]).src=numbers[numberboard[i][j]]
         else document.getElementById(ids[i][j]).src = "minesweeper_01.png"
      }
   }
}
function firstTime(x,y) {
   while((x>0 && y>0 && realBoard[x-1][y-1] == true) || (x>0 && realBoard[x-1][y]==true) || (x>0 && y<SIDE-1 && realBoard[x-1][y+1] == true) || (y>0 && realBoard[x][y-1] == true) || (realBoard[x][y] == true) || (y<SIDE-1 && realBoard[x][y+1] == true) || (x<SIDE-1 && y>0 && realBoard[x+1][y-1] == true) || (x<SIDE-1 && realBoard[x+1][y] == true) || (x<SIDE-1 && y<SIDE-1 && realBoard[x+1][y+1] == true)) {
      createBoard()
   }
}
function reset() {
   createBoard()
   createNumberboard()
   moves = 0
   flagcount = 0
   gameover = false
   visitcount = 0
   for(let i=0;i<SIDE;i++) {
      for(let j=0;j<SIDE;j++) {
         document.getElementById(ids[i][j]).src = empty
      }
   }
   document.getElementById("result_text").innerHTML = ""
}

createBoard();
createNumberboard();

