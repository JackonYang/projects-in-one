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
    picList: []
  },
  // 跳转投图详情页
  goDetails: function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../choiceness/details?id=' + id
    });
  },
  // 请求精彩图片
  getWonderPic: function () {
    app.utils.loading();
    let url = 'getAllColumnContentsModel',
      params = {
        columnCode: 'weapp',
        pageIndex: 0,
        pageSize: 10
      };
    if (this.data.reloadState){
      params.pageIndex = 0;
    }else{
      params.pageIndex = this.data.PageIndex++;
    }
    app.request.requestPostApi(url, params, "CHOICE_LIST", this.successFun, this.failFun);
  },
  // 请求成功返回数据
  successFun: function (res, code) {
    var that = this;
    switch (code) {
      case "CHOICE_LIST":
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
          console.log("CHOICE_LIST:", res.data.pageData);
        }else{
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWonderPic();
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
    let title = "投图列表",
        path = "pages/choiceness/index",
        imgUrl = '';
    return {
      title: title,
      path: path,
      imageUrl: imgUrl,
      success: function (res) {
        // 转发成功
        console.log("转发成功 => ", "投图列表");
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})