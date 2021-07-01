import cloudbase from "@cloudbase/js-sdk";
import router from '@/router';
const actions = {
    // 更新用户信息
    async updateUserInfo({ commit }) {
        const app = cloudbase.init({
            env: this.state.env
        });
        const auth = app.auth({
            persistence: "local"
        });
        return new Promise((resolve, reject) => {
            const ret = {};
            const query = {};
            query['uid'] = auth.currentUser.uid;
            // query['uid'] = "5a0d0443b1f942dbb459d8b7a073f0f6";
            app.callFunction({
                    name: 'getAdminInfo',
                    data: query
                })
                .then(res => {
                    res = res.result;
                    if (!res.success) {
                        ret['msg'] = res.msg;
                        ret['err'] = res;
                        reject(ret);
                    } else if (res.expire) {
                        // 账号信息过期，退出
                        auth.signOut()
                            .then(() => {
                                ret['msg'] = res.msg;
                                ret['err'] = res;
                                reject(ret);
                            });
                    } else {
                        commit('updateUserInfo', res.data);
                        resolve();
                    }
                })
                .catch((err) => {
                    ret['msg'] = err.msg;
                    ret['err'] = err;
                    reject(ret);
                });
        });
    },
    // 账号 密码登录
    async loginWithUsernameAndpassword({ commit }, userInfo) {
        const app = cloudbase.init({
            env: this.state.env
        });
        const auth = app.auth({
            persistence: "local"
        });
        const ret = {};
        return new Promise((resolve, reject) => {
            auth.signInWithUsernameAndPassword(userInfo.username, userInfo.password) // 用户名密码登录
                .then(res => {
                    const ret = {};
                    const query = {};
                    query['uid'] = res.user.uid;
                    app.callFunction({
                            name: 'getAdminInfo',
                            data: query
                        })
                        .then(res => {
                            res = res.result;
                            if (res.success) {
                                if (res.data.state === true) {
                                    commit('updateUserInfo', res.data);
                                    // 登录时 更新上次登录时间
                                    app.callFunction({
                                            name: 'updateAdminInfo',
                                            data: query
                                        })
                                        .then(() => {
                                            ret['code'] = 200;
                                            ret['data'] = res.data;
                                            ret['msg'] = '欢迎回来';
                                            router.push("/");
                                            resolve(ret);
                                        });
                                } else {
                                    // 退出
                                    auth.signOut()
                                        .then(() => {
                                            ret['code'] = -1;
                                            ret['msg'] = '登录失败，管理员正在审核中';
                                            reject(ret);
                                        });
                                }
                            } else {
                                ret['msg'] = res.msg;
                                ret['err'] = res;
                                reject(ret);
                            }
                        })
                        .catch((err) => {
                            ret['msg'] = err.msg;
                            ret['err'] = err;
                            reject(ret);
                        });
                })
                .catch(err => {
                    ret['code'] = -1;
                    ret['msg'] = '登录失败，账号密码有误';
                    ret['err'] = err;
                    reject(ret);
                });
        });
    },
    // 手机号 密码或者验证码 登录
    async loginWithPhoneCodeOrPassword({ commit }, userInfo) {
        const app = cloudbase.init({
            env: this.state.env
        });
        const auth = app.auth({
            persistence: "local"
        });
        const ret = {};
        const info = {};
        if (userInfo.phoneCode !== undefined) {
            // 手机号 验证码登录
            info.phoneNumber = userInfo.phone;
            info.phoneCode = userInfo.phoneCode;
        } else {
            // 手机号 密码 登录
            info.phoneNumber = userInfo.phone;
            info.password = userInfo.password;
        }
        return new Promise((resolve, reject) => {
            auth.signInWithPhoneCodeOrPassword(info)
                .then(res => {
                    const ret = {};
                    const query = {};
                    query.uid = res.user.uid;
                    app.callFunction({
                            name: 'getAdminInfo',
                            data: query
                        })
                        .then(res => {
                            res = res.result;
                            if (res.success) {
                                if (res.data.state === true) {
                                    commit('updateUserInfo', res.data);
                                    // 登录时 更新上次登录时间
                                    app.callFunction({
                                        name: 'updateAdminInfo',
                                        data: query
                                    }).then(() => {
                                        ret['code'] = 200;
                                        ret['data'] = res.data;
                                        ret['msg'] = '欢迎回来';
                                        router.push("/");
                                        resolve(ret);
                                    });
                                } else {
                                    // 退出
                                    auth.signOut()
                                        .then(() => {
                                            ret['code'] = -1;
                                            ret['msg'] = '登录失败，管理员正在审核中';
                                            reject(ret);
                                        });
                                }
                            } else {
                                ret['msg'] = res.msg;
                                ret['err'] = res;
                                reject(ret);
                            }
                        })
                        .catch((err) => {
                            ret['msg'] = err.msg;
                            ret['err'] = err;
                            reject(ret);
                        });
                })
                .catch(err => {
                    ret['msg'] = '登录失败，请仔细核对信息';
                    ret['err'] = err;
                    reject(ret);
                });
        });
    },
    // 退出登录
    async exitLogin({ commit }) {
        const ret = {};
        return new Promise((resolve, reject) => {
            const app = cloudbase.init({
                env: this.state.env
            });
            const auth = app.auth({
                persistence: "local"
            });
            auth.signOut()
                .then((res) => {
                    // 登出成功操作
                    ret['code'] = 200;
                    ret['msg'] = '账号已退出';
                    // localStorage.removeItem("state");
                    // sessionStorage.removeItem("state");
                    // localStorage.removeItem("state");
                    commit('clearState');
                    resolve(ret);
                })
                .catch(err => {
                    ret['code'] = -1;
                    ret['msg'] = '登出失败';
                    ret['err'] = err;
                    reject(ret);
                });
        })
    },
    // 发送验证码
    async sendPhoneCode({ commit }, userInfo) {
        const app = cloudbase.init({
            env: this.state.env
        });
        const auth = app.auth();
        const ret = {};
        return new Promise((resolve, reject) => {
            //发送验证码
            auth.sendPhoneCode(userInfo.phone)
                .then((res) => {
                    ret['code'] = 200;
                    ret['msg'] = '验证码已发送';
                    resolve(ret);
                })
                .catch(err => {
                    ret['code'] = -1;
                    ret['msg'] = '验证码发送失败';
                    reject(ret);
                });

        })
    },
    // 手机号 + 验证码 + 密码注册
    async registerByPhoneCode({ commit }, userInfo) {
        const app = cloudbase.init({
            env: this.state.env
        });
        const auth = app.auth({
            persistence: "local"
        });
        const ret = {};
        return new Promise((resolve, reject) => {
            auth.signUpWithPhoneCode(userInfo.phone, userInfo.phoneCode, userInfo.password)
                .then((res) => {
                    let _openid = res.user.uid;
                    userInfo.username = "A" + userInfo.phone;
                    auth.currentUser.updateUsername(userInfo.username)
                        .then(() => {
                            const query = {};
                            query['username'] = userInfo.username;
                            query['phone'] = userInfo.phone;
                            query['_openid'] = _openid;
                            app.callFunction({
                                name: "addAdminInfo",
                                data: query
                            }).then(() => {
                                ret['code'] = 200;
                                ret['msg'] = '注册成功，用户名为随机分配账号';
                                resolve(ret);
                            })
                        })
                        .catch(err => {
                            ret['code'] = -1;
                            ret['msg'] = '注册成功，但用户名绑定手机失败';
                            ret['err'] = err;
                            reject(ret);
                        });
                    // });
                })
                .catch(err => {
                    let message = JSON.parse(err.message);
                    let msg = message.msg;
                    ret['code'] = -1;
                    if (msg.indexOf('PHONE_CODE_NOTFOUND_OR_EXPIRED') !== -1) {
                        ret['msg'] = '注册失败：未发送验证码 或者 验证码过期';
                    } else if (msg.indexOf('PHONE_CODE_NOT_MATCHED') !== -1) {
                        ret['msg'] = '注册失败：验证码错误';
                    } else if (msg.indexOf('AUTH_PHONE_HAS_BEEN_BOUND') !== -1) {
                        ret['msg'] = '注册失败：该手机号已注册';
                    } else {
                        ret['msg'] = '注册失败：未知错误';
                    }
                    reject(ret);
                });
        })
    },
    async isUsernameRegistered({ commit }, username) {
        const app = cloudbase.init({
            env: this.state.env
        });
        const auth = app.auth({
            persistence: "local"
        });
        return new Promise((resolve, reject) => {
            auth.isUsernameRegistered(username)
                .then((res) => {
                    if (!res) { // 用户名未绑定过手机号
                        resolve();
                    } else {
                        reject();
                    }
                });
        });
    }
}
export default actions;