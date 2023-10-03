var a = function(){
    console.log('haha');
} //JS에서는 함수가 값이다!

//a(); // 변수 뒤에 ()를 붙혀서 함수로 실행 가능. 
//JS에서는 함수가 값이기 때문.

function slowfunc(callback){
    callback();
}

slowfunc(a); // a는 함수다.