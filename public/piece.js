class piece{
    constructor(colour){
        this.colour = colour;
        this.x = -1;
        this.c = colour;
    }

    move(dc, dx){
        this.x = dx;
        this.c = dc;
    }
}