<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template #title>
                            <i :class="item.icon"></i>
                            <span>{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                            >
                                <template #title>{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem, i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.index"
                                :key="subItem.index"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <template #title>{{ item.title }}</template>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
// import bus from "../common/bus";
export default {
    data() {
        return {
            items: [
                {
                    icon: "el-icon-s-home",
                    index: "/",
                    title: "系统首页"
                },
                {
                    icon: "el-icon-map-location",
                    index: "map",
                    title: "景点统计"
                },
                {
                    icon: "el-icon-user",
                    index: "user",
                    title: "用户管理"
                },
                {
                    icon: "el-icon-postcard",
                    index: "marker",
                    title: "景点管理"
                },
                {
                    icon: "el-icon-chat-dot-square",
                    index: "comment",
                    title: "留言管理"
                },
                {
                    icon: "el-icon-notebook-1",
                    index: "question",
                    title: "答题管理"
                },
                {
                    // icon: "el-icon-message",
                    // icon: "el-icon-message-solid",
                    icon: "el-icon-bell",
                    index: "message",
                    title: "消息管理"
                }
            ]
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace("/", "");
        },
        collapse(){
            return this.$store.state.collapse
        }
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
