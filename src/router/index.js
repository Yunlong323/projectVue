import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";
import cloudbase from "@cloudbase/js-sdk";
import routes from "@/router/routes";
const app = cloudbase.init({
    env: "sishimap-6gv4iiy402fa8f89"
});
const auth = app.auth({
    persistence: "local"
});


const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

router.beforeEach((to, from, next) => {
    document.title = `四史后台管理系统 | ${to.meta.title}`;
    // const state = sessionStorage.getItem('state') ? JSON.parse(sessionStorage.getItem('state')) : null;
    // const state = localStorage.getItem('state') ? JSON.parse(localStorage.getItem('state')) : null;
    // console.log(from, to, state);
    auth.getLoginState()
        .then(loginstate => {
            if (loginstate) {
                store.dispatch('updateUserInfo')
                    .then(() => {
                        if (!store.state.userInfo.state && to.path !== '/login' && to.path !== '/register') { // 判断当前用户是否已登录
                            // if (!loginstate && to.path !== '/login' && to.path !== '/register') { // 判断当前用户是否已登录
                            console.log('没有权限，返回登录界面');
                            next('/login');
                        } else if (to.meta.permission) {
                            store.state.userInfo.super === true ? next() : next('/403'); // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
                        } else {
                            next();
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        next('/login');
                    });
            } else if (!loginstate) {
                if (to.path !== '/login' && to.path !== '/register') {
                    console.log('未登录，返回登录界面');
                    next('/login');
                } else {
                    next();
                }
            }
        })
        .catch(err => {
            console.log(err);
        });
});
export default router;