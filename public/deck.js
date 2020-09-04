
class deck {
  constructor() {
    this.cards = [];
    for (i = 1; i <= 13; i++) {
      this.cards.push(new card("club", i));
      this.cards.push(new card("heart", i));
      this.cards.push(new card("diamond", i));
      this.cards.push(new card("spade", i));
    }
    this.cards.push("joker", 20);
    this.cards.push("joker", 20);
    this.cards.sort(Math.random() - 0.5);
  }

  draw() {
    return this.cards.pop();
  }

  size() {
    return this.cards.size();
  }

  //add a reset function

}


