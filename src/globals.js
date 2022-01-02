/////////////////////////////////////////////////////////////////////////////////////
// global variables to hold game data... => eventually ported into database
/////////////////////////////////////////////////////////////////////////////////////
const rackSize = 7;
const gameTiles = createTiles();
// assign tiles to players
let p1Hand = [];
let p2Hand = [];
// various word holders
let boardLetters = [];
let currentWord = [];
let p1Score = 0;
let p2Score = 0;
// control turn playing
let turn = "player1"
let hand
let rack
let tileClass
