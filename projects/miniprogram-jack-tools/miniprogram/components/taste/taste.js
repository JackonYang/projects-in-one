// components/taste/taste.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    showState: true,
    imgInfo: {
      mode: 'scaleToFill',
      load: true
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    show: function () {
      this.setData({showState: true});
    },
    close: function () {
      this.setData({showState: false});
    },
    goSubscribe: function(){
      wx.switchTab({
        url: '../order/order'
      })
    }
  }
})
