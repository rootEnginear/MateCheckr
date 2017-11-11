//--------------------------------------------------
//  § Pieces constructor
//--------------------------------------------------
//  Contained what it has to do as a checker piece.
//==================================================
function Pieces(id,x,y,side){
  this.id = id;
  this.x = x;
  this.y = y;
  this.prevX = x;
  this.prevY = y;
  this.side = side;
  this.floating = false;
  this.king = false;
  this.chkRoute = function(x,y,prevX,prevY){ // get current X,Y return true if possible.
    var i, j, oppositeDir = [2,3,0,1], pntX, pntY;
    // 0. check if in proper square
    x = floor(map(x,0,$dimension,0,10)); // map to 0 - 10
    y = floor(map(y,0,$dimension,0,10));
    if((y == 0 || y >= 9) || (x == 0 || x >= 9) || (x%2  == y%2) /* <- not in dark square */){
      console.log("not in proper square");
      return false;
    }else{
      x = x*$dimension/10;
      y = y*$dimension/10;
    }
    // 1. check if place on friend or enemy (mean that square is not blank)
    for(i=0;i<aSide.length;i++){ // loop for all aSide pieces
      if(aSide[i].x == x && aSide[i].y == y){
        console.log("cell is occupied by aSide");
        return false; // if match mean the cell is occupied so false
      }
    }
    for(i=0;i<bSide.length;i++){ // loop for all bSide pieces
      if(bSide[i].x == x && bSide[i].y == y){
        console.log("cell is occupied by bSide");
        return false; // if match mean the cell is occupied so false
      }
    }
    // 2. check if place to eat enemy
    if(!this.king){
      for(i=0;i<4;i++){ // loop through dir to find enemy from current dir
        if(this.chkEnemy(x,y,this.side,i)!=false){ // if found enemy
          if(this.chkEnemy(prevX,prevY,this.side,oppositeDir[i])!=false){ // also match
            if(this.chkEnemy(prevX,prevY,this.side,oppositeDir[i])==this.chkEnemy(x,y,this.side,i)){
              console.log("eat an enemy");
              return true; // then it means that it is blank and can be placed because it will eat enemy
            }
          }
        }
      }
    }else{

    }
    // 3 check if move forward and only next square (only when not king)
    if(this.king==false){
      // 3.1 check if move forward not backward
      if(this.side==0){ //aside y always +$dimension/10
        if(prevY - y == $dimension/10){
          console.log("no backward");
          return false;
        }
      }else{
        if(y - prevY == $dimension/10){
          console.log("no backward");
          return false;
        }
      }
      // 3.2 check if place on the next diagonal square
      if(dist(x,y,prevX,prevY)==$dimension/10*sqrt(2)){
        console.log("normal move");
        return true;
      }
    }else{
      if(dist(x,y,prevX,y)==dist(x,y,x,prevY)){
        console.log("normal move");
        return true;
      }
    }
    console.log("idk why");
    return false; // or else return false
  };
  this.chkEnemy = function(x,y,side,dir=0){ //return index+1 if found, else return false
    var i, targetX, targetY;
    // dir 0 = top right | dir 1 = bottom right | dir 2 = bottom left | dir 3 = top left
    // set target x,y value from dir
    targetX = (dir == 0) || (dir == 1)? x+$dimension/10 : x-$dimension/10;
    targetY = (dir == 1) || (dir == 2)? y+$dimension/10 : y-$dimension/10;
    // loop through all opposite side array to find out if some enemy has the same target coordinate
    if(side==0){ // aSide check for bSide
      for(i=0;i<bSide.length;i++){
        if(bSide[i].x == targetX && bSide[i].y == targetY){
          return i+1;
        }
      }
    }else{
      for(i=0;i<aSide.length;i++){
        if(aSide[i].x == targetX && aSide[i].y == targetY){
          return i+1;
        }
      }
    }
    return false;
    // if found return its id
    // or else return false
  };
  this.captureEnemy = function(){
    var i, oppositeDir = [2,3,0,1];
    for(i=0;i<4;i++){
      if(this.chkEnemy(this.x,this.y,this.side,i)!=false){ // <- return as number
        //   if true check in the opposite dir of prev position
        if(this.chkEnemy(this.prevX,this.prevY,this.side,oppositeDir[i])!=false){ // <- also return as number
          // also same enemy
          if(this.chkEnemy(this.prevX,this.prevY,this.side,oppositeDir[i])==this.chkEnemy(this.x,this.y,this.side,i)){
            //     if true splice it out
            if(this.side==0){ // aSide splice bSide
              bSide.splice(this.chkEnemy(this.x,this.y,this.side,i)-1,1);
            }else{
              aSide.splice(this.chkEnemy(this.x,this.y,this.side,i)-1,1);
            }
            break;
          }
        }
      }
    }
  };
  this.chkKing = function(){
    if(this.side == 0){ // aSide chk for bottom
      if(this.y == $dimension/10*8){
        return true;
      }
    }else{
      if(this.y == $dimension/10*1){
        return true;
      }
    }
    return false;
  };
  this.isFloating = function(){
    if(this.floating==true){
      return true;
    }else{
      return false;
    }
  };
  this.isMouseOn = function(){
    if(dist(this.x+$dimension/10*0.5,this.y+$dimension/10*0.5,mouseX,mouseY)<=$dimension/20*0.75){
      return true;
    }else{
      return false;
    }
  };
  this.mouseUp = function(){
    var tempX = floor(map(this.x,0,$dimension,0,10))*$dimension/10, tempY = floor(map(this.y,0,$dimension,0,10))*$dimension/10;
    if(this.isFloating()){ // Place
      // always revert position
      this.x = this.prevX;
      this.y = this.prevY;

      if(!this.king){
        // not king normal check
        if(this.chkRoute(tempX,tempY,this.prevX,this.prevY)){
          this.x = tempX;
          this.y = tempY;
        }
      }else{
        var pntX=this.x, pntY=this.y, pntXO=this.x, pntYO=this.y, chkNum=0, forwardX;
        for(i=0;i<(Math.abs(tempX-this.x)/($dimension/10)) && Math.abs(tempX - pntX) > 0 ;i++){
          if(tempX-this.x > 0){ pntX += $dimension/10; forwardX = pntX + $dimension/10; }else{ pntX -= $dimension/10; forwardX = pntX - $dimension/10; }
          if(tempY-this.y > 0){ pntY += $dimension/10; }else{ pntY -= $dimension/10; }
          console.log(forwardX + "" + tempX);
          if(this.side == 1 && forwardX == tempX){
            for(j=0;j<aSide.length;j++){ // loop for all aSide pieces
              if(aSide[j].x == pntX && aSide[j].y == pntY){
                this.prevX = pntXO;
                this.prevY = pntYO;
                if(tempX-this.x > 0){ pntX += $dimension/10; }else{ pntX -= $dimension/10; }
                if(tempY-this.y > 0){ pntY += $dimension/10; }else{ pntY -= $dimension/10; }
                // console.log("found break loop for aSide");
                break;
              }
            }
          }else if(this.side == 0 && forwardX == tempX){
            for(j=0;j<bSide.length;j++){ // loop for all bSide pieces
              if(bSide[j].x == pntX && bSide[j].y == pntY){
                this.prevX = pntXO;
                this.prevY = pntYO;
                if(tempX-this.x > 0){ pntX += $dimension/10; }else{ pntX -= $dimension/10; }
                if(tempY-this.y > 0){ pntY += $dimension/10; }else{ pntY -= $dimension/10; }
                // console.log("found break loop for bSide");
                break;
              }
            }
          }
          if(!this.chkRoute(pntX,pntY,pntXO,pntYO)){
            chkNum++;
          }
          pntXO = pntX;
          pntYO = pntY;
        }
        if(chkNum==0){
          this.x = tempX;
          this.y = tempY;
        }
      }
    }

    if(this.chkKing()){
      this.king = true;
    }

    this.floating = false;
    this.captureEnemy();
  };
  this.mouseDown = function(){
    if(this.isMouseOn()){
      this.prevX = this.x;
      this.prevY = this.y;
      this.floating = true;
    }
  };
  this.draw = function(mode=0){
    var side = this.side == 0? "A" : "B", king = this.king == true? "*": "";
    textSize(16);
    textAlign(CENTER,CENTER);
    textStyle(BOLD);
    if(this.side == 0){
      if(this.king == true){
        fill($aSideKingColor);
      }else{
        fill($aSideColor);
      }
    }else{
      if(this.king == true){
        fill($bSideKingColor);
      }else{
        fill($bSideColor);
      }
    }
    if(mode == 1){
      ellipseMode(CENTER);
      ellipse(this.x, this.y, $dimension/10*0.75);
      fill("#000");
      text(side + king, this.x, this.y);
    }else{
      ellipseMode(CORNER);
      ellipse(this.x + $dimension*0.25/20, this.y + $dimension*0.25/20, $dimension/10*0.75);
      fill("#000");
      text(side + king, this.x + $dimension/20, this.y + $dimension/20);
    }
  };
}
