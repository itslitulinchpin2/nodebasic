var fs=require('fs');

//readFileSync, 동기적, 순서대로, 리턴값이 존재
// console.log('A');
// var result = fs.readFileSync('nodejs/sample.txt','utf8')
// console.log(result);
// console.log('C')
// A result C


//비동기적 : 콜백함수 필요, 리턴 대신 콜백함수를 실행함
console.log('A');
fs.readFile('nodejs/sample.txt','utf8', function(err,result){
    console.log(result);
}) //시간이 걸리니, 작업이 끝나고 나서 콜백함수를 실행해라.
console.log('C')
// A C result