'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* @description 把虫子渲染在画布上。玩家需要躲避虫子
* @constructor
* @param {number} x - 虫子的横坐标
* @param {number} y - 虫子的纵坐标
*/
var Enemy = function () {
    function Enemy(x, y) {
        _classCallCheck(this, Enemy);

        this.x = x;
        this.y = y;
        this.speed = Math.random() * 3;
        this.sprite = 'images/enemy-bug.png';
    }

    /**
    * @description 虫子移动速度
    * @param {number} dt - 时间间隔
    */


    _createClass(Enemy, [{
        key: 'update',
        value: function update(dt) {
            this.x += 75 * dt + this.speed;
            if (this.x > 505) {
                this.x = 0;
            };
        }

        /**
        * @description 在画布上绘制虫子
        */

    }, {
        key: 'render',
        value: function render() {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        }
    }]);

    return Enemy;
}();

;

var TILE_WIDTH = 101,
    TILE_HEIGHT = 83;

/**
* @description 实现玩家类
* @constructor
* @param {number} x - 玩家的横坐标
* @param {number} y - 玩家的纵坐标
*/

var Player = function (_Enemy) {
    _inherits(Player, _Enemy);

    function Player(x, y) {
        _classCallCheck(this, Player);

        var _this = _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this, x, y));

        _this.sprite = 'images/char-boy.png';
        return _this;
    }

    _createClass(Player, [{
        key: 'render',
        value: function render() {
            //通过super调用父类的方法时，方法内部的this指向子类
            _get(Player.prototype.__proto__ || Object.getPrototypeOf(Player.prototype), 'render', this).call(this);
        }

        /**
        * @desc 限制玩家在画布内移动；玩家到达对岸后出现胜利提示
        */

    }, {
        key: 'update',
        value: function update() {
            if (this.x < 0) this.x += TILE_WIDTH;
            if (this.x > 404) this.x -= TILE_WIDTH;
            if (this.y < -30) this.y += TILE_HEIGHT;
            if (this.y > 450) this.y -= TILE_HEIGHT;

            //到达对岸后弹出胜利页面
            var winElem = document.getElementById('win_hidden');
            if (this.y < 0) {
                winElem.style.transform = "translateY(200px)";
            };
            if (this.y > 0) {
                winElem.style.transform = "translateY(-200px)";
            }
            this.collisionDetect();
        }

        /**
        * @description 移动player
        * @param {string} input - 按键名称
        */

    }, {
        key: 'handleInput',
        value: function handleInput(input) {
            switch (input) {
                case 'left':
                    this.x -= TILE_WIDTH;
                    break;
                case 'up':
                    this.y -= TILE_HEIGHT;
                    break;
                case 'right':
                    this.x += TILE_WIDTH;
                    break;
                case 'down':
                    this.y += TILE_HEIGHT;
                    break;
            }
        }

        /**
        * @description 检测碰撞
        * @returns {number} 若玩家碰到虫子后的新坐标
        */

    }, {
        key: 'collisionDetect',
        value: function collisionDetect() {
            var self = this;
            allEnemies.forEach(function (enemy) {
                if (self.x < enemy.x + 70 && self.x + 70 > enemy.x && self.y < enemy.y + 70 && 65 + self.y > enemy.y) {
                    self.x = 202;
                    self.y = 320;
                }
            });
        }
    }]);

    return Player;
}(Enemy);

;

// 实例化所有对象
var allEnemies = [];
//通过循环生成虫子个数
for (var i = 0; i < 5; i++) {
    allEnemies[i] = new Enemy(0, Math.floor(Math.random() * 3) * TILE_HEIGHT + 60);
}

var player = new Player(202, 320);

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});