// initial state
const inputState = {
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    translateX: 1,
    translateY: 1,
    translateZ: 1,
    cameraX: 1,
    cameraY: 1,
    cameraZ: 1,
};

// getters
const inputGetters = {
    scaleX: (state: any) => state.scaleX,
    scaleY: (state: any) => state.scaleY,
    scaleZ: (state: any) => state.scaleZ,
    translateX: (state: any) => state.translateX,
    translateY: (state: any) => state.translateY,
    translateZ: (state: any) => state.translateZ,
    cameraX: (state: any) => state.cameraX,
    cameraY: (state: any) => state.cameraY,
    cameraZ: (state: any) => state.cameraZ,
};

// actions
const inputActions = {
    setScaleX: ({ commit }: any, newScaleX: number) => {
        commit('setScaleX', newScaleX);
    },
    setScaleY: ({ commit }: any, newScaleY: number) => {
        commit('setScaleY', newScaleY);
    },
    setScaleZ: ({ commit }: any, newScaleZ: number) => {
        commit('setScaleZ', newScaleZ);
    },
    setTranslateX: ({ commit }: any, newTranslateX: number) => {
        commit('setTranslateX', newTranslateX);
    },
    setTranslateY: ({ commit }: any, newTranslateY: number) => {
        commit('setTranslateY', newTranslateY);
    },
    setTranslateZ: ({ commit }: any, newTranslateZ: number) => {
        commit('setTranslateZ', newTranslateZ);
    },
    setCameraX: ({ commit }: any, newCameraX: number) => {
        commit('setCameraX', newCameraX);
    },
    setCameraY: ({ commit }: any, newCameraY: number) => {
        commit('setCameraY', newCameraY);
    },
    setCameraZ: ({ commit }: any, newCameraZ: number) => {
        commit('setCameraZ', newCameraZ);
    },
};

// mutations
const inputMutations = {
    setScaleX(state: any, newScaleX: number) {
        state.scaleX = newScaleX;
    },
    setScaleY(state: any, newScaleY: number) {
        state.scaleY = newScaleY;
    },
    setScaleZ(state: any, newScaleZ: number) {
        state.scaleZ = newScaleZ;
    },
    setTranslateX(state: any, newTranslateX: number) {
        state.translateX = newTranslateX;
    },
    setTranslateY(state: any, newTranslateY: number) {
        state.translateY = newTranslateY;
    },
    setTranslateZ(state: any, newTranslateZ: number) {
        state.translateZ = newTranslateZ;
    },
    setCameraX(state: any, newCameraX: number) {
        state.cameraX = newCameraX;
    },
    setCameraY(state: any, newCameraY: number) {
        state.cameraY = newCameraY;
    },
    setCameraZ(state: any, newCameraZ: number) {
        state.cameraZ = newCameraZ;
    },
};

export default {
    namespaced: true,
    state: inputState,
    getters: inputGetters,
    actions: inputActions,
    mutations: inputMutations,
};
