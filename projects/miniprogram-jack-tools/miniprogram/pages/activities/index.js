// pages/choiceness/index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    imgInfo: {
      mode: 'aspectFill',
      load: true
    },
    isShowMore: '',
    reloadState: false,
    PageIndex: 0,
    PageTotal: 10,
    picList: [],
    curCode: '',
    curTitle: '热门活动'
  },
  // 跳转详情页
  goDetails: function (e) {
    let id = e.currentTarget.dataset.id;
    let code = this.data.curCode;
    wx.navigateTo({
      url: '../activities/details?id=' + id + '&code=' + code
    });
  },
  // 列表
  getWonderPic: function (code) {
    app.utils.loading();
    let url = 'getAllColumnContentsModel',
      params = {
        columnCode: this.data.curCode,
        pageIndex: 0,
        pageSize: 10
      };
    if (this.data.reloadState) {
      params.pageIndex = 0;
    } else {
      params.pageIndex = this.data.PageIndex++;
    }
    app.request.requestPostApi(url, params, "ACTIVE_LIST", this.successFun, this.failFun);
  },
  // 设置页面title
  setPageTitle: function (str) {
    let title = this.data.curTitle;
    wx.setNavigationBarTitle({
      title: title
    })
  },
  // 请求成功返回数据
  successFun: function (res, code) {
    var that = this;
    switch (code) {
      case "ACTIVE_LIST":
        if (res.code == 0) {
          let ListArr = [], showMore = '';
          if (that.data.reloadState) {
            ListArr = res.data.pageData;
          } else {
            ListArr = that.data.picList.concat(res.data.pageData);
          };
          if (ListArr.length < res.data.totalElements && res.data.totalElements > 10) {
            showMore = "上拉加载更多";
          } else {
            showMore = "没有更多啦";
          };
          that.setData({
            picList: ListArr,
            PageTotal: res.data.totalElements,
            isShowMore: showMore
          });
          console.log("ACTIVE_LIST:", res.data.pageData);
        } else {
          app.utils.toast("出错啦，请再试一次");
        };
        app.utils.hideLoading();
        wx.stopPullDownRefresh();
        break;
    }
  },
  // 请求失败返回数据
  failFun: function (res, code) {

  },
  // 页面初始化
  init: function (code,title) {
    this.setData({ 
      curCode: code,
      curTitle: title 
    });
    this.setPageTitle();
    this.getWonderPic();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init(options.code, options.title);
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
    this.setData({ reloadState: true });
    this.getWonderPic();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.picList.length < this.data.PageTotal) {
      this.getWonderPic();
    };
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let title = this.data.curTitle,
        path = "pages/activities/index" + '?code=' + this.data.curCode + '&title=' + this.data.curTitle,
        imgUrl = '';
    return {
      title: title,
      path: path,
      imageUrl: imgUrl,
      success: function (res) {
        // 转发成功
        console.log("转发成功 => ", "热门列表");
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})