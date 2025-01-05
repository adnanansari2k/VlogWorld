<script setup>
import { ref, onMounted, watch ,onUnmounted} from "vue";
import { useMapStore } from "../stores/counter.js";

const store = useMapStore();
const page = ref(store.page); // Track the current page from the store
let map = null;
let add = ref("");
const overlay = ref(false)
const selectedMarker = ref("")
const selectedCreater = ref("")
const selectedCategory = ref("")
const selectedCountry = ref("")
const filteredVideos = ref("")
const allMarkers = ref([]);
let isZooming = false
// Initialize the map
const initializeMap = () => {
   filteredVideos.value = store.videos
    if (!map) {
        map = L.map("map").setView([46.5935, 7.9091], 2);//46.5935° N, 7.9091° E"
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "© OpenStreetMap contributors"
        }).addTo(map);}
addMarkers()
        map.on("zoomstart", () => {console.log("Map during zoomstart:")
        isZooming = true
        });
        map.on("zoomend", () => {console.log("Map during zoomend:")
        isZooming = false
        
        deleteAllMarkers()
        addMarkers()
        });

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

//delete Markers
const deleteAllMarkers = () => {
    console.log(map,"map")
    if (!map) return;
    if (isZooming) {
        console.log("Skipping marker deletion during zoom");
        return; // Skip marker deletion during zoom
    }
    allMarkers.value.forEach((marker) => {
        if (marker && map.hasLayer(marker)) {
            map.removeLayer(marker);
        }
    });
    allMarkers.value = [];
};

const addMarkers = () => {
      
      deleteAllMarkers()
       if (isZooming) {
        console.log("Skipping marker updates during zoom");
        return; // Skip marker updates during zoom
    }
     filteredVideos.value.forEach((marker) => {
    
        const leafletMarker = L.marker([marker.mapLocation[0].trim(),marker.mapLocation[1].trim()]).addTo(map);
        leafletMarker.on("click", () => {
        selectedMarker.value = marker
        overlay.value = true
        });
        allMarkers.value.push(leafletMarker)
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

//creating new arrays
const filterMapVideos = ()=>{
filteredVideos.value = store.videos.filter(video=>{
const matchesCreater =selectedCreater.value ?  video.creater === selectedCreater.value : true;
const matchesCategory = selectedCategory.value ? video.category === selectedCategory.value : true;
const matchesCountry = selectedCountry.value ? video.location === selectedCountry.value : true
return matchesCountry && matchesCategory && matchesCreater
})

addMarkers()
console.log(filteredVideos.value)
}
onUnmounted(() => {
    if (map) {
        console.log("Destroying map...");
        map.off();
        map.remove(); 
        map = null; 
    }
});

</script>

<template>
  <div class="mapBox">
    <div id="map"></div>
    <div class="controls">
      <p>Filter videos by</p>
      <div>
        <span>
          <label for="creater">Creater:</label>
          <select v-model="selectedCreater" name="creater">
            <option v-for="creater in store.allCreaters" :value="creater">{{ creater }}</option>
          </select>
        </span>
        <span>
          <label for="category">Category:</label>
          <select v-model="selectedCategory" name="category">
            <option v-for="category in store.allCategories" :value="category">{{ category }}</option>
          </select>
        </span>
        <span>
          <label for="country">Country:</label>
          <select v-model="selectedCountry" name="country">
            <option v-for="country in store.allCountries" :value="country">{{ country }}</option>
          </select>
        </span>
        <button @click="filterMapVideos">Done</button>
      </div>
    </div>
    <div v-if="overlay" class="custom-popup">
      <img :src="selectedMarker.thumbnail" />
      <p>{{ selectedMarker.title }}</p>
      <button @click="videoHandler(selectedMarker)" class="playbtn">Play</button>
      <button @click="overlay = false" class="closebtn">Close</button>
    </div>
    <div v-if="overlay" @click="overlay = false" class="overlay"></div>
  </div>
</template>


<style scoped>
.mapBox{
width:100vw;
height:100vh;
}
#map {
    width: 100%;
    height: 70%;
    max-height:81%;/* Fullscreen map */
}
.custom-popup {
  position: absolute;
  top: 10%;
  left: 30%;
  width:60%;
  height:30%;
  background:transparent;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
  z-index: 1000;
  backdrop-filter:blur(15px)
}
.custom-popup img{
width:100%;
height:80%;
position:relative;
top:-13%;
clip-path:polygon(0% 13%,100% 13%,100% 87%,0% 87%)
}
.custom-popup p{
font-size:0.8rem;
margin-top:-20%;
color:#333333;
margin-bottom:2%;
text-align:center;
font-weight:600
}
.custom-popup button{
width:25%;
height:10%;
margin-left:13%;
border:0;
font-size:0.5rem;
}
.playbtn{
background:#f5c266 ;
margin-left:16%;
margin-right:10%;

}

.closebtn{
background:#dc5454;
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
z-index:999;
}

.controls{
width:100%;
padding:2% 5%;
}
.controls p{
font-size:0.9rem;
text-align:center;
background:#dc5454;
color:#fff;
}
.controls div{
display:flex;
justify-content:space-between;
flex-wrap:wrap;
align-items:center;
width:100%;
height:100%;
}
.controls span{
width:50%;
margin-top:2%
}
select, .controls button{
width:50%;
height:30%;
font-size:0.8rem;
background:#f5c266;
border:0
}
.controls button{
height:20px;
width:100px;
background:#dc5454;
color:white;
margin:3% auto
}
</style>
