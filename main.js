var http = require('http'); //https, fs, url은 모듈임.
var fs = require('fs');
var url = require('url')
var qs = require('querystring'); // post전송 데이터 수신시 사용

function templateHTML(title,list,body,control){

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
              ${control}
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
    console.log(pathname);
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

          var template=templateHTML(title,list,`<h2>${title}</h2>${description}`
          ,`<a href="/create">create</a>`);
          response.writeHead(200);
          response.end(template)
      })
           
      } else {
        //쿼리스트링이 존재한다면

        fs.readdir('./data',function(error, filelist){
          fs.readFile(`./data/${queryData.id}`,'utf8', function(err,description){
            var title = queryData.id;
            var list=templateList(filelist)
            var template=templateHTML(title,list,`<h2>${title}</h2>${description}`,
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
            response.writeHead(200);
            response.end(template)
          })
        })
      }
  } else if (pathname==='/create'){
    //pathname이 /가 아닌 /create인 경우

    fs.readdir('./data',function(error, filelist){
          
      var title='Web - create'
      // var list = `
      //     <ol>
      //       <li><a href="/?id=HTML">HTML</a></li>
      //       <li><a href="/?id=CSS">CSS</a></li>
      //       <li><a href="/?id=JavaScript">JavaScript</a></li>
      //     </ol>
      // `
      var list = templateList(filelist);
      
      var template=templateHTML(title,list,`
      
        <form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p><textarea name="description" placeholder="description"></textarea></p>
        <p><input type="submit"></p>
        </form>
      `,' ');
      response.writeHead(200);
      response.end(template)
  })

  } else if (pathname==='/create_process'){
  
    var body='';
    
    request.on('data',function(data){
      body+=data;
    }); //post방식으로 전송되는 데이터가 많을 때를 대비해서.
    //특정량을 서버가 수신할 때마다 콜백함수를 호출한다.
    //그 때마다 data라는 인자를 통해 수신한 정보를 준다.
    
    request.on('end',function(){
      var post = qs.parse(body); // 여기에 원하는 body 정보가 들어있음.
      var title=post.title;
      var description=post.description;
      //이제 받아왔으니 아래 줄부터 파일을 저장해야함.
      
      fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        //이 곳 콜백 함수는 파일의 저장이 끝났을 때에 실행되는 함수.
        response.writeHead(302, {Location: `/?id=${title}`});
        response.end();
      } )

    }); //정보가 조각조각 들어오다, 더 이상 없으면 이 콜백함수를 호출.(request.on('end'))
    //이 때 정보 수신이 끝났음.
  }
  else if (pathname==='/update'){
    fs.readdir('./data',function(error, filelist){
      fs.readFile(`./data/${queryData.id}`,'utf8', function(err,description){
        var title = queryData.id;
        var list=templateList(filelist)
        var template=templateHTML(title,list,`
        <form action="/update_process" method="post">
        <input type="hidden" name="id" value="${title}">
        <p><input type="text" name="title" placeholder="title" value=${title}></p>
        <p><textarea name="description" placeholder="description" >${description}</textarea></p>
        <p><input type="submit"></p>
        </form>
        `, '');
        response.writeHead(200);
        response.end(template)
      })
    })

  } else if (pathname==='/update_process'){

    var body='';
    
    request.on('data',function(data){
      body+=data;
    }); 
    request.on('end',function(){
      var post = qs.parse(body); 
      var id = post.id;
      var title=post.title;
      var description=post.description;
      
      //파일 수정하기 : 이름을 변경하고 파일 write.
      //원래 이름, 바꿀 이름, 콜백함수
      fs.rename(`data/${id}`,`data/${title}`,function(err){
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end();
        } )
      } )

    }); 


  } else {
    response.writeHead(404);
    response.end('Not Found');
  } 
    //response.end(fs.readFileSync(__dirname + _url)); 
});
app.listen(3000); //3000은 포트번호