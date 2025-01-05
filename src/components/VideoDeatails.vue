<script setup>
  import {useMapStore} from '../stores/counter.js'
  import {ref,computed} from 'vue'
  import { doc, updateDoc } from "firebase/firestore";
import { db } from "../components/firebase.js"; 
import {useToast} from 'vue-toastification'
  const toast = useToast()
  const formView = ref(false)
  const store = useMapStore()
  
  const isFav = computed(() => {
   if(store.user.favorites){
  return store.user.favorites.some(video => video.id === store.currentVideo.id);
  }
     });
  const category = computed({get: () => store.currentVideo.category,
  set: (value) => {
    store.currentVideo.category = value
  }})
  const creater = computed({get: () => store.currentVideo.creater,
  set: (value) => {
    store.currentVideo.creater = value
  }})
  const location = computed({get: () => store.currentVideo.location,
  set: (value) => {
    store.currentVideo.location = value
  }})
  const mapLocation = computed({get: () => store.currentVideo.mapLocation,
  set: (value) => {
    store.currentVideo.mapLocation = value
  }})
  
const editVideo =async () =>{
      const newData = {
      creater: creater.value,
      mapLocation:mapLocation.value.split(","),
      category: category.value,
      location: location.value,
 }
 try {
    const docRef = doc(db, "videos", store.currentVideo.id);
    await updateDoc(docRef, newData);
    toast.success("Document updated successfully!");
  } catch (error) {
    toast.error("Error updating document");
  }
 }
  
</script>
<template>
    <div class="main">
        <div class="videoBox">
          <iframe
        :src="store.currentVideo.link"
        frameborder="0"
        style="width: 100%; height: 100%; margin-bottom: 10px;"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
        </div>
        <p class="titleOne">{{store.currentVideo.title}}</p>
        <div class="videoInfo">
          <div>
            <h6>{{store.currentVideo.location}}</h6>
             <p><span class="material-symbols-outlined">pin_drop</span> Country</p>
          </div>
          <div>
             
             <h6>{{store.currentVideo.creater}}</h6>
             <p><span class="material-symbols-outlined">person</span> Creater</p>
          </div>
          
          <div>
             
             <h6>{{store.currentVideo.publishedDate}}</h6>
             <p><span class="material-symbols-outlined">schedule</span> Published</p>
          </div>
          
          <div>
             
             <h6>{{store.currentVideo.category}}</h6>
             <p><span class="material-symbols-outlined">category</span> category</p>
          </div>
          
          <div>
            
             <h6>{{store.currentVideo.date}}</h6>
             <p> <span class="material-symbols-outlined">date_range</span> uploade date</p>
            
          </div>
          <div class="btns">
            <button v-show="store.user.email === 'moin@gmail.com' " @click="formView = true" class="editBtn">Edit</button>
            <span @click="store.favToggle(store.currentVideo.id)" class="material-symbols-outlined" :class="{favActive:isFav}">favorite</span>
          </div>
        </div>
        <h3 class="titleTwo">Description</h3>
        <div class="descriptionBox">
            <p @click="view = 'form' ">
                {{store.currentVideo.description}}
            </p>
        </div>
        
       <div class="formView" v-show="formView">
          <p>edit your video</p>
      <input v-model="creater" placeholder="creater"/>
      <input v-model="category" placeholder="desert,forest,city,beach" />
      <input v-model="location" placeholder="location"/>
      <input v-model="mapLocation"  placeholder="longitude and latitude"/>
      <button @click="store.deleteDocument(store.currentVideo.id)">delete</button>
      <button class="submitBtn" @click="editVideo()">Submit</button>
      <button class="clsBtn" @click="formView = false">Close</button>
  </div>
  
  <div @click="formView = false" v-if="formView" class="overlay"></div>
        </div>
    
</template>
<style scoped>
.main {
    width: 100vw;
    height: 80vh;
    padding: 0.1vh 1vw;
    background: #fbfbfb;
}
.titleOne{
background:#dc5454;
color:#fff00a;
padding:2px 0;
text-align:center
}
.titleTwo{
font-size:clamp(1.2rem,1.5rem,1.6rem);
width:100%;
color:rgba(17, 17, 26, 0.8);
text-align:center;
background:#f5c266;
font-weight:800;
margin-top:2px
}
.videoBox {
    width: 100%;
    height: 30%;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 10px 13px 3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
    
    
}
.descriptionBox {
    min-height: 20%;
    height:45%;
    width:100%;
    margin-top:1px;
    overflow: scroll;
    text-align:center;
    box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px;
    font-weight:200;
}
.descriptionBox p::first-letter{
color:#dc5454;
font-size:2rem;
}
.videoInfo{
width:100%;
height:10%;
display:flex;
flex-wrap:wrap;
align-items:center;
margin:2px 0;
background:#f4f4f8;
border:1px solid #dc5454
}
.videoInfo div {
width:33%;
height:50%;
text-align:center;
padding:2px;
}
 .videoInfo p,.videoInfo h6, .videoInfo span{
 font-size:.7rem;
 letter-spacing:2px
 }
 .videoInfo span {
color:#dc5454;
font-size:1rem;
}
.videoInfo p{
display:flex;
align-items:center;
justify-content:center
}
h6{
color:#000;
font-size:0.8rem !important;
}
.formView{
position:absolute;
top:30%;
left:50%;
transform:translate(-50%,-50%);
width:80%;
height:50%;
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
gap:5px;
background:#f5c266;
padding:0 2%;
z-index:1000;
box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
border-radius:5px;
}
.formView p{
font-size:1.5rem
}
input:focus{
outline:none;
background:#dc5454;
color:white
}
input,.formView button{
width:100%;
height:10%;
}
input{
border:0;
border-bottom:1px solid #dc5454;
box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
.overlay{
width:100vw;
height:100vh;
top:0;
position:absolute;
background:transparent;
backdrop-filter:blur(2px);
z-index:1;
}
.submitBtn{
background:#dc5454;
border:0;
}
.btns{
display:flex;
justify-content:space-around;
align-items:center;
}
.btns span{
font-size:1.6rem;
color:gray
}
.favActive{
color:#dc5454 !important;
}
.btns button{
width:40%;
height:60%;
border-radius:2px;
background:#dc5454;
font-size:0.8rem;
color:#fffffc
}

</style>
