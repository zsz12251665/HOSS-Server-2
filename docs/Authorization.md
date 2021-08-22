# Authorization

## User

| URI                    |             GET             |      PUT      |                              PATCH                              |           DELETE            |
| ---------------------- | :-------------------------: | :-----------: | :-------------------------------------------------------------: | :-------------------------: |
| `/users`               |        Administrator        | Administrator |                          Administrator                          |             :x:             |
| `/users/:userID`       | Administrator<br />The User | Administrator | Administrator<br />The User (`identity` and `certificate` only) | Administrator<br />The User |
| `/users/:userID/tasks` |          The User           |  **Nobody**   |                           **Nobody**                            |             :x:             |


| URI                    |  POST  |
| ---------------------- | :----: |
| `/users`               | Anyone |
| `/users/:userID/token` | Anyone |

## Student

| URI                                           |                           GET                           |      PUT      |                 PATCH                  |    DELETE     |
| --------------------------------------------- | :-----------------------------------------------------: | :-----------: | :------------------------------------: | :-----------: |
| `/students`                                   |                      Administrator                      | Administrator |             Administrator              |      :x:      |
| `/students/:studentID`                        |             Administrator<br />The Student              | Administrator |             Administrator              | Administrator |
| `/students/:studentID/courses`                |             Administrator<br />The Student              | Administrator |             Administrator              |      :x:      |
| `/students/:studentID/homeworks`              |                       The Student                       |      :x:      |               **Nobody**               |      :x:      |
| `/students/:studentID/homeworks/:taskID`      | The Student<br />Related Teachers<br />Related Monitors |      :x:      | Related Teachers<br />Related Monitors |      :x:      |
| `/students/:studentID/homeworks/:taskID/file` |            The Student<br />Related Teachers            |  The Student  |                  :x:                   |      :x:      |

## Teacher

| URI                            |              GET               |      PUT      |     PATCH     |    DELETE     |
| ------------------------------ | :----------------------------: | :-----------: | :-----------: | :-----------: |
| `/teachers`                    |         Administrator          | Administrator | Administrator |      :x:      |
| `/teachers/:teacherID`         | Administrator<br />The Teacher | Administrator | Administrator | Administrator |
| `/teachers/:teacherID/courses` | Administrator<br />The Teacher | Administrator | Administrator |      :x:      |

## Course

| URI                           |                            GET                            |      PUT      |     PATCH     |    DELETE     |
| ----------------------------- | :-------------------------------------------------------: | :-----------: | :-----------: | :-----------: |
| `/courses`                    | Administrator<br />Related Teachers<br />Related Students | Administrator | Administrator |      :x:      |
| `/courses/:courseID`          | Administrator<br />Related Teachers<br />Related Students | Administrator | Administrator | Administrator |
| `/courses/:courseID/students` | Administrator<br />Related Teachers<br />Related Students | Administrator | Administrator |      :x:      |
| `/courses/:courseID/tasks`    |          Related Teachers<br />Related Students           |      :x:      |      :x:      |      :x:      |
| `/courses/:courseID/teachers` | Administrator<br />Related Teachers<br />Related Students | Administrator | Administrator |      :x:      |

## Task

| URI                                        |                             GET                              |       PUT        |                 PATCH                  |      DELETE      |
| ------------------------------------------ | :----------------------------------------------------------: | :--------------: | :------------------------------------: | :--------------: |
| `/tasks`                                   | Related Teachers<br />Related Students<br />Related Monitors | Related Teachers |            Related Teachers            |       :x:        |
| `/tasks/:taskID`                           | Related Teachers<br />Related Students<br />Related Monitors | Related Teachers |            Related Teachers            | Related Teachers |
| `/tasks/:taskID/files`                     |                       Related Teachers                       |       :x:        |                  :x:                   |       :x:        |
| `/tasks/:taskID/homeworks`                 | Related Teachers<br />Related Students<br />Related Monitors |       :x:        | Related Teachers<br />Related Monitors |       :x:        |
| `/tasks/:taskID/homeworks/:studentID`      |   The Student<br />Related Teachers<br />Related Monitors    |       :x:        | Related Teachers<br />Related Monitors |       :x:        |
| `/tasks/:taskID/homeworks/:studentID/file` |              The Student<br />Related Teachers               |   The Student    |                  :x:                   |       :x:        |
| `/tasks/:taskID/monitors`                  | Related Teachers<br />Related Students<br />Related Monitors | Related Teachers |            Related Teachers            |       :x:        |
