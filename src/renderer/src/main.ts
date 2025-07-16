import router from '@renderer/router/index'
import { createApp } from 'vue'
import App from './App.vue'
import 'primeicons/primeicons.css'
import 'virtual:uno.css'
import './style/reset.css'
import './style/base.scss'
import 'virtual:svg-icons-register'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice';

const app = createApp(App)
app.use(router)
    .use(PrimeVue, {
        theme: {
            preset: Aura,
            locale: 'zh-CN'
        }
    })
    .use(ToastService).use(ConfirmationService)
    .mount('#app')
