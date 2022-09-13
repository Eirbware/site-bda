import {createStore} from 'vuex';
import createPersistedState from "vuex-persistedstate";

const store = createStore({
    state() {
        return {};
    },
    mutations: {},
    actions: {},
    plugins: [createPersistedState()],
});

export default store;
