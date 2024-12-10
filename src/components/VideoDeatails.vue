<script setup>
  import {useMapStore} from '../stores/counter.js'
  import {ref} from 'vue'
  import { doc, updateDoc } from "firebase/firestore";
import { db } from "../components/firebase.js"; 
 const formView = ref(false)
  const store = useMapStore()
  const category = ref('')
  const videoLink = ref(store.currentVideo.link)
  const creater = ref('')
  const location = ref('')
  const mapLocation = ref('')
  
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

    console.log("Document updated successfully!");
  } catch (error) {
    console.error("Error updating document:", error);
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
        <p class="titleTwo">{{store.currentVideo.title}}</p>
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
             <p><span class="material-symbols-outlined">schedule</span> Published Date</p>
          </div>
          
          <div>
             
             <h6>{{store.currentVideo.category}}</h6>
             <p><span class="material-symbols-outlined">category</span> category</p>
          </div>
          
          <div>
            
             <h6>{{store.currentVideo.date}}</h6>
             <p> <span class="material-symbols-outlined">date_range</span> uploade date</p>
            
          </div>
          <button @click="formView = true" class="editBtn">Edit</button>
        </div>
        <h3 class="titleTwo">Description</h3>
        <div class="descriptionBox">
            <p @click="view = 'form' ">
                {{store.currentVideo.description}}
            </p>
        </div>
        
       <div class="formView" v-show="formView">
          <p>edit your video</p>
      <input v-model="videoLink" placeholder="Link of the video" readonly/>
      <input v-model="creater" placeholder="creater"/>
      <input v-model="category" placeholder="desert,forest,city,beach" />
      <input v-model="location" placeholder="location"/>
      <input v-model="mapLocation" type="text"  placeholder="longitude and latitude"/>
      <button @click="editVideo()">Submit</button>
        </div>
    </div>
    
</template>
<style scoped>
.main {
    width: 100vw;
    height: 80vh;
    padding: 1vh 1vw;
    background: #fbfbfb;
}
.titleTwo{
font-size:clamp(1.2rem,1.5rem,1.6rem);
width:100%;
color:#f5c266;
text-align:center;
background:#717171;
font-weight:800
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
}
.videoInfo div {
width:33%;
height:50%;
text-align:center;
padding-top:10px
}
 .videoInfo p,.videoInfo h6, .videoInfo span{
 font-size:.7rem;
 letter-spacing:2px
 }
h3{
margin:5px 0
}
.editBtn{
width:20%;
height:30%;
margin-left:auto;
margin-top:auto;
padding:2px 5px;
background:#dc5454;
}
.formView{
position:absolute;
top:50%;
left:50%;
transform:translate(-50%,-50%);
width:80%;
height:50%;
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
gap:5px;
background:white;
padding:0 2%
}
.formView p{
font-size:1.5rem
}
input,.formView button{
width:100%;
height:10%;
}
</style>
