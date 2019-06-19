API
==================
#### 实现的功能：
从云盘打开 edu 格式的文件，classin 能打开该文件指定的页面，该类课件内容的同步由第三方自行处理，classin只负责窗口信息（位置、前后关系及全屏状态）的同步。
#### edu 文件格式说明
edu 格式内容为一个 json，样例如下，key 不能改，值可以根据需求调整，数据大小写敏感，使用无 BOM 的 UTF-8 编码：

```JSON
{
    "url":"http://www2.bing.com?key=value#anchorHash",
    "uid":true,
    "nickname":true,
    "identity":true,
    "title":"CET4 测试",
    "size":"800x600,400x300",
    "classin_authority":true
}
```
##### ClassIn 会默认传入以下参数：
| 字段         	| 类型           	| 描述                                                                                	|
|--------------	|----------------	|-------------------------------------------------------------------------------------	|
| `schoolId`   	| 64位无符号整数 	| 学校唯一标识号                                                                      	|
| `courseId`   	| 64位无符号整数 	| 课程唯一标识号                                                                      	|
| `classId`    	| 64位无符号整数 	| 课节唯一标识号                                                                      	|
| `deviceType` 	| 字符串         	| 客户端类型，取值范围是`pc`,`android`,`iPhone`,`iPad`                                	|
| `lang`       	| 字符串         	| 客户端语言，取值范围是`en`(英语),`zh-CN`(简体中文),`zh-TW`(繁体中文),`es`(西班牙语) 	|


##### edu 文件必填项：
- `url` 需要打开的网址，例如`http://www.example.io/faq.html?key=value#question13`，classin 会将传入的参数拼接到`?key=value`之后，如`http://www.example.io/faq.html?key=value&schoolId=111&courseId=222...#question13`

##### edu 文件选填项：
| 字段              	| 类型   	| 取值／`默认值`      	| 描述                                                                                                                                                                                                	|
|-------------------	|--------	|---------------------	|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| `uid`               	| bool   	| `true`, false       	| `true`表示 classin 打开 url 时将拼接`uid=<登录者的uid>`                                                                                                                                                 	|
| `nickname`          	| bool   	| `true`, false       	| `true`表示 classin 打开 url 时将拼接`nickname=<登录者的nickname>`                                                                                                                                       	|
| `identity`          	| bool   	| `true`, false       	| `true`表示 classin 打开 url 时将拼接`identity=<登录者的角色>`<BR> 角色范围是`teacher`, `assistant`, `student`, `auditor`                                                                                	|
| `title`             	| string 	|                     	| 课件标题栏会显示此字符串                                                                                                                                                                            	|
| `classin_authority` 	| bool   	| `true`, false       	| `true`表示使用 classin 的课件授权规则（即由老师在课堂中控制学生的授权状态），`false` 表示网页内容一直是可操作的状态。<BR> **注意：auditor 角色永远没有权限**                                            	|
| `size`              	| string 	| `"600x400,300x200"` 	| 值为两组宽高，第一组是打开时窗口的推荐大小，第二组是窗口的最小限制。<BR> **注意：两组大小均不能小于 100x0，且推荐大小不能小于最小限制。宽高之间使用小写字母x分隔，两组宽高之间使用半角逗号`,`分隔** 	|

添加参数后的完整 url 示例：
```http://11.33.55.77:9999/index_exam.html?schoolId=111111&courseId=222222&classId=3333333&uid=666666&nickname=call me student&identity=teacher&deviceType=pc&lang=zh-CN```

ClassIn 中的 edu 文件示例见 ```eeo_cn_exam_demo.edu```

##### 注意事项
1. PC 端在使用简体中文时传给网页的语言参数有误，老版本传的是`zh`，后续更新的版本会修改为本文档里约定的`zh-CN`，移动端无此问题。期间机构的开发者处理多语言的时候可能需要兼容这两个值，伪代码如下：
```javascript
if (lang == "zh" || lang == "zh-CN") { // 需要判断两个值
    // 显示简体中文界面
} else if (lang == "zh-TW") {
    // 显示繁体中文界面
} else if (lang == "es") {
    // 显示西班牙语界面
} else {
    // 显示英文界面
}
```
2. 开发时请注意不要在发布环境中弹独立的窗口（如alert），否则接收端可能会闪退。保留 alert 弹窗仅作为开发阶段调试使用。如果需要弹窗的话，发布环境中应该在 classin 的 edu 课件框内显示提示框。

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
- PC 版: Qt5.5.1 对应的 QtWebkit，可用该文档附带的 browser 目录里的 fancybrowser 测试（**注意：*PC 版浏览器*不支持 Flash，不支持 es6 语法，内核基于webkit 。**）
- iOS 版: 手机/Pad 系统自带的 safari
- Android 版：手机/Pad 系统自带的浏览器

目录结构
============
```
demo/                       答题 demo
example.edu                 答题 demo对应的 edu 文件（使用时需要将 url 里的 IP 改成开发者的服务器的 IP 或域名）
eeo_cn_exam_demo.edu        答题 demo对应的 edu 文件（可以直接上传到 ClassIn 里演示）
browser/                    用于调 html5 代码兼容性
browser/fancybrowser.dmg    PC Mac版浏览器
browser/fancybrowser.zip    PC windows 版浏览器，解压后运行 fancybrowser.exe 即可
```
