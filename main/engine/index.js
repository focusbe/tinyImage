const fs = require('fs');
const { app } = require('electron');
const path = require('path');
const https = require('https');
const { URL } = require('url');
const fse = require('fs-extra');
const Files = require('./files');
const exts = ['.jpg', '.png', '.gif', '.webp', '.jpeg', '.svg']; //图片的格式，不一定压缩但是可以完成复制；
const tinyExts = ['.jpg', '.png'];
const max = 5200000; // 5MB == 5242848.754299136
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const Utli = require('./utli');
const iconv = require('iconv-lite');
const _plugins = {
    jpg: imageminMozjpeg({
        quality: 80,
    }),
    png: imageminPngquant({
        quality: [0.6, 0.8],
    }),
};
class TinyPng {
    constructor() {}
    static compressList(imagelist, onprogress) {
        if (!imagelist || imagelist.length == 0) {
            throw new Error('没有获取到图片文件');
        }
        var total = imagelist.length;
        var compressed = 0;
        for (var i in imagelist) {
            let curpath = imagelist[i].path;
            TinyPng.compressImg(curpath, curpath)
                .then((res) => {
                    compressed++;
                    if (!!onprogress) {
                        onprogress(res, compressed / total);
                    }
                })
                .catch((err) => {
                    compressed++;
                    onprogress(false, compressed / total, err);
                });
        }
        return true;
    }
    static async compress(from, out, onprogress) {
        if (!from) {
            throw new Error('请传入要压缩的文件夹');
        }
        if (!out) {
            out = from;
        }
        var imagelist = await this.getAllImg(from);
        if (!imagelist || imagelist.length == 0) {
            throw new Error('没有获取到图片文件');
        }
        var total = imagelist.length;
        var compressed = 0;
        for (var i in imagelist) {
            let curpath = imagelist[i].path;
            let relative = path.relative(from, curpath);
            let outputPath = path.resolve(out, relative);
            TinyPng.compressImg(curpath, outputPath)
                .then((res) => {
                    compressed++;
                    if (!!onprogress) {
                        onprogress(res, compressed / total);
                    }
                })
                .catch((err) => {
                    compressed++;
                    onprogress(false, compressed / total, err);
                });
        }
        return true;
    }
    static getPlugins(extname) {
        var plugins = [];
        if (extname == '.jpg' || extname == '.jpeg') {
            plugins.push(_plugins['jpg']);
        } else if (extname == '.png') {
            plugins.push(_plugins['png']);
        }
        return plugins;
    }
    static uploadImage(imageData) {
        //上传到tinypng进行压缩
        if (!imageData || imageData.length > max) {
            return false;
        }
        return new Promise((resolve, reject) => {
            var req = https.request(Utli.getOptions(), (res) => {
                res.on('data', (buf) => {
                    let obj;
                    try {
                        obj = JSON.parse(buf.toString());
                    } catch (error) {
                        reject(new Error('解析返回值失败'));
                    }
                    if (obj.error) {
                        reject(new Error(obj.error));
                    } else {
                        resolve(obj);
                    }
                });
            });
            req.write(imageData, 'binary');
            req.on('error', (err) => {
                reject(err);
            });
            req.end();
        });
    }

    static async compressImg(from, out, disableTiny) {
        if (!from) {
            throw new Error('请传入正确的from');
        }
        if (!out) {
            out = from;
        }
        var exists = await fse.exists(from);
        if (!exists) {
            throw new Error('传入的文件不存在');
        }
        var imageData;
        var stat;
        var res;
        stat = await fse.stat(from);
        console.log(stat);
        from = from.replace(/\\/g, '/');
        var extname = path.extname(from).toLowerCase();
        try {
            var image = await imagemin([from], {
                plugins: this.getPlugins(extname),
            });
            imageData = image[0]['data'];
        } catch (error) {
            if (tinyExts.includes(extname)) {
                console.log(error);
                imageData = await fs.readFile(from);
                console.log(imageData);
            } else {
                throw error;
                return false;
            }
        }

        var resObj = {
            input: { size: stat.size, path: from },
            type: 'imagemin',
        };
        if (!disableTiny && tinyExts.indexOf(extname) > -1) {
            try {
                var obj = await this.uploadImage(imageData);
                if (obj && obj.output) {
                    var content = await this.downloadFile(obj.output.url);
                    if (content) {
                        resObj.type = 'tinypng';
                        imageData = content;
                    }
                }
            } catch (error) {}
        }
        var res = await this.saveImg(out, imageData);
        if (res) {
            resObj.output = {
                size: imageData.length,
                path: out,
            };
            return resObj;
        } else {
            return false;
        }
    }
    static downloadFile(url) {
        //下载文件
        return new Promise((resolve, reject) => {
            let options = new URL(url);
            let req = https.request(options, (res) => {
                let body = '';
                res.setEncoding('binary');
                res.on('data', function (data) {
                    body += data;
                });
                res.on('end', function () {
                    resolve(body);
                });
            });
            req.on('error', (e) => {
                reject(e);
            });
            req.end();
        });
    }
    static saveImg(imgpath, content) {
        //保存在线压缩好的图片
        return new Promise((resolve, reject) => {
            Files.createdirAsync(path.dirname(imgpath)).then((res) => {
                fs.writeFile(imgpath, content, 'binary', (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(true);
                });
            });
        });
    }
    static async getAllImg(file) {
        var imgs = await Files.getTree(file, false, null, function (file) {
            var extname = path.extname(file).toLowerCase();
            return !extname || !exts.includes(extname);
        });
        return imgs;
    }
}
module.exports = TinyPng;
