/**
* @description 把虫子渲染在画布上。玩家需要躲避虫子
* @constructor
* @param {number} x - 虫子的横坐标
* @param {number} y - 虫子的纵坐标
*/
class Enemy{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.speed = Math.random() * 3;
        this.sprite = 'images/enemy-bug.png';
    }

    /**
    * @description 虫子移动速度
    * @param {number} dt - 时间间隔
    */
    update(dt){
        this.x += 75 * dt + this.speed;
        if (this.x > 505) {
             this.x = 0;
        };
    }

    /**
    * @description 在画布上绘制虫子
    */
    render(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

var TILE_WIDTH = 101,
    TILE_HEIGHT = 83;

/**
* @description 实现玩家类
* @constructor
* @param {number} x - 玩家的横坐标
* @param {number} y - 玩家的纵坐标
*/
class Player extends Enemy{
    constructor(x,y){
        super(x,y);
        this.sprite = 'images/char-boy.png';
    }

    render(){
        //通过super调用父类的方法时，方法内部的this指向子类
        super.render();
    }

    /**
    * @desc 限制玩家在画布内移动；玩家到达对岸后出现胜利提示
    */
    update() {
        if (this.x < 0) this.x += TILE_WIDTH ;
        if (this.x > 404) this.x -=TILE_WIDTH;
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
    handleInput (input) {
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
    collisionDetect () {
        var self = this;
        allEnemies.forEach(function(enemy) {
            if (self.x < enemy.x + 70 &&
                self.x +70 > enemy.x &&
                self.y < enemy.y + 70 &&
                65 + self.y > enemy.y) {
                self.x = 202;
                self.y = 320;
            }
        });
    }
};


// 实例化所有对象
var allEnemies = [];
//通过循环生成虫子个数
for(var i=0;i<5;i++){
    allEnemies[i]= new Enemy(0,Math.floor(Math.random()*(3))*TILE_HEIGHT+60);
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