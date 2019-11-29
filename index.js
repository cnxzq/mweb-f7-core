const express = require("express");
let app = express(),
config = require('./config'),
open = require('open'),
proxy = require('http-proxy-middleware');

var port = config.port || 3000;
var APIProxy = proxy(config.proxy);


if(config.defaultDocument){
    app.get("/",(req,res)=>{
        res.redirect(302,config.defaultDocument);
    })
}
app.use(config.root||"/",express.static("public")); 
app.use(APIProxy);

app.listen(port,function(){
    console.log("[server] 服务已启动 "+port)
    open('http://127.0.0.1:'+port,{app: ['chrome', '--incognito']});
});