export default {
    namespaced: true,
    state: {
        editor: null,
        editable: false,
    },

    mutations: {
        SET_EDITOR(state, editor) {
            state.editor = editor
        },
        SET_EDITABLE(state, editable){
            state.editable = editable
        }
    },

    actions: {
        setEditor({commit}, editor){
            commit("SET_EDITOR", editor);
        },
        setEditable({commit}, editable){
            commit("SET_EDITABLE", editable);
        }
    }
}