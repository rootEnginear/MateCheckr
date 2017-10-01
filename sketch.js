//--------------------------------------------------
//  § Variable Declaration
//--------------------------------------------------
//  Declare common variables.
//==================================================
var $dimension = 500; //Checkerboard Area Size. The more; more detail (but take more time to render).
var $lightSquareColor = "#FFF";
var $darkSquareColor = "#888";
var $aSideColor = "#FF8";
var $bSideColor = "#F88";
var $aSideKingColor = "#FF0";
var $bSideKingColor = "#F00";
var $hoverColor = "#88F";
var aSide = [], bSide = [], $mouseDownState = false, cnv, terminate;

//--------------------------------------------------
//  § p5.js
//--------------------------------------------------
//  p5.js processes.
//==================================================

function setup() {
  cnv = createCanvas($dimension, $dimension);
  cnv.parent('chckrArea'); //Move board to #chckrArea
  board.setup();
}

function draw() { // Loop
  background(255); // Erase
  board.update();
}

//--------------------------------------------------
//  § Event Listener
//==================================================
function mousePressed() {
  var i;
  if($mouseDownState == false){
    for (i = 0; i < aSide.length; i++) {
      aSide[i].mouseDown();
    }
    for (i = 0; i < bSide.length; i++) {
      bSide[i].mouseDown();
    }
    $mouseDownState = true;
  }
  return false;
}

function mouseReleased() {
  var i;
  if($mouseDownState == true){
    for (i = 0; i < aSide.length; i++) {
      aSide[i].mouseUp();
    }
    for (i = 0; i < bSide.length; i++) {
      bSide[i].mouseUp();
    }
    $mouseDownState = false;
  }
  return false;
}
