//////////////////////////////////
//Helper functions
//////////////////////////////////
// Get a random index ranging from 0 (inclusive) to max (exclusive).
const getRandomIndex = (max) => Math.floor(Math.random() * max);

// Shuffle an array of cards
export const shuffleCards = (cards) => {
  for (let currentIndex = 0; currentIndex < cards.length; currentIndex += 1) {
    const randomIndex = getRandomIndex(cards.length);
    const randomCard = cards[randomIndex];
    const currentCard = cards[currentIndex];
    cards[currentIndex] = randomCard;
    cards[randomIndex] = currentCard;
  }
  return cards;
};

export const makeDeck = () => {
  const newDeck = [];
  const suits = ["hearts", "diamonds", "clubs", "spades"];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    const currentSuit = suits[suitIndex];
    let suitSymbol = "",
      suitColor = "";

    currentSuit === "hearts"
      ? (suitSymbol = "♥️")
      : currentSuit === "diamonds"
      ? (suitSymbol = "♦")
      : currentSuit === "clubs"
      ? (suitSymbol = "♣")
      : (suitSymbol = "♠");

    currentSuit === "hearts" || currentSuit === "diamonds"
      ? (suitColor = "red")
      : (suitColor = "black");

    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      // By default, the card name is the same as rankCounter
      let cardName = rankCounter;
      if (rankCounter == 1) {
        cardName = "A";
      } else if (rankCounter == 11) {
        cardName = "J";
      } else if (rankCounter == 12) {
        cardName = "Q";
      } else if (rankCounter == 13) {
        cardName = "K";
      }

      // Create a new card with the current name, suit, and rank
      const card = {
        suitPic: suitSymbol,
        suit: currentSuit,
        name: cardName,
        colour: suitColor,
        rank: rankCounter,
      };

      // Add the new card to the deck
      newDeck.push(card);
    }
  }
  return newDeck;
};

// determine winner of deal
export const winner = (p1, p2) => {
  if (p1.rank > p2.rank) {
    return "p1";
  } else if (p2.rank > p1.rank) {
    return "p2";
  } else {
    return "tie";
  }
};
