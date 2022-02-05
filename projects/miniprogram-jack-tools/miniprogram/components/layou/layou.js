// components/layou/layou.js
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
    shwoStatus: true
  },
  /**
   * 组件布局完
   */
  ready: function () {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    show: function () {
      this.setData({ shwoStatus: true });
    },
    close: function(str){
      console.log(str);
      this.setData({ shwoStatus: false});
    }
  }
})
