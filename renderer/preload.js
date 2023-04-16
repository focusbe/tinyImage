const { contextBridge } = require('electron');
const TinyPng = require('tinypngjs');
console.log(TinyPng);
contextBridge.exposeInMainWorld('TinyPng', {
    compressList: TinyPng.compressList,
    getAllImg: TinyPng.getAllImg,
});
