var testFoler = 'data'; //디렉토리 이름
var fs = require('fs');

fs.readdir(testFoler,function(error, filelist){
    console.log(filelist);
})