<script setup lang="ts">
import Board from '../components/Board.vue';

import { ref, type Ref } from 'vue';

const brushColor = ref('#000000');
const brushWidth = ref(7)
const BoardRef = ref<InstanceType<typeof Board> | null>(null)

function clear() {
  BoardRef.value?.clear();
}

function undo() {
  BoardRef.value?.undo();
}

</script>

<template>
  <div class="board-container">
    <div class="color-picker-container">
      <input v-model="brushColor" type="color">
      <div id="button-container">
        <button @click="clear">Clear</button>
        <button @click="undo">Undo</button>
      </div>
      <div id="slider-container">
        <input type="range" min="3" max="11" v-model.number="brushWidth" class="slider" id="myRange">
      </div>
    </div>
    <Board :brushColor="brushColor" :brushWidth="brushWidth" ref="BoardRef" />
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
</style>