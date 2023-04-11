---
description: 图片压缩工具
---

# tinypngjs

## 安装

```bash
npm install tinypngjs
```

```bash
var TinyPng = require("tinypngjs");
```

## API

#### TinyPng.compress\(fromFolder,\[outFolder,onProgress\]\);

  
参数：

* fromFolder：需要压缩的文件夹
* outFolder：压缩后图片保存的文件夹
  * 可选
  * 默认值=fromFolder
* onProgress：下载进度回调

  回调函数：function\(res,percent\){}

  * res: Object,tinyjs压缩图片后返回的json
  * percent：Number当前进度

返回值 Promise

```javascript
var res = await TinyPng.compress("./a/");
```



#### TinyPng.compressImage\(fromImg,\[outImg\]\);

  
参数：

* fromImg：需要压缩的图片路径
* outFolder：压缩后图片的图片路径
  * 可选
  * 默认值=fromImg

返回值 Promise

```javascript
var res = await TinyPng.compressImg("./a/1.jpg");
```



### Github

nodejs版：[https://github.com/focusbe/tinypngjs](https://github.com/focusbe/tinypngjs)  
客户端版：[https://github.com/focusbe/tinyImage](https://github.com/focusbe/tinyImage)




