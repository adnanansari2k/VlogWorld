<script setup>
  import {useMapStore} from '../stores/counter.js'
  const store = useMapStore()
</script>
<template>
    <div class="nav">
        <div @click="store.setPage('home')">
            <span class="material-symbols-outlined">home</span>
            <p>Home</p>
        </div>
        <div @click="store.setPage('mapPage')">
            <span class="material-symbols-outlined">map</span>
             <p>Map</p>
        </div>
        <div @click="store.setPage('videoDetails')">
            <span class="material-symbols-outlined"> save </span>
             <p>Save</p>
        </div>
        <div>
           <span @click="store.setPage('loginPage')" class="material-symbols-outlined"> settings </span>
             <p>Setting</p>
        </div>
    </div>
</template>
<style scoped>
.nav {
    width: 100vw;
    height: 6vh;
    position: fixed;
    bottom: 0;
    display: flex;
    align-items: center;
    background: #fafefe;
    justify-content:space-around;
    text-align:center;
    z-index:1000
}
.nav div{
width:25%;
transition:.05s all ease-in-out
}
.nav span{
    font-size: 1.6rem;
    color:black;
}
.nav p{
margin-top:-6px;
text-align:center;
font-weight:300;
}
.nav div:hover{
background:#dc5454;
color:#fff
}
.nav div:hover span{
color:#fff;
}
</style>
