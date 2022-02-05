// pages/findFace/findSuccess.js
const app = getApp();

Page({
  data: {
    imgUrl: {
      noFind: "../../assets/img/no-find.png",
      more: "../../assets/img/more.png",
    },
    albumID: '',
    searchResult: '',
    searchCount: 0,
    listUrl: '',
    notFound: false,
    errorMore: false
  },
  // 查看大图
  openImage: function (e) {
    let index = e.currentTarget.dataset.current;
    let url = this.data.searchResult[index].smallUrl;
    wx.previewImage({
      current: url,
      urls: this.data.listUrl
    })
  },
  // 筛选数组
  filtrateList: function (arr) {
    let newArr = [];
    arr.map(function (item) {
      newArr.push(item.smallUrl);
    });
    this.setData({ listUrl: newArr });
  },
  // 再试一次
  backFindFace: function () {
    app.utils.to("findFace/findFace", "albumID=" + this.data.albumID);
  },
  // 返回相册
  backAlbum: function () {
    app.utils.back();
  },
  // 识别结果
  init: function () {
    let ErrorCode = [4004, 4005, 4006, 4007, 4009];
    let data = app.pageBetweenData.FindFaceInfo;
    if (typeof (data) != "object"){
      data = JSON.parse(data);
    };
    if (data.code == 4008) {
      // 人物太多
      this.setData({ errorMore: true });
    };
    if (ErrorCode.includes(data.code)) {
      // 没有数据
      this.setData({ notFound: true });
    };    
    if (data.code == 0) {
      let list = data.data;
      this.setData({
        searchResult: list,
        searchCount: list.length
      });
      this.filtrateList(data.data);
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ albumID: options.albumID });
    this.init();
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