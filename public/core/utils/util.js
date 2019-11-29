define(function(){
    return {
        /* 延时调用，防止密集调用 */
		debounce : function (fn,delay,context) {
            delay = delay || 500;
            var timer = null; // 声明计时器
            return function () {
                var context = this;
                var args = arguments;
                timer&&clearTimeout(timer);
                timer = setTimeout(function () {
                    fn.apply(context, args);
                }, delay);
            };
        },
        queryUrlParameter:function(url){
            var rev = {};
            (url.split("?")[1]||[]).split("&").forEach(function(item){
                var i = item.split("=");
                i[0]&&(rev[i[0]]=(unescape(i[1])||null))
            })
            return rev;
        },
		queryString:function(name,url) {
            url = url || window.location.search;
			if(url){
				var arr = url.split("?");
				url = "?"+arr[arr.length-1];
			}else{
		        url = url || window.location.search;
			}
	        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	        var r = url.substr(1).match(reg);
	        if (r != null) return unescape(r[2]); return null;
	    },
        isFunction:function(arg){
            return arg && (arg.constroller === Function)
        },
        isArray:function(arg){
            return arg && (arg.constroller === Array)
        }
    }
})