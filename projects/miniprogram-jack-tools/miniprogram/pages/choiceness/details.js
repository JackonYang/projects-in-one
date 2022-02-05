// pages/choiceness/details.js
//获取应用实例
const app = getApp();

Page({
  data: {
    imgInfo: {
      mode: 'scaleToFill',
      load: true
    },
    currentID: null,
    dataInfo: '',
    coverInfo: '',
    authUrl: '../../assets/icon/auth.png'    
  },
  //进入对应相册
  goAlbum: function () {
    let albumID = this.data.dataInfo.keyWord;
    if (albumID) {
      wx.navigateTo({
        url: '../album/album?albumID=' + albumID + '&source=2004'
      })
    }
  },
  //请求精彩图片内容
  getWonderPic: function () {
    let url = 'findColumnContentModel',
      params = {
        id: this.data.currentID
      }
    app.request.requestPostApi(url, params, "PIC_DETAILS", this.successFun, this.failFun);
  },
  // 请求相册封面信息
  getCoverInfo: function (keyWord) {
    let url = "findCoverInfoModel";
    let params = {
      weChatId: keyWord,
      photoSizeType: 4
    };
    app.request.requestPostApi(url, params, "COVER_INFO", this.successFun, this.failFun);
  },  
  // 数据处理
  findCurrentData: function (data) {
    let pattern = /^[A-Za-z0-9]{32}$/;
    let curData = data;
    let names = curData.summary.replace(/\s+/, "").split("#");
    curData.photographer = names[0];
    curData.digital = names[1];
    if (pattern.test(curData.keyWord)) {
      curData.isKeyWord = true;
      this.getCoverInfo(curData.keyWord);
    } else {
      curData.keyWord = '';
      curData.isKeyWord = false;
    };
    this.setData({ dataInfo: curData });
    this.statisticsData();
    console.log("PIC_DETAILS:", curData);
  },
  // 请求成功返回数据
  successFun: function (res, code) {
    var that = this;
    switch (code) {
      case "PIC_DETAILS":
        if(res.code == 0){
          that.findCurrentData(res.data);
        }
        break;
      case "COVER_INFO":
        if (res.code == 0) {
          let info = res.data;
          info.headTitle = app.utils.clearHeadString(info.headTitle);
          that.setData({ coverInfo: info });
          console.log("COVER_INFO:", res.data);
        }else{
          that.setData({ 'dataInfo.isKeyWord': false });
        }
        break;
    }
  },
  // 请求失败返回数据
  failFun: function (res, code) {

  },
  // 数据统计
  statisticsData: function(){
    let info = this.data.dataInfo;
    app.sensors.track('BannerClick', { banner_id: info.id, banner_sort: 0, banner_name: info.columnName, banner_heat: info.viewNum });
  },
  // 页面初始化
  init: function(){
    this.getWonderPic();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ currentID: options.id})
    this.init();
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
    var title = '', path = '', imgUrl = '';
    title = "投图详情-" + this.data.dataInfo.name;
    path = "/pages/choiceness/details?id=" + this.data.currentID;
    imgUrl = this.data.dataInfo.thumbnailUrl;
    return {
      title: title,
      path: path,
      imageUrl: imgUrl,
      success: function (res) {
        // 转发成功
        app.sensors.track('SharePage', { share_page: '投图' });
        console.log("转发属性：", res)
      },
      fail: function (res) {
        // 转发失败
      }
    }  
  }
})