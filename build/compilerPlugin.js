const path=require('path');
const HtmlWebpackPlugin=require('html-webpack-plugin');
const MultiEntryPlugin=require('webpack/lib/MultiEntryPlugin');
module.exports= class compilerPlugin{
    apply(compiler) {
        const that=this;
        compiler.cachePlugins={};
        const _plugin=compiler.plugin;
        const cacheNames=['compilation','make','emit'];
        compiler.plugin=function(name,fn){
            _plugin.call(compiler,name,fn);
            if(compiler.contexName&&cacheNames.indexOf(name)!==-1){
                console.info('contexName',compiler.contexName)
                fn={fn:fn,entry:compiler.contexName};
            };
            if(!compiler.cachePlugins[name]) this.cachePlugins[name] = [fn];
	        else compiler.cachePlugins[name].push(fn);
        }
        compiler.apply=function(){
            for(var i = 0; i < arguments.length; i++) {
               if(arguments[i] instanceof MultiEntryPlugin){
                    compiler.contexName=arguments[i].name;
               }
                arguments[i].apply(this);
                compiler.contexName=null;
            }
        }
    }
}