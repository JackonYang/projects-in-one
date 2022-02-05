// pages/myMaking/single.js
const app = getApp();

Page({
  data: {
    currentInfo: '',
    isFull: false
  },
  // 返回上一页
  goBack: function () {
    app.utils.back();
  },
  // 缩放弹层
  openBig: function () {
    let url = this.data.currentInfo.url;
    wx.previewImage({
      current: url,
      urls: [url]
    })
  },
  // 等待加载
  waitLoading: function(e){
    let info = e.detail ;
    this.setCenter(info);
  },
  // 图片居中展示
  setCenter: function (info) {
    // 解决是否超屏或居中
    let system = app.globalData.systemInfo,
      scale = system.windowWidth / info.width,
      scaleY = info.height * scale;
    this.setData({
      isFull: scaleY > system.windowHeight
    });
    app.utils.hideLoading();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.utils.loading();
    this.setData({
      currentInfo: app.pageBetweenData.currentMergeInfo
    })
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
  
  }
})