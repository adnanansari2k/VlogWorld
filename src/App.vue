<script setup>
import { ref,onMounted ,provide} from "vue";
import Search from "./components/Saerch.vue";
import Navbar from "./components/Navbar.vue";
import Mapview from "./components/Mapview.vue";
import backHeader from "./components/backHeader.vue"
import VideoDetails from "./components/VideoDeatails.vue"
import {getYouTubeVideoDetails} from "./components/youtubeService.js"
import Login from "./components/LoginPage.vue"
import {useMapStore} from './stores/counter.js'
const latestVideos = ref([])
const randomVideo = ref("")
const view = ref("homePage")
const store = useMapStore()
//load data youtube
onMounted(async () => {
  await store.loadVideos();
  if (store.videos && store.videos.length > 0) {
   latestVideos.value = getFiveLatestVideos()
   getRandomVideo()
   store.currentVideo = randomVideo.value
  } else {
    console.warn("No videos available in the store.");
  }
});
const getFiveLatestVideos = () => {
  return store.videos
    .slice()
    .sort((a, b) => {
      const dateA = new Date(a.publishedDate.split('.').reverse().join('-'));
      const dateB = new Date(b.publishedDate.split('.').reverse().join('-'));
      return dateB - dateA;
    })
    .slice(0, 5);
};

const getRandomVideo = ()=>{
let randomNumber = Math.floor(Math.random()*store.videos.length) 
randomVideo.value = store.videos[randomNumber]
}

//category videos
const categoryVideos =(category)=>{

 store.filteredVideos = store.videos.filter(video=>{
 return video.category === category
 })
 store.categoryStore.title = category
 view.value = 'categoryPage'
 }
 //provide to child
provide("categoryVideos",categoryVideos)
//vedioClickhamdler
const videoHandler=(video)=>{
store.openVideoDetails(video);
view.value='homePage'
}
//allVideos
const allVideos =()=>{
store.filteredVideos = store.videos
store.categoryStore.title = "All"
view.value = 'categoryPage'
}

const searchHandler =(data)=>{
const searchQuery = data.toLowerCase().trim()
 store.filteredVideos = store.filteredVideos.filter(video =>{
return video.title.toLowerCase().trim().includes(searchQuery)
})
console.log(store.filteredVideos)
}
</script>
<template>
    <div v-show="store.page === 'home' " class="main">
     <div v-show="view === 'homePage' ">
     <div class="homeHeader">
            <p>VlogWorld</p>
            <span class="material-symbols-outlined bellIcon">
                notifications
            </span>
        </div>
        <h1>Discover,wonder,<span>Be curius!</span></h1>
        <h2>Category</h2>
        <div class="mainCat">
            <span @click="categoryVideos('road trip')" class="roadTrip">
                <h6>road trip</h6>
            </span>
            <span @click="categoryVideos('mountain')" class="mountain">
                <h6>mountain</h6>
            </span>
            <span @click="categoryVideos('beach')" class="beach">
                <h6>beach</h6>
            </span>
            <span @click="categoryVideos('camping')" class="camping">
                <h6>camping</h6>
            </span>
            <span @click="categoryVideos('wonders')" class="wonders">
                <h6>wonders</h6>
            </span>
            <span @click="categoryVideos('city')" class="city">
                <h6>city</h6>
            </span>
            <span @click="categoryVideos('forest')" class="forest">
                <h6>forest</h6>
            </span>
            <span @click="categoryVideos('hotel')" class="hotelResort">
                <h6>hotel</h6>
            </span>
            <span @click="allVideos()">
              <h6>All</h6>
            </span>
            
        </div>
        <div class="headingSec">
            <h2>New added</h2>
        </div>
  <div class="newAddedList">
    <div v-for="(latestVideo, index) in latestVideos" :key="index"  class="newAdded">
       <img @click="videoHandler(latestVideo)" :src="latestVideo.thumbnail ||'https://i.postimg.cc/Pxg76L7F/images.png' " />
       <h6>
         Explore <span>{{latestVideo.location}} </span> with <span> {{latestVideo.creater}} </span>
       </h6>
    </div>
  </div>
        <div class="headingSec">
            <h2>Random</h2>
        </div>
        <div class="nearByList">
            <div class="videoBig">
              <img @click="videoHandler(randomVideo)" :src="randomVideo.thumbnail ||'https://i.postimg.cc/Pxg76L7F/images.png' " />
              <h6>
         Explore <span>{{randomVideo.location}} </span> with <span> {{randomVideo.creater}} </span>
       </h6>
            </div>
        </div>
        </div>
     <div v-show="view === 'categoryPage' " class="categoryPage">
       <backHeader @click="view = 'homePage' "/>
       <Search @search = "searchHandler"/>
      <p v-if="!store.filteredVideos || store.filteredVideos.length === 0">No videos found</p>
       <div class="categorylistPage">
       <div class="videoBox" @click="videoHandler(video)" v-for="video of store.filteredVideos">
         <img  :src="video.thumbnail ||'https://i.postimg.cc/Pxg76L7F/images.png' " />
         
         <p>{{video.title}}</p>
         <div class="titles">
         <h6>{{video.creater}}</h6>
         <h6>{{video.publishedDate}}</h6>
         </div>
         <h6>{{video.location}}</h6>
            </div>
       </div>
     </div>
    </div>
    <Mapview v-show="store.page === 'mapPage' " />
    <Login v-show="store.page === 'loginPage' " />
    <VideoDetails v-show="store.page === 'videoDetails' "/>
    <Navbar v-if="view !== 'categoryPage'" />
