import Vue from 'vue';
import Vuex from 'vuex';
import counter from '@/store/modules/counter';
import cubestore from '@/store/modules/cubestore';
import settings from '@/store/modules/settings';
Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    modules: {
        counter,
        cubestore,
        settings,
    },
    strict: debug,
});
