$(function () {
  var x = 0;
  var y = 0;
  var windowX = $(document).width();
  var windowY = $(document).height();
  var doc = $(document);
  const FPS = 10;
  const speed = 1;
  const wall = true;
  // canvas
  const display = document.getElementById('display');
  const ctx = display.getContext('2d');
  var config = ['SNAKE', 'IOMAR', 'TETRIS'];


  // Game Boy color palette
  // http://ooloopa.studio/gameboy-color-palette/

  const COLOR_0 = '#CADC9F';
  const COLOR_1 = '#0f380f';
  const COLOR_2 = '#306230';
  const COLOR_3 = '#8bac0f';
  const COLOR_4 = '#9bbc0f';


  var Apple;
  var g = new Game(wall);
  const gbInput = $(".gb-input")

  const extractButtonName = (id) => {
    return id.replace('-button', '').replace('dpad-', '')
  };

  for (let input of gbInput) {
    const btnName = extractButtonName(input.id);
    input.onclick = (e) => inputs(btnName);
  }

  // using canvas to draw the clicked button names

  setInterval(() => {
    g.setup ?
      g.start(config[g.pointer]) :
      g.menu();
  }, 1000 / FPS);

  function inputs(button) {
    if(button=="select")
    {
      g.reset();
      g.setup=false;
    }
    if (g.setup) {
      g.playingSnake(button);
    } else {
      switch (button) {
        case 'up':
          g.up();
          break;

        case 'down':
          g.down();
          break;

        case 'a':
          g.select();
          break;
      }
    }
  }

  function Game(wall) {
    this.setup = false;
    this.pointer = 0;
    this.STOP = false;
    this.Score = 0;
    this.wall = wall;
    this.pixel = 5;
    this.margin = 1;
    this.screen = new Screen(display.width, display.height - ((this.pixel / 2)) * 20 + this.margin * 20, 0, 0, this.pixel, this.margin, COLOR_2);
    this.snake = new Snake(5, 5, this.screen);
    this.walls;
    this.menuI = new Screen(display.width, ((this.pixel / 2)) + this.margin * 20, 0, display.height - ((this.pixel / 2)) * 20 + this.margin * 20, this.pixel / 2, this.margin, COLOR_2);
    this.filter = new Screen(display.width, display.height, 0, 0, this.pixel / 2, this.margin, COLOR_4);

    Game.prototype.param = function () {
      config[this.pointer] = true ? config[this.pointer] = false : config[this.pointer] = true;
    }

    Game.prototype.select = function () {
      this.setup = true;
    }

    Game.prototype.up = function () {
      this.pointer > 0 ? this.pointer-- : console.log('Already on top');
    }

    Game.prototype.down = function () {
      this.pointer < config.length - 1 ? this.pointer++ : console.log('Already on bottom');
    }

    Game.prototype.playingSnake = function (e) {
      switch (e) {
        case 'left':
          if (g.snake.LastKey != "RIGHT") {
            if (!g.snake.IsMoving === true)
              g.snake.IsMoving = true;
            g.snake.LEFT();
            g.snake.LastKey = "LEFT";
          }
          break;

        case 'up':
          if (g.snake.LastKey != "DOWN") {
            if (!g.snake.IsMoving === true)
              g.snake.IsMoving = true;

            g.snake.UP();
            g.snake.LastKey = "UP";
          }
          break;

        case 'right':
          if (g.snake.LastKey != "LEFT") {
            if (!g.snake.IsMoving === true)
              g.snake.IsMoving = true;

            g.snake.RIGHT();
            g.snake.LastKey = "RIGHT";
          }
          break;

        case 'down':
          if (g.snake.LastKey != "UP") {
            if (!g.snake.IsMoving === true)
              g.snake.IsMoving = true;

            g.snake.DOWN();
            g.snake.LastKey = "DOWN";
          }
          break;

        case 'b':
          g.menuI.Sweap();
        case 'start':
          console.log(g.STOP);
          g.STOP ? g.STOP = false : g.STOP = true;
          break;
      }
    }
  }

  Game.prototype.start = function (cmd) {
    switch (cmd) {
      case config[this.pointer]:
        this.snakeGame();
        break;
    }
  }

  Game.prototype.menu = function () {
    ctx.clearRect(0, 0, display.width, display.height);
    for (var i = 0; i < config.length; i++) //le filtre dans la boucle c'est pour le style :p
    {
      DrawText(0, i * 5, this.screen, config[this.pointer].toUpperCase(), 3);
      this.filter.showTest();
      this.screen.show();
    }
  }


  Game.prototype.snakeGame = function () {
    if (this.STOP) {
      DrawText(Math.floor(this.screen.WorldX.length / 6), Math.floor(this.screen.WorldY.length / 2), this.screen, "PAUSE", 3);
    } else {
      if (this.wall) {
        this.build();
      }
      if (Apple === undefined)
        PlaceApple(this.screen);
      this.paint();
      if (this.snake.eat(Apple)) {
        PlaceApple(this.screen);
        this.Score++;
      }
      if (this.snake.update(this.screen) || this.snake.Collision()) {
        this.reset();
      }
    }
  }

  Game.prototype.reset = function () {
    this.snake = new Snake(getRandomInt(0, this.screen.WorldX.length - 1), getRandomInt(0, this.screen.WorldY.length - 1), this.screen);
    this.Score = 0;
  }


  Game.prototype.build = function () {
    var letter = new Letter(this.screen);
    //letter.write("^",3);
    this.walls = letter;
  }

  Game.prototype.paint = function () {
    ctx.clearRect(0, 0, display.width, display.height);
    this.snake.Draw(this.screen);
    this.screen.SetCoordVisibility(Apple[1], Apple[0], 2);
    //this.wall?this.screen.DrawInGrid(this.walls,0,this.screen.WorldY.length-1):this.wall=false;
    var text = "SCORE " + this.Score;
    DrawText(0, 0, this.menuI, text, 3);
    this.filter.showTest();
    this.screen.show();
    this.menuI.show();
  };

  function DrawText(Y, X, output, Text, color) {
    var letter = new Letter(output);
    var Margin = 0;
    var hitbox = 0;
    var hitboxY = 0;
    var sizeX = 0;
    for (var i = 0; i < Text.length; i++) {
      letter.init(Text[i], color);
      output.DrawInGrid(letter, X, Y + Margin);
      Margin += letter.sizeX + 1;
      if (letter.sizeX / letter.grid.length > hitboxY)
        hitboxY = letter.grid.length / letter.sizeX;
      sizeX += letter.sizeX;
    }
    output.DrawGrid();
    //hitbox=new Array(Margin).fill(new Array(hitboxY).fill(5));
    hitbox = new Array(new Coord(Y, X), new Coord(Y + hitboxY, X + Margin));
    //console.log("X "+hitbox[0].x +" Y "+hitbox[0].y+"    "+ "X "+hitbox[1].x +" Y "+hitbox[1].y  );    
    return hitbox;
  }

  function PlaceApple(screen) {
    Apple = new Array(getRandomInt(0, screen.WorldX.length - 1), getRandomInt(0, screen.WorldY.length - 1));;
  };

  function Screen(X, Y, x, y, pixel, m, color) {
    this.x = x;
    this.y = y;
    this.pixelSize = pixel;
    this.margin = m;
    this.WorldX = new Array(Math.round(X / (pixel + this.margin)));
    this.WorldY = new Array(Math.round(Y / (pixel + this.margin)));
    this.ShowCoord = new Array((this.WorldX.length - 1) * (this.WorldY.length - 1)).fill(-1);
    this.wall;
    this.color = color;
    this.enable = true;

    for (var i = 0; i < this.WorldX.length; i++) {
      this.WorldX[i] = i * pixel + (i) * this.margin;
    }
    for (var i = 0; i < this.WorldY.length; i++) {
      this.WorldY[i] = i * pixel + (i) * this.margin;
    }

    Screen.prototype.IsCoordVisible = function (Y, X) {
      return this.ShowCoord[this.WorldX.length * Y + X];
    };

    Screen.prototype.SetCoordVisibility = function (Y, X, color) {
      this.ShowCoord[this.WorldX.length * Y + X] = color;
    };

    Screen.prototype.Sweap = function () {
      for (var i = 0; i < this.ShowCoord.length; i++) {
        this.ShowCoord[i] = -1;
      }
    }

    Screen.prototype.DrawInGrid = function (img, X, Y) {
      var increment = 0;
      for (var i = 0; i < img.grid.length; i++) {
        if (i % img.sizeX === 0)
          increment++;

        if (img.grid[i] > -1)
          this.ShowCoord[i % img.sizeX + this.WorldX.length * increment + (this.WorldX.length * X + Y)] = img.grid[i];
        //this.ShowCoord[(i%(img.sizeX+1)*increment + (this.WorldX.length * Y + X))]=img.grid[i];
      }
    };

    Screen.prototype.DrawBackgroundText = function (img, X, Y) {
      for (var i = 0; i < img.length; i++) {
        for (var j = 0; j < img.length; j++) {
          this.SetCoordVisibility(X + j, Y + i, img[i][j]);
        }
      }
    };

    Screen.prototype.DrawGrid = function () {
      ctx.fillStyle = this.color;
      for (var i = 0; i < this.WorldY.length; i++) //lines
      {
        for (var j = 0; j < this.WorldX.length; j++) //columns
        {
          //SelectColor(i,j,output);
          if (this.IsCoordVisible(i, j) >= 1) {
            //ctx.fillRect(this.coords[0]+this.WorldX[j],this.coords[1]+ this.WorldY[i], this.pixelSize, this.pixelSize);
            ctx.fillRect(this.WorldX[j] + this.x, this.WorldY[i] + this.y, this.pixelSize, this.pixelSize);
          }
        }
      }
    };

    Screen.prototype.show = function () {
      this.DrawGrid();
      this.Sweap();
    };

    Screen.prototype.showTest = function () {
      ctx.fillStyle = this.color;
      if (this.enable) {
        for (var i = 0; i < this.WorldY.length; i++) //lines
        {
          for (var j = 0; j < this.WorldX.length; j++) //columns
          {
            //SelectColor(i,j,output);
            ctx.fillRect(this.WorldX[j] + 3, this.WorldY[i], this.pixelSize, this.pixelSize);
          }
        }
      }
    };
  }
});