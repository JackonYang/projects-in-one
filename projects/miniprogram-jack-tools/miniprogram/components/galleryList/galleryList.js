// pages/component/galleryList/gallery.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    galleryInfo:{
      type: Array,
      value: []
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    mode: 'widthFix',
    load: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap:function(){
      this.triggerEvent(' ');
    }
  }
})
