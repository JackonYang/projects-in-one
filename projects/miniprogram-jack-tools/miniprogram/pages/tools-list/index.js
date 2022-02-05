// index.js
// const app = getApp()
const { envList } = require('../../envList.js');

Page({
  data: {
    showUploadTip: false,
    powerList: [
      {
        title: '我的常用组合',
        tip: '高级工具',
        showItem: true,
        item: [
          {
            title: '文章图片一键合成视频',
            page: 'getOpenId'
          },
        ],
      },
      {
        title: '图片处理',
        tip: '批量下载 / 视频合成等',
        showItem: false,
        item: [
          {
            title: '图片批量下载',
            page: 'getOpenId'
          },
          {
            title: '视频合成',
            page: 'getMiniProgramCode'
          },
        ],
      }, 
    ],
    envList,
    selectedEnv: envList[0],
    haveCreateCollection: false
  },

  onClickPowerInfo(e) {
    const index = e.currentTarget.dataset.index;
    const powerList = this.data.powerList;
    powerList[index].showItem = !powerList[index].showItem;

    this.setData({
      powerList
    });
  },

  onChangeShowEnvChoose() {
    wx.showActionSheet({
      itemList: this.data.envList.map(i => i.alias),
      success: (res) => {
        this.onChangeSelectedEnv(res.tapIndex);
      },
      fail (res) {
        console.log(res.errMsg);
      }
    });
  },

  onChangeSelectedEnv(index) {
    if (this.data.selectedEnv.envId === this.data.envList[index].envId) {
      return;
    }
    const powerList = this.data.powerList;
    powerList.forEach(i => {
      i.showItem = false;
    });
    this.setData({
      selectedEnv: this.data.envList[index],
      powerList,
      haveCreateCollection: false
    });
  },

  jumpPage(e) {
    wx.navigateTo({
      url: `/pages/${e.currentTarget.dataset.page}/index?envId=${this.data.selectedEnv.envId}`,
    });
  },

});
