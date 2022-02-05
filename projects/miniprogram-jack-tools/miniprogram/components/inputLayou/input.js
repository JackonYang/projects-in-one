// components/inputLayou/input.js
const app = getApp();
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
    userTexts: '',
    isFocus: false,
    hideStatus: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    show: function(str) {
      this.setData({
        userTexts: str,
        isFocus: true,
        hideStatus: false
      });
    },
    // 取消
    cancel: function() {
      this.setData({
        isFocus: false,
        hideStatus: true
      });
    },
    // 完成
    finish: function() {
      this.setData({
        isFocus: false,
        hideStatus: true
      });
      this.triggerEvent('textevent', {
        text: this.data.userTexts
      });
    },
    // 自定义文字
    userDefined: function(e) {
      this.setData({
        userTexts: e.detail.value
      });
    },
    // 换一句
    switchText: function () {
      let url = "findQuotationModel";
      let params = {};
      app.request.requestPostApi(url, params, this, this.switchTextFun, this.failFun);
    },
    switchTextFun: function (res, source){
      if(res.code == 0){
        source.setData({
          userTexts: res.data.quotation
        });
      }
    },
    // 清除文字
    clearText: function(){
      this.setData({
        userTexts: ''
      });      
    }

  }
})