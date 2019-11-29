module.exports = {
    port:3000,
    defaultDocument:"",
    root:"/",
    proxy:{ //http-proxy-middleware option
        target: 'http://192.168.1.11:9080/', // 目标服务器 host
        changeOrigin: true,               // 默认false，是否需要改变原始主机头为目标URL
        ws: true // 是否代理websockets
    }
}