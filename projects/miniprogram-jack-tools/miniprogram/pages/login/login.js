//获取应用实例
const app = getApp();

Page({
  data: {
    authInfo: null,
    token: '',
    title: '正在获取数据中，请耐心等待',
    loadingSrc: '../../assets/img/bg.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfoStatus();
  },
  // 请求userinfo
  getUserInfoStatus: function(){
    let that = this;
    app.getLoginFun().then(function (info) {
      console.log("回调：", info)
      if (info) {
        that.checkIsToken();
      }else{
        that.checkIsNewUser();
      }
    })
  },
  // 获取基础授权
  getUserToken: function () {
    let login = app.globalData.loginData;
    let url = "authByJsCodeModel";
    let params = {
      code: login.code
    };
    app.request.requestPostApi(url, params, "AUTH_CODE", this.successFun, this.failFun);
  },
  // 用户信息授权
  getUserTication: function () {
    let auth = app.globalData.encryptInfo;
    let url = "authenticationModel";
    let params = {
      sessionKey: this.data.authInfo.sessionKey,
      encryptedData: auth.encryptedData,
      ivStr: auth.iv
    };
    app.request.requestPostApi(url, params, "AUTH_TICATION", this.successFun, this.failFun);
  },
  // setStorage and check
  setStorageFun: function (data) {
    wx.setStorageSync("token", data.token);
    wx.setStorageSync("authInfo", data);
    this.writeUserInfo(2);
    this.checkIsNewUser();
  },
  // 检查是否为新用户
  checkIsNewUser: function () {
    let isInfo = wx.getStorageSync("isNewUser");
    if (isInfo == 1) {
      wx.reLaunch({
        url: '../tag/tag'
      })
    }else{
      // wx.reLaunch({
      //   url: '../album/album?albumID=1C0E9CAEF9F4284701EC2694953E0F57'
      // })      
      wx.switchTab({
        url: '../index/index'
      });
    }
  },
  // 判断token是否过期
  checkIsToken: function () {
    let token = wx.getStorageSync('token');
    if (!!token) {
      const arr = app.dates.formatDayArray(0);
      let url = "healthCheckModel";
      let params = {};
      app.request.requestPostApi(url, params, "CHECK_TOKEN", this.successFun, this.failFun);
    } else {
      this.getUserToken();
    }
  },
  // 获取用户后台是否新用户数据，写入localstorage
  writeUserInfo: function (arg) {
    if (!arg) arg = 1;
    wx.setStorageSync("isNewUser", arg);
  },
  // 接口调用成功数据集合
  successFun: function (res, code) {
    var that = this;
    switch (code) {
      case "AUTH_CODE":
        if (res.code == 0) {
          that.setData({
            authInfo: res.data
          });
          if (!!res.data.unionId) {
            that.setStorageFun(res.data);
            console.log("AUTH_CODE:", res.data);
          } else {
            that.getUserTication();
          }
        } else {
          console.log("AUTH_CODE:", res.code, res.message);
        }
        break;
      case "AUTH_TICATION":
        if (res.code == 0) {
          that.setStorageFun(res.data);
        } else {
          console.log("AUTH_TICATION:", res.code, res.message);
        };
        break;
      case "CHECK_TOKEN":
        if (res.code == 1001) {
          that.getUserToken();
        } else {
          that.checkIsNewUser();
        };
        break;
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})