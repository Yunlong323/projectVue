import Home from "@/views/Home.vue";
const Dashboard = () =>
    import ("@/views/Dashboard.vue");
const Map = () =>
    import ("@/views/Map.vue");
const User = () =>
    import ("@/views/User.vue");
const Marker = () =>
    import ("@/views/Marker.vue");
const Comment = () =>
    import ("@/views/Comment.vue");
const Question = () =>
    import ("@/views/Question.vue");
const Message = () =>
    import ("@/views/Message.vue");
const NotFound = () =>
    import ('@/views/404.vue');
const NoPerm = () =>
    import ('@/views/403.vue');
const Login = () =>
    import ("@/views/Login.vue");
const Register = () =>
    import ("@/views/Register.vue");


const routes = [{
    path: "/",
    name: "Home",
    component: Home,
    children: [{
        path: "",
        name: "dashboard",
        meta: {
            title: '系统首页'
        },
        component: Dashboard
    }, {
        path: "/map",
        name: "map",
        meta: {
            title: '景点统计'
        },
        component: Map
    }, {
        path: "/user",
        name: "user",
        meta: {
            title: '用户管理',
            permission: true
        },
        component: User
    }, {
        path: "/marker",
        name: "marker",
        meta: {
            title: '景点管理'
        },
        component: Marker
    }, {
        path: "/comment",
        name: "comment",
        meta: {
            title: '留言管理'
        },
        component: Comment
    }, {
        path: "/question",
        name: "question",
        meta: {
            title: '答题管理',
            permission: true
        },
        component: Question
    }, {
        path: "/message",
        name: "message",
        meta: {
            title: '消息管理'
        },
        component: Message
    }, {
        path: '/404',
        name: '404',
        meta: {
            title: '找不到页面'
        },
        component: NotFound
    }, {
        path: '/403',
        name: '403',
        meta: {
            title: '没有权限'
        },
        component: NoPerm
    }]
}, {
    path: "/login",
    name: "Login",
    meta: {
        title: '登录'
    },
    component: Login
}, {
    path: "/register",
    name: "Register",
    meta: {
        title: '注册'
    },
    component: Register
}];
export default routes;