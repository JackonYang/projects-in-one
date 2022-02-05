// components/password/index.js
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
    Length: 4,        //输入框个数
    isFocus: false,    //聚焦
    Value: "",        //输入的内容
    ispassword: false, //是否密文显示 true为密文， false为明文。
    isApply: false, // 是否输入完成
    showState: false
  },
  /**
   * 组件的方法列表
   */
  methods: {
    show: function () {
      this.setData({ 
        showState: true,
        isFocus: true
      });
    },
    close: function () {
      this.setData({ 
        showState: false,
        isFocus: false
      });
    },
    readNumber: function (e) {
      let num = e.detail.value;
      this.setData({
        Value: num,
        isApply: num.length == 4
      });
    },
    getFocus: function () {
      this.setData({
        isFocus: true,
      })
    },
    submit: function() {
      let text = this.data.Value;
      if (text.length == 4){
        this.triggerEvent('textevent', {
          text: text
        });
      }
    }
  }
})
