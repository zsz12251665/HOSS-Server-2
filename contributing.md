# 开发指南

## 贡献前，请先

- 执行 `git update-index --assume-unchanged src/config/*` 以避免您本地的配置文件影响代码仓库上的配置模板；
- 配置 `src/config/` 中的配置文件
  - `server.json` 配置服务端口
  - `mysql.json` 配置您的 MySQL 服务器信息
  - `admin.json` 配置管理员账号密码
  - `jwt.json` 配置 JWT 令牌密钥及签发人
- 运行 `npm install` 以安装依赖包。

## 源代码结构设计

```plain
src
|-- components          组件目录
|   |-- db.js           数据库组件（封装自 MySQL）
|   `-- token.js        令牌组件（封装自 JsonWebToken）
|
|-- config              配置目录
|   |-- admin.json      管理员配置
|   |-- jwt.json        JWT 配置
|   |-- mysql.json      MySQL 配置
|   `-- server.json     服务器配置
|
|-- models              接口模型目录
|   |-- admin           管理员接口目录
|   |   `-- login.js    管理员登录接口
|   |
|   `-- user            普通用户接口目录
|       `-- upload.js   作业上传接口
|
|-- app.js              服务器入口
`-- router.js           REST API 路由

static                  静态资源（挂载在根目录下）
|-- index.html          主页面（服务器启动标志）
|-- login.html          管理员登录页面模板
`-- upload.html         作业上传页面模板
```

## 数据库结构设计

```sql
CREATE TABLE students (
  `name` VARCHAR(255) NOT NULL, # 学生姓名
  `number` VARCHAR(255) NOT NULL # 学生学号
) CHARSET=utf8mb4;

ALTER TABLE students ADD PRIMARY KEY (`number`);

CREATE TABLE homeworks (
  `id` INT NOT NULL AUTO_INCREMENT, # 作业编号
  `title` VARCHAR(255) NOT NULL, # 作业标题
  `directory` VARCHAR(255) NOT NULL, # 作业目录
  `deadline` TIMESTAMP NOT NULL, # 作业提交截止时间
  `validator` VARCHAR(255) NOT NULL # 文件名验证器，一个正则表达式
) CHARSET=utf8mb4;

ALTER TABLE homeworks ADD PRIMARY KEY (`id`);

```

## 参考资料

- [HTTP response status codes - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
