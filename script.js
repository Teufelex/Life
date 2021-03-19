"use strict"
class Life {
  constructor(size) {
    this.size = size;
    this.canvas = document.getElementById("field");
    this.cell = 10;
    this.cellNum = size / 10;
    this.arr = [];
    this.count = 0;
    this.timer = 0;
  }

  init() {
    this.goLife();
    this.drawField();
  }

  paint(e) {
    e = e || window.event;
    let x = e.offsetX;
    let y = e.offsetY;
    x = Math.floor(x / this.cell);
    y = Math.floor(y / this.cell);
    this.arr[y][x] = 1;
    this.drawField();
  }

  goLife() {
    let w = this.size / this.cell,
        h = w;

    this.arr.length = 0;
    this.canvas.width = this.size;
    this.canvas.height = this.size;

    for (let i = 0; i < w; i++) {
      this.arr[i] = [];
      for (let j = 0; j < h; j++) 
        this.arr[i][j] = 0;
    }
  }

  drawField() {
    const ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, this.size, this.size);
    ctx.strokeStyle='rgb(194, 194, 194)';    
    ctx.fillStyle='black';

    for (let i = 0; i < this.cellNum; i++) {
      for (let j = 0; j < this.cellNum; j++) {
        if (this.arr[i][j] === 1) 
          ctx.fillRect(j * this.cell, i * this.cell, this.cell, this.cell);
        ctx.strokeRect(j * this.cell, i * this.cell, this.cell, this.cell);
      }
    }
  }

  randomBtn() {
    let w = this.size / this.cell,
        h = w;

    for (let i = 0; i < w; i++) {
      this.arr[i] = [];
      for (let j = 0; j < h; j++) {
        let rand = Math.floor(0 + Math.random() * (3 + 1 - 0));
        this.arr[i][j] = (rand === 1) ? 1 : 0;
      }
    }
    this.drawField();
  }

  startBtn() {
    clearInterval(this.timer);
    this.timer = 0;
    this.startLife();
  }

  stopBtn() {
    clearInterval(this.timer);
    this.timer = 0;
  }

  clearBtn() {
    clearInterval(this.timer);
    this.timer = 0;
    this.count = 0;

    const ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, this.size, this.size);
    document.getElementById("count").innerHTML = this.count;
    this.goLife();
    this.drawField();
  }

  startLife() {
    let arr = this.arr,
        arr2 = [],
        notEmpty = 0;

    for (let i = 0; i < this.cellNum; i++) {
      arr2[i] = [];
      for (let j = 0; j < this.cellNum; j++) {
        let neighbors = 0;
        if (arr[this.fpm(i) - 1][j] === 1) neighbors++;
        if (arr[this.fpp(i) + 1][j] === 1) neighbors++;
        if (arr[i][this.fpm(j) - 1] === 1) neighbors++;
        if (arr[i][this.fpp(j) + 1] === 1) neighbors++;
        if (arr[this.fpp(i) + 1][this.fpp(j) + 1] === 1) neighbors++;
        if (arr[this.fpm(i) - 1][this.fpp(j) + 1] === 1) neighbors++;
        if (arr[this.fpp(i) + 1][this.fpm(j) - 1] === 1) neighbors++;
        if (arr[this.fpm(i) - 1][this.fpm(j) - 1] === 1) neighbors++;
        if (arr[i][j] > 0) ++notEmpty; 

        if (arr[i][j] === 0) {
          (neighbors === 3) ? arr2[i][j] = 1 : arr2[i][j] = 0;
        } else {
          (neighbors === 2 || neighbors === 3) ?
          arr2[i][j] = 1 : arr2[i][j] = 0;
        }
      }
    }

    this.arr = arr2;
    this.drawField();
    ++this.count;
    document.getElementById("count").innerHTML = this.count;
    if (notEmpty > 0) {
      this.timer = setTimeout(() => {this.startLife()}, 300);
    } else {
      this.count = 0;
    }
  }

  fpm(i) {
    if (i === 0) return this.cellNum;
    else return i;
  }

  fpp(i) {
    if (i === this.cellNum - 1) return -1;
    else return i;
  }

  addListeners() {
    this.canvas.addEventListener("click", this.paint.bind(this));
    document.getElementById("start").addEventListener("click", this.startBtn.bind(this));
    document.getElementById("random").addEventListener("click", this.randomBtn.bind(this));
    document.getElementById("stop").addEventListener("click", this.stopBtn.bind(this));
    document.getElementById("clear").addEventListener("click", this.clearBtn.bind(this));
  }

  removeListeners() {
    this.canvas.removeEventListener("click", this.paint.bind(this));
    document.getElementById("start").removeEventListener("click", this.startBtn.bind(this));
    document.getElementById("stop").removeEventListener("click", this.stopBtn.bind(this));
    document.getElementById("clear").removeEventListener("click", this.clearBtn.bind(this));
  }
}

let game = new Life(300);
game.init();
game.addListeners();
document.querySelector(".size__wrapper").onclick = (e) => {
  e = e || window.event;
  let size = +e.target.innerHTML.slice(0,3);
  let canvas = document.getElementById("field");
  let ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, game.size, game.size);

  game.size = size;
  game.cellNum = size / 10;
  game.init();
} 
