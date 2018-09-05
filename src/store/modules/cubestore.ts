// initial state
const state = {
    scale: 0.1,
    displayWidth: window.innerWidth / 2,
    displayHeight: window.innerHeight / 2,
    color: '#194d33',
    //color: { r: 255, g: 255, b: 255, a: 1 },
};

// getters
const getters = {
    scale: (state: any) => state.scale,
    displayWidth: (state: any) => state.displayWidth,
    displayHeight: (state: any) => state.displayHeight,
    color: (state: any) => state.color,
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
    },
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
        state.color = newColor.hex;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
