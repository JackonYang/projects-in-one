// pages/myMaking/myMaking.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reloadState: false,
    imageList: [],
    pageIndex: 1,
    pageTotal: 20
  },
  //请求拼图列表
  getPuzzleList: function () {
    let url = 'getUserMergePhotosModel',
      params = {
        weChatId: 1,
        pageSize: 20,
        pageNumber: 1
      }
    if (this.data.reloadState) {
      app.utils.loading("加载中...");      
      params.pageNumber = 1;
      app.request.requestPostApi(url, params, 'PUZZLE_LIST', this.successFUN, this.failFUN);
    } else {
      if (this.data.imageList.length < this.data.pageTotal) {
        app.utils.loading("加载中...");        
        params.pageNumber = this.data.pageIndex++;
        app.request.requestPostApi(url, params, 'PUZZLE_LIST', this.successFUN, this.failFUN);
      } else {
        wx.hideLoading();
      }
    }
  },
  //打开大图
  openBigPic: function (options) {
    let index = options.currentTarget.dataset.current;
    let currentInfo = this.data.imageList[index]
    // app.pageBetweenData.currentMergeInfo = currentInfo;
    // app.utils.go("myMaking/single");
    wx.previewImage({
      current: currentInfo.url, // 当前显示图片的http链接
      urls: [currentInfo.url] // 需要预览的图片http链接列表
    })
  },
  successFUN: function (res, code) {
    let that = this;
    switch (code) {
      case 'PUZZLE_LIST':
        if (res.code == 0) {
          let ListArr = [];
          if (that.data.reloadState) {
            ListArr = res.data.photoList;
            that.setData({ pageIndex: 2 })
          } else {
            ListArr = that.data.imageList.concat(res.data.photoList);
          };
          that.setData({
            imageList: ListArr,
            reloadState: false,
            pageTotal: res.data.count
          });
        }
        wx.hideLoading(); 
        wx.stopPullDownRefresh();       
        break;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPuzzleList();
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
    this.setData({
      reloadState: true
    });
    this.getPuzzleList();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getPuzzleList();
  }
})