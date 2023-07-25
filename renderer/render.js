console.log('TinyPng.compressList', TinyPng.compressList);

function getExtName(filename) {
    var pos = filename.lastIndexOf('.');
    return filename.substring(pos);
}
var iframeWindow;
function sendMessage(msg) {
    try {
        if (!iframeWindow) {
            iframeWindow =
                document.getElementById('remote-iframe').contentWindow;
        }
        iframeWindow.postMessage(msg, '*');
    } catch (error) {}
}
window.addEventListener('DOMContentLoaded', function () {
    sendMessage({ event: 'ready' });
    var exts = ['.jpg', '.png'];
    var dropEle = document.querySelector('.drop');
    var busy = false;
    dropEle.addEventListener('mousemove', function (e) {
        e.preventDefault();
    });
    var dropZone = dropEle;
    dropZone.addEventListener(
        'dragenter',
        function (e) {
            e.preventDefault();
            e.stopPropagation();
            dropEle.style.background = 'rgba(255,255,255,0.1)';
        },
        false
    );
    dropZone.addEventListener(
        'dragover',
        function (e) {
            e.preventDefault();
            e.stopPropagation();
        },
        false
    );
    dropZone.addEventListener(
        'dragleave',
        function (e) {
            e.preventDefault();
            e.stopPropagation();
            dropEle.style.background = '';
        },
        false
    );
    dropZone.addEventListener('drop', function (e) {
        e.preventDefault();
        e.stopPropagation(); // 处理拖拽文件的逻辑
        // alert(1);
        if (busy) {
            return;
        }
        sendMessage({ event: 'drop', data: e.dataTransfer.files });
        dropEle.style.background = '';
        var df = e.dataTransfer;
        var dropFiles = []; // 存放拖拽的文件对象
        if (df.items !== undefined) {
            // Chrome有items属性，对Chrome的单独处理
            for (var i = 0; i < df.items.length; i++) {
                var item = df.items[i]; // 用webkitGetAsEntry禁止上传目录
                if (item.kind == 'file') {
                    var file = item.getAsFile();
                    if (item.webkitGetAsEntry().isFile) {
                        dropFiles.push({ type: 'file', path: file.path });
                    } else {
                        dropFiles.push({ type: 'folder', path: file.path });
                    }
                }
            }
        }
        var imagesArr = [];
        var chuli = 0;
        for (var i in dropFiles) {
            let curpath = dropFiles[i].path;
            let curtype = dropFiles[i].type;
            if (curtype == 'file') {
                if (!exts.includes(getExtName(curpath).toLowerCase())) {
                    continue;
                }
                imagesArr.push({ path: curpath });
                chuli++;
                if (chuli >= dropFiles.length) {
                    startCom(imagesArr);
                }
            } else {
                TinyPng.getAllImg(curpath)
                    .then((imgs) => {
                        imagesArr = imagesArr.concat(imgs);
                        // console.log(imgs);
                        chuli++;
                        if (chuli >= dropFiles.length) {
                            startCom(imagesArr);
                        }
                    })
                    .catch((err) => {
                        // console.log(err);
                        sendMessage({ event: 'error', data: err });
                    });
            }
        }
    });

    function startCom(imglist) {
        if (busy) {
            return;
        }

        let chuli = 0;
        var faild = 0;
        var before = 0;
        var after = 0;
        if (imglist.length == 0) {
            alert('没有找到图片文件');
        } else if (imglist.length > 300) {
            alert('选择的图片超过300张');
        } else {
            
            if (confirm('是否压缩图片并替换原文件')) {
                busy = true;
                $('.nums .success').html('0/' + imglist.length);
                $('.nums .fail').html('0');
                $('.progress_inner span').width(0);
                $('.progress .num').html('0/' + imglist.length);
                $('.progress span').width(0);
                $('.progress').css({ display: 'flex' });
                try {
                    TinyPng.compressList(imglist, function (res, percent, err) {
                        chuli++;
                        $('.nums .success').html(chuli + '/' + imglist.length);
                        if (!res) {
                            faild++;
                            $('.nums .fail').html(faild);
                            console.log(err);
                            sendMessage({ event: 'error', data: err });
                        } else {
                            if (!!res.input && !!res.output) {
                                before += res.input.size;
                                after += res.output.size;
                            }
                        }

                        $('.progress_inner span').width(percent * 100 + '%');
                        if (percent >= 1) {
                            var sheng = parseInt((before - after) / 1024);
                            if (sheng > 1024) {
                                sheng =
                                    parseInt((sheng / 1024) * 10) / 10 + 'M';
                            } else {
                                sheng += 'K';
                            }

                            alert('压缩完成,节省空间：' + sheng);
                            sendMessage({ event: 'finish', data: sheng });
                            $('.progress').hide();
                            busy = false;
                        }
                    });
                } catch (error) {
                    busy = false;
                    $('.progress').hide();
                    if (!!error.message) {
                        alert(error.message);
                    } else {
                        alert('发生未知错误');
                    }
                }
            }
        }
    }
});
