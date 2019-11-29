define(["SysUtil","Framework7"],function(SysUtil,Framework7){
    var log = SysUtil.getLoger("Platform-F7");
    var controllername = SysUtil.getControllerName();
	if(controllername){
        return SysUtil.promiseRequire([controllername])
        .then(function(controller){
            if(controller){
                //有返回值认为需要自动初始化
                if(typeof controller =="function"){
                    controller = controller()
                }
                return Promise.resolve(controller)
                .then(function(controller){
                    new Framework7(controller);
                })
            }else{
                return Promise.resolve(true);
            }
        })
	}else{
        log.info("body 未配置 controller");
        return Promise.resolve(true);
    }
})