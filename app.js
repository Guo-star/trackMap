const express = require("express");
const app = express();

// mysql连接池
// require("./db.js");

// 静态文件
app.use(express.static('public'));

app.get('/track', (req, res) => {

  res.send('Hello World!')
});

// 开启服务
app.listen(3000, () => {
  console.log('start! http://localhost:3000/')
})