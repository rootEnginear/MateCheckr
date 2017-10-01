//--------------------------------------------------
//  § Board Object
//--------------------------------------------------
//  Contained what it has to do as a checkerboard.
//==================================================
var board = {
  drawBoard: function(){
    var i, j;
    for(i=1;i<=8;i++){ // board always be 8 by 8
      for(j=1;j<=8;j++){
        if((mouseX >= i*$dimension/10 && mouseX <= (i+1)*$dimension/10) && (mouseY >= j*$dimension/10 && mouseY <= (j+1)*$dimension/10) && $mouseDownState == true){
          fill($hoverColor);
        }else if((i%2==1 && j%2==0) || (i%2==0 && j%2==1)){
          fill($darkSquareColor);
        }else{
          fill($lightSquareColor);
        }
        rect(i*$dimension/10,j*$dimension/10,$dimension/10,$dimension/10);
      }
    }
  },
  drawPieces: function(){
    var i;
    for (i = 0; i < aSide.length; i++) {
      if(aSide[i].isFloating()){
        aSide[i].draw(1);
      }else{
        aSide[i].draw();
      }
    }
    for (i = 0; i < bSide.length; i++) {
      if(bSide[i].isFloating()){
        bSide[i].draw(1);
      }else{
        bSide[i].draw();
      }
    }
  },
  setupPieces: function(){
    var i, y;
    for (i = 0; i < 8; i++) { // Setup always set all pieces to 8
      y = i%2==1? $dimension/10:$dimension/10+$dimension/10;
      aSide[i] = new Pieces(i,i*$dimension/10+$dimension/10,y,0);
      bSide[i] = new Pieces(i,i*$dimension/10+$dimension/10,y+6*$dimension/10,1);
    }
    this.drawPieces();
  },
  setup: function(){
    this.drawBoard();
    this.setupPieces();
  },
  updatePieces: function(){
    var i;
    for (i = 0; i < aSide.length; i++) {
      if(aSide[i].isFloating()){
        aSide[i].x = mouseX;
        aSide[i].y = mouseY;
      }
    }
    for (i = 0; i < bSide.length; i++) {
      if(bSide[i].isFloating()){
        bSide[i].x = mouseX;
        bSide[i].y = mouseY;
      }
    }
    this.drawPieces();
  },
  update: function(){
    this.drawBoard();
    this.updatePieces();
    // chkWin
    if (terminate != 1) {
      if(aSide.length == 0){
        alert("ฝ่าย B เป็นฝ่ายชนะ");
        addScore(1);
        if(confirm("ต้องการเล่นต่อหรือไม่?")){
          this.kill();
          this.setup();
        }else{
          terminate = 1;
        }
      }else if(bSide.length == 0){
        alert("ฝ่าย A เป็นฝ่ายชนะ");
        addScore(0);
        if(confirm("ต้องการเล่นต่อหรือไม่?")){
          this.kill();
          this.setup();
        }else{
          terminate = 1;
        }
      }
    }
  },
  kill: function(){
    aSide = [];
    bSide = [];
  }
}
