# HOSS-Server 2

中文 | [English](readme.md)

[![HOSS-Server 2](https://img.shields.io/badge/HOSS%20Server%202-v2.1%20Alpha-inactive.svg?logo=Node.js)](https://github.com/zsz12251665/HOSS-Server-2)
[![License](https://img.shields.io/github/license/zsz12251665/HOSS-Server-2.svg)](https://github.com/zsz12251665/HOSS-Server-2/blob/master/LICENCE)

*基于 Node.js 的在线作业提交系统*

这是 HOSS（**H**omework **O**nline **S**ubmit **S**ystem，在线作业提交系统）的服务器脚本。

## 启动服务器

1. 安装 *Node.js*；
2. 执行 `npm install` 以安装依赖包；
3. *（开发前）* 执行 `git update-index --assume-unchanged config/*` 以避免您本地的配置文件影响代码仓库上的配置模板；
4. 执行 `npm run config` 以配置您的服务器；
5. 执行 `npm start` 即可启动服务器，或执行 `npm test` 以启动带有自动重启的服务器。

## [REST API](docs/REST%20API.zh.md)
