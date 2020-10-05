<template>
    <v-container>    
        <v-layout>
            <v-flex>
                <v-data-table
                    :headers="headers"
                    :items="roles"
                    :search="search"
                    sort-by="calories"
                    class="elevation-1"                    
                    >
                    <template v-slot:top>
                        <v-toolbar flat color="white">
                        <v-toolbar-title>Roles</v-toolbar-title>
                        <v-divider
                            class="mx-4"
                            inset
                            vertical
                        ></v-divider>
                        <v-spacer></v-spacer>
                        <v-text-field class="text-xs-center" v-model="search" append-icon="mdi-search" label="Busqueda" single-line hide-details></v-text-field>
                        <v-spacer></v-spacer>                        
                        </v-toolbar>
                    </template>
                    

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
                roles:[],
                dialog: false,
                headers: [                               
                { text: 'Nombre', value: 'nombre' },
                { text: 'Descripcion', value: 'descripcion', sortable: false },
                { text: 'Estado', value: 'condicion', sortable: false },               
                
                ],
                search:'',
                
            }
        },

        computed: {
            
        },

        watch: {
            
        },

        created () {            
            this.listar();
        },

        methods:{

            listar(){
                let me = this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers: header};
                axios.get('api/Roles/Listar',configuracion).then(function(response){
                    me.roles = response.data;
                }).catch(function(error){
                    console.log(error);
                });
            },

        }
    }
</script>

