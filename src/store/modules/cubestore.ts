// initial state
const cubeState = {
    scale: 0.1,
    displayWidth: window.innerWidth / 2,
    displayHeight: window.innerHeight / 2,
    color: { r: 66, g: 185, b: 131, a: 255 },
};

// getters
const cubeGetters = {
    scale: (state: any) => state.scale,
    displayWidth: (state: any) => state.displayWidth,
    displayHeight: (state: any) => state.displayHeight,
    color: (state: any) => state.color,
};

// actions
const cubeActions = {
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
const cubeMutations = {
    increment(state: any) {
        state.scale += 0.1;
    },
    decrement(state: any) {
        state.scale -= 0.1;
    },
    setColor(state: any, newColor: any) {
        state.color = newColor.rgba;
    },
};

export default {
    namespaced: true,
    state: cubeState,
    getters: cubeGetters,
    actions: cubeActions,
    mutations: cubeMutations,
};
