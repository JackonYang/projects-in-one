// pages/myLook/myLook.js
var app = getApp();
Page({
  data: {
    imgInfo: {
      mode: 'aspectFill',
      load: true
    },
    currentTab: 0,
    historyList: [],
    reloadState: false,
    // 下拉刷新状态
    historyState: false,
    QRcodeState: false,
    // 请求页码
    historyIndex: 0,
    QRcodeIndex: 0,
    // 列表最大总数
    htyTotalCount: 10,
    //触底加载状态(解决接口返回慢不停加载问题 )
    reachBtmState: true,
    // 是否为空空如也
    lookState: true,
    source: 2003
  },
  // 跳转相册
  goCurrentAlbum: function(e) {
    let albumID = e.currentTarget.dataset.wechatid;
    app.sensors.track('HistoryClick', {
      album_wechatid: albumID
    });
    if (this.data.currentTab == 0){
      this.setData({ source: 2011 });
    }else{
      this.setData({ source: 2003 });
    }
    wx.navigateTo({
      url: '../album/album?albumID=' + albumID + '&source=' + this.data.source
    })
  },
  // 根据id获取当前数据
  findCurrentData: function(id) {
    let data = '',
      albumList = [];
    albumList = this.data.historyList
    for (let item of albumList) {
      if (item.wechatMd5 == id) {
        data = item;
      }
    };
    return data
  },
  // 切换顶部nav
  swichNav: function(e) {
    let index = e.currentTarget.dataset.current;
    if (index == this.data.currentTab) {
      return false;
    } else {
      this.setData({
        currentTab: index,
        reloadState: true
      });
      this.findRecords();
    };
  },
  // 获取历史记录
  findRecords: function() {
    app.utils.loading();
    let index = this.data.currentTab;
    let url = "findVisitHistoryByPageModel",
      params = {
        pageIndex: 0,
        pageSize: 10
      },
      message = "";
    if (index == 1) {
      params.sourceFromType = "NO_QR_CODE";
      message = "History_LIST";
    } else {
      params.sourceFromType = "QR_CODE";
      message = "QRcode_LIST";
    }
    if (this.data.reloadState) {
      params.pageIndex = 0;
      app.request.requestPostApi(url, params, message, this.successFun, this.failFun);
    } else {
      this.setData({
        reachBtmState: false
      })
      let totalCount = this.data.htyTotalCount;
      if (this.data.historyList.length < totalCount) {
        params.pageIndex = this.data.historyIndex++;
        app.request.requestPostApi(url, params, message, this.successFun, this.failFun);
      }else{
        app.utils.hideLoading();  
      }
    }
  },
  // 接口返回
  backResult: function(prama) {
    let that = this,
      state = null,
      ListArr = [];
    if (prama.code == 0) {
      let htyData = prama.data.records;
      if (that.data.reloadState) {
        // 下拉重置
        that.setData({
          historyIndex: 1,
        });
        ListArr = htyData;
      } else {
        ListArr = that.data.historyList.concat(htyData);
      };
      let hisData = app.utils.clearHeadString(ListArr);
      state = ListArr.length > 0;
      that.setData({
        lookState: state,
        historyList: hisData,
        reloadState: false,
        htyTotalCount: prama.data.totalCount,
        reachBtmState: true
      })
    }
    app.utils.hideLoading();    
    wx.stopPullDownRefresh();
    console.log("History_LIST:", that.data.historyList);
  },

  // 接口返回数据
  successFun: function(res, code) {
    switch (code) {
      case "History_LIST":
        this.backResult(res);
        break;
      case "QRcode_LIST":
        this.backResult(res);
        break;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.findRecords();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // this.findRecords();
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
    let index = this.data.currentTab;
    this.setData({
      reloadState: true
    })
    this.findRecords();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.reachBtmState) {
      console.log("加载了加载了")
      this.findRecords();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})