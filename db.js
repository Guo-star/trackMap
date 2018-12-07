const mysql = require("mysql");
const fs = require("fs");
const routeIds = require("./bus.json");

Date.prototype.Format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ?
        o[k] :
        ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
};

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "root",
  database: "bus_track"
});


let index = 1;
let timeInterval = 5;// 时间间隔（分钟）
let sum = 24 * 60 / timeInterval;
// let sum = 2;
let nowDate = new Date("2018-11-27 00:00:00").getTime();
console.log("开始！")

executeSql(index);

function executeSql(i) {
  console.log("--------------------- " + new Date(nowDate + i * 60000 * timeInterval).Format("yyyy-MM-dd hh:mm:ss") + " ---------------------")
  console.time("耗时");

  let sql = `SELECT bus_id,route_id,lon,lat,updownflag,date_format(create_time, "%Y-%m-%d %H:%i:%s") create_time FROM record_bus_gpsdata_20181127 WHERE create_time BETWEEN '${new Date(nowDate + (i - 1) * 60000 * timeInterval).Format("yyyy-MM-dd hh:mm:ss")}' and '${new Date(nowDate + i * 60000 * timeInterval).Format("yyyy-MM-dd hh:mm:ss")}' ORDER BY create_time asc;`
  
  pool.query(sql, (error, results, fields) => {
    if (error) throw error;

    fs.writeFile(`./public/timeDate/time${i}.json`, JSON.stringify(results), () => {
      if (index <= sum) {
        console.log(`完成${index}个，总数${sum}个`);
        console.timeEnd("耗时");
        index++;
        executeSql(index);
      }else{
        console.log("完成！")
      }
    })
  });

}

// let index = 0;
// let sum = routeIds.length;

// function executeSql(i) {
//   console.log("---------------------" + routeIds[i] + "---------------------")
//   console.time("耗时");

//   let sql = `SELECT lon,lat,updownflag,date_format(create_time, "%Y-%m-%d %H:%i:%s") create_time FROM record_bus_gpsdata_20181127 WHERE bus_id = "${routeIds[i]}" ORDER BY create_time asc`

//   pool.query(sql, (error, results, fields) => {
//     if (error) throw error;

//     fs.writeFile(`./public/data/bus${routeIds[i]}.json`, JSON.stringify(results), () => {
//       console.timeEnd("耗时");
//       if (routeIds[i + 1]) {
//         index++;
//         console.log(`完成${index}个，总数${sum}个`);
//         executeSql(index);
//       }else{
//         console.log("完成！")
//       }
//     })
//   });

// }


// connection.connect();

// console.time("耗时")

// connection.query('SELECT lon,lat,updownflag,date_format(create_time, "%Y-%m-%d %H:%i:%s") create_time FROM record_bus_gpsdata_20181127 WHERE bus_id = "059L0786" ORDER BY create_time asc', (error, results, fields) => {
//   if (error) throw error;

//   fs.writeFile("./public/data/bus059L0786.json", JSON.stringify(results), () => {
//     console.log('完成')
//     console.timeEnd("耗时")
//   })
// });

// connection.end();