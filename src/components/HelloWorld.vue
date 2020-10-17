<template>
  <v-container>
    <v-layout>
      <v-flex sm12 md12>
        <div>
          <canvas id="myChart">

          </canvas>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import axios from 'axios'
  import Chart from 'chart.js'
  export default {
    name: 'HelloWorld',

    data: () => ({

      mesesValores:null,
      nombreMeses:[],
      totalMeses:[],


      ecosystem: [
        {
          text: 'vuetify-loader',
          href: 'https://github.com/vuetifyjs/vuetify-loader',
        },
        {
          text: 'github',
          href: 'https://github.com/vuetifyjs/vuetify',
        },
        {
          text: 'awesome-vuetify',
          href: 'https://github.com/vuetifyjs/awesome-vuetify',
        },
      ],
      importantLinks: [
        {
          text: 'Documentation',
          href: 'https://vuetifyjs.com',
        },
        {
          text: 'Chat',
          href: 'https://community.vuetifyjs.com',
        },
        {
          text: 'Made with Vuetify',
          href: 'https://madewithvuejs.com/vuetify',
        },
        {
          text: 'Twitter',
          href: 'https://twitter.com/vuetifyjs',
        },
        {
          text: 'Articles',
          href: 'https://medium.com/vuetify',
        },
      ],
      whatsNext: [
        {
          text: 'Explore components',
          href: 'https://vuetifyjs.com/components/api-explorer',
        },
        {
          text: 'Select a layout',
          href: 'https://vuetifyjs.com/getting-started/pre-made-layouts',
        },
        {
          text: 'Frequently Asked Questions',
          href: 'https://vuetifyjs.com/getting-started/frequently-asked-questions',
        },
      ],
    }),

    methods:{
      loadProductosMasVendidos(){
        let me = this;
        let mesn ='';
        me.mesesValores.map(function(x){
          switch(parseInt(x.etiqueta)){
            case 1:
              mesn='Enero';
              break;
            case 2:
              mesn='Febrero';
              break;
            case 3:
              mesn='Marzo';
              break;
            case 4:
              mesn='Abril';
              break;
            case 5:
              mesn='Mayo';
              break;
            case 6:
              mesn='Junio';
              break;
            case 7:
              mesn='Julio';
              break;
            case 8:
              mesn='Agosto';
              break;
            case 9:
              mesn='Septiembre';
              break;
            case 10:
              mesn='Octubre';
              break;
            case 11:
              mesn='Noviembre';
              break;
            case 12:
              mesn='Diciembre';
              break;
            default:
              mesn='Error';
          }
          me.nombreMeses.push(mesn);
          me.totalMeses.push(x.valor);
        });
        var ctx = document.getElementById('myChart');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: me.nombreMeses,
                datasets: [{
                    label: 'Ventas enlos ultimos 12 Meses',
                    data: me.totalMeses,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
      },

      getProductosMasVendidos(){
        let me = this;
        let header={"Authorization" : "Bearer " + this.$store.state.token};
        let configuracion= {headers: header};
        axios.get('api/Ventas/VentasMes12',configuracion).then(function(response){
            me.mesesValores = response.data;
            me.loadProductosMasVendidos();
        }).catch(function(error){
            console.log(error);
        });
      }

    },
    mounted(){
      this.getProductosMasVendidos();
    }

  }
</script>
