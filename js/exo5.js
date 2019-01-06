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
  var myScreen = new Screen(display.width, display.height, 5, 1);
  var Apple;
  var g = new Game(wall, myScreen);

  // Game Boy color palette
  // http://ooloopa.studio/gameboy-color-palette/

  const COLOR_0 = '#CADC9F';
  const COLOR_1 = '#0f380f';
  const COLOR_2 = '#306230';
  const COLOR_3 = '#8bac0f';
  const COLOR_4 = '#9bbc0f';

  const gbInput = $("#dpad").find('.gb-input');

  const extractButtonName = (id) => {
    return id.replace('-button', '').replace('dpad-', '')
  };

  for (let input of gbInput) {
    const btnName = extractButtonName(input.id);
    console.log(input);
    input.onclick = (e) => inputs(btnName);
  }

  // using canvas to draw the clicked button names

  setInterval(() => {
    g.Start();
  }, 1000 / FPS);

  function inputs(button, e) {
    switch (button) {
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
        
        case 'a':
        console.log(s);
        break;
        }
      }  

  function Game(wall, screen) {
    this.GameCode = "";
    this.STOP = false;
    this.Score = 0;
    this.wall = wall;
    this.screen = screen;
    this.snake=new Snake(5,5,this.screen);
    this.walls= Perlin(20);

    Game.prototype.Start = function () {
      if (Apple === undefined)
        PlaceApple(this.screen);
        this.Paint();
      if (this.snake.eat(Apple)) {
        PlaceApple(this.screen);
        this.Score++;
      }
      if (this.snake.update(this.screen)||this.snake.Collision()) {
        this.reset();    
      }
    }

    Game.prototype.reset= function(){
      this.snake = new Snake(getRandomInt(0, this.screen.WorldX.length - 1), getRandomInt(0, this.screen.WorldY.length - 1), this.screen);
      this.Score = 0;
    }
  }

  Game.prototype.Paint=function() {
    this.screen.Sweap();
    ctx.clearRect(0, 0, display.width, display.height);
    this.snake.Draw(this.screen)
    this.screen.SetCoordVisibility(Apple[1], Apple[0], 2);
    this.screen.show();
  };


  function PlaceApple(screen) {
    Apple = new Array(getRandomInt(0, screen.WorldX.length - 1), getRandomInt(0, screen.WorldY.length - 1));;
  };


  function Screen(X, Y, pixel, m) {
    this.pixelSize = pixel;
    this.margin = m;
    this.WorldX = new Array(Math.round(X / (pixel + this.margin)));
    this.WorldY = new Array(Math.round(Y / (pixel + this.margin)));
    this.ShowCoord = new Array((this.WorldX.length - 1) * (this.WorldY.length - 1)).fill(-1);
    this.wall;
    for (var i = 0; i < this.WorldX.length; i++) {
      this.WorldX[i] = i * pixel + (i) * this.margin;
    }
    for (var i = 0; i < this.WorldY.length; i++) {
      this.WorldY[i] = i * pixel + (i) * this.margin;
    }

    Screen.prototype.IsCoordVisible = function (X, Y) {
      return this.ShowCoord[this.WorldX.length * Y + X];
    };

    Screen.prototype.SetCoordVisibility = function (X, Y, color) {
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
    ctx.fillStyle = COLOR_2;
    for (var i = 0; i < this.WorldY.length; i++) //lines
    {
      for (var j = 0; j < this.WorldX.length; j++) //columns
      {
        //SelectColor(i,j,output);          
        if (this.IsCoordVisible(i, j) >= 1) {
          ctx.fillRect(this.WorldX[j], this.WorldY[i], this.pixelSize, this.pixelSize);
        }
      }
    }
  };

  Screen.prototype.show = function () {
    this.DrawGrid();
    this.Sweap();
  };

  Screen.prototype.showTest = function () {
    ctx.fillStyle = COLOR_2;
    for (var i = 0; i < this.WorldY.length; i++) //lines
    {
      for (var j = 0; j < this.WorldX.length; j++) //columns
      {
        //SelectColor(i,j,output);          
        ctx.fillRect(this.WorldX[j] + 3, this.WorldY[i], this.pixelSize, this.pixelSize);
      }
    }
  };
}
});