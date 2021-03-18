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
src                     核心代码目录
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
|       |-- list.js     作业列表获取接口
|       |-- upload.js   作业上传接口
|       `-- validate.js 学生信息验证接口
|
|-- app.js              服务器入口
`-- router.js           REST API 路由

static                  静态资源目录（挂载在根目录下）
|-- index.html          主页面（服务器启动标志）
|-- login.html          管理员登录页面模板
`-- upload.html         作业上传页面模板
```

## 数据库结构设计

```sql
CREATE TABLE students ( # 学生列表
  `name` VARCHAR(255) NOT NULL COMMENT '学生姓名',
  `number` VARCHAR(255) NOT NULL COMMENT '学生学号',
  PRIMARY KEY (`number`)
) CHARSET=utf8mb4;

CREATE TABLE homeworks ( # 作业列表
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '作业编号',
  `title` VARCHAR(255) NOT NULL COMMENT '作业标题',
  `deadline` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作业提交截止时间',
  `validator` VARCHAR(255) NOT NULL COMMENT '文件名验证器（一个正则表达式）',
  PRIMARY KEY (`id`)
) CHARSET=utf8mb4;

CREATE TABLE submissions ( # 提交列表
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '提交编号',
  `student` VARCHAR(255) NOT NULL COMMENT '学生学号',
  `homework` INT NOT NULL COMMENT '作业编号',
  `time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '提交时间',
  `filename` VARCHAR(255) NOT NULL COMMENT '作业文件名',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`student`) REFERENCES students(`number`),
  FOREIGN KEY (`homework`) REFERENCES homeworks(`id`)
) CHARSET=utf8mb4;
```

## 参考资料

- [Express 4.x - API Reference](https://expressjs.com/en/api.html) ([中文版](https://www.expressjs.com.cn/4x/api.html))
- [HTTP response status codes - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [JSON Web Tokens - jwt.io](https://jwt.io/)
