# HOSS-Server 2

[![HOSS-Server 2](https://img.shields.io/badge/HOSS%20Server%202-developing-inactive.svg?logo=Node.js)](https://github.com/zsz12251665/HOSS-Server-2)
[![License](https://img.shields.io/github/license/zsz12251665/HOSS-Server-2.svg)](https://github.com/zsz12251665/HOSS-Server-2/blob/master/LICENCE)
[![HOSS-Server 2](https://img.shields.io/badge/contributing-manual-informational.svg)](https://github.com/zsz12251665/HOSS-Server-2/blob/master/contributing.md)

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

### `/api/homework/list/`：作业列表获取接口

#### 请求

`GET` 请求，参数如下：

|    字段     |  类型  |        内容         |
| :---------: | :----: | :-----------------: |
| `*/:number` | string | *（可选）* 学生学号 |

#### 响应

一段 JSON 文本（状态码 `200`），该对象有属性如下：

|    属性     |  类型   |                       内容                        |
| :---------: | :-----: | :-----------------------------------------------: |
|    `id`     | number  |                     作业编号                      |
|   `title`   | string  |                     作业标题                      |
| `deadline`  | number  |                 作业提交截止时间                  |
| `validator` | string  |          文件名验证器（一个正则表达式）           |
| `submitted` | boolean | *（仅传递了有效的学生学号时）* 学生是否提交了作业 |

### `/api/homework/upload/`：作业上传接口

#### 请求

`PUT` 请求，参数如下：

|        字段        |  类型  |    内容    |
| :----------------: | :----: | :--------: |
|   `studentName`    | string |  学生姓名  |
|  `studentNumber`   | string |  学生学号  |
|    `homeworkId`    | string |  作业编号  |
|   `homeworkFile`   |  file  |  作业文件  |
| `homeworkFilename` | string | 作业文件名 |

#### 响应

| 代码  |    类型    |             内容              |
| :---: | :--------: | :---------------------------: |
|  400  | text/plain |     `"Incomplete form!"`      |
|  401  | text/plain |     `"No such student!"`      |
|  401  | text/plain |     `"No such homework!"`     |
|  501  | text/plain | `"Function not implemented!"` |