</template>

<style>
*::-webkit-scrollbar {
    width: 1em;
}

*,
*::before,
*::after {
    font-size: 16px;
    font-family: Roboto;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.main {
    width: 100vw;
    min-height: 100vh;
    height: 100vh;
    padding: 1vw 1vh;
    background: #fff;
}
.homeHeader {
    width: 100%;
    height: 10%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.homeHeader p {
    color: #f5c266;
    font-size:2rem;
    font-weight:800;
    position:relative;
    z-index:2;
}
.homeHeader p::before{
content:"";
position:absolute;
top:0%;
left:0;
background:#313638;
width:50%;
height:100%;
transform:skew(10deg);
z-index:-1;
animation:animateStaright 1s alternate
}
.homeHeader p::after{
content:"";
position:absolute;
top:0%;
left:50%;
background:#dc5454;
width:51%;
height:100%;
transform:skew(10deg);
z-index:-1;
animation:animateStaright 1s alternate
}
@keyframes animateBack{
from{
width:50%;
}
to{
width:0%;
}
}
@keyframes animateStaright{
from{
width:0;
}
to{
width:51%;
}
}
.proImg {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-image: url(https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png);
    background-position: center;
    background-size: cover;
}
h1 {
    font-size: 1.6rem;
    color: #717171;
    display:inline-block;
    margin: 0px 0px;
    position:relative;
    font-weight:900;
    z-index:2;
    margin:2vh 0 0 0;
}


h1 span {
    color: #dc5454;
    font-size:1.3rem;
    text-transform:uppercase;
}
h2 {
    font-size: 1.2rem;
    color: #717171;
    margin: 10px 0;
}
.mainCat {
    width: 104vw;
    height: 12vh;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-left: -2vw;
    overflow: scroll;
    scrollbar-color: transparent;
    position: relative;
    
}
.mainCat span {
    width: 70px;
    min-width: 70px;
    height: 70px;
    border-radius: 50%;
    background-position: center;
    background-size: cover;
    box-shadow: rgba(90, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
}
.mainCat h6 {
    position: relative;
    top: 100%;
    left: 0px;
    font-size: .8rem;
    text-align: center;
    color: #717171;
    font-weight: 800;
}
h1 {
    font-size: clamp(1.4rem, 2.5vw, 1.6rem);
}
h2 {
    font-size: clamp(1rem, 2vw, 1.2rem);
}

.mainCat,
.newAddedList {
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;
}
.headingSec {
    width: 100%;
    height: 5%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
h6 {
    color: #dc5454;
}
.newAddedList {
    width: 110%;
    height: 15vh;
    display: flex;
    margin-left:-3%;
}
.newAddedList .newAdded {
    width: 48%;
    min-width:45%;
    margin-top:-4%
}
.newAddedList img{
width:100%;
height: 105%;
border-radius: 4px;
clip-path:polygon(0% 13%,100% 13%,100% 87%,0% 87%);
margin-top:-4%;
position:relative;
z-index:1
}
.newAddedList h6{
color:#717171;
font-size:0.5rem;
margin-top:-19%;
text-align:center;
position:relative;
z-index:100;
background:transparent;
backdrop-filter:blur(20px)
}
.newAddedList span{
font-size:0.8rem;
}
.mainCat span:nth-child(1) {
    background-image: url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREvmO4Pz5V0EQb3_pJT6ZXivAOvrrll6y988SPNk_yNX8FquFPEteOQlw&s=10);
}
.mainCat span:nth-child(2) {
    background-image: url(https://i.postimg.cc/YCr7bKSY/pexels-jake-pnw-1761282.jpg);
}
.mainCat span:nth-child(3) {
    background-image: url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZB42gFoY0Gt4beYbHwhhYBp6XxplOdTjL5Q&s);
}
.mainCat span:nth-child(4) {
    background-image: url(https://i.postimg.cc/VsG7Dw0Q/pexels-cliford-mervil-988071-2398220.jpg);
}
.mainCat span:nth-child(5) {
    background-image: url(https://i.postimg.cc/02vGs2MJ/pexels-axp-photography-500641970-18991552.jpg);
}
.mainCat span:nth-child(6) {
    background-image: url(https://i.postimg.cc/jjcmzkpM/pexels-lkloeppel-466685.jpg);
}
.mainCat span:nth-child(7) {
    background-image: url(https://i.postimg.cc/4dZ8Fbgm/pexels-matthew-montrone-230847-1179229.jpg);
}
.mainCat span:nth-child(8) {
    background-image: url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO9fp2Xw8lRP00jBpy4X1cKwNhrRhkQ3fhdg&s);
}

.nearByList {
    width: 104%;
    height: 30vh;
}
.categorylistPage{
display:flex;
flex-wrap:wrap;
gap:1%
}
.categorylistPage .videoBox{
    height:40%;
    width:48%;
    min-height:140px;
    margin-top:3%;
    background:transparent;
    box-shadow: rgba(90, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  position:relative;
}
.categorylistPage img{
width:100%;
height:50%;
margin-top:-13%;
background-position: center;
background-size: cover;
object-fit:cover;
clip-path:polygon(0% 13%,100% 13%,100% 89%,0% 89%);

}
.titles{
display:flex;
position:absolute;
justify-content:space-between;
align-items:center;
padding:0 5%;
bottom:1%;
width:100%;
height:10%;
}
.categorylistPage p{
color:#f5c266;
margin-top:-11%;
font-size:0.5rem;
min-height:5%;
text-wrap:nowrap;
overflow:hidden;
background:#dc5454;
padding:2% 5%
}
.categorylistPage h6{
font-size:1rem;
color:#717171;
text-transform:uppercase;
text-align:center;
background:#ccc
}
.titles h6{
font-size:0.6rem;
color:#717171;
text-transform:uppercase;
background:transparent

}
.videoBig {
    width: 80%;
    height: 100%;
    margin-left: 9%;
    margin-top:10px;
    box-shadow: rgba(90, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
}
.videoBig img{
width:100%;
height:120%;
clip-path:polygon(0% 13%,100% 13%,100% 87%,0% 87%);
margin-top:-13%
}
.categoryPage p:nth-child(3) {
text-align:center;
font-size:2rem;
color:#dc5454;
margin-top:50%;
}
.videoBig h6{
color:#717171;
font-size:1rem;
margin-top:-19%;
text-align:center;
position:relative;
z-index:100;
background:transparent;
backdrop-filter:blur(20px)
}
.videoBig span{
font-size:2rem;
}
.sidebar{
width:40%;
height:100%;
background:white;
position:fixed;
right:0;
z-index:100;
}
</style>
