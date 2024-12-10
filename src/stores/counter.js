import { defineStore } from 'pinia';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../components/firebase.js";
import {ref} from 'vue'
export const useMapStore = defineStore('map', {
  state: () => ({
    page: 'home',
    isMapVisible:false,
    videos: [],
    categoryStore:{
    videos: [],
    title:"adnan",
    errorMassage: false},
    currentVideo:{}
  }),
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
        }));
        console.log("Videos loaded:", this.videos);
      } catch (error) {
        console.error("Error loading videos:", error);
      }
    },
    openVideoDetails(video){
      this.page = 'videoDetails'
      this.currentVideo = video
    }
  }
});
