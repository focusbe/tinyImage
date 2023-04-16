// const path = require('path');
// const fs = require('fs');
// const { exec } = require('child_process');
const TinyPng = require('tinypngjs');
// const imagemin = require('imagemin');
// const imageminMozjpeg = require('imagemin-mozjpeg');
// const imageminPngquant = require('imagemin-pngquant');
// const Utli = require('./engine/utli');
// const iconv = require('iconv-lite');
// const remote = require('electron').remote;
const compress = function (imagelist, onprogress) {
    TinyPng.compressList(imagelist, onprogress);
};
module.exports = {
    compress,
};
