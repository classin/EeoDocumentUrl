API
==================
#### 实现的功能：
从云盘打开 edu 格式的文件，classin 能打开该文件指定的页面，该类课件内容的同步由第三方自行处理，classin只负责窗口位置、前后关系及全屏状态的同步。
#### edu 文件格式说明
edu 格式内容为一个 json，样例如下，key 不能改，值可以根据需求调整，数据大小写敏感，使用无 BOM 的 UTF-8 编码：

```
{
    "url":"http://cn.bing.com?p=v",
    "uid":true,
    "nickname":true,
    "identity":true,
    "title":"CET4 测试",
    "size":"800x600,400x300",
    "classin_authority":true
}
```
##### ClassIn 会默认传入以下参数：
- 学校ID，schoolId=<64位无符号整数>
- 课程ID，courseId=<64位无符号整数>
- 课节ID，classId=<64位无符号整数>
- 客户端语言，lang=<字符串>，目前的取值范围是 en, zh-CN, zh-TW

##### edu 文件必填项：
- url 需要打开的网址

##### edu 文件选填项：
- 如果 uid 字段为 true，表示 classin 打开 url 时后面会加上 uid=<登录者的uid>
- 如果 nickname 字段为 true，表示 classin 打开 url 时后面会加上 nickname=<登录者的nickname>
- 如果 identity 字段为 true，表示 classin 打开 url 时后面会加上 identity=<登录者的角色>，该值是一个字符串，取值范围是 teacher, assistant, student, auditor。
- 如果包含 title 字段，则课件标题栏会显示此字符串，数据使用 utf-8 编码
- 如果 classin_authority 字段为 true，表示会使用 classin 的课件授权规则（即由老师在课堂中控制学生的授权状态），否则网页内容一直是可操作的状态。auditor 角色永远没有权限
- 如果包含 size 字段，值为两组宽高，第一组是打开时窗口的推荐大小，第二组是窗口的最小限制，默认为"600x400,300x200"

添加参数后的完整 url 示例：
```http://11.33.55.77:9999/index_exam.html?schoolId=111111&courseId=222222&classId=3333333&uid=666666&nickname=call me student&identity=teacher&lang=zh-CN```

ClassIn 中的 edu 文件示例见 ```eeo_cn_exam_demo.edu```

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
- PC 版: Qt5.5.1 对应的 QtWebkit，可用该文档附带的 browser 目录里的 fancybrowser 测试（**注意：*PC 版浏览器*不支持 Flash，不支持 es6 语法，内核基于webkit 内核。**）
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
