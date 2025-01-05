<script setup>
  import {useMapStore} from '../stores/counter.js'
  import {inject,ref} from 'vue'
  const store = useMapStore()
  const categoryVideos = inject("categoryVideos")
  const updateView = inject("updateView")

  const favList=()=>{
   store.setPage("home")
   categoryVideos("favorites")
   store.filteredVideos = store.user.favorites
  }
  
  const myVideosList=()=>{
   store.setPage("home")
   categoryVideos("My Videos")
   store.filteredVideos = store.user.addedVideos
  }
  
  
  const signOutHadnler=()=>{
  store.signOutUser();
  }
  
  
  const addVideoForm=()=>{
  updateView("addVideo")
  }
  
</script>
<template>
  <div class="main">
   <div class="nav">
  <p>Profile</p>
  </div>
  <div class="nameBox">
    <div>
    <span class="material-symbols-outlined">person</span>
    </div>
    <p>{{store.user.name}}</p>
    <p>{{store.user.email}}</p>
  </div>
  
  <div class="optionBox">
    <div>
      <span class="material-symbols-outlined">person</span>
    <p>My profile</p>
    </div>
     <div @click="favList()">
      <span class="material-symbols-outlined">Favorite</span>
    <p>Favorites</p>
    </div>
    
    <div @click="addVideoForm()">
      <span class="material-symbols-outlined">add</span>
    <p>Add videos</p>
    </div>
    
     <div  @click="myVideosList">
      <span class="material-symbols-outlined">dns</span>
    <p>My videos</p>
    </div>
    
    <div @click="signOutHadnler" class="logoutBox">
      <span class="material-symbols-outlined">logout</span>
    <p>Log out</p>
    </div>
    </div>
  </div>
  
</template>
<style scoped>
  .main{
  width:100vw;
  height:100vh;
  padding:1vh 1vw;
  background:#fffffe;
  }
  .nav{
  display:flex;
  width:100%;
  height:5%;
  justify-content:center;
  align-items:center;
  color:#313638
  }
  .nav p{
  font-size:1.5rem;
  font-weight:600;
  }
  .nameBox{
  width:100%;
  height:20%;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  }
  .nameBox div{
  width:70px;
  height:70px;
  min-height:70px;
  border-radius:100%;
  text-align:center;
  line-height:100px;
  margin-bottom:10px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  }
  .nameBox span{
  font-size:3rem;
  font-weight:400;
  
  }
  .nameBox p{
  font-size:1.2rem;
  font-weight:600;
  color:#313638;
  }
  .nameBox p:nth-child(2){
  color:#dc5454;
  letter-spacing:2px
  }
  .nameBox p:nth-child(3){
  color:gray;
  font-weight:300;
  font-size:1rem
  }
  .optionBox{
  width:100%;
  height:40%;
  padding:5% 5%;
  }
  .optionBox div{
  display:flex;
  gap:5%;
  align-items:center;
  margin-bottom:10%
  }
  .optionBox div span {
  font-size:1.9rem;
  color:#f5c266
  }

  .optionBox p{
  font-size:1.1rem;
  font-weight:500;
  letter-spacing:2px;
  color:#313638
  }
  .logoutBox{
   display:flex;
   justify-content:center;
   background:#dc5454;
  }
  .logoutBox p, .logoutBox span{
  color:#fffffe !important;
  }
</style>