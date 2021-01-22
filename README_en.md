API
==================
#### Brief introduction of ClassIn edu
In order to open the third party web cousreware in ClassIn classroom, we provide one open standard file format, which suffixed with `.edu`.

When edu file (courseware) is open in classroom from cloud disk, ClassIn will read the edu content and open the web page specified by the file. The synchronization of the courseware content is handled by the third party's own developers. The ClassIn is only responsible for the synchronization of the courseware widget information (geometry, z-order and the full screen status).

#### Edu file format description
The content of the edu format is a json. An example is presented below, the key cannot be changed, the value can be adjusted according to requirements, the data is case-sensitive, and the UTF-8 encoding:

```JSON
{
    "url":"http://www2.bing.com?key=value#anchorHash",
    "uid":true,
    "nickname":true,
    "identity":true,
    "title":"CET4 test",
    "size":"600x400,300x200",
    "ClassIn_authority":true
}
```

##### ClassIn will pass the following parameters by default:
| Field          | Type           | Description                                                                                                                  |
|----------------|----------------|------------------------------------------------------------------------------------------------------------------------------|
| `schoolId`     | unsigned int64 | school identifier                                                                                                            |
| `courseId`     | unsigned int64 | course identifier                                                                                                            |
| `classId`      | unsigned int64 | class identifier                                                                                                             |
| `initiatorUid` | unsigned int64 | uid of the one who opened this edu courseware                                                                                |
| `deviceType`   | string         | device type, possible values are `pc`,`android`,`iPhone`,`iPad`                                                              |
| `lang`         | string         | client language, possible values are `en`(English), `zh-CN`(Simplified Chinese), `zh-TW`(Traditional Chinese), `es`(Spanish) |

##### Required fields in edu file:
- `url` url to open, say `http://www.example.io/faq.html?key=value#question13`, classin will pass parameters after `?key=value`, that is `http://www.example.io/faq.html?key=value&schoolId=111&courseId=222...#question13`

##### Optional fields in edu file:
| Field               | Type   | values/`default`    | Description                                                                                                                                                                                                                                                                                                                                    |
|---------------------|--------|---------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `uid`               | bool   | `true`, false       | `true` means pass the following part to url`uid=<user's uid>`                                                                                                                                                                                                                                                                                  |
| `nickname`          | bool   | `true`, false       | `true` means pass the following part to url`nickname=<user's nickname>`                                                                                                                                                                                                                                                                        |
| `identity`          | bool   | `true`, false       | `true` means pass the following part to url`identity=<user's role>`<BR> possible values are`teacher`, `assistant`, `student`, `auditor`                                                                                                                                                                                                        |
| `title`             | string |                     | the data will be presented in courseware title bar                                                                                                                                                                                                                                                                                             |
| `classin_authority` | bool   | `true`, false       | `true` means the authorization rule of ClassIn will be used (i.e. the teacher could control the authorization status of students in the classroom), or the web content will be in the operational state. <BR> **NOTE: Auditor role never has the permission.**                                                                                 |
| `size`              | string | `"600x400,300x200"` | need two groups of width and height, the first group is the recommended size of open widget, while second group is a minimum limit.<BR> **NOTE: size cannot smaller than 100x0, and recommended size cannot smaller than minimum limit. Separator of width and height is lowercase letter x, and separator of groups is half-width comma `,`** |

Example of a full url after adding parameters:
```http://11.33.55.77:9999/index_exam.html?schoolId=111111&courseId=222222&classId=3333333&uid=666666&nickname=call%20me%20student&identity=teacher&initiatorUid=666666&deviceType=pc&lang=zh-CN```

See the example of the edu file in ClassIn. `eeo_cn_exam_demo.edu`

##### Warnings
1. Please be careful not to pop up a separate window (such as `alert` in `javascript`) in the none debug environment during development, or the receiving side may crash. We keep the alert popup function only for debugging under development. If you need to pop up a window, you should develop a window which can be displayed inside web page.

Online test demo (socket.io)
===============

A simple online test system that allows teachers to distribute tests, view student's answers, collect back the tests, close the test; and it allows students to answer tests.

The implementation of this demo is to add the `get parameter` in the url of the ClassIn edu, the course id, the class id, the user id, the user nickname, and the user identity, and then the third party developers implement the login access of the user in the third party server and the interaction with other users.

The server environment of this demo is based on `nodejs`, and transmit data between users is using by websocket.

Install
==================

1. install ```nodejs```
2. Open a command prompt in the program root directory
3. run ```npm install``` to install necessary modules
4. run ```node app_exam.js``` to start the server environment
5. visit ```http://demo_host:3000/index.html?[User related information]``` by using Chromium kernel based browser
6. User related information parameters introduce
    Format: courseId=[course id]&classId=[class id]&uid=[user id]&nickname=[user nickname encodeURIComponent]&identity=[user identity].

7. Scene simulation
    Teacher login```http://demo_host:3000/index.html?courseId=1000&classId=2000001&uid=300001&nickname=%E7%8E%8B%E8%80%81%E5%B8%88&identity=teacher&lang=zh-CN```

    Student A login```http://demo_host:3000/index.html?courseId=1000&classId=2000001&uid=300002&nickname=%E5%AD%A6%E7%94%9FA&identity=student&lang=zh-CN```

    Student B login```http://demo_host:3000/index.html?courseId=1000&classId=2000001&uid=300003&nickname=%E5%AD%A6%E7%94%9FB&identity=student&lang=zh-CN```

Browser used in ClassIn
=============
- PC version: Chromium Embedded Framework (84.4.0+g304e015+chromium-84.0.4147.105), developers can test by using [this tool](https://github.com/classin/EeoDocumentUrl/releases/tag/4.0)
- iOS version: Safari comes with the phone/Pad system
- Android version: The browser that comes with the phone/Pad system

Directory Structure
============
```
|-- browser                  for tweaking html5 code compatibility
|     |- fancybrowser.dmg    Mac browser
|     `- fancybrowser.zip    windows browser, unzip and run fancybrowser.exe
|-- demo                     online answer demo
|     |- ...
|     |- ...
|     `- ...
|-- eeo_cn_exam_demo.edu     the edu file corresponding to the demo (can be uploaded directly to ClassIn)
`-- example.edu              the edu file of the demo (change ip in the url to developers's server ip)
```
