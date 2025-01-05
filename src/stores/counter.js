import { defineStore } from 'pinia';
import { getDoc,collection, getDocs,deleteDoc,doc,updateDoc } from "firebase/firestore";
import { auth} from '../components/firebase.js';

import { onAuthStateChanged,signOut } from 'firebase/auth'
import { db } from "../components/firebase.js";
import {ref} from 'vue'
export const useMapStore = defineStore('map', {
  state: () => ({
    page: 'home',
    isMapVisible:false,
    user:{
      uid:"",
      name:null,
      email:null,
      favorites:[],
      addedVideos:[]
    },
    isLoggedIn:false,
    videos: [],
    categoryStore:{
    videos: [],
    title:"adnan",
    errorMassage: false},
    currentVideo:{},
    filteredVideos:[]
  }
  ),
  getters:{
  allCategories:(state)=>{
   const category = state.videos.map(video=>video.category)
   return [... new Set(category)]
  },
  allCreaters :(state)=>{
    const creater = state.videos.map(video=>video.creater)
    return [... new Set(creater)]
  },
  allCountries :(state)=>{
    const location = state.videos.map(video=>video.location)
    return [... new Set(location)]
  }
  },
  actions: {
    setPage(newPage) {
      this.page = newPage;
      this.isMapVisible = newPage === 'mapPage'

    },
    async loadVideos() {
      try {
        const querySnapshot = await getDocs(collection(db, "videos"));
        this.videos = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
      } catch (error) {
        console.error("Error loading videos:", error)
      }
    },
    openVideoDetails(video){
      this.page = 'videoDetails'
      this.currentVideo = video
    },
   async fetchUserData(uid){
      try{
        const userDocRef = await doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef)
    if (userDoc.exists()) {
      this.user = userDoc.data();
    } else {
      console.log("no data")
    }
      }catch(error){
        console.log(error)
      }
    },
    initAuthListener(){
      onAuthStateChanged(auth,(firebaseUser)=>{
        if(firebaseUser){
          this.isLoggedIn = true
          this.user.email = firebaseUser.email
          this.fetchUserData(firebaseUser.uid)
        }else{
          this.isLoggedIn = false;
            this.user = {
              uid: "",
              name: null,
              email: null,
              favorites: [],
              addedVideos: []
            };
        }
        console.log('Store state:', this.$state);

      })
    },
  async signOutUser(){
      try {
        await signOut(auth)
        console.log("User signed out successfully")
        this.isLoggedIn = false
      } catch (error) {
        console.error("Error signing out:", error);
      }
    },
    async deleteDocument(documentId){
      try {
        const docRef = doc(db, 'videos', documentId)
        await deleteDoc(docRef)
        console.log("Document deleted successfully")
      } catch (error) {
        console.error("Error deleting document:", error)
      }
    },
    favToggle(id) {
  const favorites = this.user.favorites;
  const videoIndex = favorites.findIndex(video => video.id === id);
  // Find index of video
  if (videoIndex > -1) {
    // If video is found, remove it
    favorites.splice(videoIndex, 1);
    console.log("Video removed");
  } else {
    // If video is not found, add the current video
    favorites.push(this.currentVideo);
  }
  this.saveFavToFire()
},
async saveFavToFire(){
  try{
    const userDocRef = doc(db,"users",this.user.uid)
    await updateDoc(userDocRef,{
      favorites:this.user.favorites
    })
  }catch(error){
    console.log("not added to fav",error)
  }
},
async saveMineVideosToFire(){
    try{
      const userDocRef = doc(db,"users",this.user.uid)
      await updateDoc(userDocRef,{
        addedVideos:this.user.addedVideos
      })
      console.log("saved to firefox")
    }catch(error){
      console.log('not added')
    }
},
  }
});
