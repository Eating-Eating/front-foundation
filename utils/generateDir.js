const fs = require('fs');
const path=require('path');
function travel(dir,callback,pushPath){
    let nowPath
    if(pushPath){
        nowPath = pushPath
    }else{
        nowPath = dir.split('markdown')[1]
    }
    // 根据目录生成state结构
    let tempArr = nowPath.split(path.sep)
    let nowRoutePath = nowPath.split(path.sep).join('/')
    let nowLabel = tempArr[tempArr.length-1]
    const obj = {
        label:"",
        routePath:nowRoutePath,
        mdPath:"",
        keyWords:[],
    }
    fs.readdirSync(dir).forEach((file)=>{
        var pathname=path.join(dir,file)
        if(fs.statSync(pathname).isDirectory()){
            obj.keyWords.push(travel(pathname,callback,nowPath+path.sep+file))
        }else{
            callback(obj,file,nowLabel,nowRoutePath)
        }
    })
    return obj
}
const output = travel(path.resolve(__dirname,'../src/pages/markdown'),function(obj,file,nowLabel,nowRoutePath){
    if(file.includes('.md')){
        if(file.includes('index.md')){
            obj.label = nowLabel
            obj.mdPath = nowRoutePath + file
        }else{
            obj.keyWords.push({
                label:file.split('.md')[0],
                routePath:nowRoutePath + "/" + file.split('.md')[0],
                mdPath:"./pages/markdown" + nowRoutePath + "/" + file,
                keyWords:[],
            })
        }
    }
})
console.log(JSON.stringify(output))

// const fs = require('fs');
// const path=require('path');
// function travel(dir,callback,pushPath){
//     let nowPath
//     if(pushPath){
//         nowPath = pushPath
//     }else{
//         nowPath = dir.split('markdown')[1]
//     }
//     console.log('dir',dir)
//     console.log('nowPath',nowPath)
//     let tempArr = nowPath.split(path.sep)
//     let nowRoutePath = nowPath.split(path.sep).join('/')
//     let nowLabel = tempArr[tempArr.length-1]
//     const obj = {
//         keyWords:[],
//         routePath:nowPath.split(path.sep).join('/'),
//         label:"",
//         mdPath:"",
//     }
//     console.log(obj)
//     fs.readdirSync(dir).forEach((file)=>{
//         var pathname=path.join(dir,file)
//         if(fs.statSync(pathname).isDirectory()){
//             travel(pathname,callback,nowPath+path.sep+file)
//         }else{
//             callback(obj,pathname,nowLabel,nowRoutePath)
//         }
//     })
// }
// let arr = []
// travel(path.resolve(__dirname,'../src/pages/markdown'),function(obj,pathname,nowLabel,nowRoutePath){
//     if(pathname.includes('.md')){
//         if(pathname.include('index.md')){
//             obj.label = nowLabel
//         }else{
//             obj.keyWords.push({
//                 routePath:nowRoutePath,
//                 label:
//             })
//         }
//       let asdes = pathname.split('pages')
//       // 这一步可以处理生成路由
//       let asd = asdes[1].split(path.sep)
//       arr.push(asd)
//     }
// })
// console.log(arr)