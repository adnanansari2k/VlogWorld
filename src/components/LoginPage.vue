<script setup>
import { ref } from 'vue';
import { signInWithEmailAndPassword, getAuth} from 'firebase/auth';
import { auth} from './firebase.js';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import {getYouTubeVideoDetails} from "./youtubeService.js";
import {useMapStore} from '../stores/counter.js'
import Search from "../components/Saerch.vue";
const store = useMapStore()
const view = ref('btnsPage');
const Auth = getAuth();
const user = Auth.currentUser;
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const errorMessageTwo = ref('');
const videoLink = ref('')
const creater = ref('')
const mapLocation = ref('')
const category = ref('')
const location = ref('')

//login login
const login = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    view.value = 'form'
    if (user) {
  console.log("User is logged in:", user.email);
} else {
  console.log("User is not logged in");
}
    // Redirect to the admin dashboard
  } catch (error) {
    errorMessage.value = error.code === "auth/invalid-credential" ? "Incorrect Password" : "user not found"
    console.log(error)
  }
};

//submit video
const submit = async () => {
  try {
    // Fetch video details
    const data = await getYouTubeVideoDetails(videoLink.value);
    // Validate required fields
    if (!mapLocation.value || !creater.value || !videoLink.value || !category.value) {
      errorMessageTwo.value = 'Please provide all required details.';
      return;
    }
      const cDate = new Date()
      
    // Prepare video data for submission
    const videoData = {
      link: data.embedUrl,
      creater: creater.value,
      mapLocation:mapLocation.value.split(","),
      date:`${cDate.getDate()}.${cDate.getMonth()+1}.${cDate.getFullYear()}`,
      publishedDate: `${data.publishedAt.split('T')[0]}`,
      category: category.value,
      location: location.value || data.location,
      title: data.title,
      description: data.description,
      thumbnail:data.thumbnail
    };
    
    // Add video data to Firestore
    await addDoc(collection(db, "videos"), videoData);
    errorMessageTwo.value = 'Video added successfully!';
     videoLink.value= mapLocation.value  = ""
    errorMessageTwo.value = '';
  } catch (error) {
    console.error('Error adding video:', error);
    errorMessageTwo.value = 'An error occurred while adding the video.';
  }
};


</script>
<template>
  <div class="mainLogin">
    <div v-show="view === 'btnsPage' " class="btnsPage">
      <button @click="view = 'login' " class="loginBtn">Login</button>
    </div>
    <div v-show="view === 'login' " class="loginView">
      <p>Login</p>
    <input v-model="email" type="email" placeholder="Enter your name"/>
    <input v-model="password" type="password" placeholder="Enter your password"/>
    <button @click="login()">Login</button>
    <p v-if="errorMessage">{{errorMessage}}</p>
    <button class="backBtn" @click="view= 'btnsPage' ">Back</button>
    </div>
    <div v-show="view === 'form' " class="formView">
      <p>add your video</p>
      <input v-model="videoLink" placeholder="Link of the video"/>
      <input v-model="creater" placeholder="creater"/>
      <input v-model="category" placeholder="
      desert,forest,city,beach" />
      <input v-model="location" placeholder="location"/>
      <input v-model="mapLocation" type="text"  placeholder="longitude and latitude"/>
      <button @click="submit()">Submit</button>
      <p v-if="errorMessageTwo">{{errorMessageTwo}}</p>
      <button class="backBtn" @click="view = 'login' ">Back</button>
    </div>
  </div>
</template>
<style scoped>
  .mainLogin{
  width:80vw;
  min-height:300px;
  max-height:500px;
  background:#eee;
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  padding:1% 1%;
  display:flex;
  flex-direction:column;
  align-items:center;
  text-align:center;
  }
  .mainLogin p{
  letter-spacing:3px;
  font-size:1.5rem;
  color:#dc5454;
  
  }
  input{
  margin:10px 20px;
  height:40px;
  background:transparent;
  border:0;
  border-bottom:1px solid black;
  }
  input:focus{
  outline:none;
  }
  button{
  width:50%;
  height:40px;
  margin:10px 0px;
  background:#dc5454;
  border:0;
  color:#fefefe;
  }
  button:active{
  background:#e9adadc6;
  color:black
  }
  .backBtn{
  background:#f5c266;
  display:block;
  margin:0 auto
  }
  .btnsPage{
  width:100%;
  height:100%;
  display:flex;
  align-items:center;
  flex-direction:column;
  justify-content:center
  }
  .serchInput{
  width:100%;
  margin-left:-1%;
  }
  .allVideosList{
  margin:2% 1%;
  max-height:300px;
  height:1%;
  overflow:scroll;
  display:flex;
  flex-wrap:wrap;
  gap:1%
  }
  .videoBox{
  width:49%;
  height:50%;
  }
  .videoBox img{
  width:100%;
  height:100%;
  }
 .titlePara{
font-size:0.5rem !important;
background:white;
  }
</style>