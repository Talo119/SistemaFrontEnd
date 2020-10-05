<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      fixed
      app
      v-if="logueado"
    >
      <v-list dense>
        <template v-if="esAdministrador || esAlmacenero || esVendedor">
          <v-list-item :to="{name: 'Home'}">
            <v-list-item-action>
                <v-icon>mdi-home</v-icon>
            </v-list-item-action>
            <v-list-item-title>
                Inicio
            </v-list-item-title>
          </v-list-item>          
        </template>

        <template v-if="esAdministrador || esAlmacenero">
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>
                  Almacen
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item :to="{name:'Categoria'}">
              <v-list-item-action>
                <v-icon>mdi-table</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Categorias
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item :to="{name:'Articulo'}">
              <v-list-item-action>
                <v-icon>mdi-table</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Articulos
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

          </v-list-group>          
        </template>
       
        <template v-if="esAdministrador || esAlmacenero">
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>
                  Compras
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item :to="{name:'Ingresos'}">
              <v-list-item-action>
                <v-icon>mdi-table</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Ingresos
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item :to="{name:'Proveedores'}">
              <v-list-item-action>
                <v-icon>mdi-table</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Proveedores
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

          </v-list-group>          
        </template>

        <template v-if="esAdministrador || esVendedor">
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>
                  Ventas
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item :to="{name:''}">
              <v-list-item-action>
                <v-icon>mdi-table</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Ventas
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item :to="{name:'Clientes'}">
              <v-list-item-action>
                <v-icon>mdi-table</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Clientes
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

          </v-list-group>          
        </template>

        <template v-if="esAdministrador">
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>
                  Accesos
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item :to="{name:'Roles'}">
              <v-list-item-action>
                <v-icon>mdi-table</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Roles
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item :to="{name:'Usuarios'}">
              <v-list-item-action>
                <v-icon>mdi-table</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Usuarios
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

          </v-list-group>          
        </template>

        <template v-if="esAdministrador">
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>
                  Consultas
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item :to="{name:''}">
              <v-list-item-action>
                <v-icon>mdi-table</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Consultas compras
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item :to="{name:''}">
              <v-list-item-action>
                <v-icon>mdi-table</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Consultas ventas
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

          </v-list-group>          
        </template>

      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="blue darken-3"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title
        style="width: 300px"
        class="ml-0 pl-4"
      >
        <span class="hidden-sm-and-down">Sistema</span>
      </v-toolbar-title>
      
      <v-spacer></v-spacer>
      <v-btn @click="salir" v-if="logueado" icon>
        <v-icon>mdi-logout</v-icon> Salir
      </v-btn>
      <v-btn :to="{name: 'login'}" v-else>
        <v-icon>mdi-apps</v-icon> Login
      </v-btn>    
      
    </v-app-bar>
    <v-main>
      <v-container
        class="fill-height"
        fluid
      >
        <v-slide-y-transition mode="out-in">
          <router-view/>
        </v-slide-y-transition>
      </v-container>
    </v-main>   
    <v-footer purple padless>
    <v-col
      class="text-center"
      cols="12"
    >
      {{ new Date().getFullYear() }} — <strong>CMSoftware</strong>
    </v-col>
  </v-footer>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';

export default {
  name: 'App',

  components: {
    HelloWorld,
  },

  data: () => ({
    drawer: null,
  }),

  computed:{
    logueado(){
      return this.$store.state.usuario;
    },
    esAdministrador(){
      return this.$store.state.usuario && this.$store.state.usuario.rol == 'Administrador';
    },
    esAlmacenero(){
      return this.$store.state.usuario && this.$store.state.usuario.rol == 'Almacenero';
    },
    esVendedor(){
      return this.$store.state.usuario && this.$store.state.usuario.rol == 'Vendedor';
    }
  },

  created(){
    this.$store.dispatch("autoLogin");
  },

  methods:{
    salir(){
      this.$store.dispatch("salir");
    }
  }

};
</script>
