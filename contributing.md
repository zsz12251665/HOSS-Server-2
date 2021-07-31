# 开发指南

## 贡献前，请先

- 执行 `git update-index --assume-unchanged config/*` 以避免您本地的配置文件影响代码仓库上的配置模板；
- 执行 `npm install` 以安装依赖包并配置您的服务器。

## 项目结构设计

```plain
config                          配置目录
|-- db.json                     Sequelize 配置
|-- jwt.json                    JWT 配置
`-- server.json                 服务器配置

src                             核心代码目录
|-- components                  组件目录
|   |-- hash.ts                 哈希函数模块（封装自 crypto）
|   |-- JWT.ts                  令牌模块（封装自 JsonWebToken）
|   `-- ORM.ts                   数据库模块（封装自 Sequelize）
|
|-- models                      接口模型目录
|
|-- app.ts                      服务器入口
|-- config.ts                   服务器配置脚本
`-- router.ts                   REST API 路由

static                          静态资源目录（挂载在根目录下）
`-- index.html                  主页面（服务器启动标志）
```

## 参考资料

- [Express 4.x - API Reference](https://expressjs.com/en/api.html) ([中文版](https://www.expressjs.com.cn/4x/api.html))
- [HTTP response status codes - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [Manual | Sequelize](https://sequelize.org/master/)
- [JSON Web Tokens - jwt.io](https://jwt.io/)
