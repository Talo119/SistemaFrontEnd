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
                        
                        <v-btn
                            v-if="verNuevo==0"
                            color="primary"
                            dark
                            class="mb-2"
                            @click="listar"                          
                        >Buscar</v-btn>

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
                                <v-card-title class="headline" v-if="adAccion==2">Anular Ingreso?</v-card-title>
                                <v-card-text>
                                    Estas a punto de
                                    <span v-if="adAccion==1">Activar</span>
                                    <span v-if="adAccion==2">Anular</span>
                                    el item {{adNombre}}                                    
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
                                        Anular
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
                        @click="verDetalles(item)"
                        >
                        mdi-tab
                        </v-icon>
                        <template v-if="item.estado == 'Aceptado'">
                            <v-icon
                            small
                            @click="activarDesactivarMostrar(2,item)"
                            >
                            mdi-cancel
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
                                <v-btn @click="mostrarArticulos()" small fab dark color="teal">
                                    <v-icon class="material-icons" dark>mdi-plus</v-icon>
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
                                    <v-flex class="text-sm-right">
                                        <strong>Total Parcial: </strong>L.{{totalParcial=(total-totalImpuesto).toFixed(2)}}
                                    </v-flex>
                                    <v-flex class="text-sm-right">
                                        <strong>Total Impuesto: </strong>L.{{totalImpuesto=(total*impuesto/(100+impuesto)).toFixed(2)}}
                                    </v-flex>
                                    <v-flex class="text-sm-right">
                                    <strong>Total Neto: </strong>L.{{total=(calcularTotal).toFixed(2)}}
                                    </v-flex>
                            </v-flex>

                            <v-flex xs12 ms12 md12 lg12 xl12>
                                <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v"></div>
                            </v-flex>

                            <v-flex xs12 ms12 md12 lg12 xl12>
                                <v-btn @click="ocultarNuevo()" color="blue darken-1" text>Cancelar</v-btn>
                                <v-btn v-if="verDet==0" @click="guardar()" color="success">Guardar</v-btn>
                            </v-flex>


                            <v-dialog v-model="verArticulos" max-width="1000px">
                            <v-card>
                                <v-card-title>
                                    <span class="headline">Seleccione un articulo</span>
                                </v-card-title>
                                <v-card-text>
                                    <v-container grid-list-md>
                                        <v-layout wrap>
                                            <v-flex sm12 md12 lg12 xl12>
                                                <v-text-field append-icon="search" 
                                                class="text-sm-center" 
                                                v-model="texto" 
                                                label="Ingrese articulo a buscar..."
                                                @keyup.enter="listarArticulo()">

                                                </v-text-field>
                                                <template>
                                                     <v-data-table
                                                        :headers="cabeceraArticulos"
                                                        :items="articulos"                                                        
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
                                                        <template v-slot:item.seleccionar="{ item }">
                                                            <v-icon
                                                            small
                                                            class="mr-2"
                                                            @click="agregarDetalle(item)"
                                                            >
                                                            mdi-plus
                                                            </v-icon>                                       
                                                            
                                                        </template >                                                       
                                                        
                                                        <template v-slot:no-data>
                                                            <v-btn color="primary" @click="listar">Resetear</v-btn>
                                                        </template>
                                                        
                                                        <template slot="no-data">
                                                            No hay articulos agregados al detalle.
                                                        </template>

                                                        </v-data-table>
                                                </template>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn @click="ocultarArticulos()" color="blue darken-1" text >Cancelar</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>

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
                    { text: 'Estado', value: 'estado', sortable: false },                               
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
                cabeceraArticulos:[
                    {text:'Seleccionar', value:'seleccionar', sortable:false},
                    {text:'Articulo', value:'nombre'},
                    {text:'Categoria', value:'categoria'},
                    {text:'Descripcion', value:'descripcion', sortable:false},
                    {text:'Stock', value:'stock', sortable:false},
                    {text:'Precio Venta', value:'precio_venta', sortable:false}
                ],
                articulos:[],
                texto:'',
                verArticulos: 0,
                verDet:0,
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
                this.limpiar();
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

            listarArticulo(){
                let me = this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers: header};
                axios.get('api/Articulos/ListarIngreso/'+me.texto,configuracion).then(function(response){
                    me.articulos = response.data;
                }).catch(function(error){
                    console.log(error);
                });
            },

            mostrarArticulos(){
                this.verArticulos = 1;
            },

            ocultarArticulos(){
                this.verArticulos = 0;
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
                let url = '';
                if(!me.search){
                    url = 'api/Ingresos/Listar'
                }
                else{
                    url = 'api/Ingresos/ListarFiltro/'+me.search;
                }
                axios.get(url,configuracion).then(function(response){
                    me.ingresos = response.data;
                }).catch(function(error){
                    console.log(error);
                });
            },

            listarDetalles(id){
                let me = this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers: header};
                axios.get('api/Ingresos/ListarDetalles/'+id,configuracion).then(function(response){
                    me.detalles = response.data;
                }).catch(function(error){
                    console.log(error);
                });
            },

            verDetalles(item){
                this.limpiar();
                this.tipo_comprobante = item.tipo_comprobante;
                this.serie_comprobante = item.serie_comprobante;
                this.num_comprobante = item.num_comprobante;
                this.idproveedor = item.idproveedor;
                this.impuesto = item.impuesto;
                this.listarDetalles(item.idingreso);
                this.verNuevo=1;    
                this.verDet=1;
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
            

            deleteItem (item) {
                const index = this.desserts.indexOf(item)
                confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
            },

            

            limpiar(){
                this.id="",
                this.idproveedor="",                
                this.nombre="",
                this.tipo_comprobante="",
                this.serie_comprobante="",
                this.num_comprobante="",
                this.impuesto=15,
                this.codigo="",
                this.detalles= [],
                this.total=0,
                this.totalImpuesto=0,
                this.totalParcial=0;  
                this.verDet=0;              
            },
            guardar () {

                if(this.validar()){
                    return;
                }
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers: header};                
                //Codigo para guardar
                let  me = this;
                axios.post('api/Ingresos/Crear',{
                    'idproveedor': me.idproveedor,                        
                    'idusuario': me.$store.state.usuario.idusuario,
                    'tipo_comprobante': me.tipo_comprobante,
                    'serie_comprobante': me.serie_comprobante,
                    'num_comprobante': me.num_comprobante,
                    'impuesto':me.impuesto,
                    'total':me.total,
                    'detalles':me.detalles
                },configuracion).then(function(response){
                    me.ocultarNuevo();
                    me.listar();
                    me.limpiar();                        
                }).catch(function(error){
                    console.log(error);
                });
                               
            },

            validar(){
                
                this.valida = 0;
                this.validaMensaje = [];                
                

                if (!this.idproveedor){                    
                    this.validaMensaje.push("Seleccione un Proveedor.")
                }

                if (!this.tipo_comprobante){                    
                    this.validaMensaje.push("Seleccione un tipo de comprobante.")
                }

                if (!this.num_comprobante){                    
                    this.validaMensaje.push("Ingrese el numero del comprobante.")
                }

                if (!this.impuesto || this.impuesto<0){    
                    this.validaMensaje.push("Ingrese un impuesto valido.")
                }                

                if (this.detalles.length<=0){
                    this.validaMensaje.push("Ingrese al menos un arituclo al detalle.")
                }

                if(this.validaMensaje.length){
                    this.valida = 1;
                }
                return this.valida;
            },

            activarDesactivarMostrar(accion, item){
                this.adModal = 1;
                this.adNombre = item.num_comprobante;
                this.adId = item.idingreso;
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
            /*
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
            */
            desactivar(){
                let  me = this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers: header};
                axios.put('api/Ingresos/Anular/'+me.adId,{},configuracion).then(function(response){
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

