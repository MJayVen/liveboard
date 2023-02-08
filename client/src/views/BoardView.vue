<script setup lang="ts">
import Board from '../components/Board.vue';
</script>

<template>
  <div class="board-container">
    <div class="color-picker-container">
      <input type="color">
    </div>
    <Board />
  </div>
</template>

<style scoped>
.board-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  width: 80%;
  height: 80%;
  border: 1px solid white;
  background-color: #0b1739;
}

.color-picker-container {
  padding: 1rem;
  width: 80%;
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid white;
}
</style>