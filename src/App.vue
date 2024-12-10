<script setup>
import { ref,onMounted } from "vue";
import Search from "./components/Saerch.vue";
import Navbar from "./components/Navbar.vue";
import Mapview from "./components/Mapview.vue";
import backHeader from "./components/backHeader.vue"
import VideoDetails from "./components/VideoDeatails.vue"
import {getYouTubeVideoDetails} from "./components/youtubeService.js"
import Login from "./components/LoginPage.vue"
import {useMapStore} from './stores/counter.js'
const latestVideos = ref([])
const filteredVideos = ref([])
const randomVideo = ref("")
const view = ref("homePage")
const store = useMapStore()
//load data youtube
onMounted(async () => {
  await store.loadVideos(); 
  if (store.videos && store.videos.length > 0) {
   latestVideos.value = getFiveLatestVideos()
   getRandomVideo()
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
 filteredVideos.value = store.videos.filter(video=>{
 return video.category === category
 })
 store.categoryStore.title = category
 view.value = 'categoryPage'
 }
//vedioClickhamdler
const videoHandler=(video)=>{
store.openVideoDetails(video);
view.value='homePage' 
}

/* <iframe v-show="false"
        :src="latestVideo.link" 
        frameborder="0"
        style="width: 100%; height: 100%;"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe> */
</script>
<template>
    <div v-show="store.page === 'home' " class="main">
     <div v-show="view === 'homePage' ">
        <div class="homeHeader">
            <div>
                <div class="proImg"></div>
                <p>VlogWorld</p>
            </div>
            <span class="material-symbols-outlined bellIcon">
                notifications
            </span>
        </div>
        <h1>Discover,wonder,<span>Be curius!</span></h1>
        <Search />
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
            <span @click="categoryVideos('hotelResort')" class="hotelResort">
                <h6>hotel and resort</h6>
            </span>
        </div>
        <div class="headingSec">
            <h2>New added</h2>
            <h6>see all</h6>
        </div>
  <div class="newAddedList">
    <div v-for="(latestVideo, index) in latestVideos" :key="index"  class="newAdded">
       <img @click="videoHandler(latestVideo)" :src="latestVideo.thumbnail ||'https://i.postimg.cc/Pxg76L7F/images.png' " />
    </div>
  </div>
        <div class="headingSec">
            <h2>Near me</h2>
            <h6>see all</h6>
        </div>
        <div class="nearByList">
            <div class="videoBig">
              <img @click="videoHandler(randomVideo)" :src="randomVideo.thumbnail ||'https://i.postimg.cc/Pxg76L7F/images.png' " />
            </div>
        </div>
        </div>
     <div v-show="view === 'categoryPage' " class="categoryPage">
       <backHeader @click="view = 'homePage' "/>
       <Search />
      <p v-if="!filteredVideos || filteredVideos.length === 0">No videos found</p>
       <div class="categorylistPage">
       <div @click="videoHandler(video)" v-for="video of filteredVideos">
         <img  :src="video.thumbnail ||'https://i.postimg.cc/Pxg76L7F/images.png' " />
         <p>{{video.title}}</p>
            </div>
       </div>
     </div>
    </div>
    <Mapview v-show="store.page === 'mapPage' " />
    <Login v-show="store.page === 'settings' " />
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
.homeHeader div {
    display: flex;
}
.homeHeader p {
    color: #f5c266;
    font-size:2rem;
    font-weight:800;
    position:relative;
    z-index:2;
    margin:1vh 0 0 17vw;
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
    color: #2b2b2b;
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
    color: #313638;
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
    margin-left: -2vw;
}
.newAddedList .newAdded {
    width: 48%;
    min-width:48%;
    height:100%;
}
.newAddedList img{
width: 100%;
height: 100%;
border-radius: 4px;
background-position: center;
object-fit: contain;
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
width:100%;
height:100%;
display:flex;
flex-wrap:wrap;
gap:10px
}
.categorylistPage div{
    width: 48%;
    height: 50%;
    min-width:45%;
    margin-top:10px;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
}
.categorylistPage div img{
width:100%;
height:100%;
background-position: center;
background-size: cover;
}
.categorylistPage div p{
color:#dc5454
}


.videoBig {
    width: 80%;
    height: 100%;
    border: 1px solid black;
    margin-left: 9%;
    margin-top:10px;
    background-image: url(https://i.postimg.cc/YCr7bKSY/pexels-jake-pnw-1761282.jpg);
    background-position: center;
    background-size: cover;
}
.videoBig img{
width:100%;
height:100%;
}
.categoryPage p:nth-child(3) {
text-align:center;
font-size:2rem;
color:#dc5454;
margin-top:50%;
}
</style>
