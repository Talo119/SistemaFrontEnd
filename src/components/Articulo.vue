<template>
    <v-container>    
        <v-layout>
            <v-flex>
                <v-data-table
                    :headers="headers"
                    :items="articulos"
                    :search="search"
                    sort-by="calories"
                    class="elevation-1"                    
                    >
                    <template v-slot:top>
                        <v-toolbar flat color="white">
                        <v-toolbar-title>Articulos</v-toolbar-title>
                        <v-divider
                            class="mx-4"
                            inset
                            vertical
                        ></v-divider>
                        <v-spacer></v-spacer>
                        <v-text-field class="text-xs-center" v-model="search" append-icon="mdi-search" label="Busqueda" single-line hide-details></v-text-field>
                        <v-spacer></v-spacer>
                        <v-dialog v-model="dialog" max-width="500px">
                            <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                color="primary"
                                dark
                                class="mb-2"
                                v-bind="attrs"
                                v-on="on"
                            >Nuevo</v-btn>
                            </template>
                            <v-card>
                            <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                            </v-card-title>
                
                            <v-card-text>
                                <v-container>
                                <v-row>
                                    <v-col cols="6" sm="6" md="6">
                                        <v-text-field v-model="codigo" label="Codigo"></v-text-field>
                                    </v-col>
                                    <v-col cols="6" sm="6" md="6">
                                        <v-select v-model="idcategoria"
                                            :items="categorias" label="Categoria">
                                        </v-select>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field v-model="nombre" label="Nombre"></v-text-field>
                                    </v-col>
                                    <v-col cols="6" sm="6" md="6">
                                        <v-text-field type="number" v-model="stock" label="Stock"></v-text-field>
                                    </v-col>
                                    <v-col cols="6" sm="6" md="6">
                                        <v-text-field type="number" v-model="precio_venta" label="Precio Venta"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field v-model="descripcion" label="Descripcion"></v-text-field>
                                    </v-col>   
                                     <v-col cols="12" sm="12" md="12" v-show="valida">
                                        <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v"></div>
                                    </v-col>                                  
                                </v-row>
                                </v-container>
                            </v-card-text>
                
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                                <v-btn color="blue darken-1" text @click="guardar">Guardar</v-btn>
                            </v-card-actions>
                            </v-card>
                        </v-dialog>

                        <v-dialog v-model="adModal" max-width="290px">
                            <v-card>
                                <v-card-title class="headline" v-if="adAccion==1">Activar Item?</v-card-title>
                                <v-card-title class="headline" v-if="adAccion==2">Desactivar Item?</v-card-title>
                                <v-card-text>
                                    Estas a punto de
                                    <span v-if="adAccion==1">Activar</span>
                                    <span v-if="adAccion==2">Desactivar</span>
                                    el articulo {{adNombre}}                                    
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn text color="green darken-1" @click="activarDesactivarCerrar">
                                        Cancelar
                                    </v-btn>
                                    <v-btn v-if="adAccion==1" text color="orange darken-4" @click="activar" >
                                        Activar
                                    </v-btn>
                                    <v-btn v-if="adAccion==2" text color="orange darken-4" @click="desactivar" >
                                        Desactivar
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                        </v-toolbar>
                    </template>
                    <template v-slot:item.opciones="{ item }">
                        <v-icon
                        small
                        class="mr-2"
                        @click="editItem(item)"
                        >
                        mdi-pencil
                        </v-icon>
                        <template v-if="item.condicion">
                            <v-icon
                            small
                            @click="activarDesactivarMostrar(2,item)"
                            >
                            mdi-cancel
                            </v-icon>
                        </template>

                        <template v-else>
                            <v-icon class="material-icons"
                            small
                            @click="activarDesactivarMostrar(1,item)"
                            >
                            mdi-check
                            </v-icon>
                        </template>
                        
                    </template >

                    <template class="justify-center" v-slot:item.condicion="{ item }">
                        <div v-if="item.condicion">
                            <v-chip color="green" dark>Activo</v-chip>
                        </div>
                        <div v-else>
                            <v-chip color="red" dark>Inactivo</v-chip>
                        </div>
                    </template>

                    <template v-slot:no-data>
                        <v-btn color="primary" @click="listar">Resetear</v-btn>
                    </template>
                    </v-data-table>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
    import axios from 'axios'
    export default {
        data(){
            return {
                articulos:[],
                dialog: false,
                headers: [
                { text: 'Opciones', value: 'opciones', sortable: false },
                { text: 'Codigo', value: 'codigo', sortable: false },                
                { text: 'Nombre', value: 'nombre' },
                { text: 'Categoria', value: 'categoria' },
                { text: 'Stock', value: 'stock' },
                { text: 'Precio Venta', value: 'precio_venta' },
                { text: 'Descripcion', value: 'descripcion', sortable: false },
                { text: 'Estado', value: 'condicion', sortable: false },               
                
                ],
                search:'',
                editedIndex: -1,                
                id:'',
                idcategoria:'',
                categorias:[              
                ],
                codigo:'',
                nombre:'',
                stock:0,
                precio_venta:0,
                descripcion:'',
                valida:0,
                validaMensaje:[],
                adModal: 0,
                adAccion:0,
                adNombre:'',
                adId: ''
            }
        },

        computed: {
            formTitle () {
            return this.editedIndex === -1 ? 'Nuevo Articulo' : 'Actualizar Articulo'
            },
        },

        watch: {
            dialog (val) {
            val || this.close()
            },
        },

        created () {            
            this.listar();
            this.select();
        },

        methods:{

            listar(){
                let me = this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers: header};
                axios.get('api/Articulos/Listar',configuracion).then(function(response){
                    me.articulos = response.data;
                }).catch(function(error){
                    console.log(error);
                });
            },

            select(){
                let me = this;
                var categoriasArray=[];
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers: header};
                axios.get('api/Categorias/Select',configuracion).then(function(response){                    
                    categoriasArray = response.data;  
                    categoriasArray.map(function(x){
                        me.categorias.push({text:x.nombre, value:x.idcategoria});
                    });
                }).catch(function(error){
                    console.log(error);
                });
            },

            editItem (item) {
                this.id = item.idarticulo;
                this.idcategoria = item.idcategoria;
                this.codigo = item.codigo;
                this.nombre = item.nombre;
                this.stock = item.stock;
                this.precio_venta = item.precio_venta;
                this.descripcion = item.descripcion;
                this.editedIndex = 1;
                this.dialog = true
            },

            deleteItem (item) {
                const index = this.desserts.indexOf(item)
                confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
            },

            close () {
                this.dialog = false     
                this.limpiar();           
            },

            limpiar(){
                this.id="",
                this.idcategoria="",
                this.codigo="",
                this.nombre="",
                this.precio_venta="",
                this.stock="",
                this.descripcion=""
                this.editedIndex = -1;
            },
            guardar () {

                if(this.validar()){
                    return;
                }
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers: header};
                if (this.editedIndex > -1) {
                    //Codigo para editar
                    let  me = this;
                    axios.put('api/Articulos/Actualizar',{
                        'idarticulo': me.id,
                        'idcategoria': me.idcategoria,
                        'codigo': me.codigo,
                        'nombre': me.nombre,
                        'stock': me.stock,
                        'precio_venta': me.precio_venta,
                        'descripcion':me.descripcion
                    },configuracion).then(function(response){
                        me.close();
                        me.listar();
                        me.limpiar();                        
                    }).catch(function(error){
                        console.log(error);
                    });
                } else {
                    //Codigo para guardar
                    let  me = this;
                    axios.post('api/Articulos/Crear',{
                        'idcategoria': me.idcategoria,
                        'codigo': me.codigo,
                        'nombre': me.nombre,
                        'precio_venta': me.precio_venta,
                        'stock': me.stock,
                        'descripcion':me.descripcion
                    },configuracion).then(function(response){
                        me.close();
                        me.listar();
                        me.limpiar();                        
                    }).catch(function(error){
                        console.log(error);
                    });
                }                
            },

            validar(){
                
                this.valida = 0;
                this.validaMensaje = [];                
                if (this.nombre.length < 3 || this.nombre.length > 50){                    
                    this.validaMensaje.push("El nombre debe tener mas de 3 caracteres y menos de 50 caracteres.")
                }

                if (!this.idcategoria){                    
                    this.validaMensaje.push("Seleccione una categoria.")
                }

                if (!this.stock || this.stock == 0){                    
                    this.validaMensaje.push("Ingrese el stock iniciar del articulo.")
                }

                if (!this.precio_venta || this.precio_venta == 0){                    
                    this.validaMensaje.push("Ingrese el precio de venta del articulo.")
                }

                if(this.validaMensaje.length){
                    this.valida = 1;
                }
                return this.valida;
            },

            activarDesactivarMostrar(accion, item){
                this.adModal = 1;
                this.adNombre = item.nombre;
                this.adId = item.idarticulo;
                if (accion ==1){
                    this.adAccion = 1;
                }
                else if (accion == 2){
                    this.adAccion = 2
                }
                else {
                    this.adModal=0;
                }
            },

            activarDesactivarCerrar(){
                this.adModal=0;
            },

            activar(){
                let  me = this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers: header};
                axios.put('api/Articulos/Activar/'+me.adId,{},configuracion).then(function(response){
                    me.adModal = 0;
                    me.adAccion = 0;
                    me.adNombre = '';
                    me.adId = '';
                    me.listar();                        
                }).catch(function(error){
                    console.log(error);
                });
            },

            desactivar(){
                let  me = this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers: header};
                axios.put('api/Articulos/Desactivar/'+me.adId,{},configuracion).then(function(response){
                    me.adModal = 0;
                    me.adAccion = 0;
                    me.adNombre = '';
                    me.adId = '';
                    me.listar();                        
                }).catch(function(error){
                    console.log(error);
                });
            }

        }
    }
</script>

