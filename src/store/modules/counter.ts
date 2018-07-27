// initial state
const state = {
    count: 0,
    history: [],
};

// getters
const getters = {
    count: (state: any) => state.count,
    limit: () => 5,
    recentHistory: (state: any, getters: any) => {
        const end = state.history.length;
        const begin = end - getters.limit < 0 ? 0 : end - getters.limit;
        return state.history
            .slice(begin, end)
            .join(', ');
    },
};

// actions
const actions = {
    increment: ({ commit }: any) => {
        commit('increment');
    },
    decrement: ({ commit }: any) => {
        commit('decrement');
    },
    incrementIfOdd: ({ commit, state }: any) => {
        if ((state.count + 1) % 2 === 0) {
            commit('increment');
        }
    },
    incrementAsync: ({ commit }: any) => {
        setTimeout(() => {
            commit('increment');
        }, 1000);
    },
};

// mutations
const mutations = {
    increment(state: any) {
        state.count++;
        state.history.push('increment');
    },
    decrement(state: any) {
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
