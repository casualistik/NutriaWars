(function() {
  var Animation, Background, Bullet, Camera, CustomBackground, Eventmanager, Game, Hero, Keyboard, Map, Nutria, NutriaWars, Shape, Sprite, State, StateMenu, StatePlay, Statemanager, Tile, Timer, Vector, root, stateclass;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  root = this;

  stateclass = {};

  Array.prototype.shuffle = function() {
    return this.sort(function() {
      return 0.5 - Math.random();
    });
  };

  Number.prototype.toHex = function(padding) {
    var hex;
    if (padding == null) padding = 2;
    hex = this.toString(16);
    while (hex.length < padding) {
      hex = "0" + hex;
    }
    return hex;
  };

  Timer = (function() {

    function Timer() {
      this.last_time = new Date().getTime();
      this.delta = 0;
    }

    Timer.prototype.punch = function() {
      var this_time;
      this_time = new Date().getTime();
      this.delta = this_time - this.last_time;
      this.last_time = this_time;
      return this.delta;
    };

    Timer.prototype.timeSinceLastPunch = function() {
      var this_time;
      this_time = new Date().getTime();
      return this_time - this.last_time;
    };

    Timer.prototype.fps = function() {
      return 1000 / this.delta;
    };

    return Timer;

  })();

  Vector = (function() {

    function Vector(x, y) {
      if (x == null) x = 0;
      if (y == null) y = 0;
      this.x = x;
      this.y = y;
    }

    Vector.prototype.clone = function() {
      return new Vector(this.x, this.y);
    };

    Vector.prototype.add = function(vec) {
      return new Vector(this.x + vec.x, this.y + vec.y);
    };

    Vector.prototype.subtract = function(vec) {
      return new Vector(this.x - vec.x, this.y - vec.y);
    };

    Vector.prototype.mult = function(num) {
      return new Vector(this.x * num, this.y * num);
    };

    Vector.prototype.length = function() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    };

    Vector.prototype.lengthSquared = function() {
      return this.x * this.x + this.y * this.y;
    };

    Vector.prototype.norm = function(factor) {
      var l;
      if (factor == null) factor = 1;
      l = this.length();
      if (l > 0) {
        return this.mult(factor / l);
      } else {
        return null;
      }
    };

    Vector.prototype.scalarProduct = function(vec) {
      return this.x * vec.x + this.y * vec.y;
    };

    Vector.prototype.sameDirection = function(vec) {
      if (this.lengthSquared() < this.add(vec).lengthSquared()) {
        return true;
      } else {
        return false;
      }
    };

    Vector.prototype.angleWith = function(vec) {
      return Math.acos(this.scalarProduct(vec) / this.length() * vec.length());
    };

    Vector.prototype.vectorProduct = function(vec) {
      return this;
    };

    Vector.prototype.projectTo = function(vec) {
      return vec.mult(this.scalarProduct(vec) / vec.lengthSquared());
    };

    Vector.intersecting = function(oa, a, ob, b) {
      var c, col, l, m, mu, mult, n;
      c = ob.subtract(oa);
      b = b.mult(-1);
      col = [];
      col[0] = a.clone();
      col[1] = b.clone();
      col[2] = c.clone();
      l = 0;
      m = 1;
      n = 2;
      mult = col[0].y / col[0].x;
      col[0].y = 0;
      col[1].y = col[1].y - (mult * col[1].x);
      col[2].y = col[2].y - (mult * col[2].x);
      mu = col[n].y / col[m].y;
      return ob.subtract(b.mult(mu));
    };

    Vector.prototype.print = function() {
      return "(" + this.x + ", " + this.y + ")";
    };

    return Vector;

  })();

  Eventmanager = (function() {

    function Eventmanager() {
      this.eventlist = {};
    }

    Eventmanager.prototype.register = function(event, callback) {
      if (this.eventlist[event] == null) this.eventlist[event] = [];
      return this.eventlist[event].push(callback);
    };

    Eventmanager.prototype.trigger = function(event, origin) {
      var callback, _i, _len, _ref, _results;
      _ref = this.eventlist[event];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        callback = _ref[_i];
        _results.push(callback(origin));
      }
      return _results;
    };

    return Eventmanager;

  })();

  Keyboard = (function() {

    function Keyboard() {
      var direction, _i, _len, _ref;
      var _this = this;
      this.keyarray = [];
      _ref = ['left', 'up', 'right', 'down', 'space'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        direction = _ref[_i];
        this.keyarray[direction] = false;
      }
      $("html").bind("keydown", function(event) {
        var directions;
        directions = {
          37: "left",
          38: "up",
          39: "right",
          40: "down",
          32: "space"
        };
        return _this.keyarray[directions[event.which]] = true;
      });
      $("html").bind("keyup", function(event) {
        var directions;
        directions = {
          37: "left",
          38: "up",
          39: "right",
          40: "down",
          32: "space"
        };
        return _this.keyarray[directions[event.which]] = false;
      });
    }

    Keyboard.prototype.key = function(which) {
      return this.keyarray[which];
    };

    return Keyboard;

  })();

  Game = (function() {

    function Game(width, height) {
      var canvas;
      this.width = width;
      this.height = height;
      this.gameloop = __bind(this.gameloop, this);
      canvas = $('<canvas/>').attr({
        "width": this.width,
        "height": this.height
      });
      $("body").append(canvas);
      this.ctx = canvas[0].getContext('2d');
      this.ctx.font = '400 18px Helvetica, sans-serif';
      this.loop = null;
      this.timer = new Timer;
    }

    Game.prototype.gameloop = function() {
      this.update();
      return this.render();
    };

    Game.prototype.start = function() {
      return this.loop = setInterval(this.gameloop, 1);
    };

    Game.prototype.stop = function() {
      return this.loop.clearInterval();
    };

    Game.prototype.update = function() {
      return this.timer.punch();
    };

    Game.prototype.render = function() {
      return this.ctx.fillText(this.timer.fps().toFixed(1), 20, 20);
    };

    return Game;

  })();

  Map = (function() {

    function Map(hash) {
      this.sprite = hash["sprite"];
      this.tiles = [];
      this.width = 0;
      this.height = 0;
      this.loadMapDataFromImage(hash["mapfile"], hash["pattern"]);
    }

    Map.prototype.render = function(ctx) {
      var tile, _i, _len, _ref, _results;
      _ref = this.tiles;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tile = _ref[_i];
        _results.push(tile.render(ctx));
      }
      return _results;
    };

    Map.prototype.loadMapDataFromImage = function(file, pattern) {
      var m, map;
      var _this = this;
      map = new Image();
      map.src = file;
      m = [];
      return $(map).load(function() {
        var canvas, col, ctx, data, green, i, p, row, type, z, _len, _ref, _ref2, _ref3, _ref4, _results, _results2, _results3, _step;
        canvas = document.createElement("canvas");
        _this.width = map.width;
        _this.height = map.height;
        canvas.width = map.width;
        canvas.height = map.height;
        ctx = canvas.getContext("2d");
        ctx.drawImage(map, 0, 0);
        data = ctx.getImageData(0, 0, map.width, map.height).data;
        for (i = 0, _len = data.length, _step = 4; i < _len; i += _step) {
          p = data[i];
          row = Math.floor((i / 4) / map.width);
          if ((_ref = m[row]) == null) m[row] = [];
          m[row].push([Number(data[i]).toHex(), Number(data[i + 1]).toHex(), Number(data[i + 2]).toHex(), Number(data[i + 3]).toHex()]);
        }
        switch (pattern) {
          case "simple":
            _results = [];
            for (row = 0, _ref2 = map.height - 1; 0 <= _ref2 ? row <= _ref2 : row >= _ref2; 0 <= _ref2 ? row++ : row--) {
              _results.push((function() {
                var _ref3, _results2;
                _results2 = [];
                for (col = 0, _ref3 = map.width - 1; 0 <= _ref3 ? col <= _ref3 : col >= _ref3; 0 <= _ref3 ? col++ : col--) {
                  type = "" + m[row][col][0];
                  green = parseInt(m[row][col][1], 16);
                  z = parseInt(m[row][col][2], 16);
                  _results2.push(this.tiles.push(new Tile(this.sprite, type, row, col, green, z)));
                }
                return _results2;
              }).call(_this));
            }
            return _results;
            break;
          case "square":
            _results2 = [];
            for (row = 0, _ref3 = map.height - 2; 0 <= _ref3 ? row <= _ref3 : row >= _ref3; 0 <= _ref3 ? row++ : row--) {
              _results2.push((function() {
                var _ref4, _results3;
                _results3 = [];
                for (col = 0, _ref4 = map.width - 2; 0 <= _ref4 ? col <= _ref4 : col >= _ref4; 0 <= _ref4 ? col++ : col--) {
                  type = "" + m[row][col][0] + m[row][col + 1][0] + m[row + 1][col][0] + m[row + 1][col + 1][0];
                  green = parseInt(m[row][col][1], 16);
                  z = parseInt(m[row][col][2], 16);
                  _results3.push(this.tiles.push(new Tile(this.sprite, type, row, col, green, z)));
                }
                return _results3;
              }).call(_this));
            }
            return _results2;
            break;
          case "cross":
            _results3 = [];
            for (row = 1, _ref4 = map.height - 2; row <= _ref4; row += 2) {
              _results3.push((function() {
                var _ref5, _results4;
                _results4 = [];
                for (col = 1, _ref5 = map.width - 2; col <= _ref5; col += 2) {
                  if (m[row][col][0] !== "00") {
                    type = "" + m[row - 1][col][0] + m[row][col + 1][0] + m[row + 1][col][0] + m[row][col - 1][0];
                    green = parseInt(m[row][col][1], 16);
                    z = parseInt(m[row][col][2], 16);
                    _results4.push(this.tiles.push(new Tile(this.sprite, type, row / 2, col / 2, green, z)));
                  } else {
                    _results4.push(void 0);
                  }
                }
                return _results4;
              }).call(_this));
            }
            return _results3;
        }
      });
    };

    Map.prototype.tileAtVector = function(vec) {
      var index, x, y;
      x = Math.floor(vec.x / this.sprite.innerWidth);
      y = Math.floor(vec.y / this.sprite.innerHeight);
      index = y * this.width + x;
      return this.tiles[index];
    };

    return Map;

  })();

  Tile = (function() {

    function Tile(sprite, type, row, col, green, z) {
      this.sprite = sprite;
      this.type = type;
      this.row = row;
      this.col = col;
      this.green = green != null ? green : 0;
      this.z = z != null ? z : 0;
    }

    Tile.prototype.isWalkable = function() {
      return this.green === 0;
    };

    Tile.prototype.render = function(ctx) {
      ctx.save();
      ctx.translate(this.col * this.sprite.innerWidth - this.z, this.row * this.sprite.innerHeight - this.z);
      this.sprite.render(this.type, ctx);
      return ctx.restore();
    };

    return Tile;

  })();

  Background = (function() {

    function Background(sprite) {
      this.sprite = sprite;
      this.sprite.addImage("background", 0);
    }

    Background.prototype.render = function(ctx) {
      return this.sprite.render("background", ctx);
    };

    return Background;

  })();

  Sprite = (function() {

    function Sprite(hash) {
      var i, key, _ref, _ref2, _ref3, _ref4;
      this.assets = {};
      this.width = hash["width"];
      this.height = hash["height"];
      this.texture = new Image();
      this.texture.src = hash["texture"];
      this.key = (_ref = hash["key"]) != null ? _ref : {};
      _ref2 = this.key;
      for (key in _ref2) {
        i = _ref2[key];
        this.addImage(key, i);
      }
      this.innerWidth = (_ref3 = hash["innerWidth"]) != null ? _ref3 : this.width;
      this.innerHeight = (_ref4 = hash["innerHeight"]) != null ? _ref4 : this.height;
    }

    Sprite.prototype.addImage = function(name, index) {
      var _this = this;
      return $(this.texture).load(function() {
        _this.texWidth = _this.texture.width;
        return _this.assets[name] = new Shape(_this, index);
      });
    };

    Sprite.prototype.addAnimation = function(name, params) {
      var _this = this;
      return $(this.texture).load(function() {
        _this.texWidth = _this.texture.width;
        return _this.assets[name] = new Animation(_this, params);
      });
    };

    Sprite.prototype.render = function(name, ctx) {
      if (this.assets[name] != null) return this.assets[name].render(ctx);
    };

    return Sprite;

  })();

  Shape = (function() {

    function Shape(sprite, index) {
      this.sprite = sprite;
      this.sx = (index * this.sprite.width) % this.sprite.texWidth;
      this.sy = Math.floor((index * this.sprite.width) / this.sprite.texWidth) * this.sprite.height;
    }

    Shape.prototype.render = function(ctx) {
      ctx.save();
      ctx.translate(-this.sprite.width / 2, -this.sprite.height / 2);
      ctx.drawImage(this.sprite.texture, this.sx, this.sy, this.sprite.width, this.sprite.height, 0, 0, this.sprite.width, this.sprite.height);
      return ctx.restore();
    };

    return Shape;

  })();

  Animation = (function() {

    function Animation(sprite, params) {
      var index, _ref, _ref2, _ref3;
      this.sprite = sprite;
      this.fps = (_ref = params["fps"]) != null ? _ref : 30;
      this.loop = (_ref2 = params["loop"]) != null ? _ref2 : true;
      this.callback = (_ref3 = params["callback"]) != null ? _ref3 : null;
      this.frames = (function() {
        var _i, _len, _ref4, _results;
        _ref4 = params["frames"];
        _results = [];
        for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
          index = _ref4[_i];
          _results.push(new Shape(this.sprite, index));
        }
        return _results;
      }).call(this);
      this.lastFrame = this.frames.length - 1;
      this.timer = new Timer;
      this.currentFrame = 0;
      this.playing = true;
    }

    Animation.prototype.render = function(ctx) {
      if (this.playing) {
        this.currentFrame = Math.floor(this.timer.timeSinceLastPunch() / (1000 / this.fps));
        if (this.currentFrame > this.lastFrame) {
          this.callback();
          if (this.loop) {
            this.rewind();
          } else {
            this.currentFrame = this.lastFrame;
            this.stop();
          }
        }
      }
      return this.frames[this.currentFrame].render(ctx);
    };

    Animation.prototype.play = function() {
      return this.playing = true;
    };

    Animation.prototype.stop = function() {
      return this.playing = false;
    };

    Animation.prototype.rewind = function() {
      this.currentFrame = 0;
      return this.timer.punch();
    };

    return Animation;

  })();

  State = (function() {

    function State() {}

    State.prototype.update = function() {};

    State.prototype.draw = function() {};

    return State;

  })();

  Statemanager = (function() {

    function Statemanager(parent, states) {
      var state, _i, _len;
      this.parent = parent;
      this.statearray = {};
      this.currentState = null;
      for (_i = 0, _len = states.length; _i < _len; _i++) {
        state = states[_i];
        this.addState(state);
      }
    }

    Statemanager.prototype.addState = function(state) {
      this.statearray[state] = new stateclass[state](this.parent);
      if (this.currentState == null) return this.setState(state);
    };

    Statemanager.prototype.setState = function(state) {
      return this.currentState = this.statearray[state];
    };

    return Statemanager;

  })();

  Camera = (function() {

    function Camera(hash) {
      this.projection = hash["projection"];
      this.vpWidth = hash["vpWidth"];
      this.vpHeight = hash["vpHeight"];
      this.coor = new Vector(0, 0);
    }

    Camera.prototype.update = function(delta) {};

    Camera.prototype.apply = function(ctx, callback) {
      switch (this.projection) {
        case "normal":
          ctx.save();
          ctx.translate(this.coor.x, this.coor.y);
          callback();
          return ctx.restore();
        case "iso":
          ctx.save();
          ctx.scale(1, 0.5);
          ctx.rotate(Math.PI / 4);
          ctx.translate(200, -400);
          callback();
          return ctx.restore();
      }
    };

    return Camera;

  })();

  NutriaWars = (function() {

    __extends(NutriaWars, Game);

    function NutriaWars(width, height) {
      NutriaWars.__super__.constructor.call(this, width, height);
      this.eventmanager = new Eventmanager;
      this.keyboard = new Keyboard;
      this.stateManager = new Statemanager(this, ["state_menu", "state_play", "state_game_over"]);
      this.stateManager.setState("state_menu");
    }

    NutriaWars.prototype.update = function() {
      NutriaWars.__super__.update.call(this);
      return this.stateManager.currentState.update(this.timer.delta);
    };

    NutriaWars.prototype.render = function() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.stateManager.currentState.render(this.ctx);
      return NutriaWars.__super__.render.call(this);
    };

    return NutriaWars;

  })();

  $(function() {
    var nutriaWars;
    nutriaWars = new NutriaWars(640, 480);
    nutriaWars.start();
    return console.log("Start NutriaWars ");
  });

  stateclass["state_menu"] = StateMenu = (function() {

    __extends(StateMenu, State);

    function StateMenu(parent) {
      var i;
      this.parent = parent;
      console.log("Init Menu State");
      console.log("width: " + this.parent.width + " -- height: " + this.parent.height);
      this.camera = new Camera({
        "projection": "normal",
        "vpWidth": this.parent.width,
        "vpHeight": this.parent.height
      });
      this.camera.coor = new Vector(0, 0);
      this.nutrias = [];
      for (i = 0; i <= 10; i++) {
        this.nutrias[i] = new Nutria;
        this.nutrias[i].isAlive = true;
      }
      this.background = new CustomBackground("assets/images/bg-menu.png", this.parent.width, this.parent.height);
    }

    StateMenu.prototype.update = function(delta) {
      var nutria, _i, _len, _ref;
      _ref = this.nutrias;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        nutria = _ref[_i];
        nutria.update(delta);
      }
      if (this.parent.keyboard.key("space")) {
        console.log("Space pressed");
        return this.parent.stateManager.setState("state_play");
      }
    };

    StateMenu.prototype.render = function(ctx) {
      var _this = this;
      return this.camera.apply(ctx, function() {
        var nutria, _i, _len, _ref;
        _ref = _this.nutrias;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          nutria = _ref[_i];
          nutria.render(ctx);
        }
        return _this.background.render(ctx);
      });
    };

    return StateMenu;

  })();

  stateclass["state_play"] = StatePlay = (function() {

    __extends(StatePlay, State);

    function StatePlay(parent) {
      var i;
      this.parent = parent;
      console.log("Construct play state");
      this.camera = new Camera({
        "projection": "normal",
        "vpWidth": this.parent.width,
        "vpHeight": this.parent.height
      });
      this.hero = new Hero(this.parent.eventmanager, this.parent.keyboard);
      this.hero.coor = new Vector(this.parent.width / 2, this.parent.height / 2);
      this.bullets = [];
      for (i = 0; i <= 20; i++) {
        this.bullets[i] = new Bullet;
      }
      this.nutrias = [];
      for (i = 0; i <= 10; i++) {
        this.nutrias[i] = new Nutria;
        this.nutrias[i].isAlive = false;
        this.nutrias[i].state = "attack";
      }
      this.creatNutriaTime = 5 * 1000;
      this.creatNutriaDelay = this.creatNutriaTime;
    }

    StatePlay.prototype.createNutria = function() {
      var nutria, _i, _len, _ref, _results;
      console.log("Playstate createNutria");
      _ref = this.nutrias;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        nutria = _ref[_i];
        if (!nutria.isAlive) {
          nutria.attack(this.hero.coor);
          break;
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    StatePlay.prototype.update = function(delta) {
      var bullet, dist, nutria, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3, _results;
      this.creatNutriaDelay -= delta;
      if (this.creatNutriaDelay <= 0) {
        this.createNutria();
        this.creatNutriaDelay = this.creatNutriaTime;
      }
      this.hero.update(delta);
      _ref = this.bullets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        bullet = _ref[_i];
        bullet.update(delta);
      }
      _ref2 = this.nutrias;
      _results = [];
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        nutria = _ref2[_j];
        dist = this.hero.coor.subtract(nutria.coor).length();
        if (dist < 50) {
          console.log("GAME OVER");
          _ref3 = this.nutrias;
          for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
            nutria = _ref3[_k];
            nutria.isAlive = false;
            nutria.coor = new Vector(0, 0);
          }
          this.parent.stateManager.setState("state_game_over");
        }
        _results.push(nutria.update(delta));
      }
      return _results;
    };

    StatePlay.prototype.render = function(ctx) {
      var _this = this;
      return this.camera.apply(ctx, function() {
        var bullet, nutria, _i, _j, _len, _len2, _ref, _ref2;
        _this.hero.render(ctx);
        _ref = _this.bullets;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          bullet = _ref[_i];
          bullet.render(ctx);
        }
        _ref2 = _this.nutrias;
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          nutria = _ref2[_j];
          nutria.render(ctx);
        }
        ctx.fillStyle = '#00ff00';
        return ctx.fillText('Use arrows to rotate and space to shoot', 20, 460);
      });
    };

    return StatePlay;

  })();

  stateclass["state_game_over"] = StateMenu = (function() {

    __extends(StateMenu, State);

    function StateMenu(parent) {
      var i;
      this.parent = parent;
      console.log("Init Menu State");
      console.log("width: " + this.parent.width + " -- height: " + this.parent.height);
      this.camera = new Camera({
        "projection": "normal",
        "vpWidth": this.parent.width,
        "vpHeight": this.parent.height
      });
      this.camera.coor = new Vector(0, 0);
      this.nutrias = [];
      for (i = 0; i <= 10; i++) {
        this.nutrias[i] = new Nutria;
        this.nutrias[i].isAlive = true;
      }
      this.background = new CustomBackground("assets/images/game-over.png", this.parent.width, this.parent.height);
    }

    StateMenu.prototype.update = function(delta) {
      var nutria, _i, _len, _ref;
      _ref = this.nutrias;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        nutria = _ref[_i];
        nutria.update(delta);
      }
      if (this.parent.keyboard.key("space")) {
        console.log("Space pressed");
        return this.parent.stateManager.setState("state_play");
      }
    };

    StateMenu.prototype.render = function(ctx) {
      var _this = this;
      return this.camera.apply(ctx, function() {
        var nutria, _i, _len, _ref;
        _ref = _this.nutrias;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          nutria = _ref[_i];
          nutria.render(ctx);
        }
        return _this.background.render(ctx);
      });
    };

    return StateMenu;

  })();

  Nutria = (function() {

    function Nutria(eventmanager, keyboard) {
      this.eventmanager = eventmanager;
      this.keyboard = keyboard;
      this.state = "normal";
      this.isAlive = true;
      this.sprite = new Sprite({
        "texture": "assets/images/test.png",
        "width": 50,
        "height": 50
      });
      this.sprite.addImage("normal", Math.floor(Math.random() * 10));
      this.sprite.addAnimation("normal", {
        frames: [0, 1, 2, 3, 4].shuffle(),
        fps: 3,
        loop: true,
        callback: this.hello
      });
      this.coor = new Vector(Math.random() * 640, Math.random() * 480);
      this.speed = new Vector(0.1, 0.1);
      if (Math.random() > 0.5) this.speed = this.speed.mult(-1);
      this.direction = new Vector(0, 0);
    }

    Nutria.prototype.attack = function(toCoor) {
      var rnd;
      this.toCoor = toCoor;
      console.log("Nutria  reset() toCoor " + this.toCoor);
      this.isAlive = true;
      this.state = "normal";
      rnd = Math.random();
      if (rnd >= 0 && rnd <= 0.2) {
        this.coor.x = 0 - 200;
        this.coor.y = Math.random() * 480;
      } else if (rnd >= 0.3 && rnd <= 0.5) {
        this.coor.x = 640 + 200;
        this.coor.y = Math.random() * 480;
      } else if (rnd >= 0.6 && rnd <= 0.8) {
        this.coor.x = Math.random() * 640;
        this.coor.y = 0 - 200;
      } else if (rnd >= 0.9 && rnd <= 1) {
        this.coor.x = Math.random() * 640;
        this.coor.y = 480 + 200;
      }
      return console.log("Nutria  reset() coor " + this.coor.x + " " + this.coor.y);
    };

    Nutria.prototype.update = function(delta) {
      if (this.isAlive) {
        switch (this.state) {
          case "normal":
            this.coor = this.coor.add(this.speed.mult(delta));
            if (this.coor.x > 640) {
              this.speed.x = this.speed.x * -1;
              this.coor.x = 640;
            }
            if (this.coor.x < 0) {
              this.speed.x = this.speed.x * -1;
              this.coor.x = 0;
            }
            if (this.coor.y > 480) {
              this.speed.y = this.speed.y * -1;
              this.coor.y = 480;
            }
            if (this.coor.y < 0) {
              this.speed.y = this.speed.y * -1;
              return this.coor.y = 0;
            }
            break;
          case "attack":
            return this.coor = this.coor.add(this.speed.mult(delta));
        }
      }
    };

    Nutria.prototype.render = function(ctx) {
      ctx.save();
      ctx.translate(this.coor.x, this.coor.y);
      this.sprite.render(this.state, ctx);
      return ctx.restore();
    };

    Nutria.prototype.hello = function() {
      return console.log("hello!");
    };

    return Nutria;

  })();

  Hero = (function() {

    function Hero(eventmanager, keyboard) {
      this.eventmanager = eventmanager;
      this.keyboard = keyboard;
      this.state = "normal";
      this.sprite = new Sprite({
        "texture": "assets/images/hero.png",
        "width": 50,
        "height": 50,
        "key": {
          "normal": 3,
          "jumping": 5
        }
      });
      this.coor = new Vector(0, 0);
      this.speed = new Vector(0, 0);
      this.omega = 0.001;
      this.gravity = 0.01;
      this.angle = 0;
    }

    Hero.prototype.shoot = function() {
      return console.log("shoot");
    };

    Hero.prototype.touchdown = function() {
      return console.log("Hero says: Touchdown occurred");
    };

    Hero.prototype.update = function(delta) {
      if (this.keyboard.key("right")) {
        this.angle += this.omega;
        console.log("" + this + " Right Angle:" + this.angle);
      } else if (this.keyboard.key("left")) {
        this.angle -= this.omega;
        console.log("" + this + " LEFT Angle:" + this.angle);
      }
      return this.coor = this.coor.add(this.speed.mult(delta));
    };

    Hero.prototype.render = function(ctx) {
      ctx.save();
      ctx.translate(this.coor.x, this.coor.y);
      ctx.rotate(this.angle * (180 / Math.PI));
      this.sprite.render(this.state, ctx);
      return ctx.restore();
    };

    return Hero;

  })();

  CustomBackground = (function() {

    function CustomBackground(image, myWidth, myHeight) {
      this.image = image;
      this.myWidth = myWidth != null ? myWidth : 640;
      this.myHeight = myHeight != null ? myHeight : 480;
      this.state = "normal";
      console.log("CustomBackground  " + this + " " + this.image + " " + this.myWidth + " " + this.myHeight + " ");
      this.sprite = new Sprite({
        "texture": this.image,
        "width": this.myWidth,
        "height": this.myHeight,
        "key": {
          "normal": 0
        }
      });
      this.coor = new Vector(this.myWidth / 2, this.myHeight / 2);
    }

    CustomBackground.prototype.update = function(delta) {};

    CustomBackground.prototype.render = function(ctx) {
      ctx.save();
      ctx.translate(this.coor.x, this.coor.y);
      this.sprite.render(this.state, ctx);
      return ctx.restore();
    };

    return CustomBackground;

  })();

  Bullet = (function() {

    function Bullet(eventmanager, keyboard) {
      this.eventmanager = eventmanager;
      this.keyboard = keyboard;
      this.state = "normal";
      this.sprite = new Sprite({
        "texture": "assets/images/bullet.png",
        "width": 3,
        "height": 3,
        "key": {
          "normal": 0
        }
      });
      this.coor = new Vector(Math.random() * 640, Math.random() * 48);
      this.speed = new Vector(0.1, 0.1);
    }

    Bullet.prototype.update = function(delta) {
      this.coor = this.coor.add(this.speed.mult(delta));
      if (this.coor.x > 640) {
        this.speed.x = this.speed.x * -1;
        this.coor.x = 640;
        this.eventmanager.trigger("touchdown");
      }
      if (this.coor.x < 0) {
        this.speed.x = this.speed.x * -1;
        this.coor.x = 0;
      }
      if (this.coor.y > 480) {
        this.speed.y = this.speed.y * -1;
        this.coor.y = 480;
      }
      if (this.coor.y < 0) {
        this.speed.y = this.speed.y * -1;
        return this.coor.y = 0;
      }
    };

    Bullet.prototype.render = function(ctx) {
      ctx.save();
      ctx.translate(this.coor.x, this.coor.y);
      this.sprite.render(this.state, ctx);
      return ctx.restore();
    };

    return Bullet;

  })();

}).call(this);