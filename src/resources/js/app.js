
require('./bootstrap');

window.Vue = require('vue');


Vue.component('MainApp', require('./components/MainApp.vue').default);
Vue.component('Vote', require('./components/Vote.vue').default);

import Toaster from 'v-toaster'
 
// toast css
import 'v-toaster/dist/v-toaster.css'
 
// optional set default timeout
Vue.use(Toaster, {timeout: 5000})

// Vue progress bar
import VueProgressBar from 'vue-progressbar'

const options = {
  color: '#00416A',
  failedColor: '#874b4b',
  thickness: '5px',
  transition: {
    speed: '0.2s',
    opacity: '0.6s',
    termination: 300
  },
  autoRevert: true,
  location: 'top',
  inverse: false
}

Vue.use(VueProgressBar, options)

// SweetAlert

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
Vue.use(VueSweetalert2);

// Store

import store from './store/index'

// moment
import moment from 'moment'
window.moment = moment

Vue.filter('upDate',function(myDate){
  return moment(myDate).format('MMMM Do YYYY');
})

const app = new Vue({
    el: '#app',
    store,
});
