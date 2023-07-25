const { app, BrowserWindow, Menu } = require('electron');
const Update = require('./main/update');

const isMac = process.platform === 'darwin';
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

template = [
    ...(isMac
        ? [
              {
                  label: app.name,
                  submenu: [
                      { role: 'about', label: '关于' },
                      { type: 'separator' },
                      { type: 'separator' },
                      { role: 'hide', label: '隐藏' },
                      { role: 'hideOthers', label: '隐藏其他' },
                      { role: 'unhide', label: '显示' },
                      { type: 'separator' },
                      { role: 'quit', label: '退出' },
                  ],
              },
          ]
        : []),
    // { role: 'fileMenu' }
    // { role: 'editMenu' }
    // {
    //     label: 'Edit',
    //     submenu: [
    //         { role: 'undo' },
    //         { role: 'redo' },
    //         { type: 'separator' },
    //         { role: 'cut' },
    //         { role: 'copy' },
    //         { role: 'paste' },
    //         ...(isMac
    //             ? [
    //                   { role: 'pasteAndMatchStyle' },
    //                   { role: 'delete' },
    //                   { role: 'selectAll' },
    //                   { type: 'separator' },
    //                   {
    //                       label: 'Speech',
    //                       submenu: [
    //                           { role: 'startSpeaking' },
    //                           { role: 'stopSpeaking' },
    //                       ],
    //                   },
    //               ]
    //             : [
    //                   { role: 'delete' },
    //                   { type: 'separator' },
    //                   { role: 'selectAll' },
    //               ]),
    //     ],
    // },
    // { role: 'viewMenu' }

    // { role: 'windowMenu' }
    {
        label: '窗口',
        submenu: [
            { role: 'minimize' , label: '最小化'},
            { role: 'zoom', label: '缩放' },
            ...(isMac
                ? [
                      { type: 'separator' },
                      { role: 'front' , label: '前置'},
                  ]
                : [{ role: 'close' , label: '关于'}]),
        ],
    },
    {
        label: '帮助',
        role: 'help',
        submenu: [
            {
                label: '了解更多',
                click: async () => {
                    const { shell } = require('electron');
                    await shell.openExternal('https://focusbe.github.io/tinyImage/');
                },
            },
        ],
    },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
