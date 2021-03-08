# 贡献指南

## 贡献前，请先

- 执行 `git update-index --assume-unchanged src/config/*` 以避免您本地的配置影响代码仓库上的配置模板；
- 配置 `src/config/` 中的配置文件，使脚本可以在合适的端口开启服务，并连接到您的 MySQL 服务器；
- 运行 `npm install` 以安装依赖包。

## 源代码结构

```plain
src
|-- api				 // REST API 接口目录
|   `-- router.js	 // REST API 路由
|
|-- components		 // 组件目录
|   |-- db.js		 // 数据库组件（封装自 MySQL）
|   `-- token.js	 // 令牌组件（封装自 JsonWebToken）
|
|-- config			 // 配置目录
|   |-- jwt.json	 // JWT 配置
|   |-- mysql.json	 // MySQL 配置
|   `-- server.json	 // 服务器配置
|
`-- app.js			 // 服务器入口
```
