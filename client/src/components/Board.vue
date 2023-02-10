<script setup lang="ts">

import { onMounted } from 'vue';

const props = defineProps<{
    color?: string;
}>();

onMounted(() => {
    draw();
});

let elements = [] as Path2D[];


function draw() {
    let canvas = document.querySelector('#board') as HTMLCanvasElement;
    let ctx = canvas!.getContext('2d');
    let sketch = document.querySelector('#sketch');
    let sketch_style = getComputedStyle(sketch as Element);
    canvas.width = parseInt(sketch_style.getPropertyValue('width'));
    canvas.height = parseInt(sketch_style.getPropertyValue('height'));

    let mouse = { x: 0, y: 0 };
    let last_mouse = { x: 0, y: 0 };

    /* Mouse Capturing Work */
    canvas.addEventListener('mousemove', function (e) {
        last_mouse.x = mouse.x;
        last_mouse.y = mouse.y;

        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
    }, false);


    /* Drawing on Paint App */
    ctx!.lineWidth = 5;
    ctx!.lineJoin = 'round';
    ctx!.lineCap = 'round';

    canvas.addEventListener('mousedown', function (e) {
        ctx!.strokeStyle = props.color!;
        canvas.addEventListener('mousemove', onPaint, false);
    }, false);

    canvas.addEventListener('mouseup', function () {
        canvas.removeEventListener('mousemove', onPaint, false);
    }, false);

    let onPaint = function () {
        let line = new Path2D();
        line.moveTo(last_mouse.x, last_mouse.y);
        line.lineTo(mouse.x, mouse.y);
        ctx!.stroke(line);
        elements.push(line);
    };
}

window.addEventListener('resize', () => {
    let canvas = document.querySelector('#board') as HTMLCanvasElement;
    let ctx = canvas!.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < elements.length; i++) {
        let newLine = new Path2D(elements[i]);
        ctx?.stroke(newLine);
    }
    console.log(elements)
});

</script>

<template>
    <div class="sketch" id="sketch">
        <canvas class="board" id="board"></canvas>
    </div>
</template>

<style scoped>
.sketch {
    background-color: white;
    width: 758px;
    height: 424px;
}

/* .board {} */
</style>