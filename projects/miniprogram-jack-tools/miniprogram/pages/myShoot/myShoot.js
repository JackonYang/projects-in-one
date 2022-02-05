// pages/myShoot/myShoot.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    galleryInfo:[
      {
        type:0,
        id:"22231",
        place:"上海", 
        time:"2018-4-15 08:00",
        code:100101010,
        status:"待沟通",
        url:"../../assets/test/default.png"
      },
      {
        type:1,
        id:"112345455",
        name:"2018美丽时尚红毯直击",
        code:20012023,
        status:"待拍摄",
        url:"../../assets/test/plan.png"
      },
      {
        type:2,
        name: "2018美丽时尚红毯直击222",
        viewNum:"122万",
        time:"2018.04.11",
        url:"http://img.vphotos.cn/DC69F776EBFD876626B43ED4164E30F0/postp/logodouble/vbox7225__12I2488_192718_small.JPG"
      },
      {
        type:3,
        name: "2018美丽时尚红毯直击333",
        viewNum:"210万",
        time:"2018.01.12",
        url:"http://img.vphotos.cn/DC69F776EBFD876626B43ED4164E30F0/postp/logodouble/vbox7225__12I2488_192718_small.JPG"
      },
      {
        type: 2,
        name: "2018美丽时尚红毯直击222",
        viewNum: "122万",
        time: "2018.04.11",
        url: "http://img.vphotos.cn/DC69F776EBFD876626B43ED4164E30F0/postp/logodouble/vbox7225__12I2488_192718_small.JPG"
      }
    ]
  },
  goSubscribing:function(e){
    console.log(e);
    wx.navigateTo({
      url: '../subscribing/subscribing?albumId=',
    })
  },
  goDetails:function(e){
    console.log(e);
    wx.navigateTo({
      url: '../details/details',
    })
  },
  ttt:function(e){
    console.log(e);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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