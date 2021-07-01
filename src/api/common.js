import cloudbase from "@cloudbase/js-sdk";
export const app = cloudbase.init({
    env: window._tcbEnv.TCB_ENV_ID
});
export const auth = app.auth({
    persistence: "local"
});
export const isRefreshLogin = () => {
    return new Promise((resolve, reject) => {
        auth.getLoginState()
            .then(loginstate => {
                if (loginstate) {
                    resolve();
                } else {
                    reject();
                }
            })
    })
};