var M = {
    v:'v',
    f: function(){
        console.log(this.v);
    }
}

var a = 1;

module.exports = M;
//모듈을 export하는 방법. 이 코드에서 M 객체를 export하겠다.