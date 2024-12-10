<script setup></script>
<template>
  <div>
  <span class="material-symbols-outlined s">
search
</span>
  <input placeholder="Search your trip">
  <span class="material-symbols-outlined m">
mic
</span>
  </input>
  </div>
</template>
<style scoped>
  div{
  height:5vh;
  width:95vw;
  display:flex;
  align-items:center;
  }
  input{
  width:95%;
  height:100%;
  border-radius:10px;
  background:#ddd;
  padding:0 30%;
  border:0;
  color:#313638
 }
  input:focus{
  outline:0
  }
  .s{
  position:absolute;
  left:18px
  }
  .m{
  position:absolute;
  left:85%
  }
</style>