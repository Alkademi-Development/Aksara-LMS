import { createStore } from 'vuex'

import modules from "@/store/modules/index";

const debug = process.env.NODE_ENV == 'production';

const store = createStore({
    modules,
    strict: debug
})

export default store