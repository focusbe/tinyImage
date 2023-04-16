const { app, BrowserWindow } = require('electron');
const Update = require('./main/update');
const path = require('path');
global.Win = null;
function createWindow() {
    // 创建浏览器窗口
    let win = new BrowserWindow({
        width: 400,
        height: 300,
        acceptFirstMouse: true,
        webPreferences: {
            nodeIntegration: true,
            preload: path.resolve(__dirname, './renderer/preload.js'),
        },
        show: false,
        backgroundColor: '#24292e',
    });
    win.once('ready-to-show', function () {
        win.show();
        Update.check();
    });
    // 加载index.html文件
    win.loadFile('renderer/index.html');
    global.Win = win;
}

app.whenReady().then(createWindow);
