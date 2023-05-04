loadFont("PixelFont", "assets/fonts/mago1.ttf");
loadFont("PixelFontWide", "assets/fonts/mago3.ttf");
loadFont("Mario", "assets/fonts/SuperMario.ttf");
function loadFont(name, url) {
  var newFont = new FontFace(name, `url(${url})`);
  newFont.load().then(function (loaded) {
    document.fonts.add(loaded);
  }).catch(function (error) {
    return error;
  });
}
let score = 0
let room = 1
let gameSettings;
let saveData
var defaultValues = {
  highScoreEasy: 0,
  highScoreHard: 0,
  highRoomEasy: 0,
  highRoomHard: 0,
  player: 0,

}

//right left up down
let neighbor4Coords = [[0, 1], [0, -1], [-1, 0], [1, 0]]
let neighbor8Coords = [[0, 1], [0, -1], [-1, 0], [1, 0], [-1, -1], [-1, 1], [1, 1], [1, -1]]
let inventoryConfig = [0, 0, 1, 2, 2, 3]
let inventoryMap = {
  0: 5,
  1: 6,
  2: 7,
  3: 8,
  4: 9
}
let inventoryMapUpgrade = {
  0: 10,
  1: 11,
  2: 12,
  3: 13,
  4: 14
}
let inventoryFilled = [{ type: 0, filled: true, image: null, level: 1, strength: 1 }, { type: 0, filled: true, image: null, level: 0, strength: 1 }, { type: 1, filled: false, image: null, level: 0, strength: 0 }, { type: 2, filled: false, image: null, level: 0, strength: 0 }, { type: 2, filled: false, image: null, level: 0, strength: 0 }, { type: 3, filled: false, image: null, level: 0, strength: 0 }]
//////////coin potion sword shield enemy chest key bomb lava bat
//map sizes
let maps = [
  { row: 3, column: 3, tiles: 9, indexes: ['enemy', 'enemy', 'enemy', 'collect', 'collect', 'collect', 'inventory', 'inventory', 'inventory'] },
  { row: 3, column: 4, tiles: 12, indexes: ['enemy', 'enemy', 'enemy', 'enemy', 'trap', 'collect', 'collect', 'collect', 'collect', 'inventory', 'inventory', 'inventory'] },
  { row: 4, column: 4, tiles: 16, indexes: ['enemy', 'enemy', 'enemy', 'enemy', 'enemy', 'collect', 'collect', 'collect', 'collect', 'inventory', 'inventory', 'inventory', 'inventory', 'trap', 'trap', 'trap'] },
  { row: 4, column: 5, tiles: 20, indexes: ['enemy', 'enemy', 'enemy', 'enemy', 'enemy', 'enemy', 'collect', 'collect', 'collect', 'collect', 'inventory', 'inventory', 'inventory', 'inventory', 'trap', 'trap', 'trap', 'trap', 'lava', 'lava'] },

  { row: 6, column: 4, tiles: 24, indexes: ['enemy', 'enemy', 'enemy', 'enemy', 'enemy', 'enemy', 'enemy', 'enemy', 'collect', 'collect', 'collect', 'collect', 'inventory', 'inventory', 'inventory', 'inventory', 'trap', 'trap', 'trap', 'trap', 'trap', 'lava', 'lava', 'lava'] },

  { row: 5, column: 5, tiles: 25, indexes: ['enemy', 'enemy', 'enemy', 'enemy', 'enemy', 'enemy', 'enemy', 'enemy', 'collect', 'collect', 'collect', 'collect', 'collect', 'inventory', 'inventory', 'inventory', 'inventory', 'trap', 'trap', 'trap', 'trap', 'trap', 'lava', 'lava', 'lava'] },
  { row: 5, column: 6, tiles: 30, indexes: ['enemy', 'enemy', 'enemy', 'enemy', 'enemy', 'enemy', 'enemy', 'enemy', 'enemy', 'collect', 'collect', 'collect', 'collect', 'collect', 'collect', 'inventory', 'inventory', 'inventory', 'inventory', 'trap', 'trap', 'trap', 'trap', 'trap', 'trap', 'lava', 'lava', 'lava', 'lava', 'lava'] },
  { row: 6, column: 6, tiles: 36, indexes: ['enemy', 'enemy', 'enemy', 'enemy', 'enemy', 'enemy', 'enemy', 'enemy', 'enemy', 'enemy', 'enemy', 'collect', 'collect', 'collect', 'collect', 'collect', 'collect', 'inventory', 'inventory', 'inventory', 'inventory', 'inventory', 'trap', 'trap', 'trap', 'trap', 'trap', 'trap', 'trap', 'lava', 'lava', 'lava', 'lava', 'lava', 'lava', 'lava'] },
  { row: 8, column: 6, tiles: 48, indexes: ['enemy', 'enemy', 'enemy', 'enemy', 'enemy', 'enemy', 'enemy', 'enemy', 'enemy', 'enemy', 'enemy', 'enemy', 'enemy', 'enemy', 'collect', 'collect', 'collect', 'collect', 'collect', 'collect', 'collect', 'inventory', 'inventory', 'inventory', 'inventory', 'inventory', 'inventory', 'inventory', 'trap', 'trap', 'trap', 'trap', 'trap', 'trap', 'trap', 'trap', 'trap', 'trap', 'lava', 'lava', 'lava', 'lava', 'lava', 'lava', 'lava', 'lava', 'lava', 'lava'] }
  //
]

