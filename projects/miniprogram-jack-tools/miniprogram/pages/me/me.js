// pages/me/me.js
//获取应用实例
const app = getApp();
// 定时器
let timeOut = null;

Page({
  data: {
    token: '',
    userInfo: '',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showInput: false,
    value: '',
    pickerIndex: null,
    langList: ["中文", "英文"],
    countInfo: {
      puzzleListNum: 0,
      visitHistoryNum: 0,
      UserLikesNum: 0
    }
  },

  done: function() {
    let val = this.data.value;
    wx.navigateTo({
      url: '../cover/cover?scene=' + val,
    })
  },
  enterKey: function(e) {
    console.log(e);
    this.setData({
      value: e.detail.value
    })
  },
  goMyCover: function() {
    this.setData({
      showInput: true
    })
  },
  //跳转我制作的
  goMymaking: function() {
    wx.navigateTo({
      url: '../myMaking/myMaking',
    });
    app.sensors.track('EnterPage', {
      page_name: '我制作的照片'
    });
  },
  // 跳转我的拍摄
  goMyAlbum: function() {
    console.log(1);
    wx.navigateTo({
      url: '../myShoot/myShoot'
    });
    app.sensors.track('EnterPage', {
      page_name: '我的拍摄'
    });
  },
  // 跳转我赞过的相片
  goMyLike: function() {
    wx.navigateTo({
      url: '../myLike/myLike'
    });
    app.sensors.track('EnterPage', {
      page_name: '我赞过的照片'
    });
  },
  // 跳转我看过的相册
  goMyLook: function() {
    console.log(3);
    wx.navigateTo({
      url: '../myLook/myLook'
    });
    app.sensors.track('EnterPage', {
      page_name: '我浏览过的相册'
    });
  },
  //设置语言
  setLang: function(e) {
    if (e.detail.value == 1) {
      wx.setStorageSync("lang", "en");
      app.globalData.langInfo = app.english;
    } else {
      wx.setStorageSync("lang", "cn");
      app.globalData.langInfo = app.chinese;
    }
    this.setData({
      pickerIndex: e.detail.value
    })
  },
  // 获取拼图数据
  getPuzzleList: function() {
    let url = 'getUserMergePhotosModel',
      params = {
        weChatId: 1,
        pageSize: 20,
        pageNumber: 1
      }
    app.request.requestPostApi(url, params, "PUZZLE_LIST", this.successFun, this.failFUN);
  },
  // 获取历史访问数据
  findVisitHistory: function() {
    // app.utils.loading();
    var url = "findVisitHistoryByPageModel",
      params = {
        "pageIndex": 0,
        "pageSize": 10
      };
    app.request.requestPostApi(url, params, "HISTORY_LIST", this.successFun, this.failFun);
  },
  // 获取点赞数据
  getUserLikes: function() {
    var url = "getUserLikesModel";
    var params = {
      weChatId: "1",
      pageNumber: 1,
      pageSize: 20
    };
    app.request.requestPostApi(url, params, "LIKE_LIST", this.successFun, this.failFun);
  },
  // 退出登录
  logOut: function() {
    app.utils.loading();
    var url = "logoutModel";
    app.request.requestPostApi(url, {}, "LOG_OUT", this.successFun, this.failFun);
  },
  // 判断token是否过期
  checkIsToken: function() {
    let url = "healthCheckModel";
    app.request.requestPostApi(url, {}, "CHECK_TOKEN_ME", this.successFun, this.failFun);
  },
  successFun: function(res, code) {
    let that = this;
    switch (code) {
      case "HISTORY_LIST":
        if (res.code == 0) {
          let historyList = res.data;
          that.setData({
            "countInfo.visitHistoryNum": historyList.totalCount
          })
        }
        // app.utils.hideLoading();
        break;
      case "LIKE_LIST":
        if (res.code == 0) {
          let likeList = res.data;
          that.setData({
            "countInfo.UserLikesNum": likeList.count
          })
        }
        break;
      case "PUZZLE_LIST":
        if (res.code == 0) {
          let puzzleList = res.data;
          that.setData({
            "countInfo.puzzleListNum": puzzleList.count
          })
        }
        break;
      case "LOG_OUT":
        if (res.code == 0) {
          wx.removeStorageSync("userInfo");
          wx.removeStorageSync("token");
          wx.removeStorageSync("uid");
          that.clearPageData();
        }
        app.utils.hideLoading();
        break;
      case "CHECK_TOKEN_ME":
        if (res.code == 0) {
          that.checkUserInfo();
          that.getPageData();
        } else {
          that.clearPageData();
        };
        break;
    }
  },

  // 未授权用户提示
  userInfoTips: function() {
    app.utils.toast("个人功能需授权后查看");
  },
  // 获取用户信息按钮
  getUserInfo: function(e) {
    if (e.detail.userInfo) {
      wx.setStorageSync("userInfo", e.detail.userInfo);
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    };
  },
  // 获取用户信息并进行授权
  getUserInfoStatus: function() {
    let that = this;
    app.getLoginFun().then(function(info) {
      console.log("回调：", info);
      if (info) {
        that.getAuthCallBack();
      };
    })
  },
  // 获取授权接口返回状态
  getAuthCallBack: function() {
    let that = this;
    app.utils.loading("授权中");
    timeOut = setInterval(function() {
      let token = wx.getStorageSync('token');
      if (token) {
        clearInterval(timeOut);
        app.utils.hideLoading();
        that.setData({
          token: token
        });
        that.checkUserInfo();
        that.getPageData();
      }
    }, 500);
  },
  //  清理数据
  clearPageData: function() {
    this.setData({
      token: '',
      userInfo: '',
      hasUserInfo: false,
      "countInfo.puzzleListNum": 0,
      "countInfo.visitHistoryNum": 0,
      "countInfo.UserLikesNum": 0
    });
  },
  // 检查userinfo数据
  checkUserInfo: function() {
    let userInfo = wx.getStorageSync('userInfo');
    if (!this.data.userInfo && !!userInfo) {
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true
      });
    };
  },
  // 请求页面数据
  getPageData: function() {
    this.getPuzzleList();
    this.getUserLikes();
    this.findVisitHistory();
  },
  // 页面初始化
  init: function() {
    let token = wx.getStorageSync('token');
    if (token) {
      this.setData({
        token: token
      });
      this.checkIsToken();
    } else {
      this.clearPageData();
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let lang = wx.getStorageSync("lang");
    if (!!lang && lang == "en") {
      this.setData({
        pickerIndex: 1
      })
    }else{
      this.setData({
        pickerIndex: 0
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.init();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }

})