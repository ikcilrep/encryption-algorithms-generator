// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
      },
    ],
  },
  {
    path: '/loading',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Splash',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/Splash.vue'),
        props: route => ({
          nonLinearTransformationType: route.query.nonLinearTransformationType,
          affineCoefficient: route.query.affineCoefficient,
          affineConstant: route.query.affineConstant,
          linearTransformationType: route.query.linearTransformationType,
          diffusionLayerSize: route.query.diffusionLayerSize,
          numberOfDoubles: route.query.numberOfDoubles
        })
      },
    ],

  },
  {
    path: '/completed',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Completed',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/Completed.vue'),
        props: route => ({
          diffusionMatrix: route.query.diffusionMatrix,
          sBox: route.query.sBox,
          blockSize: route.query.blockSize,
        })

      },
    ],

  },
  {
    path: '/code',
    children: [
      {
        path: '',
        name: 'Code',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/Code.vue'),
      },
    ],

  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