/* indexes: [
  'enemy', 'enemy', 'enemy', 'enemy', 'enemy', 'enemy',
  'collect', 'collect', 'collect', 'collect',
  'inventory', 'inventory', 'inventory', 'inventory',
  'trap', 'trap', 'trap', 'trap',
  'lava'
] */
// 3x3 = 9  enemy, enemy, enemy, collect, collect, collect, inventory, inventory, inventory,
// 4x3 = 12
// 4x4 = 16
// 5x4 = 20
// 5x6 = 30
// 6x6 = 36
let indexes = {
  collect: [3, 4],
  inventory: [11, 5, 10, 13],
  enemy: [20, 22, 23, 25],
  trap: [27, 17],
  lava: [19],

}
let collectIndexes = [3, 4]
let inventoryIndexs = [11, 5, 10, 13]
let enemyIndexes = [20, 22, 23]
let trapIndexes = [27, 17]
let lavaIndexes = [19]
let portalIndexs = [15]

this.selector = 0
let cardIndexes = [4, 10, 11, 5, 20, 13, 3, 27, 19, 23, 17, 22]
let cardWeights = [40, 20, 25, 20, 15, 3, 5, 10, 0, 0, 15, 20]
let cards = {
  0: {
    name: 'Blank',
    frame: 0,
    canBeAttacked: false,
    canAttack: false,
    hp: 0,
    blocked: false,
    canExplode: false,
    canOpen: false,
    canCollect: false,
    score: 0,
    heart: 0,
    inventory: null
  },
  9: {
    name: 'Door',
    frame: 9,
    canBeAttacked: false,
    canAttack: false,
    hp: 0,
    blocked: false,
    canExplode: false,
    canOpen: false,
    canCollect: true,
    score: 5,
    heart: 0,
    inventory: null
  },
  4: {
    name: 'Coin',
    frame: 4,
    canBeAttacked: false,
    canAttack: false,
    hp: 0,
    blocked: false,
    canExplode: false,
    canOpen: false,
    canCollect: true,
    score: 1,
    heart: 0,
    inventory: null

  },
  10: {
    name: 'Potion',
    frame: 10,
    canBeAttacked: false,
    canAttack: false,
    hp: 0,
    blocked: false,
    canExplode: false,
    canOpen: false,
    canCollect: true,
    score: 1,
    heart: 1,
    inventory: 0
  },
  11: {
    name: 'Basic Sword',
    frame: 11,
    canBeAttacked: false,
    canAttack: false,
    hp: 0,
    blocked: false,
    canExplode: false,
    canOpen: false,
    canCollect: true,
    score: 1,
    heart: 0,
    inventory: 2
  },
  5: {
    name: 'Basic Sheild',
    frame: 5,
    canBeAttacked: false,
    canAttack: false,
    hp: 0,
    blocked: false,
    canExplode: false,
    canOpen: false,
    canCollect: true,
    score: 1,
    heart: 0,
    inventory: 1
  },
  20: {
    name: 'Basic Enemy',
    frame: 20,
    canBeAttacked: true,
    canAttack: false,
    hp: 1,
    blocked: false,
    canExplode: false,
    canOpen: false,
    canCollect: false,
    score: 2,
    heart: 0,
    inventory: null
  },
  13: {
    name: 'Chest',
    frame: 13,
    canBeAttacked: false,
    canAttack: false,
    hp: 0,
    blocked: true,
    canExplode: false,
    canOpen: false,
    canCollect: false,
    score: 2,
    heart: 0,
    inventory: null
  },
  3: {
    name: 'Key',
    frame: 3,
    canBeAttacked: false,
    canAttack: false,
    hp: 0,
    blocked: false,
    canExplode: false,
    canOpen: false,
    canCollect: true,
    score: 1,
    heart: 0,
    inventory: 3
  },
  27: {
    name: 'Bomb',
    frame: 27,
    canBeAttacked: false,
    canAttack: false,
    hp: 0,
    blocked: false,
    canExplode: true,
    canOpen: false,
    canCollect: false,
    score: 1,
    heart: 0,
    inventory: null
  },
  19: {
    name: 'Lava',
    frame: 19,
    canBeAttacked: false,
    canAttack: false,
    hp: 0,
    blocked: false,
    canExplode: false,
    canOpen: false,
    canCollect: false,
    score: 0,
    heart: 0,
    inventory: null
  },
  22: {
    name: 'Spider',
    frame: 22,
    canBeAttacked: true,
    canAttack: false,
    hp: 1,
    blocked: false,
    canExplode: false,
    canOpen: false,
    canCollect: false,
    score: 0,
    heart: 0,
    inventory: null
  },
  23: {
    name: 'Bat',
    frame: 23,
    canBeAttacked: false,
    canAttack: true,
    hp: 1,
    blocked: false,
    canExplode: false,
    canOpen: false,
    canCollect: false,
    score: 0,
    heart: 0,
    inventory: null
  },
  17: {
    name: 'Spike',
    frame: 17,
    canBeAttacked: false,
    canAttack: false,
    hp: 1,
    blocked: false,
    canExplode: false,
    canOpen: false,
    canCollect: false,
    score: 0,
    heart: 0,
    inventory: null
  },
  14: {
    name: 'Portal',
    frame: 14,
    canBeAttacked: false,
    canAttack: false,
    hp: 0,
    blocked: false,
    canExplode: false,
    canOpen: false,
    canCollect: false,
    score: 0,
    heart: 0,
    inventory: null
  },
  25: {
    name: 'Eye',
    frame: 25,
    canBeAttacked: true,
    canAttack: false,
    hp: 1,
    blocked: false,
    canExplode: false,
    canOpen: false,
    canCollect: false,
    score: 0,
    heart: 0,
    inventory: null
  }

}

function weighted_random_(items, weights) {
  var i;

  for (i = 1; i < weights.length; i++)
    weights[i] += weights[i - 1];

  var random = Math.random() * weights[weights.length - 1];

  for (i = 0; i < weights.length; i++)
    if (weights[i] > random)
      break;

  return items[i];
}

function weighted_random(items, weights) {
  let randomArray = [];
  items.forEach((item, index) => {
    var clone = Array(weights[index]).fill(item);
    randomArray.push(...clone);
  });

  return randomArray[~~(Math.random() * randomArray.length)]
}