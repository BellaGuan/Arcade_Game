// 这是玩家要躲避的敌人
var Enemy = function(x,y) {
    this.x = x,//Math.floor(Math.random()*100), 产生0-100内的随机数
    this.y = y,
    this.speed = Math.random() * 3;
    this.sprite = 'images/enemy-bug.png';
};

// 用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    this.x += 75 * dt + this.speed;
    if (this.x > 505) {
         this.x = 0;
    };
    // 给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
};

// 用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// 实现玩家类
var Player = function(x,y) {
    Enemy.call(this,x,y);
    this.sprite = 'images/char-boy.png';
};
Player.prototype = Object.create(Enemy.prototype);
Player.prototype.constructor = Player;

var TILE_WIDTH = 101,
    TILE_HEIGHT = 83;
Player.prototype.update = function () {
    //使player不能跑出画布
    if (this.x < 0) this.x += TILE_WIDTH ;
    if (this.x > 404) this.x -=TILE_WIDTH;
    if (this.y < -30) this.y += TILE_HEIGHT;
    if (this.y > 450) this.y -= TILE_HEIGHT;

    //到达水面时弹出胜利页面
    if (this.y < 0) {
        document.getElementById('win-hidden').style.transform = "translateY(200px)";
    };

    this.collisionDetect();
};

//移动player
Player.prototype.handleInput = function (input) {
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
};

//检测碰撞
Player.prototype.collisionDetect = function () {
    var self = this;
    allEnemies.forEach(function(enemy) {
        if (self.x < enemy.x + 70 && self.x +70 > enemy.x &&
         self.y < enemy.y + 70 && 65 + self.y > enemy.y) {
            self.x = 202;
            self.y = 320;
        }
    });
};

// 实例化所有对象
var allEnemies = [];
//通过循环生成虫子个数
for(var i=0;i<5;i++){
    //Math.floor(Math.random()*(2-0+1))+0随机产生0-2之间的整数
    allEnemies[i]= new Enemy(0,Math.floor(Math.random()*(2-0+1))*TILE_HEIGHT+60);
}

var player = new Player(202,320);

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});