import { Vector3 } from 'three';

// initial state
const cubeState = {
    scale: 0.1,
    displayWidth: window.innerWidth / 2,
    displayHeight: window.innerHeight / 2,
    color: { r: 66, g: 185, b: 131, a: 255 },
    objects: [],
    object: '',
    count: 0,
};

// getters
const cubeGetters = {
    scale: (state: any) => state.scale,
    displayWidth: (state: any) => state.displayWidth,
    displayHeight: (state: any) => state.displayHeight,
    color: (state: any) => state.color,
    objects: (state: any) => state.objects,
    object: (state: any) => state.object,
    count: (state: any) => state.count,
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
    displayObject: ({ commit }: any, object: string) => {
        commit('displayObject', object);
    },
    pushObject: ({ commit }: any, objectPos: Vector3) => {
        commit('pushObject', objectPos);
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
    displayObject(state: any, object: string) {
        state.object = object;
        state.count += 1;
    },
    pushObject(state: any, objectPos: Vector3) {
        state.objects.push({ name: state.object, position: objectPos });
    },
};

export default {
    namespaced: true,
    state: cubeState,
    getters: cubeGetters,
    actions: cubeActions,
    mutations: cubeMutations,
};
