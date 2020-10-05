<template>
    <v-container>    
        <v-layout>
            <v-flex>
                <v-data-table
                    :headers="headers"
                    :items="ingresos"
                    :search="search"
                    sort-by="calories"
                    class="elevation-1"  
                    v-if="verNuevo==0"                  
                    >
                    <template v-slot:top>
                        <v-toolbar flat color="white">
                        <v-toolbar-title>Ingresos</v-toolbar-title>
                        <v-divider
                            class="mx-4"
                            inset
                            vertical
                        ></v-divider>
                        <v-spacer></v-spacer>
                        <v-text-field v-if="verNuevo==0" class="text-xs-center" v-model="search" append-icon="mdi-search" label="Busqueda" single-line hide-details></v-text-field>
                        <v-spacer></v-spacer>
                        <v-btn
                            v-if="verNuevo==0"
                            color="primary"
                            dark
                            class="mb-2"
                            @click="mostrarNuevo"                          
                        >Nuevo</v-btn>
                        
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
                        <template v-if="item.estado == 'Aceptado'">
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

                    <template class="justify-center" v-slot:item.estado="{ item }">
                        <div v-if="item.estado == 'Aceptado'">
                            <v-chip color="green" dark>Aceptado</v-chip>
                        </div>
                        <div v-else>
                            <v-chip color="red" dark>{{item.estado}}</v-chip>
                        </div>
                    </template>

                    <template v-slot:no-data>
                        <v-btn color="primary" @click="listar">Resetear</v-btn>
                    </template>
                    </v-data-table>
                    <v-container grid-list-sm class="pa-4 white" v-if="verNuevo">
                        <v-layout row wrap>
                            <v-flex xs12 ms4 md4 lg4 xl4>
                                <v-select v-model="tipo_comprobante"
                                    :items="comprobantes" label="TipoComprobante">
                                </v-select>
                            </v-flex>

                            <v-flex xs12 ms4 md4 lg4 xl4>
                                <v-text-field v-model="serie_comprobante" label="Serie Comprobante">
                                </v-text-field>
                            </v-flex>

                            <v-flex xs12 ms4 md4 lg4 xl4>
                                <v-text-field v-model="num_comprobante" label="Numero Comprobante">
                                </v-text-field>
                            </v-flex>

                            <v-flex xs12 ms4 md4 lg4 xl4>
                                <v-select v-model="idproveedor"
                                    :items="proveedores" label="Proveedor">
                                </v-select>
                            </v-flex>

                            <v-flex xs12 ms4 md4 lg4 xl4>
                                <v-text-field type="number" v-model="impuesto" label="Impuesto">
                                </v-text-field>
                            </v-flex>

                            <v-flex xs12 ms8 md8 lg8 xl8>
                                <v-text-field @keyup.enter="buscarCodigo()" v-model="codigo" label="Codigo">
                                </v-text-field>
                            </v-flex>

                            <v-flex xs12 ms2 md2 lg2 xl2>
                                <v-btn small fab dark color="teal">
                                    <v-icon class="material-icons" dark>mdi-list</v-icon>
                                </v-btn>
                            </v-flex>

                            <v-flex xs12 ms2 md2 lg2 xl2 v-if="errorArticulo">
                                <div class="red--text" v-text="errorArticulo"></div>
                            </v-flex>

                            <v-flex xs12 ms12 md12 lg12 xl12>
                                <v-data-table
                                    :headers="cabeceraDetalles"
                                    :items="detalles"
                                    hide-actions                                    
                                    class="elevation-1"                    
                                    >
                                    <template v-slot:top>
                                        <v-toolbar flat color="white">
                                        <v-toolbar-title>Detalles</v-toolbar-title>
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

                                        
                                        </v-toolbar>
                                    </template>
                                    <template v-slot:item.borrar="{ item }">
                                        <v-icon
                                        small
                                        class="mr-2"
                                        @click="eliminarDetalle(detalles,item)"
                                        >
                                        mdi-delete
                                        </v-icon>                                       
                                        
                                    </template >
                                    
                                    <template v-slot:item.cantidad="{ item }">
                                        <v-text-field type="number" v-model="item.cantidad"></v-text-field>
                                    </template >

                                    <template v-slot:item.precio="{ item }">
                                        <v-text-field type="number" v-model="item.precio"></v-text-field>
                                    </template >

                                    <template v-slot:item.subtotal="{ item }">
                                       L.{{item.cantidad * item.precio}}                                        
                                    </template >

                                    <template v-slot:no-data>
                                        <v-btn color="primary" @click="listar">Resetear</v-btn>
                                    </template>
                                    
                                    <template slot="no-data">
                                        No hay articulos agregados al detalle.
                                    </template>

                                    </v-data-table>
                                    <v-flex class="text-xs-right">
                                        <strong>Total Parcial:</strong>L.{{totalParcial=(total-totalImpuesto).toFixed(2)}}
                                    </v-flex>
                                    <v-flex class="text-xs-right">
                                        <strong>Total Impuesto:</strong>L.{{totalImpuesto=(total*impuesto/(100+impuesto)).toFixed(2)}}
                                    </v-flex>
                                    <v-flex class="text-xs-right">
                                    <strong>Total Neto:</strong>L.{{total=(calcularTotal).toFixed(2)}}
                                    </v-flex>
                            </v-flex>

                            <v-flex xs12 ms12 md12 lg12 xl12>
                                <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v"></div>
                            </v-flex>

                            <v-flex xs12 ms12 md12 lg12 xl12>
                                <v-btn @click="ocultarNuevo" color="blue darken-1" text>Cancelar</v-btn>
                                <v-btn color="success">Guardar</v-btn>
                            </v-flex>

                        </v-layout>
                    </v-container>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
    import axios from 'axios'
    export default {
        data(){
            return {
                ingresos:[],
                dialog: false,
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },                
                    { text: 'Usuario', value: 'usuario' },
                    { text: 'Proveedor', value: 'proveedor' },                
                    { text: 'Tipo Comprobante', value: 'tipo_comprobante' },                
                    { text: 'Serie Comprobante', value: 'serie_comprobante', sortable: false },                
                    { text: 'Numero Comprobante', value: 'num_comprobante',  sortable: false },
                    { text: 'Fecha', value: 'fecha_hora', sortable: false },
                    { text: 'Impuesto', value: 'impuesto', sortable: false },                
                    { text: 'Total', value: 'total', sortable: false },                
                    { text: 'Estado', value: 'condicion', sortable: false },                               
                ],
                cabeceraDetalles: [
                    { text: 'Borrar', value: 'borrar', sortable: false },                
                    { text: 'Articulo', value: 'articulo', sortable: false },                
                    { text: 'Cantidad', value: 'cantidad',  sortable: false },
                    { text: 'Precio', value: 'precio', sortable: false },
                    { text: 'Subtotal', value: 'subtotal', sortable: false },                                                    
                ],
                detalles:[                                       
                ],
                search:'',
                editedIndex: -1,                
                id:'',
                idproveedor:'',
                proveedores:[],
                tipo_comprobante:'',
                comprobantes:['FACTURA','COMPROBANTE','RECIBO', 'ORDEN'],
                serie_comprobante:'',
                num_comprobante:'',
                impuesto: 15,
                codigo:'',
                verNuevo:0,
                errorArticulo:null,
                totalParcial:0,
                totalImpuesto:0,
                total:0,        
                valida:0,
                validaMensaje:[],
                adModal: 0,
                adAccion:0,
                adNombre:'',
                adId: ''
            }
        },

        computed: {
            calcularTotal:function(){
                var resultado = 0.0;
                for(var i=0; i<this.detalles.length;i++){
                    resultado = resultado + (this.detalles[i].precio*this.detalles[i].cantidad);
                }
                return resultado;
            }
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
            mostrarNuevo(){
                this.verNuevo = 1;
            },
            ocultarNuevo(){
                this.verNuevo = 0;
            },

            buscarCodigo(){
                let me = this;
                me.errorArticulo=null;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers: header};
                axios.get('api/Articulos/BuscarCodigoIngreso/'+this.codigo,configuracion).then(function(response){
                    me.agregarDetalle(response.data);
                }).catch(function(error){
                    console.log(error);
                    me.errorArticulo='No existe el articulo';
                });
            },

            agregarDetalle(data = []){
                if(this.encuentra(data['idarticulo'])){
                    this.errorArticulo = "El articulo ya ha sido agregado."
                }
                else{
                    this.detalles.push(
                    {idarticulo:data['idarticulo'],
                    articulo: data['nombre'],
                    cantidad:1,
                    precio:1}
                    )
                }
                
            },

            encuentra(id){
                var sw=0;
                for(var i = 0;  i<this.detalles.length; i++){
                    if (this.detalles[i].idarticulo == id){
                        sw=1;
                    }
                }
                return sw;
            },

            eliminarDetalle(arr,item){
                var i = arr.indexOf(item);
                if(i!==-1){
                    arr.splice(i,1);
                }
            },

            listar(){
                let me = this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers: header};
                axios.get('api/Ingresos/Listar',configuracion).then(function(response){
                    me.ingresos = response.data;
                }).catch(function(error){
                    console.log(error);
                });
            },

            select(){
                let me = this;
                var proveedoresArray=[];
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers: header};
                axios.get('api/Personas/SelectProveedores',configuracion).then(function(response){                    
                    proveedoresArray = response.data;  
                    proveedoresArray.map(function(x){
                        me.proveedores.push({text:x.nombre, value:x.idpersona});
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

