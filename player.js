class player {
    constructor(hand, colour, partner, pieces){
        this.hand = hand;
        this.colour = colour;
        this.partner = partner;
        this.pieces = pieces;
    }

    setHand(newHand){ this.hand = newHand;}
    removeCard(card){ this.hand.remove(card);}

}