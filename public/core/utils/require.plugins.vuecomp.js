define(["require","urijs/URI","util"],function(require,URI,util){
    
    /** START OF PUBLIC API **/

    /**
     * Registers a callback for DOM ready. If DOM is already ready, the
     * callback is called immediately.
     * @param {Function} callback
     */
    function comp() {
        //console.log("comp:")
        //console.log(arguments)
    }

    comp.version = '0.0.1';

    comp.load = function (name, req, onLoad, config) {
        require([name],function(controller){
            if(typeof controller == "function"){
                controller = Promise.resolve(controller())
            }
            Promise.resolve(controller).then(function(controller){
                if(controller.template){
                    controller.el&&(controller.el = null);
                    onLoad(controller);
                } else {
                    if(controller.el && !controller.templatePath){
                        var arr = name.split(".")
                        arr[arr.length-1]="html";
                        controller.templatePath = URI(arr.join("."), window.location.pathname).toString();
                    }
                    if(!controller.templatePath){
                        throw "组件"+name+"未定义 el、template、templatePath"
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
                                    var styles = content.match(REG_style);
                                    if(styles&&styles.length){
                                        html+="\n"+styles.join("\n");
                                    }
                                    return {
                                        attrs:result[1],
                                        content:html
                                    };
                                }
                                return content;
                            }

                            var appContainer = $("<div>"+getBody(html).content+"</div>").find(controller.el);
                            appContainer.removeAttr("id");
                            controller.template = appContainer[0].outerHTML;
                            controller = util.removeAttr(controller,"el")
                            controller = util.removeAttr(controller,"templatePath")
                            return onLoad(controller);
                        },
                        function(err){
                            throw err
                        }
                    )
                }
            })
        },function(err){
            throw err
        });
    };

    return comp;
})