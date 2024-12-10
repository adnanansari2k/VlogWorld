<template>
  <div class="mapBox">
    <div id="map">
    </div>
    <div  v-if="overlay" class="custom-popup">
    <img :src="selectedMarker.thumbnail"/>
    <p>{{selectedMarker.title}}</p>
    <h3>{{selectedMarker.location}}</h3>
    <button @click="videoHandler(selectedMarker)" class="playbtn">Play</button>
    <button @click="overlay = false" class="closebtn">Close</button>
  </div>
  <div @click="overlay = false" v-if="overlay" class="overlay"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useMapStore } from "../stores/counter.js";

const store = useMapStore();
const page = ref(store.page); // Track the current page from the store
let map = null;
let add = ref("");
const overlay = ref(false)
const selectedMarker = ref("")
let greenIcon = ref('')
// Initialize the map
const initializeMap = () => {
    if (!map) {
        map = L.map("map").setView([46.5935, 7.9091], 2);//46.5935° N, 7.9091° E"
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "© OpenStreetMap contributors"
        }).addTo(map);}
addMarkers()
        
 map.on("click", async function (ev) {
    try {
        // Fetch the location from coordinates
        const location = await getLocationFromCoordinates(ev.latlng.lat, ev.latlng.lng);
        if (!location || !location.country) {
            console.error("Country information is missing from location data");
            alert("Country information could not be found for this location.");
            return;
        }

        // Fetch vlogs using the location's country
    } catch (error) {
        console.error("Error occurred:", error);
        alert("An error occurred while processing your request.");
    }
    
});

}

const addMarkers = () => {
     store.videos.forEach((marker) => {
    
        const leafletMarker = L.marker([marker.mapLocation[0].trim(),marker.mapLocation[1].trim()]).addTo(map);
        leafletMarker.on("click", () => {
        selectedMarker.value = marker
        overlay.value = true
        });
      });
    };
    
const videoHandler = (video)=>{
store.openVideoDetails(video);
overlay.value = false
}
// Function to fetch location from coordinates using Nominatim API
const getLocationFromCoordinates = async (lat, lng) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        if (data && data.address) {
            const location = data.address;
            return location;
        } else {
            alert("Location not found");
        }
    } catch (error) {
        console.error("Error fetching location:", error);
        alert("Error fetching location");
    }
};

// Watch for page changes
watch(
    () => store.page,
    newPage => {
        page.value = newPage;
        if (newPage === "mapPage") {
            setTimeout(() => {
                if (!map) {
                    initializeMap(); // Initialize map if not already done
                } else {
                    map.invalidateSize(); // Adjust map if it's already initialized
                }
            }, 0);
        }
    }
);

// Mount the map if the initial page is 'mapPage'
onMounted(() => {
    if (page.value === "mapPage") {
        initializeMap();
    }
})
</script>

<style scoped>
.mapBox{
width:100vw;
height:80vh;
max-height:80vh;
}

#map {
    width: 100%;
    height: 100%; /* Fullscreen map */
}
.custom-popup {
  position: absolute;
  top: 10%;
  left: 30%;
  width:60%;
  height:40%;
  background:white;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  z-index: 1000;
  padding:2%;
}
.custom-popup img{
width:100%;
height:80%;
position:relative
}
p{
font-size:0.7rem;
background:white;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis
}
.playbtn{
background:#f5c266 ;
width:30%;
height:10%;
margin-left:16%;
margin-right:10%;

}

.closebtn{
background:#dc5454;
width:30%;
height:10%;
margin-right:-16%;
}
.overlay{
width:100%;
height:100%;
position:absolute;
top:0;
left:0;
background:transparent;
backdrop-filter:blur(2px);
z-index:999
}
</style>
