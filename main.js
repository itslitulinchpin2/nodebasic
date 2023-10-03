var http = require('http'); //https, fs, url은 모듈임.
var fs = require('fs');
var url = require('url')

function templateHTML(title,list,body){

  return (
          `
          <!doctype html>
            <html>
            <head>
              <title>WEB1 - ${title}</title>
              <meta charset="utf-8">
            </head>
            <body>
              <h1><a href="/">WEB</a></h1>
              ${list}
              ${body}
            </body>
            </html>
          `
  )
}

function templateList(filelist){
  var list = '<ul>'
  var i=0;
  while(i<filelist.length){
      list=list+`<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
      i=i+1
    }
  list=list+'</ul>'
  return(list)
}

var app = http.createServer(function(request,response){
    
    var _url = request.url;
    
    var queryData = url.parse(_url, true).query;
    var pathname=url.parse(_url, true).pathname
    
    //console.log(queryData.id) // HTML, CSS, ...
    
    if(pathname ==='/'){
      //현재 접속이 유효한 경로인 경우
      if(queryData.id===undefined){
        //쿼리스트링이 없는 경우
        
        fs.readdir('./data',function(error, filelist){
          
          var title='Welcome'
          // var list = `
          //     <ol>
          //       <li><a href="/?id=HTML">HTML</a></li>
          //       <li><a href="/?id=CSS">CSS</a></li>
          //       <li><a href="/?id=JavaScript">JavaScript</a></li>
          //     </ol>
          // `
          var list = templateList(filelist);
          var description = 'Hello, Node.js!'

          var template=templateHTML(title,list,`<h2>${title}</h2>${description}`);
          response.writeHead(200);
          response.end(template)
      })
           
      } else {
        //쿼리스트링이 존재한다면

        fs.readdir('./data',function(error, filelist){
          fs.readFile(`./data/${queryData.id}`,'utf8', function(err,description){
            var title = queryData.id;
            var list=templateList(filelist)
            var template=templateHTML(title,list,`<h2>${title}</h2>${description}`);
            response.writeHead(200);
            response.end(template)
          })
        })
      }
  } else {
    response.writeHead(404);
    response.end('Not Found');
  } 
    //response.end(fs.readFileSync(__dirname + _url)); 
});
app.listen(3000); //3000은 포트번호