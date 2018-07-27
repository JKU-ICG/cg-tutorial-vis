// initial state
const state = {
    count: 0,
    history: [],
};

// getters
const getters = {
    count: (state) => state.count,
    limit: () => 5,
    recentHistory: (state, getters) => {
        const end = state.history.length;
        const begin = end - getters.limit < 0 ? 0 : end - getters.limit;
        return state.history
            .slice(begin, end)
            .join(', ');
    },
};

// actions
const actions = {
    increment: ({ commit }) => {
        commit('increment');
    },
    decrement: ({ commit }) => {
        commit('decrement');
    },
    incrementIfOdd: ({ commit, state }) => {
        if ((state.count + 1) % 2 === 0) {
            commit('increment');
        }
    },
    incrementAsync: ({ commit }) => {
        setTimeout(() => {
            commit('increment');
        }, 1000);
    },
};

// mutations
const mutations = {
    increment(state) {
        state.count++;
        state.history.push('increment');
    },
    decrement(state) {
        state.count--;
        state.history.push('decrement');
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
