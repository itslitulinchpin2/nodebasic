//리터럴 : 정보를 표현하는 기호를 뜻함.
var name = "leo"
//var letter = "Dear " + name + " \n Oh my gosh. He is Super great."

var letter = `Dear ${name}, 
Oh my gosh. He is Super great.
`

console.log(letter)

//줄바꿈을 할 때 이상한 특수문자를 사용하지 않아도 됨.
//변수를 문자열에 덧붙힐때 +따위가 필요없이,
// ${변수명}을 사용하면 됨
