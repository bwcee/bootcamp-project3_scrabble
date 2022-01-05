/*-------------------------------------------------- 
create tiles
-----------------------------------------------------*/
/* shuffle tiles */
export const shuffleTiles = (tiles) => {
  for (let i = 0; i < tiles.length; i += 1) {
    const randomIndex = Math.floor(Math.random() * tiles.length);
    const randomCard = tiles[randomIndex];
    const currentCard = tiles[i];
    tiles[i] = randomCard;
    tiles[randomIndex] = currentCard;
  }
  return tiles;
};

/*  create all the tiles */
export const createTiles = () => {
  const tileSpecsArr = [
    { l: "a", s: 1, f: 9 },
    { l: "b", s: 3, f: 2 },
    { l: "c", s: 3, f: 2 },
    { l: "d", s: 2, f: 4 },
    { l: "e", s: 1, f: 12 },
    { l: "f", s: 4, f: 2 },
    { l: "g", s: 2, f: 3 },
    { l: "h", s: 4, f: 2 },
    { l: "i", s: 1, f: 9 },
    { l: "j", s: 8, f: 1 },
    { l: "k", s: 5, f: 1 },
    { l: "l", s: 1, f: 4 },
    { l: "m", s: 3, f: 2 },
    { l: "n", s: 1, f: 6 },
    { l: "o", s: 1, f: 8 },
    { l: "p", s: 3, f: 2 },
    { l: "q", s: 10, f: 1 },
    { l: "r", s: 1, f: 6 },
    { l: "s", s: 1, f: 4 },
    { l: "t", s: 1, f: 6 },
    { l: "u", s: 1, f: 4 },
    { l: "v", s: 4, f: 2 },
    { l: "w", s: 4, f: 2 },
    { l: "x", s: 8, f: 1 },
    { l: "y", s: 4, f: 2 },
    { l: "z", s: 10, f: 1 },
  ];
  const allTiles = [];
  let id = 0;
  for (let i = 0; i < tileSpecsArr.length; i += 1) {
    for (let j = 0; j < tileSpecsArr[i].f; j += 1) {
      allTiles.push({
        tile: tileSpecsArr[i].l,
        pt: tileSpecsArr[i].s,
        id: "t" + (id += 1),
      });
    }
  }
  return shuffleTiles(allTiles);
};

/*-------------------------------------------------- 
tile functions
-----------------------------------------------------*/
const rackSize = 7;
export const deal = (hand, gameTiles) => {
  while (hand.length < rackSize && gameTiles.length > 0) {
    hand.push(gameTiles.pop());
  }
};
