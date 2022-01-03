const Api = require('../../api/index.js');
const app = getApp();

Page({
  data: {
    data: {},
    itemOrder: [],
    isLoading: false,
  },
  onLoad(options) {
    // globalData 是否完成初始化
    if (app.globalData.loaded) {
      this.doInit()
    } else {
      // 由于 globalData 初始化 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.configLoadedCallback = () => {
        this.doInit.bind(this)();
      }
    }
  },

  doInit(options) {
    this.fetchData();
    this.setData({
      isLoading: false,
    });
  },

  goPage: function(e){
    const uid = e.currentTarget.dataset.uid
    const new_url = `/pages/chatDetail/index?chat-uid=${uid}`;
    wx.navigateTo({
      url: new_url,
    })
  },
  onShow() {
  },

  fetchData() {
    this.setData({
      isLoading: true,
    });
    // if (!app.globalData.openid) return;

    const self = this;
    const url = Api.getUserChats();
    wx.request({
      url,
      data: {
        open_id: app.globalData.openid,
      },
      success(res) {
        self.setData({
          data: res.data.data,
          itemOrder: res.data.itemOrder,
        });
      },
      complete() {
        self.setData({
          isLoading: false,
        });
      },
    });
  },
})