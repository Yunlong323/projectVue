import { createStore } from 'vuex'
import mutations from '@/store/mutations';
import actions from '@/store/actions';
export default createStore({
    // state: sessionStorage.getItem('state') ? JSON.parse(sessionStorage.getItem('state')) : {
    // state: localStorage.getItem('state') ? JSON.parse(localStorage.getItem('state')) : {
    state: {
        tagsList: [],
        collapse: false,
        env: "sishimap-6gv4iiy402fa8f89",
        userInfo: null,
        query: {
            pageSize: 8, // 每页条数
        }
    },
    mutations,
    actions,
    modules: {}
})