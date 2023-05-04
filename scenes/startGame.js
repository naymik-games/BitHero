class startGame extends Phaser.Scene {
  constructor() {
    super("startGame");
  }
  preload() {
    //this.load.bitmapFont('atari', 'assets/fonts/atari-smooth.png', 'assets/fonts/atari-smooth.xml');
    // this.load.bitmapFont('atari', 'assets/fonts/Lato_0.png', 'assets/fonts/lato.xml');

  }
  create() {
    gameOptions.difficulty = 'easy'
    gameOptions.player = 0
    saveData = JSON.parse(localStorage.getItem('BHsave'));
    if (saveData === null || saveData.length <= 0) {
      localStorage.setItem('BHsave', JSON.stringify(defaultValues));
      saveData = defaultValues;
    }

    this.cameras.main.setBackgroundColor(0x000000);

    this.top = this.add.image(0, 192, 'top').setOrigin(0, 1).setAlpha(.5).setScale(2)
    this.bottom = this.add.image(0, game.config.height - 192, 'top').setOrigin(0).setAlpha(.5).setScale(2)
    var modalWidth = 450
    var modalHeight = 600
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



    this.roomBack = this.add.image(10, 10, 'blank').setOrigin(0).setTint(0x000000);
    this.roomBack.displayWidth = 350
    this.roomBack.displayHeight = 70
    this.roomText = this.add.bitmapText(20, 12, 'topaz', 'ROOM: ' + saveData.highRoomEasy, 50).setOrigin(0).setTint(0xcbf7ff).setAlpha(1);

    this.scoreBack = this.add.image(10, 100, 'blank').setOrigin(0).setTint(0x000000);
    this.scoreBack.displayWidth = 350
    this.scoreBack.displayHeight = 70
    this.scoreText = this.add.bitmapText(20, 103, 'topaz', 'SCORE: ' + saveData.highScoreEasy, 50).setOrigin(0).setTint(0xcbf7ff).setAlpha(1);
    this.bestText = this.add.bitmapText(game.config.width * .75, 75, 'topaz', 'BEST', 35).setOrigin(.5).setTint(0xfafafa).setAlpha(1).setInteractive();



    this.modeText = this.add.bitmapText(game.config.width / 2, game.config.height / 2 + 25, 'topaz', 'DIFFICULTY', 35).setOrigin(.5).setTint(0xfafafa).setAlpha(1).setInteractive();

    this.diffBack = this.add.image(10, 10, 'blank').setOrigin(.5).setTint(0x333333);
    this.diffBack.displayWidth = 115
    this.diffBack.displayHeight = 60
    this.easytText = this.add.bitmapText(game.config.width / 2 - 75, game.config.height / 2 + 100, 'topaz', 'EASY', 50).setOrigin(.5).setTint(0xcbf7ff).setAlpha(1).setInteractive();
    this.modal.add(this.easytText)
    this.hardText = this.add.bitmapText(game.config.width / 2 + 75, game.config.height / 2 + 100, 'topaz', 'HARD', 50).setOrigin(.5).setTint(0xcbf7ff).setAlpha(1).setInteractive();
    this.modal.add(this.hardText)
    this.diffBack.setPosition(this.easytText.x, this.easytText.y + 5)

    this.easytText.on('pointerdown', this.clickHandler, this);
    this.hardText.on('pointerdown', this.clickHandler2, this);

    this.goToText = this.add.bitmapText(game.config.width / 2, game.config.height / 2 + 200, 'topaz', 'PLAY', 50).setOrigin(.5).setTint(0xcbf7ff).setAlpha(1).setInteractive();
    this.goToText.on('pointerdown', this.goToGame, this)

    this.titleBack = this.add.image(game.config.width / 2, 975 + 10, 'blank').setOrigin(.5).setTint(0x000000);
    this.titleBack.displayWidth = 350
    this.titleBack.displayHeight = 90
    this.titleText = this.add.bitmapText(game.config.width / 2, 975, 'topaz', 'BIT HERO', 70).setOrigin(.5).setTint(0xcbf7ff).setAlpha(1);


    this.playerBack = this.add.image(10, 10, 'blank').setOrigin(.5).setTint(0x333333);
    this.playerBack.displayWidth = 19 * 5
    this.playerBack.displayHeight = 19 * 5


    this.playerText = this.add.bitmapText(game.config.width / 2, game.config.height / 2 - 180, 'topaz', '', 35).setOrigin(.5).setTint(0xfafafa).setAlpha(1).setInteractive();

    this.playerMenu = []
    var ts = 5 * 20
    var os = (game.config.width - (players.length * ts)) / 2
    for (var i = 0; i < players.length; i++) {
      var player = this.add.sprite(os + (i * ts) + ts / 2, game.config.height / 2 - 100, 'player', players[i].frames[0]).setScale(5).setInteractive()
      player.num = i
      player.on('pointerdown', this.playerPress.bind(this, player))
      this.playerMenu.push(player)
    }
    this.playerText.setText(players[this.playerMenu[0].num].name)
    this.playerBack.setPosition(this.playerMenu[0].x, this.playerMenu[0].y + 2)





  }
  playerPress(player) {
    this.playerText.setText(players[player.num].name)
    this.playerBack.setPosition(this.playerMenu[player.num].x, this.playerMenu[player.num].y + 2)
    gameOptions.player = player.num
  }
  clickHandler() {
    gameOptions.difficulty = 'easy'
    this.diffBack.setPosition(this.easytText.x, this.easytText.y + 5)
    this.scoreText.setText('SCORE: ' + saveData.highScoreEasy)
    this.roomText.setText('ROOM: ' + saveData.highRoomEasy)
  }
  clickHandler2() {
    gameOptions.difficulty = 'hard'
    this.diffBack.setPosition(this.hardText.x, this.hardText.y + 5)
    this.scoreText.setText('SCORE: ' + saveData.highScoreHard)
    this.roomText.setText('ROOM: ' + saveData.highRoomHard)
    //this.scene.launch('UI');
  }
  goToGame() {
    score = 0
    room = 1
    gameOptions.rows = maps[0].row
    gameOptions.columns = maps[0].column
    this.scene.start('playGame');
  }

}