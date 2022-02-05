// pages/picShare/pic.js
//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    currentAlbumId: '',
    currentPhotoId: '',
    photoUrl: ''
  },
  // 去当前照片相册
  goCurrentAlbum: function () {
    let that = this;
    wx.navigateTo({
      url: '../album/album?albumID=' + that.data.currentAlbumId,
    })
  },
  // 跳转首页
  goIndex: function () {
    wx.switchTab({
      url: '../index/index',
    })
  },
  // 获取照片信息
  getPhotoUrl: function () {
    let url = "getPhotoUrlModel";
    // 该版本不传
    // let uid = wx.getStorageSync('uid');
    let params = {
      photoId: this.data.currentPhotoId,
      photoSizeType: 6,
      // uId: uid
    };
    app.request.requestPostApi(url, params, this, this.successPhotoUrl, this.failFun);
  },
  successPhotoUrl: function (res, source) {
    if (res.code == 0) {
      // console.log(res);
      // this.LoadComplete();
      source.setData({
        photoUrl: res.data.smallUrl,
        loading: true
      });
    }
  },
  // 图片加载完成
  LoadComplete: function (e) {
    // console.log("4");
    wx.hideLoading();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("分享属性",options);
    this.setData({
      currentAlbumId: options.albumID,
      currentPhotoId: options.photoId
    });
    this.getPhotoUrl();
    app.utils.loading("加载中...");

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