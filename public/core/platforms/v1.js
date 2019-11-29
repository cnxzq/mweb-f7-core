define(["sysUtil"],function(SysUtil){
    console.log("加载默认平台V1");
    return SysUtil.getController()
    .then(function(Controller){
        return new Controller();
    })
})