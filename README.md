API
==================
#### 实现的功能：
从云盘打开 edu 格式的文件，classin 能打开该文件指定的页面，该类课件内容的同步由第三方自行处理，classin只负责窗口信息（位置、前后关系及全屏状态）的同步。
#### edu 文件格式说明
edu 格式内容为一个 json，样例如下，key 不能改，值可以根据需求调整，数据大小写敏感，使用 UTF-8 编码。开发者需要保证 json 格式的正确性，否则上传后会报转换错误，可以使用[在线的 json 校验网站](https://cn.bing.com/search?q=%E5%9C%A8%E7%BA%BFjson%E6%A0%A1%E9%AA%8C)进行检查。

```JSON
{
    "url":"http://www2.bing.com?key=value#anchorHash",
    "uid":true,
    "nickname":true,
    "identity":true,
    "title":"CET4 测试",
    "size":"600x400,300x200",
    "classin_authority":true
}
```

##### edu 文件必填项：
- `url` 需要打开的网址，例如`http://www.example.io/faq.html?key=value#question13`，classin 会将传入的参数拼接到`?key=value`之后，如`http://www.example.io/faq.html?key=value&schoolId=111&courseId=222...#question13`

##### edu 文件选填项：
| 字段              	| 类型   	| 取值／`默认值`      	| 描述                                                                                                                                                                                                	|
|-------------------	|--------	|---------------------	|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| `uid`               	| bool   	| `true`, false       	| `true`表示 classin 打开 url 时将拼接`uid=<登录者的uid>`                                                                                                                                               |
| `nickname`          	| bool   	| `true`, false       	| `true`表示 classin 打开 url 时将拼接`nickname=<登录者的nickname>`                                                                                                                                     |
| `identity`          	| bool   	| `true`, false       	| `true`表示 classin 打开 url 时将拼接`identity=<登录者的角色>`<BR> 角色范围是`teacher`, `assistant`, `student`, `auditor`                                                                              |
| `title`             	| string 	|                     	| 课件标题栏会显示此字符串                                                                                                                                                                            	|
| `classin_authority` 	| bool   	| `true`, false       	| `true`表示由老师在 classin 教室里通过摄像头下方的授权按钮控制 edu 文件是否响应用户操作，`false` 表示网页内容一直是可操作的状态。<BR> **注意：auditor 角色永远没有权限操作 edu**                       |
| `size`              	| string 	| `"600x400,300x200"` 	| 值为两组宽高，第一组是打开时窗口的推荐大小，第二组是窗口的最小限制。<BR> **注意：两组大小均不能小于 100x0，且推荐大小不能小于最小限制。宽高之间使用小写字母x分隔，两组宽高之间使用半角逗号`,`分隔** 	|


##### ClassIn 程序会默认向打开的 url 的 [query](https://www.rfc-editor.org/rfc/rfc1808#section-2.1) 中传入以下参数：
| 字段           | 类型           | 描述                                                                                |
|----------------|----------------|-------------------------------------------------------------------------------------|
| `schoolId`     | 64位无符号整数 | 学校唯一标识号                                                                      |
| `courseId`     | 64位无符号整数 | 课程唯一标识号                                                                      |
| `classId`      | 64位无符号整数 | 课节唯一标识号                                                                      |
| `initiatorUid` | 64位无符号整数 | 打开该 edu 的用户                                                                   |
| `deviceType`   | 字符串         | 客户端类型，取值范围是`pc`,`android`,`iPhone`,`iPad`                                |
| `lang`         | 字符串         | 客户端语言，取值范围是`en`(英语),`zh-CN`(简体中文),`zh-TW`(繁体中文),`es`(西班牙语) |


添加参数后的完整 url 示例：
```http://11.33.55.77:9999/index_exam.html?schoolId=111111&courseId=222222&classId=3333333&uid=666666&nickname=call%20me%20student&identity=teacher&initiatorUid=666666&deviceType=pc&lang=zh-CN```

ClassIn 中的 edu 文件示例见 ```eeo_cn_exam_demo.edu```

##### 注意事项
1. 开发时请注意不要在发布环境中弹独立的窗口（如alert），否则接收端可能会闪退。保留 alert 弹窗仅作为开发阶段调试使用。如果需要弹窗的话，发布环境中应该在 classin 的 edu 课件框内显示提示框。

在线答题demo (socket.io)
===============

一个简易的在线考试系统，支持老师开启考试，查看学生答题状况，收卷，关闭考场，学生答题。

本 demo 主要实现方式为由 ClassIn 在线教室在地址栏加入 get 参数，传入课程 id、课节 id、用户 id、用户昵称、以及用户身份，然后第三方实现该用户在第三方的登陆接入以及和其他接入用户的互动交互。

本 demo 的服务器环境基于 nodejs，用户间的交互数据通过 websocket 实现。

Install
==================

1. 安装 ```nodejs```
2. 在程序根目录打开命令行工具
3. 在命令行工具输入并执行 ```npm install``` 安装必要模块
4. 在命令行工具输入并执行 ```node app_exam.js``` 启动服务器环境
5. 使用chrome内核的浏览器访问 ```http://demo_host:3000/index.html?[用户相关信息参数]```;
6. 用户相关信息参数介绍
    基本格式：courseId=[课程id]&classId=[课节id]&uid=[用户id]&nickname=[用户昵称encodeURIComponent]&identity=[用户身份]。

7. 场景模拟
    老师登陆：```http://demo_host:3000/index.html?courseId=1000&classId=2000001&uid=300001&nickname=%E7%8E%8B%E8%80%81%E5%B8%88&identity=teacher&lang=zh-CN```

    学生A登陆：```http://demo_host:3000/index.html?courseId=1000&classId=2000001&uid=300002&nickname=%E5%AD%A6%E7%94%9FA&identity=student&lang=zh-CN```

    学生B登陆：```http://demo_host:3000/index.html?courseId=1000&classId=2000001&uid=300003&nickname=%E5%AD%A6%E7%94%9FB&identity=student&lang=zh-CN```

ClassIn 使用的浏览器
=============
- PC 版: Chromium Embedded Framework (84.4.0+g304e015+chromium-84.0.4147.105)，可使用[这里的浏览器工具](https://github.com/classin/EeoDocumentUrl/releases/tag/4.0)进行调试
- iOS 版: 手机/Pad 系统自带的 safari
- Android 版：手机/Pad 系统自带的浏览器

目录结构
============
```
|-- demo                     答题 demo
|     |- ...
|     |- ...
|     `- ...
|-- eeo_cn_exam_demo.edu     答题 demo对应的 edu 文件（可以直接上传到 ClassIn 里演示）
`-- example.edu              答题 demo对应的 edu 文件（使用时需要将 url 里的 IP 改成开发者的服务器的 IP 或域名）
```
