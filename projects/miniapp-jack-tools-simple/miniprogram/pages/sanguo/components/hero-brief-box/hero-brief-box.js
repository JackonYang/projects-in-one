// pages/sanguo/components/hero-brief-box/hero-brief-box.js
Component({
  /**
   * Component properties
   */
  properties: {
    heroInfo: Object,
    orderIndex: Number,
  },

  /**
   * Component initial data
   */
  data: {
    keyNames: {
      'skill1': '技能一',
      'skill2': '技能二',
    }
  },

  /**
   * Component methods
   */
  methods: {
    tapSkill: function(e) {
      var that = this;
      let key = e.currentTarget.dataset.key;
      let keyName = that.data.keyNames[key];

      wx.showModal({
        title: keyName,
        content: that.properties.heroInfo[key],
      })

    },
  }
})
