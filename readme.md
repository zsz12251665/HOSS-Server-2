# HOSS-Server 2

*基于 Node.js 的在线作业提交系统*

这是 HOSS（**H**omework **O**nline **S**ubmit **S**ystem，在线作业提交系统）的服务器脚本。

## 启动服务器

1. 安装 *Node.js*；
2. 编辑 `config/` 下的配置文件；
3. 在项目根目录下开启命令行，执行 `npm run start` 即可启动服务器。

## REST API

### `/api/admin/login/`：管理员登录接口

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

### `/api/homework/upload/`：作业上传接口

#### 请求

`PUT` 请求，参数待定。

#### 响应

| 代码  |    类型    |             内容              |
| :---: | :--------: | :---------------------------: |
|  501  | text/plain | `"Function not implemented!"` |
