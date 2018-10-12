'use strict'
const utils = require('./utils')
const compilerPlugin=require('./compilerPlugin');
const webpack = require('webpack')
const chokidar=require('chokidar')
const MultiEntryPlugin = require('webpack/lib/MultiEntryPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const WebpackDevServer = require('webpack-dev-server')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)
const devServer={
    clientLogLevel: 'warning',
    // historyApiFallback: {
    //   rewrites: [
    //     { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
    //   ],
    // },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  };
const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  plugins: [
    new compilerPlugin(),
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ]),
    new webpack.ProgressPlugin(),
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devServer.host}:${devServer.port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      })
  ]
})
function reBulid(type,path,compiler,server){
  if(!/.+main\.js$/.test(path)) return;
  path=path.replace(/\\/g,"/");
  let matchs=path.match(/pages\/(.+)\/main.js/);
  if(!matchs) return;
  let baseName=matchs[1];
  if(type=="DELETE"){
    let newCompilation=[];
    let newMake=[];
    compiler.cachePlugins.compilation.forEach(function(item){
      if(item.entry!==baseName){
        if(typeof(item)=="object"){
          item=item.fn;
        }
        newCompilation.push(item);
      }
    })
    compiler.cachePlugins.make.forEach(function(item){
      if(item.entry!==baseName){
        if(typeof(item)=="object"){
          item=item.fn;
        }
        newMake.push(item);
      }
    })
    compiler._plugins.compilation=newCompilation;
    compiler._plugins.make=newMake;
  }else{
    let config={entry:{}};config.entry[baseName]=path;
    //热加载入口处理
    WebpackDevServer.addDevServerEntrypoints(config, devServer);
    //添加热加载入口
    compiler.apply(new MultiEntryPlugin(process.cwd(),config.entry[baseName],baseName));
    let conf = {
      // 模板来源
      template: 'index.html',
      // 文件名称
      filename: baseName + '.html',
      // 页面模板需要加对应的js脚本，如果不加这行则每个页面都会引入所有的js脚本
      chunks: ['manifest', 'vendor', baseName],
      inject: true
    }
    //添加模板入口
    compiler.apply(new HtmlWebpackPlugin(conf));
  }
  server.invalidate();
}
WebpackDevServer.addDevServerEntrypoints(devWebpackConfig, devServer);
let compiler=webpack(devWebpackConfig);
const server= new WebpackDevServer(compiler,devServer);
var watcher=chokidar.watch(path.join(__dirname,'../src/pages'))
watcher.on('ready', () => {
  watcher.on('add', (path) => {
    reBulid("ADD",path,compiler,server)
  });
  watcher.on('unlink', (path) => {
    reBulid("DELETE",path,compiler,server)
  });
});
server.listen(devServer.port, devServer.host, () => {
  console.log('\x1B[36m%s\x1B[0m','\n服务监听完成,代码编译中....');
});
