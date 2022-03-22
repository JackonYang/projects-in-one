/* 待办列表首页 */

Page({
  // 存储请求结果
  data: {
    navList: [
      {
        'key': 'mp-tools',
        'groupName': '公众号工具',
        'items': [
          {
            'title': '图片批量下载',
            'desc': '批量保存公众号文章中的图片到手机相册',
            'url': '/pages/image-download/input/input',
          },
          {
            'title': '图片集 -> 文章',
            'desc': '即将上线',
            'url': '',
          },
        ]
      },
      {
        'key': 'game-sanguo',
        'groupName': '游戏--三国志·战略版',
        'items': [
          {
            'title': '三国志配将表',
            'desc': '起飞了 🛫️',
            'url': '/pages/sanguo/heroTeams/heroTeams',
          },
        ]
      },
    ],
  },

  onShow() {
  },

  // 跳转响应函数
  goToPage(e) {
    let url = e.currentTarget.dataset.url;
    console.log('url: ', url);
    if (url) {
      wx.navigateTo({
        url,
      });
    } else {
      wx.showModal({
        content: '该功能尚未发布，请耐心等待',
        success: function(res) {},
      });
    }
  },


})