<script setup lang="ts">

import { onMounted, ref } from 'vue';
import io from 'socket.io-client';

// default brush vals
const brushColor = ref('black');
const brushWidth = ref(7)

// canvas control 
let mousePressed = false;
let lastX: number, lastY: number;
let canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D;

// network vars
let timeout: ReturnType<typeof setTimeout>;
const socket = io('http://localhost:3000');

// undo/redo vars
// let cPushArray = new Array();
// let cStep = -1;

/**
 * initialize board
 */
const initBoard = () => {
  // initialize canvas and context
  canvas = document.getElementById('board') as HTMLCanvasElement;
  ctx = canvas.getContext('2d')!;

  // specify width and height of canvas based on wrapper div
  let sketch = document.querySelector('#sketch');
  let sketch_style = getComputedStyle(sketch as Element);
  canvas.width = parseInt(sketch_style.getPropertyValue('width'));
  canvas.height = parseInt(sketch_style.getPropertyValue('height'));

  // event listeners
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
      // push();
    }
  });

  canvas.addEventListener("mouseleave", function (e) {
    if (mousePressed) {
      mousePressed = false;
      // push();
    }
  });

  // push();
}

/**
 * draw on canvas
 * @param x - x coordinate
 * @param y - y coordinate
 * @param isDown - is mouse down
 */
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
      emit();
    }, 100);
  }
  lastX = x; lastY = y;
}

/**
 * clear canvas
 */
const clearCanvas = () => {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
/**
 * clear canvas and emit to server
 */
const clear = () => {
  clearCanvas();
  emit();
}

// const push = () => {
//   cStep++;
//   if (cStep < cPushArray.length) { cPushArray.length = cStep; }
//   cPushArray.push(canvas.toDataURL());
// }
// const undo = () => {
//   if (cStep > 0) {
//     cStep--;
//     let canvasPic = new Image();
//     canvasPic.src = cPushArray[cStep];
//     canvasPic.onload = function () {
//       clearCanvas();
//       ctx.drawImage(canvasPic, 0, 0);
//     }
//   }
// }

// /*
//  * Redo the last action
//  */
// const redo = () => {
//   if (cStep < cPushArray.length - 1) {
//     cStep++;
//     let canvasPic = new Image();
//     canvasPic.onload = function () {
//       clearCanvas();
//       ctx.drawImage(canvasPic, 0, 0);
//     }
//     canvasPic.src = cPushArray[cStep];
//   }

// }

/**
 * draw uploaded image on canvas
 * @param e - event from file input
 */
const handleImage = (e: Event) => {
  let reader = new FileReader();
  reader.onload = function (event) {
    let img = new Image();
    img.onload = function () {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      emit();
    }
    img.src = event.target!.result as string;
  }
  reader.readAsDataURL((e.target as HTMLInputElement).files![0]);
}

/**
 * emit canvas data to server
 * @param canvasData - defualt to current canvas data 
 */
const emit = (canvasData: string = canvas.toDataURL("image/png")) => {
  socket.emit("canvas-data", canvasData);
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

socket.on("user-connected", () => {
  emit();
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
        <input type="file" id="bg-image-input" accept="image/*" @change="handleImage">
        <!-- <button @click="undo">Undo</button>
               <button @click="redo">Redo</button> -->
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