<script setup>
import {useToast} from 'vue-toastification'
import ProfilePage from "./profilePage.vue"
import SignUp from "./SignUp.vue"
import { watch,ref ,provide,computed,onBeforeMount,onMounted} from 'vue';
import { signInWithEmailAndPassword, getAuth} from 'firebase/auth';
import { auth} from './firebase.js';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import {getYouTubeVideoDetails} from "./youtubeService.js";
import {useMapStore} from '../stores/counter.js'
import Search from "../components/Saerch.vue";
const toast = useToast()
const store = useMapStore()
const view = ref("login")
const Auth = getAuth();
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const errorMessageTwo = ref('');
const videoLink = ref('')
const creater = ref('')
const mapLocation = ref([])
const longitude = ref("")
const latitude = ref("")
const northSouth = ref("")
const eastWest = ref("")
const mapLocations = ref("")
const category = ref('')
const location = ref('')
const slectedLanguage = ref('')

const lonnLatSimply = () =>{
if(northSouth.value === "south"){
latitude.value = `-${latitude.value}`
}
if(eastWest.value === "west"){
longitude.value = `-${longitude.value}`
}
mapLocations.value = [latitude.value,longitude.value]
return mapLocation.value
}
watch(
  () => store.isLoggedIn,
  (isLoggedIn) => {
    view.value = isLoggedIn ? 'profile' : 'login';
  },
  { immediate: true }
);



const login = async () => {
  try {
   const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
   const user = userCredential.user
    if (user) {
    toast.success("success")
    updateView("profile")
    store.fetchUserData(user.uid)
} else {
  toast.error("User is not logged in")
}
  } catch (error) {
    errorMessage.value = error.code === "auth/invalid-credential" ? "Incorrect Password" : "user not found"
    toast.error(errorMessage.value)
  }
};

//submit video
const submit = async () => {
  try {
    const data = await getYouTubeVideoDetails(videoLink.value);
    if (!mapLocation.value || !creater.value || !videoLink.value || !category.value) {
      errorMessageTwo.value = 'Please provide all required details.';
      return;
    }
      const cDate = new Date()
      
    // Prepare video data for submission
    const videoData = {
      link: data.embedUrl,
      creater: creater.value,
      mapLocation:lonnLatSimply(),
      date:`${cDate.getDate()}.${cDate.getMonth()+1}.${cDate.getFullYear()}`,
      publishedDate: `${data.publishedAt.split('T')[0]}`,
      category: category.value,
      location: location.value || data.location,
      title: data.title,
      description: data.description,
      thumbnail:data.thumbnail,
      language:slectedLanguage.value
    };
    
    // Add video data to Firestore
    await addDoc(collection(db, "videos"), videoData);
    store.user.addedVideos.push(videoData)
   store.saveMineVideosToFire()
    errorMessageTwo.value = '';
    toast.success("Video added successfully!")
     videoLink.value= mapLocation.value  = ""
    errorMessageTwo.value = '';
  } catch (error) {
  console.log(error)
    errorMessageTwo.value = error.code === "permission-denied" ? "you are not alowed":'An error occurred while adding the video.';
    toast.error(errorMessageTwo.value);
  }
};

const updateView=(data)=>{
view.value = data
}

provide("updateView",updateView)

const signUphandler=()=>{
view.value = 'signIn'
}
const changeView=(data)=>{
view.value = data
}

const newCategoryAdd = ()=>{
if(category.value === "addNew"){
category.value = prompt("new category")
}
}

