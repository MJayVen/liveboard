<script setup lang="ts">
import { onMounted, ref } from 'vue';
import io from 'socket.io-client';

const brushColor = ref('#000000');
const brushWidth = ref(7)

let mousePressed = false;
let lastX: number, lastY: number;
let canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D;

let timeout: ReturnType<typeof setTimeout>;

const socket = io('http://localhost:3000');

const initBoard = () => {
  canvas = document.getElementById('board') as HTMLCanvasElement;
  ctx = canvas.getContext('2d')!;

  // specify width and height of canvas based on wrapper div
  let sketch = document.querySelector('#sketch');
  let sketch_style = getComputedStyle(sketch as Element);
  canvas.width = parseInt(sketch_style.getPropertyValue('width'));
  canvas.height = parseInt(sketch_style.getPropertyValue('height'));

  canvas.addEventListener("mousedown", function (e) {
    mousePressed = true;
    draw(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, false);
  });

  canvas.addEventListener("mousemove", function (e) {
    if (mousePressed) {
      draw(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
    }
  });

  canvas.addEventListener("mouseup", function (e) {
    if (mousePressed) {
      mousePressed = false;
      push();
    }
  });

  canvas.addEventListener("mouseleave", function (e) {
    if (mousePressed) {
      mousePressed = false;
      push();
    }
  });

  // drawImage();
  push();
}

// function drawImage() {
//     let image = new Image();
//     image.src = 'myimg.jpg';
//     image.onload = (function () {
//         ctx.drawImage(image, 0, 0, 500, 200);
//         push();
//     }); 
// }

const draw = (x: number, y: number, isDown: boolean) => {
  if (isDown) {
    ctx.beginPath();
    ctx.strokeStyle = brushColor.value;
    ctx.lineWidth = brushWidth.value;
    ctx.lineJoin = "round";
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.stroke();
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      let base64ImageData = canvas.toDataURL("image/png");
      socket.emit("canvas-data", base64ImageData);
    }, 10);
  }
  lastX = x; lastY = y;
}

const clear = () => {
  clearCanvas();
  socket.emit("canvas-data", canvas.toDataURL("image/png"));
}

const clearCanvas = () => {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

let cPushArray = new Array();
let cStep = -1;

const push = () => {
  cStep++;
  if (cStep < cPushArray.length) { cPushArray.length = cStep; }
  cPushArray.push(canvas.toDataURL());
}

/*
 * Undo the last action
 */
const undo = () => {
  if (cStep > 0) {
    cStep--;
    let canvasPic = new Image();
    canvasPic.src = cPushArray[cStep];
    canvasPic.onload = function () {
      clearCanvas();
      ctx.drawImage(canvasPic, 0, 0);
    }
  }
}

/*
 * Redo the last action
 */
const redo = () => {
  if (cStep < cPushArray.length - 1) {
    cStep++;
    let canvasPic = new Image();
    canvasPic.onload = function () {
      clearCanvas();
      ctx.drawImage(canvasPic, 0, 0);
    }
    canvasPic.src = cPushArray[cStep];
  }

}

// receive canvas data from server
socket.on("canvas-data", (data: string) => {
  let canvasPic = new Image();
  canvasPic.onload = function () {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(canvasPic, 0, 0);
  }
  canvasPic.src = data;
})


onMounted(() => {
  initBoard();
})

</script>

<template>
  <div class="board-container">
    <div class="color-picker-container">
      <input v-model="brushColor" type="color">
      <div id="button-container">
        <button @click="clear">Clear</button>
        <button @click="undo">Undo</button>
        <button @click="redo">Redo</button>
      </div>
      <div id="slider-container">
        <input type="range" min="3" max="11" v-model.number="brushWidth" class="slider" id="myRange">
      </div>
    </div>
    <div class="sketch" id="sketch">
      <canvas class="board" id="board"></canvas>
    </div>
</div>
</template>

<style scoped>
.board-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 10px;
  padding: 10px;
  border: 1px solid white;
  border-radius: 10px;
  background-color: #0b1739;
}

.color-picker-container {
  padding: 1rem;
  margin-bottom: 1rem;
  width: 80%;
  border-bottom: 1px solid white;
  display: flex;
  justify-content: center;
}

.sketch {
  background-color: white;
  width: 758px;
  height: 424px;
}
</style>