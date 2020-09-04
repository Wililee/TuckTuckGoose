class hand {
  constructor(cards) {
    this.cards = cards;
  }

  remove(c) {
    return this.cards.pop(c);
  }

  hasCard(c) {
    for (i in this.cards) if (i == c) return true;
  }

  addCard(c) {
    this.cards.push(c);
  }
}
