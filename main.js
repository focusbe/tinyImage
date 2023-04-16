const { app, BrowserWindow, contextBridge } = require('electron');
const TinyPng = require('tinypngjs');
const Update = require('./main/update');
const path = require('path');
function myFunction() {
    console.log('Hello from main process!');
}

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
        win.webContents.openDevTools();
    });
    // 加载index.html文件
    win.loadFile('renderer/index.html');
    global.Win = win;
}

app.whenReady().then(createWindow);
