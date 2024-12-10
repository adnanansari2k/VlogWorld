<script setup>
  import { useMapStore } from "../stores/counter.js";
const store = useMapStore();
</script>
<template>
  <div>
    <span class="material-symbols-outlined">
arrow_back
</span>
  <p>{{store.categoryStore.title}}</p>
  </div>
</template>
<style scoped>
  div{
  width:65%;
  height:5%;
  display:flex;
  justify-content:space-between;
  margin-bottom:10px;
  align-items:center;
  text-transform:uppercase;
  font-weight:400;
  letter-spacing:2px
  }
</style>