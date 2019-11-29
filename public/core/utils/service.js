/**
 * 接口基类
 * @class services/base
 * @author zhuqiang
 * @see services/base.js
 * @expmale
 * var service = require("service");
 * 
 * 	var getUserInfo = service.createService({url:"xxxx/getUserInfo"});
 */
define(["mock","ajax","util"],function(Mock,Ajax,Util){
    "use strict";
    var mapObj = function(fn,obj){
        var rev = {};
        for(var a in obj){
            rev[a] = fn(obj)
        }
        return rev;
    }

    /*
    //创建 Service
    var option = function(){

    }
    var option = "xxxxx.action";
    var option = {
        url:"xxxxx.action",
        props:[name,id],//function(){},null
        usemock:true,
        mock:function(){

        },
        then:function(){

        }
    }
    */

    var Option = function(setting){
        var option = {};
        if(!setting){
            throw "参数必须是 string|function|object 类型"
        } else if(typeof setting == "string" ){
            option.url = setting;
        } else if(setting&&setting.constructor==Function){
            option.then = function(){
                return Promise.resolve(setting.apply(this,arguments))
            }
        }
    }


    var getProps = function(props,allarg,con){
        //处理参数 props 属性
        if(Util.isFunction(props)){
            //若props为函数,将实参列表传入props,在props函数中this指向services,this.context指向当前配置，
            return Promise.resolve(props.apply(con,allarg));
        } else if(Util.isArray(props)){
            //若props为string[]，将实参列表传入props
            var rev = {};
            props.forEach(function(iprop,index){
                rev[iprop] = allarg[index]||null;
            })
            return Promise.resolve(rev);
        }else{
            return Promise(allarg);
        }
    }

    var createService = function(setting,context){
        var getContext = function(){
            return Promise.resolve(Util.isFunction(context)?context():context);
        };

        var setting = new Option(setting);
        return function(){
            var allarg = arguments;
            var rev = getContext()
            .then(function(con){
                return getProps(setting.props,allarg,con)
                .then(function(args){
                    var rev = null;
                    if(setting.mock && (setting.usemock || util.queryString("usemock"))){
                        if(typeof setting.mock == "function"){
                            rev = setting.mock.apply(con,args);
                        }else{
                            rev = Mock.mock(setting.mock);
                        }
                    }else if(typeof setting.url == "string"){
                        rev = Ajax.ajax(Util.extend(true,{},
                            defaultAjaxOption,
                            setting.ajax,
                            {
                                url:setting.url,
                                data:args
                            }
                        ));
                    }else if($.isFunction(setting.url)){
                        rev = setting.url.apply(con,args);
                    }
                    return Promise.resolve(rev);
                })
                .then(function(data){
                    if(setting.then){
                        return Promise.resolve(setting.then.call(con,data));
                    }else{
                        return data;
                    }
                });
            })
            rev = setting["catch"]?rev["catch"](setting["catch"]): rev;
            return rev;
        }
    }

    
    /*
    * 创建接口对象(多个接口集合)
    * 
    * 例子：
    * 
    * var myservices = create({
    * 		//简单例子
    * 		getDataByCustomArg:{url:'/xxx/getDataByCustomArg.action'},
    * 		
    * 		//复杂例子1：登陆校验,假如接口返回{err:0,msg:"登陆成功"}，err 1:密码错误  0:成功 2:登陆限制
    * 		login:{
    * 			url:'/xxx/getName.action',
    * 			props:["username","password"],
    * 			then:function(resp){
    * 				//校验失败
    * 				if(resp.err){throw resp.msg}
    * 				
    * 				//校验成功
    * 				return resp.msg;
    * 			},
    * 			catch:function(err){return "请求失败-"+err.message}
    * 		},
    * 		
    * 		//简单例子-不从服务器取数
    * 		getCurrentUserId:function(){return $.cookie('userid')},
    * 		
    * 		//例子：根据用户ID获取用户信息
    * 		getUserInfoById:{url:'/xxx/getUserInfo.action',props:["id"]},
    * 
    * 		//例子：获取当前登陆用户信息
    * 		getCurrentUserInfo:function(){return this.getCurrentUserId().then(this.getUserInfoById)}
    * })
    * 
    * //一般调用，传入参数都会作为post参数
    * myservices.getDataByCustomArg({arg1:"参数1"});
    * 
    * //校验登陆
    * .then(function(msg){
    * 		alert("登陆成功:"+msg)
    * }).catch(function(msg){
    * 		alert("登陆失败:"+msg)
    * })
    * 
    */
    var createServices = function(setting,option){
        var _service = mapObj(function(item){
            return createService(item,function(){ 
                return Util.extend({},_service,{
                    context:item
                })
            });
        },setting);
        
        return _service;
    }
	
	return createServices;
});
