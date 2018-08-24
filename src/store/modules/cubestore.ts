// initial state
const state = {
    scale: 0.1,    
};

// getters
const getters = {
    scale: (state: any) => state.scale    
};

// actions
const actions = {
    increment: ({ commit }: any) => {
        commit('increment');
    },
    decrement: ({ commit }: any) => {
        commit('decrement');
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
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
