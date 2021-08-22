# REST API

## Definitions

Paging and sizing might be included in URI as query parameters.

There could be aliases for some less common HTTP methods which might be unsupported:

- `PUT /:URI` a.k.a. `POST /:URI/rewrite`
- `PATCH /:URI` a.k.a. `POST /:URI/update`
- `DELETE /:URI` a.k.a. `POST /:URI/remove`

### User

| URI                    | Resource                         | Type                                    |             GET             |      PUT      |                         PATCH                          |           DELETE            |                         POST                         |
| ---------------------- | -------------------------------- | --------------------------------------- | :-------------------------: | :-----------: | :----------------------------------------------------: | :-------------------------: | :--------------------------------------------------: |
| `/users`               | All users                        | [Batching](#batching)                   |        Administrator        | Administrator |                     Administrator                      |             :x:             | Administrator<br />Anyone (`id` and `password` only) |
| `/users/:userID`       | The user                         | [Resource](#resource)                   | Administrator<br />The User | Administrator | Administrator<br />The User (`id` and `password` only) | Administrator<br />The User |                         :x:                          |
| `/users/:userID/tasks` | All tasks which the user manages | [Batching](#batching)                   |          The User           |      :x:      |                          :x:                           |             :x:             |                         :x:                          |
| `/users/:userID/token` | A token of the user              | <abbr title="JSON Web Token">JWT</abbr> |             :x:             |      :x:      |                          :x:                           |             :x:             |       Anyone with correct `id` and `password`        |

There could be aliases for practical requests:

- `POST /users` a.k.a. `POST /register`
- `POST /users/:userID/token` a.k.a. `POST /login`

### Student

| URI                            | Resource                                                   | Type                  |              GET               |      PUT      |     PATCH     |    DELETE     |       POST        |
| ------------------------------ | ---------------------------------------------------------- | --------------------- | :----------------------------: | :-----------: | :-----------: | :-----------: | :---------------: |
| `/students`                    | All students                                               | [Batching](#batching) |         Administrator          | Administrator | Administrator |      :x:      | ~~Administrator~~ |
| `/students/:studentID`         | The student                                                | [Resource](#resource) | Administrator<br />The Student | Administrator | Administrator | Administrator |        :x:        |
| `/students/:studentID/courses` | The set of primary keys of courses which the student takes | [Key Set](#key-set)   | Administrator<br />The Student | Administrator | Administrator |      :x:      |        :x:        |
| `/students/:studentID/tasks`   | All tasks which the student needs to complete              | [Batching](#batching) |          The Student           |      :x:      |      :x:      |      :x:      |        :x:        |

### Teacher

| URI                            | Resource                                                     | Type                  |              GET               |      PUT      |     PATCH     |    DELETE     |       POST        |
| ------------------------------ | ------------------------------------------------------------ | --------------------- | :----------------------------: | :-----------: | :-----------: | :-----------: | :---------------: |
| `/teachers`                    | All teachers                                                 | [Batching](#batching) |         Administrator          | Administrator | Administrator |      :x:      | ~~Administrator~~ |
| `/teachers/:teacherID`         | The teacher                                                  | [Resource](#resource) | Administrator<br />The Teacher | Administrator | Administrator | Administrator |        :x:        |
| `/teachers/:teacherID/courses` | The set of primary keys of courses which the teacher teaches | [Key Set](#key-set)   | Administrator<br />The Teacher | Administrator | Administrator |      :x:      |        :x:        |
| `/teachers/:teacherID/tasks`   | All tasks which the teacher gives                            | [Batching](#batching) |          The Teacher           |      :x:      |      :x:      |      :x:      |        :x:        |

### Course

| URI                                                          | Resource                                                                      | Type                  |                                        GET                                        |       PUT        |             PATCH              |      DELETE      |         POST         |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------- | --------------------- | :-------------------------------------------------------------------------------: | :--------------: | :----------------------------: | :--------------: | :------------------: |
| `/courses`                                                   | All courses                                                                   | [Batching](#batching) | Administrator<br />Students (only related ones)<br />Teachers (only related ones) |  Administrator   |         Administrator          |       :x:        |  ~~Administrator~~   |
| `/courses/:courseID`                                         | The course                                                                    | [Resource](#resource) |             Administrator<br />Related Students<br />Related Teachers             |  Administrator   |         Administrator          |  Administrator   |         :x:          |
| `/courses/:courseID/students`                                | The set of primary keys of students who take the course                       | [Key Set](#key-set)   |             Administrator<br />Related Students<br />Related Teachers             |  Administrator   |         Administrator          |       :x:        |         :x:          |
| `/courses/:courseID/tasks`                                   | All tasks which the course assigns                                            | [Batching](#batching) |     Monitors (only related ones)<br />Related Students<br />Related Teachers      | Related Teachers |        Related Teachers        |       :x:        | ~~Related Teachers~~ |
| `/courses/:courseID/tasks/:taskID`                           | The task which the course assigns                                             | [Resource](#resource) |               Monitors<br />Related Students<br />Related Teachers                | Related Teachers |        Related Teachers        | Related Teachers |         :x:          |
| `/courses/:courseID/tasks/:taskID/files`                     | The package of all homework files of the task which the course assigns        | File                  |                                 Related Teachers                                  |       :x:        |              :x:               |       :x:        |         :x:          |
| `/courses/:courseID/tasks/:taskID/homeworks`                 | All homeworks of the task which the course assigns                            | [Batching](#batching) |               Monitors<br />Related Students<br />Related Teachers                |       :x:        | Monitors<br />Related Teachers |       :x:        |         :x:          |
| `/courses/:courseID/tasks/:taskID/homeworks/:studentID`      | The homework of the task which the course assigns for the student             | [Resource](#resource) |                  Monitors<br />Related Teachers<br />The Student                  |       :x:        | Monitors<br />Related Teachers |       :x:        |         :x:          |
| `/courses/:courseID/tasks/:taskID/homeworks/:studentID/file` | The homework file of the task which the course assigns for the student        | File                  |                         Related Teachers<br />The Student                         |   The Student    |              :x:               | Related Teachers |         :x:          |
| `/courses/:courseID/tasks/:taskID/monitors`                  | The set of primary keys of users who manage the task which the course assigns | [Key Set](#key-set)   |               Monitors<br />Related Students<br />Related Teachers                | Related Teachers |        Related Teachers        |       :x:        |         :x:          |
| `/courses/:courseID/teachers`                                | The set of primary keys of teachers who teach the course                      | [Key Set](#key-set)   |             Administrator<br />Related Students<br />Related Teachers             |  Administrator   |         Administrator          |       :x:        |         :x:          |

## Resource Types

### Resource

Resource indicates an object with properties. The following are the meaning of the methods:

- GET method **prints** the resource
  - E. g. `GET /users/root` returns the user `root`
- PUT method **rewrites or creates** the resource
  - E. g. `PUT /courses/AI` rewrites or creates the course `AI`
- PATCH method **edit** some properties of the resource
  - E. g. `PATCH /students/Bill` updates some property of the student `Bill`
- DELETE method **removes** the resource instance from the database
  - E. g. `DELETE /teachers/Jacob` removes the teacher `Jacob`

### Batching

Batching is not an instance but a shortcut to manage multiple resources of the same kind in one request. The meaning of the methods are slightly different:

- GET method lists **all** resources
  - E. g. `GET /courses` lists all courses in the database
- PUT method rewrites or creates **some** resources
  - E. g. `PUT /students` rewrites or creates some students
- PATCH method updates **some** resources
  - E. g. `PATCH /teachers` partially rewrites some teachers
- POST method creates **one new instance** of this type of resource
  - E. g. `POST /users` create a new user

Note: **The PATCH method is idempotent** for both batching and resources. The PATCH methods is only allowed to edit existing fields, but not allowed to create any new field for any resource.

### Key Set

Key Set is a set of primary keys of resources, usually used to mark many-to-many or one-to-many relations. It allows the following methods:

- GET method returns the set
  - E. g. `GET /student/Alice/courses` lists the courses ID of all courses taken by the student `Alice`
- PUT method replaces the set with a new set
  - E. g. `PUT /courses/Physics/tasks/Homework1/monitors` reassigns monitors to manage the task `Homework1` of the course `Physics`
- PATCH method inserts elements into the set and deletes elements from the set
  - E. g. `PATCH /teachers/Williams/courses` adds new courses or remove some existing courses to be taught by the teacher `Williams`

Note: **The PATCH method is idempotent** for key sets. As the elements in the set should be distinct, repeating addition will not create multiple copies for the same value and repeating deletion will also affect only once.
