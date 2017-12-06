var fs = require('fs')
var pth = require('path')
var completedTasks = 0
var tasks = []
var wordCounts = {}
var filesDir = './text'
//这个Demo不错
function checkIfComplete() {
    completedTasks ++
    //这个思路不错，在这里统计任务个数，如果数完成了就全部打出来
    if(completedTasks == tasks.length){
        for(var index in wordCounts){
            console.log(index+':'+wordCounts[index])
        }
    }
}
function countWordsInText(text){
    var words = text.toString().toLowerCase().split(/\W+/).sort()
    for(var index in words){
        var word = words[index]
        if(word){
            //如果这个单词存在，就加一，不存在就是一
            wordCounts[word] = (wordCounts[word]) ? wordCounts[word] + 1 : 1
        }
    }
}

fs.readdir(filesDir,function(err,files){
    if(err) throw err
    for(var index in files){
        //每一个文件新建一个任务，
        var task = (function(file){
            return function(){
                fs.readFile(file,function(err,text){
                    if(err) throw err
                    countWordsInText(text)
                    checkIfComplete()
                })
            }
        })(filesDir + '/' + files[index])
        tasks.push(task)
    }
    //从里面开户全部任务
    for(var task in tasks){
        tasks[task]()
    }
})