import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import { ElButton, ElRow, ElCol, ElSwitch, ElInput }  from 'element-plus'


const app = createApp(App)

app.use(router)
// app.use(ElementPlus)
app.component('ElButton', ElButton)
app.component('ElRow', ElRow)
app.component('ElCol', ElCol)
app.component('ElSwitch', ElSwitch)
app.component('ElInput', ElInput)

app.mount('#app')
