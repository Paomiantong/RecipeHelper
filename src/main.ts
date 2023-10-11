import './assets/main.css'
import 'ag-grid-community/styles/ag-grid.css' // Core grid CSS, always needed

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
