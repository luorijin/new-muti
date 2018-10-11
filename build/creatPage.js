const inquirer = require("inquirer");
const fs = require("fs");
const path = require('path');
const mkdirp = require("mkdirp");
    inquirer.prompt([{
        type:"input",
        message:"输入页面名字:",
        name:"page",
        validate:function(val){
            let page=path.join(__dirname,`../src/pages/${val}`);
            if(fs.existsSync(page)){
               return "页面已存在" 
            }
            return true;
        }
    }]).then(answers =>{
        let from=path.join(__dirname,`./template`);
        let dist=path.join(__dirname,`../src/pages/${answers.page}`);
        copy(from,dist);
    })
    
let copy = function(src,dst){

    //判断文件需要时间，则必须同步
    if(fs.existsSync(src)){
        fs.readdir(src,function(err,files){
            if(err){console.log(err);return;}
            files.forEach(function(filename){
            
                //url+"/"+filename不能用/直接连接，Unix系统是”/“，Windows系统是”\“
                var url = path.join(src,filename),
                    dest = path.join(dst,filename);
                fs.stat(url,function(err, stats){
                    if (err) throw err;
                    
                     //是文件
                    if(stats.isFile()){
                    
                        // //创建读取流
                        let readable = fs.createReadStream(url);
                        mkdirp.sync(path.dirname(dest));
                        //创建写入流 
                        let writable = fs.createWriteStream(dest,{ encoding: "utf8" });
                        // 通过管道来传输流
                        readable.pipe(writable);
                        
                    //如果是目录
                    }else if(stats.isDirectory()){
                        exists( url, dest, copy );
                    }
                });
            });
        });
    }else{
        console.log("给定的目录不存，读取不到文件");
        return;
    }
}

function exists(url,dest,callback){
    fs.exists(dest,function(exists){
        if(exists){
            callback && callback(url,dest);
        }else{
            //第二个参数目录权限 ，默认0777(读写权限)
            fs.mkdir(dest,0777,function(err){
                if (err) throw err;
                callback && callback(url,dest);
            });
        }
    });
}
process.on('exit',function(){
   console.log("\n页面创建成功");
})