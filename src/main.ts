import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/modules/im'
import vant from 'vant';
import vconsole from '@/utils/vconsole';
import 'vant/lib/index.css';
import "@/assets/styles/mixins.scss"

const app = createApp(App)

 app.use(store)
    .use(router)
    .use(vant)
    .use(vconsole)
    .mount('#app')
