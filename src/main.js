import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {useMapStore} from './stores/counter.js'
import App from './App.vue'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
const app = createApp(App)
app.use(createPinia())
const store = useMapStore()
app.use(Toast);
store.initAuthListener()
app.mount('#app')
