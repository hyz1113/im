import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import {store} from './store/index'
import {
 Notify,
 Image as VanImage,
 Cell,
 CellGroup,
 PullRefresh,
 Icon,
 Field,
 Button,
} from 'vant';
import Vconsole from '@/utils/vconsole';
import 'vant/lib/index.css';
import "@/assets/styles/mixins.scss"

const app = createApp(App)

 app.use(store)
    .use(router)
    .use(Notify)
    .use(VanImage)
    .use(Cell)
    .use(CellGroup)
    .use(PullRefresh)
    .use(Button)
    .use(Icon)
    .use(Field)
    .use(Vconsole)
    .mount('#app')
