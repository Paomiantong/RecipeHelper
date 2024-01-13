import './assets/main.css'
import 'ag-grid-community/styles/ag-grid.css' // Core grid CSS, always needed

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { useProjectStore } from './stores/projectManager'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const projectStore = useProjectStore()
projectStore.init()

app.mount('#app')
