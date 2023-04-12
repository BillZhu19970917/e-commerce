var mysql = require("mysql");
var http = require("http");
const urlib = require("url");
const { mysql_setting } = require("./mysql_setting");
var connection = mysql.createConnection(mysql_setting);
connection.connect((err) => {
  // 如果有错误对象，表示连接失败
  if (err) return console.log("数据库连接失败", err);
  // 没有错误对象提示连接成功
  else console.log("mysql数据库连接成功");
});
const RequestUrl = "http://localhost:8000";
const doResponse = (response, res) => {
  response.setHeader("Access-Control-Allow-Origin", RequestUrl);
  response.setHeader("Access-Control-Allow-Credentials", true);
  response.setHeader("Content-type", "text/html;charset=UTF-8");
  response.end(res);
};

// 创建http server，并传入回调函数:
var server = http.createServer(function (request, response) {
  // 回调函数接收request和response对象,
  var url = request.url;
  var myobj = urlib.parse(url, true);
  var pathName = myobj.pathname;
  var query = myobj.query;
  switch (pathName) {
    case "/sendOnLineInfo":
      console.log(query);
      break;
    default:
      console.log("错误，请求路径为" + pathName);
  }
});

// 让服务器监听8080端口:
server.listen(8080);
console.log("Server is running at http://localhost:8080/");
