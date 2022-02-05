// pages/choiceness/details.js
//获取应用实例
const app = getApp();

Page({
  data: {
    currentID: null,
    currentCode: null,
    dataInfo: ''
  },
  //请求精彩图片
  getWonderPic: function () {
    let url = 'getAllColumnContentsModel',
      params = {
        columnCode: this.data.currentCode,
        pageIndex: 0,
        pageSize: 10
      }
    app.request.requestPostApi(url, params, "PIC_DETAILS", this.successFun, this.failFun);
  },
  // 根据id获取当前数据
  findCurrentData: function (arr) {
    let pattern = /^[A-Za-z0-9]{32}$/;
    for (let item of arr) {
      if (item.id == this.data.currentID) {
        this.setData({ dataInfo: item });
        console.log("PIC_DETAILS:", item);
      }
    };
  },
  // 请求成功返回数据
  successFun: function (res, code) {
    var that = this;
    switch (code) {
      case "PIC_DETAILS":
        if (res.code == 0) {
          that.findCurrentData(res.data.pageData);
        }
        break;
    }
  },
  // 请求失败返回数据
  failFun: function (res, code) {

  },
  // 页面初始化
  init: function (id, code) {
    this.setData({
      currentID: id,
      currentCode: code
    });
    this.getWonderPic();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init(options.id, options.code);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获取组件实例
    this.taste = this.selectComponent("#taste-dialog");
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
    let title = '', path = '', imgUrl = '';
    let curID = this.data.currentID;
    let curCode = this.data.currentCode;
    title = this.data.dataInfo.name;
    path = "/pages/activities/details?id=" + curID + '&code=' + curCode;
    imgUrl = this.data.dataInfo.thumbnailUrl;
    return {
      title: title,
      path: path,
      imageUrl: imgUrl,
      success: function (res) {
        // 转发成功
        console.log("转发属性：", res)
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})