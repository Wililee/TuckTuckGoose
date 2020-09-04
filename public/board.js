class board {
  constructor(pieces) {
    this.pieces = pieces;
    //the map is the board
    let map = new Map();
    map.set(Colour.W, [...Array(22).keys()]);
    map.set(Colour.B, [...Array(22).keys()]);
    map.set(Colour.R, [...Array(22).keys()]);
    map.set(Colour.Bl, [...Array(22).keys()]);
    map.set(Colour.Y, [...Array(22).keys()]);
    map.set(Colour.G, [...Array(22).keys()]);
    this.map = map;
  }
  //The holes
  /*
        out of start = 17
        regular = 0 - 16
        start = - 1
        home = 18 - 21
        */

  isPieceAtPosition(c, x) {
    for (var p in this.pieces) if (p.c == c && p.x == x) return true;
    return false;
  }

  pieceAtPosition(c, x) {
    for (var p in this.pieces) if (p.c == c && p.x == x) return p;
  }

  nextCol(c) {
    switch (c) {
      case Colour.W:
        return Colour.B;
      case Colour.B:
        return Colour.R;
      case Colour.R:
        return Colour.Bl;
      case Colour.Bl:
        return Colour.Y;
      case Colour.Y:
        return Colour.G;
      case Colour.G:
        return Colour.W;
    }
  }

  previousCol(c) {
    switch (c) {
      case Colour.W:
        return Colour.G;
      case Colour.B:
        return Colour.W;
      case Colour.R:
        return Colour.B;
      case Colour.Bl:
        return Colour.R;
      case Colour.Y:
        return Colour.Bl;
      case Colour.G:
        return Colour.Y;
    }
  }

  findX(p, dx) {
    //own territory
    if (p.colour == p.c) {
      if (p.x == 16)
        if (dx < 0) return p.x + dx;
        else return p.x;
      if (p.x < 16) return p.x + dx;
    }

    return (p.x + dx) % 18;
  }

  findC(p, dx) {
    //own territory
    if (p.colour == p.c) {
      if (p.x + dx < 0) return previousCol(p.c);
      if (p.x < 17) return p.c;
    }

    if (p.x + dx > 36) return nextCol(nextCol(p.c));
    if (p.x + dx > 18) return nextCol(p.c);
  }

  movePiece(p, dx) {
    if (validMove(p, dx)) {
      tempx = this.findX(p, dx);
      p.c = this.findC(p, dx);
      p.x = tempx;
    }
  }

  validMove(p, dx) {
    //collision with own piece in home
    if (p.c == p.colour) {
      if (p.x == 16 && dx > 0) return false;

      if (this.findX(p, dx) > 17) {
        if (this.findX(p, dx) > 21) return false; //if it is more than the thing
        //check if there is a piece that would be there or before it
        for (i = 18; i < this.findX(p, dx); i++)
          if (this.isPieceAtPosition(p.c, i)) return false;
      }
    }
    //if there is a piece that is blocking it
    //if its passing a 17
    if (p.x + dx > 17 && p.c != p.colour) {
      if (
        this.isPieceAtPosition(p.c, 17) &&
        this.pieceAtPosition(p.c, dx).colour == p.c
      )
        return false;
    }

    return true;
  }

  leaveStart(p) {
    //if there is a piece of its own it wont happen
    if (this.isPieceAtPosition(p.colour, 17)) return false;
    p.x == 17;
  }

  swap(p1, p2) {
    temp = p1.x;
    p1.x = p2.x;
    p2.x = temp;
  }

  validSwap(p1, p2) {
    //neither piece cant be in home or start
    if (p1.x == -1 || p2.x == -1 || p1.x > 17 || p2.x > 17) return false;
    return true;
  }
}
