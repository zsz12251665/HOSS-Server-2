# HOSS-Server 2

[![HOSS-Server 2](https://img.shields.io/badge/HOSS%20Server%202-developing-inactive.svg?logo=Node.js)](https://github.com/zsz12251665/HOSS-Server-2)
[![License](https://img.shields.io/github/license/zsz12251665/HOSS-Server-2.svg)](https://github.com/zsz12251665/HOSS-Server-2/blob/master/LICENCE)
[![HOSS-Server 2](https://img.shields.io/badge/contributing-manual-informational.svg)](https://github.com/zsz12251665/HOSS-Server-2/blob/master/contributing.md)

*基于 Node.js 的在线作业提交系统*

这是 HOSS（**H**omework **O**nline **S**ubmit **S**ystem，在线作业提交系统）的服务器脚本。

## 启动服务器

1. 安装 *Node.js*；
2. 执行 `npm install` 以安装依赖包；
3. 执行 `npm run init` 以配置并初始化您的服务器；
4. 执行 `npm run start` 即可启动服务器。

## REST API

-  [`/api/admin/login/`：管理员登录接口](https://github.com/zsz12251665/HOSS-Server-2/wiki/管理员登录接口)
-  [`/api/homework/list/`：作业列表获取接口](https://github.com/zsz12251665/HOSS-Server-2/wiki/作业列表获取接口)
-  [`/api/homework/upload/`：作业上传接口](https://github.com/zsz12251665/HOSS-Server-2/wiki/作业上传接口)
-  [`/api/homework/download/`：作业下载接口](https://github.com/zsz12251665/HOSS-Server-2/wiki/作业下载接口)
-  [`/api/homework/manage/`：作业信息操作接口](https://github.com/zsz12251665/HOSS-Server-2/wiki/作业信息操作接口)
-  [`/api/student/manage/`：学生信息操作接口](https://github.com/zsz12251665/HOSS-Server-2/wiki/学生信息操作接口)
-  [`/api/student/validate/`：学生信息验证接口](https://github.com/zsz12251665/HOSS-Server-2/wiki/学生信息验证接口)
