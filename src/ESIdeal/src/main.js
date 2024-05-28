import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import HeaderSection from './components/HeaderSection.vue'
import Button from './components/ui/Button.vue'
import ModalMenu from './components/ModalMenu.vue'
import ServicesTable from './components/ServicesTable.vue'
import ModalConfirmDialog from './components/ModalConfirmDialog.vue'
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/aura-light-blue/theme.css'

const app = createApp(App);

app.component('HeaderSection', HeaderSection);
app.component('Button', Button);
app.component('ModalMenu', ModalMenu);
app.component('ServicesTable', ServicesTable);
app.component('ModalConfirmDialog', ModalConfirmDialog);

app.use(PrimeVue);
app.use(router);
app.mount('#app');
