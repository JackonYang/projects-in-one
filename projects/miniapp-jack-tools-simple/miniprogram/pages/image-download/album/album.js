// pages/album/album.js
// 模拟数据
// var mockdata = require('../../../models/mock');

//获取应用实例
const app = getApp();
// 定时器
let timeOut = null;

Page({
  videoDom: '', // 视频组件
  data: {
    albumID: null,
    token: null,
    albumInfo: {
      'headTitle': '下载的图片列表',
    }, //相册属性
    showAuthHintDialog: false,
    photoListData: [], //相册data
    photoListTotal: 0,
    layouImages: {
      top: '/assets/icon/top.png',
      select: '/assets/icon/select.png',
      selected: '/assets/icon/select-white.png',
      loadingUrl: '/assets/icon/photo.png',
      save: '/assets/icon/save.png',
    },
    localSrc: {
      noList: '/assets/img/no-pic.png'
    },
  },

  // 选中图片
  selectPic: function(e) {
    let index = e.currentTarget.dataset.current;
    console.log("选中图片:", index);
    this.setData({
      settingState: false
    });
    // this.openBigPic(index);
  },
  // 设置页面title
  setPageTitle: function() {
    let title = this.data.albumInfo.headTitle || "图片查看";
    wx.setNavigationBarTitle({
      title: title
    })
  },
  //  回到顶部
  onTop: function() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 500
    });
    app.sensors.track('AlbumClick', {
      album_wechatid: this.data.albumID,
      album_click: '回到顶部'
    });
  },
  // 返回首页
  goIndex: function() {
    wx.switchTab({
      url: '../index/index'
    });
    app.sensors.track('AlbumClick', {
      album_wechatid: this.data.albumID,
      album_click: '返回首页'
    });
  },

  // 保存图片到手机相册
  saveImageToPhoto: function() {
    this.data.photoListData.forEach(function (item, index) {
      let url = item;
      wx.downloadFile({
        url: url,
        success (res) {
          console.log(res);

          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          if (res.statusCode === 200) {
            let filePath = res.tempFilePath;
            wx.saveImageToPhotosAlbum({
              filePath: filePath,
              success: (res) => {
                console.log(`saved. ${url}`);
                // wx.showToast({
                //   title: '生成图片成功',
                //   icon: 'success',
                //   duration: 2000
                // })
              },
              fail: (err) => {
                console.log(`failed. ${url}`);
                console.log(err);
                // wx.showToast({
                //   title: '生成图片失败',
                //   icon: 'error',
                //   duration: 2000
                // })
              }
            })
          }
        }
      });
    });
  },

  //引导设置
  openAlbumAuth: function() {
    wx.showModal({
      content: '关闭相册权限获取会导致无法下载图片，去打开？',
      success: function(res) {
        if (res.confirm) {
          wx.openSetting({
            //打开微信设置
            success: function(res) {
              //获取设置状态
              wx.getSetting({
                success: function(res) {
                  if (res.authSetting['scope.writePhotosAlbum']) {
                    //查看用户设置的状态
                  }
                }
              })
            }
          })
        }
      }
    })
  },
  // 登录授权
  getUserInfoStatus: function() {
    let that = this;
    app.getLoginFun().then(function(info) {
      console.log("回调：", info)
      if (info) {
        that.getAuthCallBack();
      }
    })
  },
  // 获取授权接口返回状态
  getAuthCallBack: function() {
    let that = this;
    app.utils.loading("授权中");
    timeOut = setInterval(function() {
      let token = wx.getStorageSync('token');
      let uid = wx.getStorageSync('uid');
      if (token) {
        clearInterval(timeOut);
        wx.hideLoading();
        that.setData({
          token: token
        });
      }
    }, 500);
  },

  // 阻止滚动穿透
  stopScrollEvent: function() {
    // stop user scroll it!
  },

  // 获取相册信息
  getPhotoList: function() {
    let url = "getPhotoList";
    let params = {
      task_id: this.data.albumID,
    };
    app.request.requestRestGetApi(url, params, "PHOTO_LIST", this.successFun, this.failFun);
  },

  // 请求成功返回数据
  successFun: function(res, code) {
    var that = this;
    switch (code) {
      case "PHOTO_LIST":
        if (res.errno == 0) {
          let listArr = res.data.photos;
          let albumInfo = that.data.albumInfo;
          let photoListTotal = res.data.total;
          albumInfo['subHeadTitle'] = `共 ${photoListTotal} 张图`;
          that.setData({
            photoListData: listArr,
            photoListTotal: photoListTotal,
            albumInfo: albumInfo,
          });
        } else {
          app.utils.toast(res.message);
        }
        app.utils.hideLoading();
        wx.stopPullDownRefresh();
        break;
    }
  },
  // 页面初始化
  init: function() {
    app.utils.loading();
    this.getPhotoList();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("相册参数：", options);
    wx.hideShareMenu();
    // for debug
    // options = {
    //   albumID: '1',
    // }
    if (options.albumID) {
      this.setData({
        albumID: options.albumID
      });
      this.init();
    } else {
      app.utils.toast("呀，发生错误啦！");
      this.goIndex();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // 获取组件实例
    // this.albumLayer = this.selectComponent("#module-layer");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 每次切换页面 更新初始设置
    this.setData({
      token: wx.getStorageSync('token'),
    });
    console.log('token：', this.data.token);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
      console.log("PullDownRefresh trigged, but do nothing");
  },

  /**
   * 页面相关事件处理函数--用户滑动
   */
  onPageScroll: function(res) {
    // console.log(res.scrollTop);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(options) {
  //   return {
  //     title: title,
  //     path: path,
  //     imageUrl: imgUrl,
  //     success: function(res) {
  //       // 转发成功
  //       console.log("转发属性：", res)
  //     },
  //     fail: function(res) {
  //       // 转发失败
  //     }
  //   }
  }
})