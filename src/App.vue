<template>
    <router-view />
</template>

<script>
export default {
  name:'App',
  created () {
    // 防止vuex中 state 的值在网页刷新后被清空
    //在页面加载时读取sessionStorage里的状态信息
    // if (sessionStorage.getItem("state") ) {
    //     this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("state"))))
    // } 
    // //在页面刷新时将vuex里的信息保存到sessionStorage里
    // window.addEventListener("beforeunload", ()=>{
    //     console.log('刷新时保存的信息', this.$store.state);
    //     sessionStorage.setItem("state", JSON.stringify(this.$store.state))
    // })
  }
}
</script>

<style>
@import "./assets/css/main.css";
@import "./assets/css/color-dark.css";
</style>
