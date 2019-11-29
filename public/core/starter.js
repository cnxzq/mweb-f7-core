/* starter.js */
(function(){
    var root = "/";
    var requirePath = root+"core/lib/require.js";
    var requireConfig = {
	    baseUrl: root,
        paths:{
            "platforms":"core/platforms",
    	    'framework7':'core/lib/framework7/core/js/framework7.bundle',
            "polyfill":"core/lib/babel/polyfill/polyfill",
            "ieBetter":'core/lib/babel/polyfill/ieBetter',
            "urijs":'core/lib/uri',
            "ramda":'core/lib/ramda',
            "mock":'core/lib/mock/mock',
            "axios":'core/lib/axios/axios',

            /* paths */
            "service":'core/utils/service',
            "util":'core/utils/util',

            "log":"core/utils/log",
            "Framework7":"core/lib/framework7/core/js/framework7.bundle",

	    	/* require plus */
	    	"text":"core/lib/require-plugins/text",
	    	"css":"core/lib/require-plugins/css",
	    	"json" :'core/lib/require-plugins/src/json',
            "domReady":"core/lib/require-plugins/domReady",
		    "vuecomp":"core/utils/require.plugins.vuecomp",
		    "f7comp":"core/utils/require.plugins.f7comp"
        },
        shim:{
	    	"Framework7":{
                "deps":[
                    "css!core/lib/framework7/fonts/icons",
                    "css!core/lib/framework7/core/css/framework7.bundle.min"
                ]
            }
        }
    }
    var appenScript = function(url,callback){
        var script=document.createElement('script');
        script.type="text/javascript";
        if(typeof(callback)!="undefined"){
            if(script.readyState){
                script.onreadystatechange=function(){
                    if(script.readyState == "loaded" || script.readyState == "complete"){
                        script.onreadystatechange=null;
                        callback();
                    }
                }
            }else{
                script.onload=function(){
                    callback();
                }
            }
        }
        script.src=url;
        document.body.appendChild(script);
    }

    var SysUtil = {
        getOption:function(target){
            return eval("("+ (target.getAttribute("option")||target.getAttribute("data-option")) +")")||{}
        },
        getBodyOption:function(){
            return this.getOption(document.body);
        },
        getDefaultControllerName:function(){
            return window.location.pathname.replace(/.html$/,".js")
        },
        getControllerName:function(target){
            var controller = (target||document.body).getAttribute("controller");
            if(controller){
                return controller.replace("{filename}",this.getDefaultControllerName())
            }else{
                return null;
            }
        },
        getController:function(element){
            element = element || document.body;
            var controllerName = this.getControllerName(element);
            if(controllerName){
                return this.promiseRequire([controllerName])
                .then(function(args){
                    return args[0]
                })
            }else{
                return Promise.resolve(null);
            }
        },
        promiseRequire:function(paths){
            return new Promise(function(resolve){
                requirejs(paths,function(){
                    resolve(Array.prototype.slice(arguments))
                })
            });
        },
        loadPlatform:function(name){
            return SysUtil.promiseRequire(["platforms/"+name])
            .then(function(args){
                return Promise.resolve(args[0])
            })
        },
        getLoger:function(name){
            return new Loger(name);
        }
    }

    //全局变量
    var GlobData = {

    }

    var Loger = (function(){
        //?debug=0 输出 日志 info error debug
        //?debug=1 输出 日志 error debug
        //?debug=2 输出 日志 error debug debugger;
    
        //日志输出级别
        var debug = window.location.search.slice(1).split("&").find(d=>d.split("=")[0]="debug");
        if(debug){
            debug = debug.split("=");
            debug = isNaN(debug) && debug*1 || 1;
        }
    
        return function(name){
            this.info = function(msg){
                debug===1&&console.log(`[${name}] `+msg)
            }
            this.error = function(msg){
                debug>0&&console.error(`[${name}] `+msg)
            }
            this.debug = function(msg){
                debug>1&&console.error(`[${name}] `+msg)
            }
            this.debugger = function(msg){
                if(debug>1){ debugger; }
            }
        }
    })()

    // append requirejs
    appenScript(requirePath,function(){
        // set requirejs
        requirejs.config(requireConfig);

        // systuil
        define("SysUtil",SysUtil);
        define("GlobData",GlobData);
        define("Log",function(){return Loger;});
        
        var option = SysUtil.getBodyOption();
        if(typeof option.platform == "undefined"){
            option.platform = "v1";
        }

        var res = [];

        // broswer polyfill
        res.push('domReady!');
        !window.Promise && res.push("polyfill");
        !document.addEventListener && res.push('ieBetter');

        var rev = SysUtil.promiseRequire(res);
        rev = rev.then(function(){
            if(option.platform){
                return SysUtil.loadPlatform(option.platform);
            }else{
                return SysUtil.promiseRequire([SysUtil.getControllerName()])
                .then(function(args){
                    var controller = args[0];
                    if(typeof controller == "function"){
                        controller = controller();
                    }
                    return Promise.resolve(controller);
                })
            }
        })

        rev.then(function(){
            if(document.body.style.display = "none"){
                var c = document.body.style;
                c.opacity = "0";
                c.display = "block";
                c.transition = "opacity 0.5s";
                setTimeout(function(){c.opacity = "1";})
            }
        })
    })
})();