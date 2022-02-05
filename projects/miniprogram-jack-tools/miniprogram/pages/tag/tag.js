// pages/tag/tag.js

//获取应用实例
const app = getApp()

Page({
  data: {
    tagInfo: {
      title: "选择你感兴趣的内容",
    },
    tagList: [
      { value: "滑雪", name: "hx", checked: false },
      { value: "视频", name: "sp", checked: false },
      { value: "体育", name: "ty", checked: true },
      { value: "会务", name: "hw", checked: false },
      { value: "派对", name: "pd", checked: true },
      { value: "娱乐演出", name: "ylyc", checked: true },
      { value: "年会", name: "nh", checked: false },
      { value: "商务", name: "sw", checked: false },
      { value: "婚礼", name: "hl", checked: false },
      { value: "旅游", name: "ly", checked: true }
    ],
    numberList: [1, 2, 3, 4, 5, 6]
  },
  // 跳转到index页面
  // tabbar必须使用 wx.switchTab
  goIndex: function () {
    this.getSelectedTag();
    wx.setStorageSync("isNewUser", 2);
    wx.switchTab({
      url: '../index/index'
    })
  },
  // 选择标签
  checkList: function (e) {
    let index = e.currentTarget.id;
    console.log(index);
    console.log(this.data.tagList[index]);
    let item = this.data.tagList[index];
    let state = !item.checked;
    this.setData({
      ['tagList[' + index + '].checked']: state
    });
  },
  // 获取选中的标签
  getSelectedTag: function () {
    let arr = this.data.tagList;
    let selectArr = [];
    for (var item of arr) {
      if (item.checked) {
        selectArr.push(item.name);
      }
    }
    console.log(selectArr);
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
  onHnamee: function () {
  
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