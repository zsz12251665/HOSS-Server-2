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

| 代码  |    类型    |     内容      |
| :---: | :--------: | :-----------: |
|  200  | text/plain | `"It works!"` |

### `/api/admin/login`：管理员登录接口

#### 请求

`POST` 请求，参数如下：

|    字段    |  类型  |  内容  |
| :--------: | :----: | :----: |
| `username` | string | 用户名 |
| `password` | string |  密码  |

#### 响应

| 代码  |    类型    |         内容         |
| :---: | :--------: | :------------------: |
|  200  | text/plain |  一个 JWT 用户令牌   |
|  400  | text/plain | `"Incomplete form!"` |
|  401  | text/plain |  `"Login failed!"`   |
