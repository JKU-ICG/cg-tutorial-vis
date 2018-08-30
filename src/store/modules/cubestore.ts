// initial state
const state = {
    scale: 0.1, 
    displayWidth: window.innerWidth/2,
    displayHeight: window.innerHeight/2,
    colors: '#194d33'
};

// getters
const getters = {
    scale: (state: any) => state.scale,
    displayWidth: (state: any) => state.displayWidth,
    displayHeight: (state: any) => state.displayHeight,
    colors: (state: any) => state.colors
};

// actions
const actions = {
    increment: ({ commit }: any) => {
        commit('increment');
    },
    decrement: ({ commit }: any) => {
        commit('decrement');
    },
    setColor: ({ commit }: any, newColor: any) => {
        commit('setColor', newColor);
    }    
};

// mutations
const mutations = {
    increment(state: any) {
        state.scale += 0.1;
    },
    decrement(state: any) {
        state.scale -= 0.1;        
    },
    setColor(state: any, newColor: any) {
        state.colors = newColor.hex;        
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
