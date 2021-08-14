# Authorization

## User

| URI                       |             GET             |      PUT      |                              PATCH                              |           DELETE            |
| ------------------------- | :-------------------------: | :-----------: | :-------------------------------------------------------------: | :-------------------------: |
| `/users`                  |        Administrator        | Administrator |                          Administrator                          |        Administrator        |
| `/users/:username`        | Administrator<br />The User | Administrator | Administrator<br />The User (`identity` and `certificate` only) | Administrator<br />The User |
| `/students/:number/tasks` |          The User           |  **Nobody**   |                           **Nobody**                            |             :x:             |


| URI                      |  POST  |
| ------------------------ | :----: |
| `/users`                 | Anyone |
| `/users/:username/token` | Anyone |

## Student

| URI                                        |                           GET                           |      PUT      |                 PATCH                  |    DELETE     |
| ------------------------------------------ | :-----------------------------------------------------: | :-----------: | :------------------------------------: | :-----------: |
| `/students`                                |                      Administrator                      | Administrator |             Administrator              | Administrator |
| `/students/:number`                        |             Administrator<br />The Student              | Administrator |             Administrator              | Administrator |
| `/students/:number/courses`                |             Administrator<br />The Student              | Administrator |             Administrator              |      :x:      |
| `/students/:number/homeworks`              |                       The Student                       |      :x:      |               **Nobody**               |      :x:      |
| `/students/:number/homeworks/:taskID`      | The Student<br />Related Teachers<br />Related Monitors |      :x:      | Related Teachers<br />Related Monitors |      :x:      |
| `/students/:number/homeworks/:taskID/file` |            The Student<br />Related Teachers            |  The Student  |                  :x:                   |      :x:      |

## Teacher

| URI                            |              GET               |      PUT      |     PATCH     |    DELETE     |
| ------------------------------ | :----------------------------: | :-----------: | :-----------: | :-----------: |
| `/teachers`                    |         Administrator          | Administrator | Administrator | Administrator |
| `/teachers/:teacherID`         | Administrator<br />The Teacher | Administrator | Administrator | Administrator |
| `/teachers/:teacherID/courses` | Administrator<br />The Teacher | Administrator | Administrator |      :x:      |

## Course

| URI                           |                            GET                            |       PUT        |      PATCH       |    DELETE     |
| ----------------------------- | :-------------------------------------------------------: | :--------------: | :--------------: | :-----------: |
| `/courses`                    | Administrator<br />Related Teachers<br />Related Students |  Administrator   |  Administrator   | Administrator |
| `/courses/:courseID`          | Administrator<br />Related Teachers<br />Related Students |  Administrator   |  Administrator   | Administrator |
| `/courses/:courseID/students` | Administrator<br />Related Teachers<br />Related Students |  Administrator   |  Administrator   |      :x:      |
| `/courses/:courseID/tasks`    |          Related Teachers<br />Related Students           | Related Teachers | Related Teachers |      :x:      |
| `/courses/:courseID/teachers` | Administrator<br />Related Teachers<br />Related Students |  Administrator   |  Administrator   |      :x:      |

## Task

| URI                                     |                             GET                              |       PUT        |                 PATCH                  |      DELETE      |
| --------------------------------------- | :----------------------------------------------------------: | :--------------: | :------------------------------------: | :--------------: |
| `/tasks`                                | Related Teachers<br />Related Students<br />Related Monitors | Related Teachers |            Related Teachers            | Related Teachers |
| `/tasks/:taskID`                        | Related Teachers<br />Related Students<br />Related Monitors | Related Teachers |            Related Teachers            | Related Teachers |
| `/tasks/:taskID/files`                  |                       Related Teachers                       |       :x:        |                  :x:                   |       :x:        |
| `/tasks/:taskID/homeworks`              | Related Teachers<br />Related Students<br />Related Monitors |       :x:        | Related Teachers<br />Related Monitors |       :x:        |
| `/tasks/:taskID/homeworks/:number`      |   The Student<br />Related Teachers<br />Related Monitors    |       :x:        | Related Teachers<br />Related Monitors |       :x:        |
| `/tasks/:taskID/homeworks/:number/file` |              The Student<br />Related Teachers               |   The Student    |                  :x:                   |       :x:        |
| `/tasks/:taskID/monitors`               | Related Teachers<br />Related Students<br />Related Monitors | Related Teachers |            Related Teachers            |       :x:        |
