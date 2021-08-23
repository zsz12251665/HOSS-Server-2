# REST API

## 定义

分页和页规模可以包含在 URI 中以查询参数的形式传递。

一些不太常见、可能不受支持的 HTTP 方法可以有别称：

- `PUT /:URI` 等价于 `POST /:URI/rewrite`
- `PATCH /:URI` 等价于 `POST /:URI/update`
- `DELETE /:URI` 等价于 `POST /:URI/remove`

### 用户

| URI                    | 资源                   | 类型                                    |        GET         |  PUT   |                    PATCH                    |       DELETE       |                    POST                     |
| ---------------------- | ---------------------- | --------------------------------------- | :----------------: | :----: | :-----------------------------------------: | :----------------: | :-----------------------------------------: |
| `/users`               | 所有用户               | [批处理](#批处理)                       |       管理员       | 管理员 |                   管理员                    |        :x:         | 管理员<br />任何人（仅 `id` 和 `password`） |
| `/users/:userID`       | 该用户                 | [资源](#资源)                           | 管理员<br />该用户 | 管理员 | 管理员<br />该用户（仅 `id` 和 `password`） | 管理员<br />该用户 |                     :x:                     |
| `/users/:userID/tasks` | 该用户所管理的所有任务 | [批处理](#批处理)                       |       该用户       |  :x:   |                     :x:                     |        :x:         |                     :x:                     |
| `/users/:userID/token` | 该用户的令牌           | <abbr title="JSON Web Token">JWT</abbr> |        :x:         |  :x:   |                     :x:                     |        :x:         |     有正确 `id` 和 `password` 的任何人      |

一些常用的请求可以有别称：

- `POST /users` 等价于 `POST /register`
- `POST /users/:userID/token` 等价于 `POST /login`

### 学生

| URI                            | 资源                       | 类型              |        GET         |  PUT   | PATCH  | DELETE |    POST    |
| ------------------------------ | -------------------------- | ----------------- | :----------------: | :----: | :----: | :----: | :--------: |
| `/students`                    | 所有学生                   | [批处理](#批处理) |       管理员       | 管理员 | 管理员 |  :x:   | ~~管理员~~ |
| `/students/:studentID`         | 该学生                     | [资源](#资源)     | 管理员<br />该学生 | 管理员 | 管理员 | 管理员 |    :x:     |
| `/students/:studentID/courses` | 学生所学习的课程的主键集合 | [键集](#键集)     | 管理员<br />该学生 | 管理员 | 管理员 |  :x:   |    :x:     |
| `/students/:studentID/tasks`   | 该学生需要完成的所有任务   | [批处理](#批处理) |       该学生       |  :x:   |  :x:   |  :x:   |    :x:     |

### 教师

| URI                            | 资源                       | 类型              |        GET         |  PUT   | PATCH  | DELETE |    POST    |
| ------------------------------ | -------------------------- | ----------------- | :----------------: | :----: | :----: | :----: | :--------: |
| `/teachers`                    | 所有教师                   | [批处理](#批处理) |       管理员       | 管理员 | 管理员 |  :x:   | ~~管理员~~ |
| `/teachers/:teacherID`         | 该教师                     | [资源](#资源)     | 管理员<br />该教师 | 管理员 | 管理员 | 管理员 |    :x:     |
| `/teachers/:teacherID/courses` | 教师所讲授的课程的主键集合 | [键集](#键集)     | 管理员<br />该教师 | 管理员 | 管理员 |  :x:   |    :x:     |
| `/teachers/:teacherID/tasks`   | 该教师所布置的所有任务     | [批处理](#批处理) |       该教师       |  :x:   |  :x:   |  :x:   |    :x:     |

### 课程

| URI                                                          | 资源                                       | 类型              |                          GET                           |   PUT    |       PATCH        |  DELETE  |     POST     |
| ------------------------------------------------------------ | ------------------------------------------ | ----------------- | :----------------------------------------------------: | :------: | :----------------: | :------: | :----------: |
| `/courses`                                                   | 所有课程                                   | [批处理](#批处理) | 管理员<br />学生（仅相关部分）<br />教师（仅相关部分） |  管理员  |       管理员       |   :x:    |  ~~管理员~~  |
| `/courses/:courseID`                                         | 该课程                                     | [资源](#资源)     |           管理员<br />相关学生<br />相关教师           |  管理员  |       管理员       |  管理员  |     :x:      |
| `/courses/:courseID/students`                                | 学习该课程的学生的主键集合                 | [键集](#键集)     |           管理员<br />相关学生<br />相关教师           |  管理员  |       管理员       |   :x:    |     :x:      |
| `/courses/:courseID/tasks`                                   | 该课程所包含的所有任务                     | [批处理](#批处理) |     助教（仅相关部分）<br />相关学生<br />相关教师     | 相关教师 |      相关教师      |   :x:    | ~~相关教师~~ |
| `/courses/:courseID/tasks/:taskID`                           | 该课程所包含的该任务                       | [资源](#资源)     |            助教<br />相关学生<br />相关教师            | 相关教师 |      相关教师      | 相关教师 |     :x:      |
| `/courses/:courseID/tasks/:taskID/files`                     | 该课程所包含的该任务的所有作业文件的压缩包 | 文件              |                        相关教师                        |   :x:    |        :x:         |   :x:    |     :x:      |
| `/courses/:courseID/tasks/:taskID/homeworks`                 | 该课程所包含的该任务的所有作业             | [批处理](#批处理) |            助教<br />相关学生<br />相关教师            |   :x:    | 助教<br />相关教师 |   :x:    |     :x:      |
| `/courses/:courseID/tasks/:taskID/homeworks/:studentID`      | 该课程所包含的该任务的该学生的作业         | [资源](#资源)     |             助教<br />相关教师<br />该学生             |   :x:    | 助教<br />相关教师 |   :x:    |     :x:      |
| `/courses/:courseID/tasks/:taskID/homeworks/:studentID/file` | 该课程所包含的该任务的该学生的作业文件     | 文件              |                  相关教师<br />该学生                  |  该学生  |        :x:         | 相关教师 |     :x:      |
| `/courses/:courseID/tasks/:taskID/monitors`                  | 该课程所包含的该任务的助教的主键集合       | [键集](#键集)     |            助教<br />相关学生<br />相关教师            | 相关教师 |      相关教师      |   :x:    |     :x:      |
| `/courses/:courseID/teachers`                                | 讲授该课程的教师的主键集合                 | [键集](#键集)     |           管理员<br />相关学生<br />相关教师           |  管理员  |       管理员       |   :x:    |     :x:      |

*助教*：实际指班长、学习委员等协助教师完成学生分组等工作的人。

## 资源类型

### 资源

资源指一个有属性的对象。它的方法的意义如下：

- GET 方法**打印**该资源
  - 例：`GET /users/root` 返回用户 `root`
- PUT 方法**覆写或新建**该资源
  - 例：`PUT /courses/AI` 重写或创建了课程 `AI`
- PATCH 方法**改动**该资源的部分属性
  - 例：`PATCH /students/Bill` 更新了学生 `Bill` 的部分属性
- DELETE 方法从数据库中**删除**该资源
  - 例：`DELETE /teachers/Jacob` 移除了教师 `Jacob`

### 批处理

批处理并不是一个实体，而是一个操作多个同类型资源的快捷方式。它的方法的意义略有不同：

- GET 方法列举**所有**资源
  - 例：`GET /courses` 列举了数据库中的所有课程
- PUT 方法覆写或新建**部分**资源
  - 例：`PUT /students` 重写或创建了一些学生
- PATCH 方法更新**部分**资源
  - 例：`PATCH /teachers` 部分重写了一些教师
- POST 方法创建该类资源的**一个新实例**
  - 例：`POST /users` 创建了一个新用户

注：对于资源和批处理，**PATCH 方法是幂等的**。PATCH 方法仅允许修改已存在的域，不允许新建域或新建资源。

### 键集

键集是资源主键的集合，通常用来表示一对多或多对多关系。它允许以下方法：

- GET 方法返回这个集合
  - 例：`GET /student/Alice/courses` 列举了学生 `Alice` 所学习的所有课程的主键
- PUT 方法将该集合替换成一个新的集合
  - 例：`PUT /courses/Physics/tasks/Homework1/monitors` 重新分配了课程 `Physics` 的任务 `Homework1` 的助教
- PATCH 方法向集合中插入或删除元素
  - 例：`PATCH /teachers/Williams/courses` 给教师 `Williams` 增加要讲授的新课程或移除已有课程

注：对于键集，**PATCH 方法是幂等的**。集合中的元素应该是唯一的，重复插入元素不应产生同一值的多份拷贝，而重复删除只有一次会起效。