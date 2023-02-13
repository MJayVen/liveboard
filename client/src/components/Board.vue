<script setup lang="ts">

import { onMounted } from 'vue';

const props = defineProps<{
    brushColor?: string;
    brushWidth?: number;
}>();

onMounted(() => {

    let canvas = document.querySelector('#board') as HTMLCanvasElement;
    let ctx = canvas!.getContext('2d');

    function draw() {
        let sketch = document.querySelector('#sketch');
        let sketch_style = getComputedStyle(sketch as Element);
        canvas.width = parseInt(sketch_style.getPropertyValue('width'));
        canvas.height = parseInt(sketch_style.getPropertyValue('height'));

        ctx?.save();

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
        ctx!.lineJoin = 'round';
        ctx!.lineCap = 'round';

        canvas.addEventListener('mousedown', function (e) {
            ctx!.lineWidth = props.brushWidth!;
            ctx!.strokeStyle = props.brushColor!;
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
        };
    }

    draw();

    window.addEventListener('resize', () => {
        let temp_canvas = document.createElement('canvas');
        let temp_ctx = temp_canvas.getContext('2d')!;

        temp_canvas.width = canvas.width;
        temp_canvas.height = canvas.height;
        temp_ctx.fillStyle = 'white';
        temp_ctx.fillRect(0, 0, canvas.width, canvas.height);
        temp_ctx.drawImage(canvas, 0, 0);

        ctx?.drawImage(temp_canvas, 0, 0);
    });
});

function clear() {
    let canvas = document.querySelector('#board') as HTMLCanvasElement;
    let ctx = canvas!.getContext('2d');
    ctx!.clearRect(0, 0, canvas.width, canvas.height);
}

function undo() {
    console.log("undo")
}

defineExpose({
    clear,
    undo
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