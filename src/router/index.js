import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Categoria from '../components/Categoria.vue'
import Articulo from '../components/Articulo.vue'
import Rol from '../components/Rol.vue'
import Usuario from '../components/Usuario.vue'
import Cliente from '../components/Cliente.vue'
import Proveedor from '../components/Proveedor.vue'
import Login from '../components/Login.vue'
import Ingreso from '../components/Ingreso.vue'
import Venta from '../components/Venta.vue'
import ConsultaVenta from '../components/ConsultaVenta.vue'
import store from '../store/index.js'


Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta:{
      administrador: true,
      almacenero: true,
      vendedor: true
    }
  },
  {
    path: '/categorias',
    name: 'Categoria',
    component: Categoria,
    meta:{
      administrador: true,
      almacenero: true
    }
  },
  {
    path: '/articulos',
    name: 'Articulo',
    component: Articulo,
    meta:{
      administrador: true,
      almacenero: true      
    }
  },
  {
    path: '/roles',
    name: 'Roles',
    component: Rol,
    meta:{
      administrador: true
    }
  },

  {
    path: '/usuarios',
    name: 'Usuarios',
    component: Usuario,
    meta:{
      administrador: true      
    }
  },
  {
    path: '/clientes',
    name: 'Clientes',
    component: Cliente,
    meta:{
      administrador: true,      
      vendedor: true
    }
  },
  {
    path: '/proveedores',
    name: 'Proveedores',
    component: Proveedor,
    meta:{
      administrador: true,
      almacenero: true      
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta:{
      libre: true
    }
  },
  {
    path: '/ingresos',
    name: 'Ingresos',
    component: Ingreso,
    meta:{
      administrador: true,
      almacenero: true      
    }
  },
  {
    path: '/ventas',
    name: 'Ventas',
    component: Venta,
    meta:{
      administrador: true,
      vendedor: true      
    }
  },

  {
    path: '/consultaventas',
    name: 'consultaventas',
    component: ConsultaVenta,
    meta:{
      administrador: true,
      vendedor: true      
    }
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) =>{
  if(to.matched.some(record => record.meta.libre)){
    next()
  } else if (store.state.usuario && store.state.usuario.rol == 'Administrador'){
    if (to.matched.some(record => record.meta.administrador)){
      next()
    }
  } else if (store.state.usuario && store.state.usuario.rol == 'Almacenero'){
    if (to.matched.some(record => record.meta.almacenero)){
      next()
    }
  }  else if (store.state.usuario && store.state.usuario.rol == 'Vendedor'){
    if (to.matched.some(record => record.meta.vendedor)){
      next()
    }
  } else{
    next({
      name: 'login'
    })
  }
})

export default router
