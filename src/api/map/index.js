export const fetchPOI = (query) => {
    const app = cloudbase.init({
        env: window._tcbEnv.TCB_ENV_ID
    });
    const auth = app.auth({
        persistence: "local"
    });
    // 判断是否登录？
    const db = app.database();
    const ret = {};
    return new Promise((resolve, reject) => {
        db.collection("markers")
            .get()
            .then(res => {
                ret['code'] = 200;
                ret['msg'] = '地图创建成功';
                ret['data'] = res.data;
                resolve(ret);
            })
            .catch(err => {
                ret['code'] = -1;
                ret['msg'] = '地图创建失败';
                ret['err'] = err;
                reject(ret);
            });
    })
};