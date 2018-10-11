const path=require('path');
const HtmlWebpackPlugin=require('html-webpack-plugin');
const MultiEntryPlugin=require('webpack/lib/MultiEntryPlugin');
module.exports= class compilerPlugin{
    apply(compiler) {
        compiler.cachePlugins={};//缓存入口监听
        const _plugin=compiler.plugin;
        const cacheNames=['compilation','make','emit'];
        compiler.plugin=function(name,fn){
            _plugin.call(compiler,name,fn);
            if(compiler.contexName&&cacheNames.indexOf(name)!==-1){
                fn={fn:fn,entry:compiler.contexName};
            };
            if(!compiler.cachePlugins[name]) this.cachePlugins[name] = [fn];
	        else compiler.cachePlugins[name].push(fn);
        }
        compiler.apply=function(){
            for(var i = 0; i < arguments.length; i++) {
               if(arguments[i] instanceof MultiEntryPlugin){//入口编译时，暂存入口名字
                    compiler.contexName=arguments[i].name;
               }
                arguments[i].apply(this);
                compiler.contexName=null;//结束时重置临时名字
            }
        }
    }
}