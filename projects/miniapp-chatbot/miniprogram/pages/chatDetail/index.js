const app = getApp();
const Api = require('../../api/index.js');

Page({
  data: {
    login_uid: 'user_id_003',
    serverHostStatic: app.globalData.serverHostStatic,
    chatUid: '',
    data: {},
    itemOrder: [],
    itemCount: 0,
    scrollToId: null,
    confirmDialog: false,
  },

  onLoad(options) {
    // globalData 是否完成初始化
    if (app.globalData.loaded) {
      this.doInit(options)
    } else {
      // 由于 globalData 初始化 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.configLoadedCallback = () => {
        this.doInit.bind(this)(options);
      }
    }
  },

  doInit(options) {
    this.fetchData(options);
    // this.setData({
    //   message_dict: app.globalData.message_dict,
    //   message_order: app.globalData.message_order,
    //   chatUid,
    // });
  },
  gotoLastest(e) {
    // const msg_id = `msgItem${this.data.itemCount - 1}`;
    // console.log(msg_id);
    this.setData({
      scrollToId: 'latest-msg-anchor-id',
    })
  },

  previewImage: function (e) {
    const current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的 http 链接
      urls: [current] // 需要预览的图片 http 链接列表
    })
  },

  fetchData(options) {
    const chatUid = options['chat-uid'];
    this.setData({
      isLoading: true,
    });
    // if (!app.globalData.openid) return;

    const self = this;
    const url = Api.getMessages();
    wx.request({
      url,
      data: {
        'chat-uid': chatUid,
      },
      success(res) {
        self.setData({
          data: res.data.data,
          itemOrder: res.data.item_order,
          itemCount: res.data.item_order.length,
        }, function() {
          self.setData({
            scrollToId: 'latest-msg-anchor-id',
          });
        });
      },
      complete() {
        self.setData({
          isLoading: false,
        });
      },
    });
  },
  openConfrim(curPlan) {
    this.setData({
      confirmDialog: true,
    });
  },
  onApplyConfirm() {
    console.log('确认报名x xx ');
  },
  onShareAppMessage(res) {
    return {
      title: this.data.plan.title,
      path: `/pages/detail/index?pid=${this.data.plan.pid}`,
    };
  },
})
