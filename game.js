let game;

let gameOptions = {
  tileSize: 70,
  scale: 4,
  offsetX: 50,
  offsetY: 150,
  rows: 3,//6 max
  columns: 3, //7 max
  difficulty: 'hard',
  player: 0
}
let players = [
  { name: 'ELVEN QUEEN', frames: [0, 1] },
  { name: 'KNIGHT', frames: [2, 3] },
  { name: 'DWARF', frames: [4, 5] },
  { name: 'FARMER', frames: [6, 7] }
]
window.onload = function () {
  let gameConfig = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: "thegame",
      width: 600,//300
      height: 1100 //450
    },
    pixelArt: true,
    scene: [preloadGame, startGame, playGame]
  }
  game = new Phaser.Game(gameConfig);
  window.focus();
}
/////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////
class playGame extends Phaser.Scene {
  constructor() {
    super("playGame");
  }
  preload() {


  }
  create() {

    var mapIndex = this.getMapIndex()
    gameOptions.rows = maps[mapIndex].row
    gameOptions.columns = maps[mapIndex].column
    gameOptions.offsetX = (game.config.width - gameOptions.columns * gameOptions.tileSize) / 2
    gameOptions.offsetY = (game.config.height - gameOptions.rows * gameOptions.tileSize) / 2

    this.moving = false
    this.spikeActive = false
    this.cameras.main.setBackgroundColor(0x09013C);


    //let posX = gameOptions.offsetX + gameOptions.tileSize * j + gameOptions.tileSize / 2;
    //let posY = gameOptions.offsetY + gameOptions.tileSize * i + gameOptions.tileSize / 2
    this.top = this.add.image(0, 192, 'top').setOrigin(0, 1).setAlpha(.5).setScale(2)
    this.bottom = this.add.image(0, game.config.height - 192, 'top').setOrigin(0).setAlpha(.5).setScale(2)
    this.back = this.add.image(gameOptions.offsetX - 1, gameOptions.offsetY - 1, 'blank').setOrigin(0).setTint(0x000000);
    this.back.displayWidth = (gameOptions.columns * gameOptions.tileSize) + 2;
    this.back.displayHeight = (gameOptions.rows * gameOptions.tileSize) + 2;



    this.lt = this.add.image(gameOptions.offsetX - 1, gameOptions.offsetY - 1, 'border', 0).setOrigin(1).setTint(0xfafafa);
    this.ct = this.add.image(gameOptions.offsetX - 1, gameOptions.offsetY - 1, 'border', 1).setOrigin(0, 1).setTint(0xfafafa);
    this.ct.displayWidth = (gameOptions.columns * gameOptions.tileSize) + 2

    this.rt = this.add.image(gameOptions.offsetX + (gameOptions.columns * gameOptions.tileSize) + 1, gameOptions.offsetY - 1, 'border', 2).setOrigin(0, 1).setTint(0xfafafa);

    this.lb = this.add.image(gameOptions.offsetX - 1, (gameOptions.offsetY) + (gameOptions.rows * gameOptions.tileSize), 'border', 6).setOrigin(1, 0).setTint(0xfafafa);
    this.cb = this.add.image(gameOptions.offsetX - 1, (gameOptions.offsetY) + (gameOptions.rows * gameOptions.tileSize), 'border', 7).setOrigin(0).setTint(0xfafafa);
    this.cb.displayWidth = (gameOptions.columns * gameOptions.tileSize) + 2

    this.rb = this.add.image(gameOptions.offsetX + (gameOptions.columns * gameOptions.tileSize) + 1, (gameOptions.offsetY) + (gameOptions.rows * gameOptions.tileSize), 'border', 8).setOrigin(0, 0).setTint(0xfafafa);

    this.lm = this.add.image(gameOptions.offsetX - 1, gameOptions.offsetY - 1, 'border', 3).setOrigin(1, 0).setTint(0xfafafa);
    this.lm.displayHeight = (gameOptions.rows * gameOptions.tileSize) + 1

    this.rm = this.add.image(gameOptions.offsetX + (gameOptions.columns * gameOptions.tileSize) + 1, gameOptions.offsetY - 1, 'border', 5).setOrigin(0, 0).setTint(0xfafafa);
    this.rm.displayHeight = (gameOptions.rows * gameOptions.tileSize) + 1

    this.door = { row: 0, column: 0 }



    const config2 = {
      key: 'player_anim',
      frames: this.anims.generateFrameNumbers('player', { frames: players[gameOptions.player].frames }),
      frameRate: 2,
      repeat: -1
    };
    this.anims.create(config2);

    const config3 = {
      key: 'portal_anim',
      frames: this.anims.generateFrameNumbers('cards', { frames: [14, 16] }),
      frameRate: 3,
      repeat: -1
    };
    this.anims.create(config3);
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    this.gameArray = [];
    this.backArray = [];

    var boardIndexs = [...maps[mapIndex].indexes];
    console.log(boardIndexs)
    for (let i = 0; i < gameOptions.rows; i++) {
      this.gameArray[i] = [];
      this.backArray[i] = [];
      for (let j = 0; j < gameOptions.columns; j++) {

        this.gameArray[i][j] = { row: i, column: j, player: false, card: null, cardIndex: null, door: false, empty: false, portal: false, portalNum: null }
        let posX = gameOptions.offsetX + gameOptions.tileSize * j + gameOptions.tileSize / 2;
        let posY = gameOptions.offsetY + gameOptions.tileSize * i + gameOptions.tileSize / 2
        var back = this.add.image(posX, posY, 'cards', 2).setScale(6.4)
        this.backArray[i][j] = back
        //back.displayWidth = 18
        // back.displayHeight = 18
        var thing = Phaser.Math.RND.pick(boardIndexs)// boardIndexs.pop()
        //console.log(thing)
        var values = indexes[thing]
        // console.log(values)
        var ran = Phaser.Math.Between(0, values.length - 1)
        // console.log(values[ran])
        var value = values[ran]
        // var value = weighted_random(cardIndexes, cardWeights)
        // var value = cardIndexes[Phaser.Math.Between(0, cardIndexes.length - 1)]
        var image = this.add.sprite(posX, posY, 'cards', value).setScale(gameOptions.scale)
        this.gameArray[i][j].card = image
        this.gameArray[i][j].cardIndex = value

      }
    }

    this.player = this.add.sprite(0, 0, 'player').setScale(gameOptions.scale).setOrigin(.5, .55)
    this.player.play('player_anim')
    this.addPlayer(0, 2)
    this.addDoor()
    if (room > 3) {
      if (Phaser.Math.Between(1, 100) < 75) {
        this.addPortals()
      }
    } else if (room > 7) {
      this.addPortals()
    }
    // 
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    //inventory
    //inventoryConfig = [0, 0, 1, 2, 2, 3]
    //inventoryFilled = [0,0,0,0,0,0]
    var invOffX = (game.config.width - (80 * inventoryConfig.length - 1)) / 2
    var invOffY = 1000

    for (let i = 0; i < inventoryConfig.length; i++) {
      const item = inventoryConfig[i];
      let posX = invOffX + 80 * i + 80 / 2;
      let posY = invOffY
      var back = this.add.image(posX, invOffY, 'inventory', item).setScale(5)


      inventoryFilled[i].image = back

      if (inventoryFilled[i].filled) {

        inventoryFilled[i].image.setFrame(inventoryMap[inventoryFilled[i].type])
        if (inventoryFilled[i].strength > 1) {
          inventoryFilled[i].image.setFrame(inventoryMapUpgrade[inventoryFilled[i].type])
        }

      }
    }

    // var gameOverText = this.add.text(game.config.width / 2, 25, 'Room: 1', { fontFamily: 'PixelFont', fontSize: '35px', color: '#fafafa', align: 'center' }).setOrigin(.5).setAlpha(1)

    this.roomBack = this.add.image(10, 10, 'blank').setOrigin(0).setTint(0x000000);
    this.roomBack.displayWidth = 350
    this.roomBack.displayHeight = 70
    this.roomText = this.add.bitmapText(20, 12, 'topaz', 'ROOM: ' + room, 50).setOrigin(0).setTint(0xcbf7ff).setAlpha(1);

    this.scoreBack = this.add.image(10, 100, 'blank').setOrigin(0).setTint(0x000000);
    this.scoreBack.displayWidth = 350
    this.scoreBack.displayHeight = 70
    this.scoreText = this.add.bitmapText(20, 103, 'topaz', 'SCORE: ' + score, 50).setOrigin(0).setTint(0xcbf7ff).setAlpha(1);


    const config1 = {
      key: 'burst1',
      frames: 'explosion',
      frameRate: 12,
      repeat: 0
    };
    this.anims.create(config1);
    this.bursts = this.add.group({
      defaultKey: 'explosion',
      maxSize: 30
    });




    this.input.on("pointerup", this.endSwipe, this);

    this.endModal()
    /* this.input.on("pointerdown", this.gemSelect, this);
     this.input.on("pointermove", this.drawPath, this);
     this.input.on("pointerup", this.removeGems, this);
    */
    //this.check = this.add.image(725, 1000, 'check').setScale(.7);
  }
  update() {
  }
  addDoor() {
    var placedB = 0
    while (placedB < 1) {
      var randX = Phaser.Math.Between(0, gameOptions.columns - 1)
      var randY = Phaser.Math.Between(0, gameOptions.rows - 1)
      if (!this.gameArray[randY][randX].player) {
        this.gameArray[randY][randX].card.setFrame(9)
        this.gameArray[randY][randX].door = true
        this.gameArray[randY][randX].cardIndex = 9
        placedB++
      }
    }
  }
  addPortals() {
    var placedB = 0
    while (placedB < 2) {
      var randX = Phaser.Math.Between(0, gameOptions.columns - 1)
      var randY = Phaser.Math.Between(0, gameOptions.rows - 1)
      if (!this.gameArray[randY][randX].portal && !this.gameArray[randY][randX].door && !this.gameArray[randY][randX].player) {
        this.gameArray[randY][randX].card.setFrame(14)
        this.gameArray[randY][randX].portal = true
        this.gameArray[randY][randX].cardIndex = 14
        this.gameArray[randY][randX].portalNum = placedB
        this.gameArray[randY][randX].card.play('portal_anim')
        placedB++
      }
    }
  }
  addPlayer() {
    var placedB = 0
    while (placedB < 1) {
      var randX = Phaser.Math.Between(0, gameOptions.columns - 1)
      var randY = Phaser.Math.Between(0, gameOptions.rows - 1)
      if (!this.gameArray[randY][randX].door) {
        this.gameArray[randY][randX].card.setAlpha(0)
        this.gameArray[randY][randX].card = null
        this.gameArray[randY][randX].player = true
        var pos = this.getPosition(randY, randX)
        this.player.setPosition(pos.x, pos.y)
        this.player.row = randY
        this.player.column = randX
        placedB++
      }
    }
  }
  addPlayer_(row, column) {
    this.gameArray[row][column].card.setAlpha(0)
    this.gameArray[row][column].card = null
    this.gameArray[row][column].player = true
    var pos = this.getPosition(row, column)
    this.player.setPosition(pos.x, pos.y)
    this.player.row = row
    this.player.column = column
  }
  movePlayer(row, column) {

    var isSpike = false
    var isPortal = false
    this.chest = false
    // if (this.moving) { return }
    //this.moving = true
    if (this.isEmpty(row, column)) { return }

    if (this.blocked(row, column)) {
      if (cards[this.gameArray[row][column].cardIndex].name == 'Chest') {
        if (this.findFilledInventory(3)) {
          var kind = Phaser.Math.Between(1, 2)
          this.chest = true
          this.addToInventory(kind, true)
          this.removeInventoryItem(3)
        } else {
          return
        }
      }

    }
    if (this.isPortal(row, column)) {
      var toPortal = this.getPortal(this.gameArray[row][column].portalNum)
      console.log(toPortal)
      var pos = this.getPosition(toPortal.row, toPortal.column)

      this.gameArray[this.player.row][this.player.column].player = false
      this.gameArray[toPortal.row][toPortal.column].player = true
      this.player.row = toPortal.row
      this.player.column = toPortal.column

      var tween = this.tweens.add({
        targets: this.player,
        x: pos.x,
        y: pos.y,
        duration: 75,
        callbackScope: this,
        onComplete: function () {

        }
      })
      return
      isPortal = true
    }
    if (this.isLava(row, column)) {
      this.endGame()
    }
    if (this.isSpike(row, column)) {
      isSpike = true

      if (this.spikeActive) {
        this.takeDamage(false)
      }
    }

    if (gameOptions.difficulty == 'hard') {
      if (this.isPortal(this.player.row, this.player.column)) {

      } else {
        this.gameArray[this.player.row][this.player.column].empty = true
        //this.backArray[this.player.row][this.player.column].setFrame(1)
        var cardtween = this.tweens.add({
          targets: this.backArray[this.player.row][this.player.column],
          alpha: 0,
          duration: 400,
        })
      }

    }
    if (this.isBomb(row, column)) {
      this.explode(row, column)
      for (let i = 0; i < neighbor8Coords.length; i++) {
        const neighbor = neighbor8Coords[i];
        if (this.validPick(row + neighbor8Coords[i][0], column + neighbor8Coords[i][1]) && !this.gameArray[row + neighbor8Coords[i][0]][column + neighbor8Coords[i][1]].player && !this.gameArray[row + neighbor8Coords[i][0]][column + neighbor8Coords[i][1]].door && !this.gameArray[row + neighbor8Coords[i][0]][column + neighbor8Coords[i][1]].portal) {
          if (this.gameArray[row + neighbor8Coords[i][0]][column + neighbor8Coords[i][1]].card != null) {
            this.gameArray[row + neighbor8Coords[i][0]][column + neighbor8Coords[i][1]].card.setAlpha(0)
            this.gameArray[row + neighbor8Coords[i][0]][column + neighbor8Coords[i][1]].card = null
            this.gameArray[row + neighbor8Coords[i][0]][column + neighbor8Coords[i][1]].cardIndex = 0
          }

        }
      }
    }
    this.gameArray[this.player.row][this.player.column].player = false
    if (this.gameArray[row][column].card != null) {
      score += this.getScore(row, column)
      this.scoreText.setText('SCORE: ' + score)
      if (this.isInventoryItem(row, column)) {
        var type = this.getInventoryType(row, column)
        this.addToInventory(type, false)
      }

      if (this.isEnemy(row, column)) {
        console.log('enemy')
        this.explode(row, column)
        //if there is a sword
        var value = this.gameArray[row][column].cardIndex
        if (value == 25) {
          this.takeDamage(true)
        } else {
          this.takeDamage(false)
        }


        //else if there is a sheild
        //else if there is a heart
        //else die
      }


      if (this.gameArray[row][column].door) {

        room++
        this.scene.restart()
      }
      if (!isSpike && !isPortal) {
        var cardtween = this.tweens.add({
          targets: this.gameArray[row][column].card,
          y: '-=64',
          alpha: 0,
          duration: 500,

        })
        this.gameArray[row][column].card = null
        this.gameArray[row][column].cardIndex = 0
      }

    }

    this.gameArray[row][column].player = true

    var pos = this.getPosition(row, column)
    //this.player.setPosition(pos.x, pos.y)
    var tween = this.tweens.add({
      targets: this.player,
      x: pos.x,
      y: pos.y,
      duration: 75,
      callbackScope: this,
      onComplete: function () {

      }
    })


    this.player.row = row
    this.player.column = column
    var bat = this.checkForBat(row, column)
    if (bat) {
      //right left up down
      if (bat.direction == 0) {
        console.log('right')
      } else if (bat.direction == 1) {
        console.log('left')
      } else if (bat.direction == 2) {
        console.log('up')
      } else if (bat.direction == 3) {
        console.log('down')
      }
      var pos = this.getPosition(row, column)
      var tween = this.tweens.add({
        targets: this.gameArray[bat.row][bat.column].card,
        x: pos.x,
        y: pos.y,
        duration: 150,
        delay: 100,
        callbackScope: this,
        onComplete: function () {
          this.explode(bat.row, bat.column)
          this.gameArray[bat.row][bat.column].card.setAlpha(0)
          this.gameArray[bat.row][bat.column].card = null
          this.gameArray[bat.row][bat.column].cardIndex = 0
          this.takeDamage(false)
          this.moving = false
        }
      })

    } else {
      this.moving = false
    }
    if (this.spikeActive) {
      this.spikeActive = false
      this.activateSpikes()
    } else {
      this.spikeActive = true
      this.activateSpikes()
    }

    isSpike = false
    isPortal = false
  }
  takeDamage(heartOnly) {
    if (heartOnly) {
      if (this.findFilledInventory(0)) {
        this.removeInventoryItem(0)
      } else {
        // this.scene.stop()
        //  this.scene.start("startGame");
        this.endGame()
      }
    } else {
      if (this.findFilledInventory(2)) {
        //
        this.removeInventoryItem(2)
      } else if (this.findFilledInventory(1)) {
        //
        this.removeInventoryItem(1)
      } else if (this.findFilledInventory(0)) {
        this.removeInventoryItem(0)
      } else {
        // this.scene.stop()
        //  this.scene.start("startGame");
        this.endGame()
      }
    }




  }
  getPosition(row, column) {
    let posX = gameOptions.offsetX + gameOptions.tileSize * column + gameOptions.tileSize / 2;
    let posY = gameOptions.offsetY + gameOptions.tileSize * row + gameOptions.tileSize / 2
    return { x: posX, y: posY }
  }
  endSwipe(e) {
    //if (this.moving) { return }
    var swipeTime = e.upTime - e.downTime;
    var swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY);
    var swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe);
    var swipeNormal = new Phaser.Geom.Point(swipe.x / swipeMagnitude, swipe.y / swipeMagnitude);
    if (swipeMagnitude > 20 && swipeTime < 1000 && (Math.abs(swipeNormal.y) > 0.8 || Math.abs(swipeNormal.x) > 0.8)) {

      if (swipeNormal.x > 0.8) {
        console.log('move right')
        if (this.validPick(this.player.row, this.player.column + 1)) {
          this.movePlayer(this.player.row, this.player.column + 1)

        }

      }
      if (swipeNormal.x < -0.8) {
        console.log('move left')
        if (this.validPick(this.player.row, this.player.column - 1)) {
          this.movePlayer(this.player.row, this.player.column - 1)

        }
      }
      if (swipeNormal.y > 0.8) {
        console.log('move down')
        if (this.validPick(this.player.row + 1, this.player.column)) {
          this.movePlayer(this.player.row + 1, this.player.column)

        }
      }
      if (swipeNormal.y < -0.8) {
        console.log('move up')
        if (this.validPick(this.player.row - 1, this.player.column)) {
          this.movePlayer(this.player.row - 1, this.player.column)

        }
      }
    }
  }
  checkForBat(row, column) {
    //right left up down
    for (let i = 0; i < neighbor4Coords.length; i++) {
      const neighbor = neighbor4Coords[i];
      if (this.validPick(row + neighbor4Coords[i][0], column + neighbor4Coords[i][1]) && this.gameArray[row + neighbor4Coords[i][0]][column + neighbor4Coords[i][1]].card != null) {

        if (cards[this.gameArray[row + neighbor4Coords[i][0]][column + neighbor4Coords[i][1]].cardIndex].canAttack) {
          return { row: row + neighbor4Coords[i][0], column: column + neighbor4Coords[i][1], direction: i }
        }



      }
    }
    return false
  }
  activateSpikes() {
    for (let i = 0; i < gameOptions.rows; i++) {
      for (let j = 0; j < gameOptions.columns; j++) {
        var value = this.gameArray[i][j].cardIndex
        if (this.gameArray[i][j].card != null) {
          if (cards[value].name == 'Spike') {
            if (this.spikeActive) {
              this.gameArray[i][j].card.setFrame(18)
            } else {
              this.gameArray[i][j].card.setFrame(17)
            }
          }
        }

      }
    }
  }
  getScore(row, column) {
    var value = this.gameArray[row][column].cardIndex
    return cards[value].score
  }
  addToInventory(type, upgrade) {
    if (!upgrade) {
      var slot = this.findEmptyInventory(type)
      if (slot) {
        inventoryFilled[slot].image.setFrame(inventoryMap[type])
        inventoryFilled[slot].filled = true
        inventoryFilled[slot].strength = 1
      }
    } else {
      var slot = this.findFilledInventory(type)
      if (slot) {
        inventoryFilled[slot].image.setFrame(inventoryMapUpgrade[type])
        inventoryFilled[slot].strength++
      } else {
        var slot = this.findEmptyInventory(type)
        if (slot) {
          inventoryFilled[slot].image.setAlpha(1)
          inventoryFilled[slot].filled = true
          inventoryFilled[slot].image.setFrame(inventoryMapUpgrade[type])
          inventoryFilled[slot].strength = 2
        }
      }
    }

  }
  removeInventoryItem(type, upgrade) {
    var slot = this.findFilledInventory(type)
    if (inventoryFilled[slot].strength > 1) {

      inventoryFilled[slot].image.setFrame(inventoryMap[type])
      inventoryFilled[slot].strength--
    } else {
      inventoryFilled[slot].filled = false
      inventoryFilled[slot].image.setFrame(type)
      inventoryFilled[slot].strength--
    }

  }
  isInventoryItem(row, column) {
    var value = this.gameArray[row][column].cardIndex
    return cards[value].inventory != null
  }
  isEnemy(row, column) {
    var value = this.gameArray[row][column].cardIndex
    return cards[value].canBeAttacked
  }
  isBomb(row, column) {
    var value = this.gameArray[row][column].cardIndex
    return cards[value].canExplode
  }
  isLava(row, column) {
    var value = this.gameArray[row][column].cardIndex
    return cards[value].name == 'Lava'
  }
  isSpike(row, column) {
    var value = this.gameArray[row][column].cardIndex
    return cards[value].name == 'Spike'
  }
  isPortal(row, column) {
    var value = this.gameArray[row][column].cardIndex
    return cards[value].name == 'Portal'
  }
  getPortal(num) {
    for (let i = 0; i < gameOptions.rows; i++) {
      for (let j = 0; j < gameOptions.columns; j++) {
        var value = this.gameArray[i][j].cardIndex
        if (this.gameArray[i][j].card != null) {
          if (this.gameArray[i][j].portal) {
            if (this.gameArray[i][j].portalNum != num) {
              return { row: i, column: j }
            }
          }
        }

      }
    }
  }
  getInventoryType(row, column) {
    var value = this.gameArray[row][column].cardIndex
    if (cards[value].inventory != null) {
      return cards[value].inventory
    }

  }

  findEmptyInventory(type) {
    for (let i = 0; i < inventoryFilled.length; i++) {
      const item = inventoryFilled[i];
      if (!item.filled && item.type == type) {
        return i
      }

    }
    return false
  }
  findFilledInventory(type) {
    //returns array index
    for (let i = inventoryFilled.length - 1; i >= 0; i--) {
      const item = inventoryFilled[i];

      if (item.filled && item.type == type) {

        return i
      }

    }
    return false
  }
  blocked(row, column) {
    var value = this.gameArray[row][column].cardIndex
    return cards[value].blocked
  }
  isEmpty(row, column) {

    return this.gameArray[row][column].empty
  }
  validPick(row, column) {
    return row >= 0 && row < gameOptions.rows && column >= 0 && column < gameOptions.columns && this.gameArray[row] != undefined && this.gameArray[row][column] != undefined;
  }
  explode(row, column) {
    // let posX = this.xOffset + this.dotSize * x + this.dotSize / 2;
    // let posY = this.yOffset + this.dotSize * y + this.dotSize / 2
    var explosion = this.bursts.get().setActive(true);

    // Place the explosion on the screen, and play the animation.
    explosion.setOrigin(0.5, 0.5).setScale(gameOptions.scale).setDepth(3);
    var pos = this.getPosition(row, column)
    explosion.setPosition(pos.x, pos.y)
    explosion.play('burst1');
    explosion.on('animationcomplete', function () {
      explosion.setActive(false);
      explosion.setPosition(-64, -64)
    }, this);
  }
  endGame() {
    if (gameOptions.difficulty == 'hard') {
      if (score > saveData.highScoreHard) {
        saveData.highScoreHard = score
      }
      if (room > saveData.highRoomHard) {
        saveData.highRoomHard = room
      }
    } else {
      if (score > saveData.highScoreEasy) {
        saveData.highScoreEasy = score
      }
      if (room > saveData.highRoomEasy) {
        saveData.highRoomEasy = room
      }
    }

    localStorage.setItem('BHsave', JSON.stringify(saveData));
    this.top.setDepth(100).setAlpha(1)
    this.bottom.setDepth(100).setAlpha(1)
    var tweenT = this.tweens.add({
      targets: this.top,
      y: game.config.height / 2,
      duration: 750
    })
    var tweenT = this.tweens.add({
      targets: this.bottom,
      y: game.config.height / 2,
      duration: 750,
      callbackScope: this,
      onComplete: function () {
        this.modal.setAlpha(1)

      }
    })

  }
  getMapIndex() {
    // return 4
    if (room <= 3) {
      return 0
    } else if (room <= 7) {
      return Phaser.Math.Between(0, 2)
    } else if (room <= 10) {
      return Phaser.Math.Between(1, 4)
    } else {
      return Phaser.Math.Between(2, maps.length - 1)
    }
  }
  endModal() {
    var modalWidth = 400
    var modalHeight = 300
    this.modal = this.add.group()
    var modalBack = this.add.image(game.config.width / 2, game.config.height / 2, 'blank').setTint(0x000000)
    this.modal.add(modalBack)
    modalBack.displayWidth = modalWidth
    modalBack.displayHeight = modalHeight
    var topLeftCorderX = (game.config.width - modalWidth) / 2
    var topLeftCorderY = (game.config.height - modalHeight) / 2

    var topRightCorderX = ((game.config.width - modalWidth) / 2) + modalWidth
    var topRightCorderY = ((game.config.height - modalHeight) / 2)


    var bottomLeftCorderX = ((game.config.width - modalWidth) / 2)
    var bottomLeftCorderY = ((game.config.height - modalHeight) / 2) + modalHeight

    var bottomRightCorderX = ((game.config.width - modalWidth) / 2) + modalWidth
    var bottomRightCorderY = ((game.config.height - modalHeight) / 2) + modalHeight

    var lt = this.add.image(topLeftCorderX, topLeftCorderY, 'border', 0).setOrigin(1).setTint(0xfafafa);
    this.modal.add(lt)
    var ct = this.add.image(topLeftCorderX, topLeftCorderY, 'border', 1).setOrigin(0, 1).setTint(0xfafafa);
    this.modal.add(ct)
    ct.displayWidth = modalWidth
    var rt = this.add.image(topRightCorderX, topRightCorderY, 'border', 2).setOrigin(0, 1).setTint(0xfafafa);
    this.modal.add(rt)
    var cb = this.add.image(bottomLeftCorderX, bottomLeftCorderY, 'border', 7).setOrigin(0).setTint(0xfafafa);
    this.modal.add(cb)
    cb.displayWidth = modalWidth

    var lb = this.add.image(bottomLeftCorderX, bottomLeftCorderY, 'border', 6).setOrigin(1, 0).setTint(0xfafafa);
    this.modal.add(lb)
    var rb = this.add.image(bottomRightCorderX, bottomRightCorderY, 'border', 8).setOrigin(0, 0).setTint(0xfafafa);
    this.modal.add(rb)

    var lm = this.add.image(topLeftCorderX, topLeftCorderY, 'border', 3).setOrigin(1, 0).setTint(0xfafafa);
    this.modal.add(lm)
    lm.displayHeight = modalHeight

    var rm = this.add.image(topRightCorderX, topRightCorderY, 'border', 5).setOrigin(0, 0).setTint(0xfafafa);
    this.modal.add(rm)
    rm.displayHeight = modalHeight



    var restartText = this.add.bitmapText(game.config.width / 2, game.config.height / 2 - 75, 'topaz', 'RESTART', 55).setOrigin(.5).setTint(0xcbf7ff).setAlpha(1).setInteractive();
    this.modal.add(restartText)
    restartText.on('pointerdown', function () {
      inventoryFilled = []
      inventoryFilled = [{ type: 0, filled: true, image: null, level: 1, strength: 1 }, { type: 0, filled: true, image: null, level: 0, strength: 1 }, { type: 1, filled: false, image: null, level: 0, strength: 0 }, { type: 2, filled: false, image: null, level: 0, strength: 0 }, { type: 2, filled: false, image: null, level: 0, strength: 0 }, { type: 3, filled: false, image: null, level: 0, strength: 0 }]
      score = 0
      room = 1
      this.scene.restart()
    }, this)


    var homeText = this.add.bitmapText(game.config.width / 2, game.config.height / 2 + 75, 'topaz', 'HOME', 55).setOrigin(.5).setTint(0xcbf7ff).setAlpha(1).setInteractive();
    this.modal.add(homeText)
    homeText.on('pointerdown', function () {

      this.scene.stop()
      this.scene.launch('startGame')
    }, this)


    this.modal.setAlpha(0).setDepth(200)

    /* 
        
 
    
     */
  }
  /* addScore() {
    this.events.emit('score');
  } */
}
