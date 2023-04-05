var mysql = require("mysql");
var http = require("http");
const urlib = require("url");
const { mysql_setting } = require("./mysql_setting");
var connection = mysql.createConnection(mysql_setting);
connection.connect((err) => {
  // 如果有错误对象，表示连接失败
  if (err) return console.log("数据库连接失败");
  // 没有错误对象提示连接成功
  else console.log("mysql数据库连接成功");
});
const RequestUrl = "http://localhost:8017";
const doResponse = (response, res) => {
  response.setHeader("Access-Control-Allow-Origin", RequestUrl);
  response.setHeader("Access-Control-Allow-Credentials", true);
  response.setHeader("Content-type", "text/html;charset=UTF-8");
  response.end(res);
};

const getGoods = (response, query) => {
  let page = query.page || 1;
  let count_per_page = query.count_per_page || 10;
  let brand = query.brand
    ? ` and title like concat('%','${query.brand}','%')`
    : "";
  let model = query.model
    ? ` and title like concat('%','${query.model}','%')`
    : "";
  let name = query.name
    ? ` and title like concat('%','${query.name}','%')`
    : "";

  let sql = `select * from jingdong where id > 0 ${name}${brand}${model} limit ${
    (page - 1) * count_per_page
  },${count_per_page};`;

  let sql2 = `SELECT COUNT(*) FROM jingdong where id > 0 ${name}${brand}${model};`;
  connection.query(sql2, (err, data, fields) => {
    if (err) throw err;
    else {
      var count = JSON.parse(JSON.stringify(data));
      var total_item_count = count[0]["COUNT(*)"];
      var total_page_count = total_item_count / count_per_page;
      connection.query(sql, (err, data, fields) => {
        if (err) throw err;
        else {
          var data_list = JSON.parse(JSON.stringify(data));
          const res = {
            XCmdrCode: 0,
            XCmdrMessage: "成功",
            XCmdrResult: {
              data_list,
              total_item_count,
              total_page_count,
            },
          };
          doResponse(response, JSON.stringify(res));
        }
      });
    }
  });
};
const getGoodsDetail = (response, query) => {
  let id = query.id || 1;
  let sql = `select * from jingdong where id =  ${id}`;
  connection.query(sql, (err, data, fields) => {
    if (err) throw err;
    else {
      var detail = JSON.parse(JSON.stringify(data));
      const res = {
        XCmdrCode: 0,
        XCmdrMessage: "成功",
        XCmdrResult: detail[0],
      };
      doResponse(response, JSON.stringify(res));
    }
  });
};
// 创建http server，并传入回调函数:
var server = http.createServer(function (request, response) {
  // 回调函数接收request和response对象,
  var url = request.url;
  var myobj = urlib.parse(url, true);
  var pathName = myobj.pathname;
  var query = myobj.query;
  switch (pathName) {
    case "/goods":
      getGoods(response, query);
      break;
    case "/goods/detail":
      getGoodsDetail(response, query);
      break;
    default:
      console.log("错误，请求路径为" + pathName);
  }
});

// 让服务器监听8080端口:
server.listen(8080);
console.log("Server is running at http://localhost:8080/");
