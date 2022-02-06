// app.js
import request from './models/request.js';
import utils from './utils/util.js';
import dates from '/utils/dates';
import sources from '/utils/source';
import packages from '/utils/package';
import base64 from '/utils/base64';
import english from '/i18n/en.js';
import chinese from '/i18n/zh.js';

// var sensors = require('/sensors/sensorsdata.js');
// sensors.init();

App({
  request: request,
  utils: utils,
  dates: dates,
  sources: sources,
  packages: packages,
  Base64: base64,
  english: english,
  chinese: chinese,

  // 全局参数
  globalData: {
    token: '',
    handLoginState: false,
    loginData: null,
    langInfo: null,
    systemInfo: null,
    userInfo: null,
    encryptInfo: null,
    authInfo: null,
    curScene: ''
  },
  // 页面间数据传递
  pageBetweenData: {
    currentMergeInfo: '',
    FindFaceInfo: '',
    mergeMakeInfo: '',
    currentAlbumInfo: ''
  },

  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      });
    }

    this.globalData = {};
  }
});
