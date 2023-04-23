import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import {store} from './store'
import { i18n } from './locales/index'
import {
 Notify,
 Image as VanImage,
 Cell,
 CellGroup,
 PullRefresh,
 Icon,
 Field,
 Button,
 Uploader,
 Locale,
} from 'vant';
import Vconsole from '@/utils/vconsole';
import 'vant/lib/index.css';
import "@/assets/styles/mixins.scss"
// 引入英文语言包
import enUS from 'vant/es/locale/lang/en-US';

Locale.use('en-US', enUS);
const app = createApp(App)

 app.use(store)
    .use(router)
    .use(Notify)
    .use(VanImage)
    .use(Cell)
    .use(CellGroup)
    .use(PullRefresh)
    .use(Uploader)
    .use(Button)
    .use(Icon)
    .use(Field)
    .use(i18n)
    .use(Vconsole)
    .mount('#app')
