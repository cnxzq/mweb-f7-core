// f7 组件加载器
define(["require","urijs/URI","Log"],function(require,URI,Log){
    var mylog = new Log("Log");
    function f7com() {
    }
    f7com.version = '1.0.0';
    f7com.load = function (name, req, onLoad, config) {
        var __f7com = {}
        require([name],function(controller){
            __f7com.jspath = name;
            if(typeof controller == "function"){
                controller = Promise.resolve(controller())
            }
            Promise.resolve(controller).then(function(controller){
                if(controller.template){
                    __f7com.templatesrc="js"
                    controller.root&&(controller.root = null);
                    onLoad(controller);
                } else {
                    if(controller.root && !controller.templatePath){
                        var arr = name.split(".")
                        arr[arr.length-1]="html";
                        controller.templatePath = URI(arr.join("."), window.location.pathname).toString();
                        __f7com.htmlpath=controller.templatePath;
                    }
                    if(!controller.templatePath){
                        throw "组件"+name+"未定义 root、template、templatePath"
                    }
                    require(
                        ["text!"+controller.templatePath],
                        function(html){
                            var REG_BODY = /<body([^>]*)>([\s\S]*?)<\/body>/;
                            var REG_style = /<style[^>]*>([\S\s]*?)<\/style>/g;
                            function getBody(content){
                                var result = REG_BODY.exec(content);
                                if(result && result.length === 3){
                                    var html = result[2];
                                    var styles = REG_style.exec(content);
                                    if(styles&&styles.length>1){
                                        styles=styles.slice(1).join("\n");
                                    }
                                    return {
                                        attrs:result[1],
                                        content:html,
                                        style:styles
                                    };
                                }
                                return content;
                            }

                            var pagecontent = getBody(html);
                            var container = document.createElement("div");
                            container.innerHTML = pagecontent.content;
                            var appContainer = container.querySelector("[f7-component-root]")
                            controller.template = appContainer.outerHTML;
                            if(pagecontent.style){
                                if(!controller.style){controller.style=""}
                                controller.style+="\n"+pagecontent.style;
                            }
                            var rev = {};
                            for(var a in controller){
                                if(a=="root"||a=="templatePath"){continue;}
                                rev[a]=controller[a];
                            }

                            rev.__f7com = __f7com;
                            return onLoad(rev);
                        },
                        function(err){
                            mylog.error("请求组件HTML失败："+controller.templatePath)
                            throw err
                        }
                    )
                }
            })
        },function(err){
            throw err
        });
    };

    return f7com;
})