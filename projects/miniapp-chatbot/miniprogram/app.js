const Api = require('/api/index.js');
const Configs = require('./configs.js');

App({
  onLaunch () {
    this.globalData = {
      loaded: true,
      openid: '',
      userInfo: null,

      serverHostApi: Configs.serverHostApi,
      serverHostStatic: Configs.serverHostStatic,

      // app data
      message_dict: {},
      message_order: [],
    };

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: Configs.wxCloudEnv,
        traceUser: true,
      })

      wx.cloud.callFunction({
        name: 'getConfig',
        success: res => {
          const openid = res.result.openid;
          console.log('云函数获取到的openid: ', openid);
          this.globalData = { 
            ...this.globalData,
            openid,
          };  

          if (!openid) {
            this.globalData.loaded = true;
            return;
          };
        },
        fail(res) {
            // console.error('错误', res);
            wx.showModal({
              title: Configs.onInitErrorTitle,
              content: Configs.onInitErrorContent,
            })
          }
      });

    }
  },

})
