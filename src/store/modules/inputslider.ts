// initial state
const inputState = {
    objectX: 1,
    objectY: 1,
    objectZ: 1,
    cameraX: 1,
    cameraY: 1,
    cameraZ: 1,
};

// getters
const inputGetters = {
    objectX: (state: any) => state.objectX,
    objectY: (state: any) => state.objectY,
    objectZ: (state: any) => state.objectZ,
    cameraX: (state: any) => state.cameraX,
    cameraY: (state: any) => state.cameraY,
    cameraZ: (state: any) => state.cameraZ,
};

// actions
const inputActions = {
    setObjectX: ({ commit }: any, newObjectX: number) => {
        commit('setObjectX', newObjectX);
    },
    setObjectY: ({ commit }: any, newObjectY: number) => {
        commit('setObjectY', newObjectY);
    },
    setObjectZ: ({ commit }: any, newObjectZ: number) => {
        commit('setObjectZ', newObjectZ);
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
    setObjectX(state: any, newObjectX: number) {
        state.objectX = newObjectX;
    },
    setObjectY(state: any, newObjectY: number) {
        state.objectY = newObjectY;
    },
    setObjectZ(state: any, newObjectZ: number) {
        state.objectZ = newObjectZ;
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
