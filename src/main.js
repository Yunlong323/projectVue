import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import './assets/css/icon.css'

window._tcbEnv = window._tcbEnv || { "TCB_ENV_ID": "sishimap-6gv4iiy402fa8f89" }; // 云开发环境id

export const envId = window._tcbEnv.TCB_ENV_ID;
export const region = window._tcbEnv.TCB_REGION;

const app = createApp(App)

app.use(ElementPlus)
app.use(store)
    .use(router)
    .mount('#app')