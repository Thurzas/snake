function Snake(X, Y, screen) {
	this.x = Math.floor(X);
	this.y = Math.floor(Y);
	this.xs = 1;
	this.ys = 0;
	this.Size = 0;
	this.body = [];
	this.IsMoving = false;
	this.LastKey = "";
	this.screen = screen;

	Snake.prototype.update = function () {
		res=false;
		if (this.IsMoving === true) {
			for (var i = 0; i < this.body.length - 1; i++) {
				this.body[i] = this.body[i + 1];
			}
			this.body[this.Size - 1] = new Coord(this.x, this.y);
			this.x = this.x + this.xs;
			this.y = this.y + this.ys;
			if (this.x >= this.screen.WorldX.length-1) {
				this.x = 0;
			} else if (this.x < 0) {
				this.x = this.screen.WorldX.length-1;
			}
			if (this.y >= this.screen.WorldY.length-1) {
				this.y = 0;
			} else if (this.y < 0) {
				this.y = this.screen.WorldY.length-1;
			}
			if(this.screen.IsCoordVisible(this.x,this.y)===3){
				res=true;
			}
		}
		return res;
	}
	Snake.prototype.UP = function () {
		this.direction(0, -1);
		this.LastKey = "UP";
	};

	Snake.prototype.DOWN = function () {
		this.direction(0, 1);
		this.LastKey = "DOWN";
	};

	Snake.prototype.LEFT = function () {
		this.direction(-1, 0);
		this.LastKey = "LEFT";
	};

	Snake.prototype.RIGHT = function () {
		this.direction(1, 0);
		this.LastKey = "RIGHT";
	};

	this.Collision = function () {
		var res = false;
		for (var i = 0; i < this.body.length; i++) {
			if (this.x === this.body[i].x) {
				if (this.y === this.body[i].y)
					res = true;
			}
		}
		return res;
	}

	this.eat = function (pos) {
		var target = new Array(Math.abs(pos[0] - this.x), Math.abs(pos[1] - this.y));
		if (target[0] < 1 && target[1] < 1) {
			this.Size++;
			return true;
		} else
			return false;
	};

	Snake.prototype.direction = function (X, Y) {
		this.xs = X;
		this.ys = Y;
	};

	Snake.prototype.Draw = function (screen) {
		for (var i = 0; i < this.body.length; i++) {
			screen.SetCoordVisibility(this.body[i].y, this.body[i].x, 2);
			this.Color++;
			if (this.Color > 4)
				this.Color = 1;
		}
		screen.SetCoordVisibility(this.y, this.x, 2);
	}
};
