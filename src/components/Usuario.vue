<template>
    <v-container>    
        <v-layout>
            <v-flex>
                <v-data-table
                    :headers="headers"
                    :items="usuarios"
                    :search="search"
                    sort-by="calories"
                    class="elevation-1"                    
                    >
                    <template v-slot:top>
                        <v-toolbar flat color="white">
                        <v-toolbar-title>Mis Usuarios</v-toolbar-title>
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
                                    <v-col cols="12" sm="6" md="6">
                                        <v-text-field v-model="nombre" label="Nombre"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-select v-model="idrol"
                                            :items="roles" label="Rol">
                                        </v-select>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-select v-model="tipo_documento"
                                            :items="documentos" label="Tipo Documento">
                                        </v-select>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-text-field v-model="num_documento" label="Numero Documento"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-text-field v-model="direccion" label="Direccion"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-text-field v-model="telefono" label="Telefono"></v-text-field>
                                    </v-col> 
                                    <v-col cols="12" sm="6" md="6">
                                        <v-text-field v-model="email" label="Email"></v-text-field>
                                    </v-col> 
                                    <v-col cols="12" sm="6" md="6">
                                        <v-text-field type="password" v-model="password" label="Password"></v-text-field>
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
                                    el usuario {{adNombre}}                                    
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
                usuarios:[],
                dialog: false,
                headers: [
                { text: 'Opciones', value: 'opciones', sortable: false },                
                { text: 'Nombre', value: 'nombre' },
                { text: 'Rol', value: 'rol', sortable: false },                
                { text: 'Tipo Documento', value: 'tipo_documento', sortable: false },                
                { text: 'Numero Documento', value: 'num_documento', sortable: false },                
                { text: 'Direccion', value: 'direccion' },
                { text: 'Telefono', value: 'telefono' },
                { text: 'Email', value: 'email' },                
                { text: 'Estado', value: 'condicion', sortable: false },                               
                ],
                search:'',
                editedIndex: -1,                
                id:'',
                idrol:'',
                roles:[              
                ],
                tipo_documento:'',
                documentos:[
                    'DNI','RUC','PASAPORTE', 'CEDULA'
                ],
                nombre:'',
                num_documento:'',
                direccion:'',
                telefono:'',
                email:'',
                password:'',
                actPassword:false,
                passwordAnt:'',
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
            return this.editedIndex === -1 ? 'Nuevo Usuario' : 'Actualizar Usuario'
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
                axios.get('api/Usuarios/Listar',configuracion).then(function(response){
                    me.usuarios = response.data;
                }).catch(function(error){
                    console.log(error);
                });
            },

            select(){
                let me = this;
                var rolesArray=[];
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers: header};
                axios.get('api/Roles/Select',configuracion).then(function(response){                    
                    rolesArray = response.data;  
                    rolesArray.map(function(x){
                        me.roles.push({text:x.nombre, value:x.idrol});
                    });
                }).catch(function(error){
                    console.log(error);
                });
            },

            editItem (item) {
                this.id = item.idusuario;
                this.idrol = item.idrol                
                this.nombre = item.nombre;
                this.tipo_documento = item.tipo_documento;
                this.num_documento = item.num_documento;
                this.direccion = item.direccion;
                this.telefono = item.telefono;
                this.email = item.email;
                this.password = item.password_hash;
                this.passwordAnt = item.password_hash;
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
                this.idrol="",                
                this.nombre="",
                this.tipo_documento="",
                this.num_documento="",
                this.direccion="",
                this.telefono="",
                this.email="",
                this.password="",
                this.passwordAnt="",
                this.actPassword=false;
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
                    if(me.password != me.passwordAnt){
                        me.actPassword = true;
                    }
                    axios.put('api/Usuarios/Actualizar',{
                        'idusuario':me.id,
                        'idrol': me.idrol,                        
                        'nombre': me.nombre,
                        'tipo_documento': me.tipo_documento,
                        'num_documento': me.num_documento,
                        'direccion':me.direccion,
                        'telefono':me.telefono,
                        'email':me.email,
                        'password':me.password,
                        'act_password':me.actPassword
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
                    axios.post('api/Usuarios/Crear',{
                        'idrol': me.idrol,                        
                        'nombre': me.nombre,
                        'tipo_documento': me.tipo_documento,
                        'num_documento': me.num_documento,
                        'direccion':me.direccion,
                        'telefono':me.telefono,
                        'email':me.email,
                        'password':me.password
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
                    this.validaMensaje.push("El nombre debe tener mas de 3 caracteres y menos de 100 caracteres.")
                }

                if (!this.idrol){                    
                    this.validaMensaje.push("Seleccione un rol.")
                }

                if (!this.tipo_documento){                    
                    this.validaMensaje.push("Seleccione un tipo de documento.")
                }

                if (!this.email){                    
                    this.validaMensaje.push("Ingrese el email del usuario.")
                }

                if (!this.password){                    
                    this.validaMensaje.push("Ingrese el password del uuario..")
                }                

                if(this.validaMensaje.length){
                    this.valida = 1;
                }
                return this.valida;
            },

            activarDesactivarMostrar(accion, item){
                this.adModal = 1;
                this.adNombre = item.nombre;
                this.adId = item.idusuario;
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
                axios.put('api/Usuarios/Activar/'+me.adId,{},configuracion).then(function(response){
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
                axios.put('api/Usuarios/Desactivar/'+me.adId,{},configuracion).then(function(response){
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

