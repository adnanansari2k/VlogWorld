<script setup>
import {ref,defineEmits} from 'vue'
const searchKeyWord = ref("")
const emit = defineEmits(["search"])
const searchVideo = () =>{
emit('search',searchKeyWord.value)
}
</script>
<template>
  <div>
  <input v-model="searchKeyWord" @keyup.enter="searchVideo" placeholder="Search your trip" />
  <span class="material-symbols-outlined m">
tune
</span>
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
  width:90%;
  height:100%;
  border-radius:10px;
  background:#ddd;
  padding:0 2%;
  border:0;
  color:#313638;
 }
  input:focus{
  outline:0
  }
  .m{
  font-size:1.6rem
  }
</style>