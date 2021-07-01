export function loadMap() {
    // 回调异步引入BMap
    return new Promise(function(resolve, reject) {
        window.onBMapCallback = function() {
            resolve(BMap);
        }
        let script = document.createElement('script');
        script.type = "text/javascript";
        script.src = "https://api.map.baidu.com/api?v=2.0&ak=D7f130ce4be999b80a56cfd12ab06a7a&callback=onBMapCallback";
        script.onerror = reject;
        document.head.appendChild(script);
    });
}