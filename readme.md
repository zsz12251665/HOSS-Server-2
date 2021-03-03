# HOSS-Server 2.0

*基于 Node.js 的在线作业提交系统*

这是 HOSS（**H**omework **O**nline **S**ubmit **S**ystem，在线作业提交系统）的服务器脚本。

## 启动服务器

1. 安装 *Node.js*；
2. 编辑 `config/` 下的配置文件；
3. 在项目根目录下开启命令行，执行 `npm run start` 即可启动服务器。

## REST API

### `/`：服务器启动标识

#### 请求

`GET` 请求，无参数。

#### 响应

| 代码  |     类型     |     内容      |
| :---: | :----------: | :-----------: |
|  200  | text/plain | `"It works!"` |
