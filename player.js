class player {
    constructor(hand, colour, partner){
        this.hand = hand;
        this.colour = colour;
        this.partner = partner
    }

    setHand(newHand){ this.hand = newHand;}
    removeCard(card){ this.hand.remove(card);}

}