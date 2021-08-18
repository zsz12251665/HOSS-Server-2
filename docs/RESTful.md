# Restful API

Paging and sizing might be included in URI as query parameters.

There could be aliases for some less common HTTP methods which might be unsupported:

- `PUT /:uri` a.k.a. `POST /:uri/rewrite`
- `PATCH /:uri` a.k.a. `POST /:uri/update`
- `DELETE /:uri` a.k.a. `POST /:uri/remove`

## User

| URI                      | Resource                                                | Methods                 |
| ------------------------ | ------------------------------------------------------- | ----------------------- |
| `/users`                 | Some users (see [batching](#batching))                  | GET, PUT, PATCH         |
| `/users`                 | A new user                                              | POST                    |
| `/users/:username`       | The user                                                | GET, PUT, PATCH, DELETE |
| `/users/:username/tasks` | The set of primary keys of tasks which the user manages | GET, PUT, PATCH         |
| `/users/:username/token` | A token of the user                                     | POST                    |

There could be aliases for practical requests:

- `POST /users` a.k.a. `POST /register`
- `POST /users/:username/token` a.k.a. `POST /login`

## Student

| URI                                        | Resource                                                   | Methods                 |
| ------------------------------------------ | ---------------------------------------------------------- | ----------------------- |
| `/students`                                | Some students (see [batching](#batching))                  | GET, PUT, PATCH         |
| `/students/:number`                        | The student                                                | GET, PUT, PATCH, DELETE |
| `/students/:number/courses`                | The set of primary keys of courses which the student takes | GET, PUT, PATCH         |
| `/students/:number/homeworks`              | The list of homeworks which the student needs to write     | GET, PATCH              |
| `/students/:number/homeworks/:taskID`      | The homework of the task for the student                   | GET, PATCH              |
| `/students/:number/homeworks/:taskID/file` | The homework file of the task for the student              | GET, PUT                |

## Teacher

| URI                            | Resource                                                     | Methods                 |
| ------------------------------ | ------------------------------------------------------------ | ----------------------- |
| `/teachers`                    | Some teachers (see [batching](#batching))                    | GET, PUT, PATCH         |
| `/teachers/:teacherID`         | The teacher                                                  | GET, PUT, PATCH, DELETE |
| `/teachers/:teacherID/courses` | The set of primary keys of courses which the teacher teaches | GET, PUT, PATCH         |

## Course

| URI                           | Resource                                                  | Methods                 |
| ----------------------------- | --------------------------------------------------------- | ----------------------- |
| `/courses`                    | Some courses (see [batching](#batching))                  | GET, PUT, PATCH         |
| `/courses/:courseID`          | The course                                                | GET, PUT, PATCH, DELETE |
| `/courses/:courseID/students` | The set of primary keys of students who take the course   | GET, PUT, PATCH         |
| `/courses/:courseID/tasks`    | The set of primary keys of tasks which the course assigns | GET, PUT, PATCH         |
| `/courses/:courseID/teachers` | The set of primary keys of teachers who teach the course  | GET, PUT, PATCH         |

## Task

| URI                                     | Resource                                             | Methods                 |
| --------------------------------------- | ---------------------------------------------------- | ----------------------- |
| `/tasks`                                | Some tasks (see [batching](#batching))               | GET, PUT, PATCH         |
| `/tasks/:taskID`                        | The task                                             | GET, PUT, PATCH, DELETE |
| `/tasks/:taskID/files`                  | The package of all homework files of the task        | GET                     |
| `/tasks/:taskID/homeworks`              | The list of all homeworks of the task                | GET, PATCH              |
| `/tasks/:taskID/homeworks/:number`      | The homework of the task for the student             | GET, PATCH              |
| `/tasks/:taskID/homeworks/:number/file` | The homework file of the task for the student        | GET, PUT                |
| `/tasks/:taskID/monitors`               | The set of primary keys of users who manage the task | GET, PUT, PATCH         |

P. S. `/tasks/:taskID/homeworks/:number` and `/students/:number/homeworks/:taskID` are identical. Both of them indicates the homework of the task for the student. So do `/tasks/:taskID/homeworks/:number/file` and `/students/:number/homeworks/:taskID/file`.

## PATCH requests

**The PATCH method should be idempotent** in this API.

For most resources, the PATCH method indicates partially rewriting the resource. It is allowed to change existing values but not create any new objects or fields. In this case, repeating PATCH requests makes no difference to executing only once.

For sets of primary keys of objects such as `/tasks/:taskID/monitors`, which allows GET, PUT and PATCH methods, the elements in the set are only strings. The PATCH request will be used to add objects into the set or remove them from the set while the PUT request will rewrite the set completely. As the elements in the set should be distinct, repeating addition will not create multiple copies for the same value and repeating deletion will also affect only once.

## Batching

For batching resources, the meaning of the methods are slightly different:

- GET method lists **all** objects
  - E.g. `GET /users` lists all users in the database
- PUT method **rewrites or creates some** objects
  - E. g. `PUT /students` rewrites or creates some students in the database
- PATCH method updates **some** objects
  - E. g. `PATCH /teachers` partially rewrites some teachers in the database
