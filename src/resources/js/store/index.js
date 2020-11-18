import Vue from 'vue' ;
import Vuex from 'vuex'; 
import draw from './modules/draw'

Vue.use(Vuex);

export default new Vuex.Store({
  modules:{
      draw
  }
})