const newCreaterAdd =()=>{
if(creater.value === 'addNew'){
creater.value = prompt("Create name")
}
}
</script>
<template>
  <div class="mainLogin">
    <div v-show="view === 'login' " class="loginView">
      <div v-show="view === 'login'">
      <p>Login</p>
    <input v-model="email" type="email" placeholder="Enter your name"/>
    <input v-model="password" type="password" placeholder="Enter your password"/>
    <button @click="login()">Login</button>
    <h6>Create a new account,<button @click="signUphandler()">sign up</button></h6>
      </div>
    </div>
    <SignUp @changeView="changeView" v-show="view === 'signIn'" />
    <div v-show="view === 'addVideo' " class="formView">
      <p class="addVideoTitle">Add your video</p>
      <input v-model="videoLink" placeholder="Link of the video"/>
    
      <input v-model="location" placeholder="location"/>
      <div class="longLat">
        <span>
         <input v-model="latitude" placeholder="Latitude"/>
         <select v-model="northSouth">
           <option value="south">S</option>
           <option value="north">N</option>
         </select>
        </span>
        
        <span>
         <input v-model="longitude" placeholder="Longitude"/>
         <select v-model="eastWest">
           <option value="east">E</option>
           <option value="west">W</option>
         </select>
        </span>
        
      </div>
       <div class="options">
         <div>
        <label for="langueges">Language</label>
        <select v-model="slectedLanguage" id="langueges">
          <option value="hinde">Hinde</option>
          <option value="english">English</option>
        </select>
        </div>
        
        <div>
        <label for="Category">Categories</label>
        <select @change="newCategoryAdd" v-model="category" id="categories">
        <option v-for="category in store.allCategories" :key="category" value="category">{{category}}</option>
        <option value="addNew">Add New</option>
        </select>
        </div>
        <div>
        <label for="creaters">Creater</label>
     <select v-model="creater" @change="newCreaterAdd" id="creaters">
        <option v-for="creater in store.allCreaters" :value="creater">{{creater}}</option>
        <option value="addNew">Add New</option>
      </select>
    </div>
      </div>
      
      <button @click="submit()">Submit</button>
      <p v-if="errorMessageTwo">{{errorMessageTwo}}</p>
      <button class="backBtn" @click="view = 'profile' ">Back</button>
    </div>
    <profilePage v-show="store.isLoggedIn && view === 'profile' "/>
  </div>
</template>
<style scoped>
  .mainLogin{
  width:100vw;
  height:100vh;
  padding:1vh 1vw;
  background:#fffffe;
  color:#313638
  }
  .loginView {
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  text-align:center;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  padding:10px;
  background:#fffffa;
  color:#313638
  }
  .loginView p{
  letter-spacing:3px;
  font-size:1.5rem;
  color:#dc5454;
  position:relative;
  }
  .addVideoTitle::before{
  content:"";
  width:8%;
  height:5%;
  background:#fffffa;
  position:absolute;
  right:0;
  clip-path:polygon(0 50%,100% 0,100% 100%)
  }
  .addVideoTitle::after{
  content:"";
  width:8%;
  height:5%;
  background:#fffffa;
  position:absolute;
  left:0;
  clip-path:polygon(0 0,100% 50%,0% 100%)
  
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
  margin-left:auto;
  margin-top: 40%
  }
  .serchInput,.formview div{
  width:100%;
  margin-left:-1%;
  }
  .formView{
  display:flex;
  justify-content:center;
  flex-direction:column;
  align-items:center;
  width:80%;
  height:70%;
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  }
  .formView p{
  font-size:1.3rem;
  background:#dc5454;
  color:#fffffc;
  width:100%;
  text-align:center
  }
  .options{
  width:100%;
  height:10%;
  padding:0 10%;
  display:flex;
  justify-content:space-between;
  text-align:center
  }
  .options div{
  min-width:20%
  }
  
  label{
  font-size:0.7rem
  }
   select{
  font-size:0.7rem;
  }
  .longLat{
  width:100%;
  height:10%;
  padding:0 10%;
  display:flex;
  align-items:center;
  justify-content:space-between
  }
 .longLat span{
 width:50%;
 height:100%;
 }
 .longLat select{
 width:30%;
 height:50%;
 border-left:0;
 background:transparent;
 border:0;
 }
 .longLat select:focus{
 outline:none;
 }
  .longLat input{
  width:60%;
  height:50%;
  font-size:0.8rem;
  margin:5%;
  
  }
</style>
