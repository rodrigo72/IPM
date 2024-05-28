import { createRouter, createWebHistory } from 'vue-router';
import Login from './pages/Login.vue';
import AssignedServices from './pages/AssignedServices.vue';
import ServicePage from './pages/ServicePage.vue'
import CompletedServices from './pages/CompletedServices.vue'
import CompletedServicePage from './pages/CompletedServicePage.vue'
import ErrorPage from './pages/ErrorPage.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: Login },
        { path: '/assigned-services', component: AssignedServices },
        { path: '/completed-services', component: CompletedServices },
        { path: '/service/:id', component: ServicePage, props: true },
        { path: '/completed-service/:id', component: CompletedServicePage, props: true },
        { path: '/error', component: ErrorPage},
        { path: '/:notFound(.*)', component: ErrorPage , redirect: '/error'}
    ]
});

export default router;