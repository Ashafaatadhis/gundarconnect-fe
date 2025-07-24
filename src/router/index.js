import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
// import FeedView from '@/views/FeedView.vue'
import AboutView from '@/views/AboutView.vue'
import SavedView from '@/views/SavedView.vue'
import LoginView from '@/views/LoginView.vue'
import PostDetail from '@/components/PostDetail.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'  // default redirect
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { title: 'Login - GundarConnect' }
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeView,
    meta: { title: 'Home - GundarConnect' }
  },
  // {
  //   path: '/feed',
  //   name: 'Feed',
  //   component: FeedView,
  //   meta: { title: 'Feed - GundarConnect' }
  // },
  {
    path: '/saved',
    name: 'Saved',
    component: SavedView,
    meta: { title: 'Saved - GundarConnect' }
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
    meta: { title: 'About - GundarConnect' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/components/ProfilePage.vue'),
    meta: { title: 'Profile - GundarConnect' }
  },
  {
    path: '/@:username',
    name: 'UserProfile',
    component: () => import('@/components/ProfilePage.vue'),
    meta: { title: 'Profile - GundarConnect' }
  },
  {
    path: '/post/:id',
    name: 'PostDetail',
    component: PostDetail,
    props: true // Untuk passing route params sebagai props
  }
]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guard: redirect /profile ke /:username jika login
router.beforeEach((to, from, next) => {
  if (to.path === '/profile') {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.username) {
          return next({ name: 'UserProfile', params: { username: payload.username } });
        }
      } catch (e) {}
    }
  }
  next();
});

// Set document title from route meta
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
