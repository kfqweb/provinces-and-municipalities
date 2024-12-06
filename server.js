/**
 * 目标：开启 cors 支持跨域资源共享
 * 步骤：
 *  1. 下载 cors 本地软件包
 *  2. 导入 cors 函数
 *  3. 使用 server.use() 给 Web 服务添加插件功能
 *  4. 把 cors 函数调用传入给 Web 服务，启动并测试
 */
const qs = require('querystring')
const fs = require('fs')
const path = require('path')
const express = require('express')
const server = express()
// 2. 导入 cors 函数
const cors = require('cors')
// 3. 使用 server.use() 给 Web 服务添加插件功能
server.use(cors())

server.get('/api/province', (req, res) => {
  fs.readFile(path.join(__dirname, 'data/province.json'), (err, data) => {
    res.send(data.toString())
  })
})

server.get('/api/city', (req, res) => {
  // 城市列表接口
  // 2. 借助 querystring 模块的方法，格式化查询参数字符串
  // req.url: '/api/city?pname=辽宁省'
  // 以?分隔符分割，拿到'pname=辽宁省'查询参数字符串
  const str = req.url.split('?')[1]
  // 把查询参数字符串 转成 JS 对象结构
  const query = qs.parse(str)
  // 获取前端发来的省份名字
  const pname = query.pname
  // 3. 读取 city.json 城市数据，匹配省份名字下属城市列表
  fs.readFile(path.join(__dirname, '/data/city.json'), (err, data) => {
    // 把 JSON 文件内对象格式字符串，转成对象结构
    const obj = JSON.parse(data.toString())
    // 省份名字作为 key，去obj对象里取到对应城市列表 value 值
    const cityList = obj[pname]
    const result = cityList ? cityList : { code: 0, message: '参数错误' }

    // 4. 返回城市列表，启动 Web 服务测试
    // 响应的是 JSON 字符串内容
    res.setHeader('Content-Type', 'application/json;charset=utf-8')
    res.end(JSON.stringify(result))
  })
})

server.get('/api/area', (req, res) => {
  // 城市列表接口
  // 2. 借助 querystring 模块的方法，格式化查询参数字符串
  // req.url: '/api/city?pname=辽宁省'
  // 以?分隔符分割，拿到'pname=辽宁省'查询参数字符串
  const str = req.url.split('?')[1]
  // 把查询参数字符串 转成 JS 对象结构
  const query = qs.parse(str)

  // 获取前端发来的省份名字
  const pname = query.pname
  const cname = query.cname
  // 3. 读取 city.json 城市数据，匹配省份名字下属城市列表
  fs.readFile(path.join(__dirname, '/data/area.json'), (err, data) => {
    // 把 JSON 文件内对象格式字符串，转成对象结构
    const obj = JSON.parse(data.toString())
    // 省份名字作为 key，去obj对象里取到对应城市列表 value 值
    //  a 存的是城市
    const areaList = obj
      .find(item => {
        if (item.name === pname) return item.city
        // return item.name === pname && item.city
      })
      .city.find(item => {
        if (item.name === cname) return item.area
      })
    const result = areaList
      ? JSON.stringify(areaList.area)
      : JSON.stringify({ code: 0, message: '参数错误' })

    // 4. 返回城市列表，启动 Web 服务测试
    // 响应的是 JSON 字符串内容
    res.setHeader('Content-Type', 'application/json;charset=utf-8')

    res.end(JSON.stringify(result))
  })
})
server.all('*', (req, res) => {
  res.status(404)
  res.send('你要访问的资源路径不存在')
})

server.listen(3000, () => {
  console.log('Web 服务已启动')
})
