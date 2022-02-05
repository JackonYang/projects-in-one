// pages/myLike/myLike.js
// var mockdata = require('../../utils/mock');
var app = getApp();
Page({
  data: {
    wechatId: '1',
    imageList: [],
    copyImageList: [], // 初始数据（克隆一份）
    puzzlePushData: [], //拼图数据
    mergeList: [], // 拼图url
    hasInfo: true,
    popupCurInfo: [],
    popupInfo: {
      switchState: false,
      picInfoState: false,
      mode: 'aspectFit',
      current: 0
    },
    layouImages: {
      selected: '/assets/icon/select-white.png',
      loadingUrl: '../../assets/icon/photo.png'
    },
    puzzleState: false,
    puzzleCount: 0,
    PageTotal: 20,
    likePageNumber: 1,
    mergeLoading: false,
    reloadState: false
  },

  //打开大图或拼图
  openBigPic: function(e) {
    let index = e.currentTarget.dataset.current;
    if (!this.data.puzzleState) {
      let index = e.currentTarget.dataset.current;
      let data = this.data.imageList[index];
      this.setData({
        popupCurInfo: data,
        'popupInfo.current': index,
        'popupInfo.switchState': true
      });
    } else {
      let data = this.data.imageList;
      let puzzle = this.data.puzzlePushData;
      let count = this.data.puzzleCount;
      if (data[index].selected) {
        --count;
        let cur = puzzle.indexOf(data[index].photoId);
        puzzle.splice(cur, 1);
        data[index].selected = !data[index].selected;
        this.setData({
          imageList: data,
          puzzleCount: count,
          puzzlePushData: puzzle
        })
      } else {
        if (count < 10) {
          ++count;
          puzzle.push(data[index].photoId);
          data[index].selected = !data[index].selected;
          this.setData({
            imageList: data,
            puzzleCount: count,
            puzzlePushData: puzzle
          })
        } else {
          app.utils.toast("最大可选10张");
        }
      }
    }
  },
  goMerge: function() {

  },
  //打开缩放
  openScale: function() {
    let currentInfo = this.data.popupCurInfo,
      imgList = this.data.copyImageList,
      urlList = [];
    console.log(currentInfo);
    console.log(imgList);
    imgList.forEach(function(val, index) {
      urlList.push(val.smallUrl);
    })
    wx.previewImage({
      current: currentInfo.smallUrl,
      urls: [currentInfo.smallUrl]
    })
  },
  //去对应相册
  goAlbum: function() {
    let that = this;
    wx.navigateTo({
      url: '../album/album?albumID=' + that.data.popupCurInfo.wechatMd5,
    })
  },
  // 打开图片元信息
  openPicInfo: function() {
    let state = this.data.popupInfo.picInfoState;
    if (!state) {
      this.getPhotoMeta();
    }
    this.setData({
      'popupInfo.picInfoState': !state
    });
    app.sensors.track('PictureClick', { album_wechatid: this.data.popupCurInfo.wechatMd5, picture_click: "信息" });
  },
  //大图滑动
  bindSlideChange: function(e) {
    // console.log("大图", e);
    let index = e.detail.current;
    let data = this.data.imageList[index];
    // this.getAnalysePhotos(data);
    // "touch" 表示用户滑动引起的变化
    if (e.detail.source == "touch") {
      this.setData({
        popupCurInfo: data,
        'popupInfo.current': index
      });
    }
  },
  // 请求图元信息
  getPhotoMeta: function() {
    let wechatMd5 = this.data.popupCurInfo.wechatMd5;
    let photoName = this.data.popupCurInfo.photoName;
    let url = "getPhotoMetaDetailModel";
    let params = {
      weChatId: wechatMd5,
      photoName: photoName
    };
    app.request.requestPostApi(url, params, "PHOTO_META", this.successFun, this.failFun);
  },
  // 关闭大图弹窗
  closePopup: function() {
    this.setData({
      'popupInfo.switchState': false
    });
  },
  //保存图片
  userSave: function() {
    let data = this.data.popupCurInfo;
    app.utils.download(data.downloadSmallUrl);
    app.sensors.track('PictureClick', { album_wechatid: this.data.popupCurInfo.wechatMd5, picture_click: "分享" });
  },
  // 拼图模式
  switchPuzzle: function() {
    this.getPuzzleData();
    this.setData({
      puzzleState: true
    });
  },
  // 关闭拼图
  closePuzzle: function() {
    let data = this.data.copyImageList;
    this.setData({
      puzzleState: false,
      puzzleCount: 0,
      imageList: data,
      puzzlePushData: []
    });
  },
  // 增加拼图参数
  getPuzzleData: function() {
    let data = this.data.imageList;
    data.map(function(item) {
      item.selected = false;
    });
    this.setData({
      imageList: data
    });
  },
  // 开始拼图
  goPuzzleFun: function() {
    let puzzle = this.data.imageList;
    let list = [],
      imgUrlList = [];
    puzzle.map(function(item, index) {
      let obj = {};
      if (item.selected) {
        obj.photoId = item.photoId;
        obj.index = ++index;
        list.push(obj);
        imgUrlList.push(item);
      }
    });
    this.setData({
      mergeList: imgUrlList
    })
    if (list.length > 1) {
      wx.navigateTo({
        url: '../merge/merge?type=user&&way=myLike'
      })
      this.mergeLoadFun();
    } else {
      app.utils.toast("请选择至少两张图片");
    }

  },
  // 拼图loading
  mergeLoadFun: function() {
    let data = this.data.copyImageList;
    this.setData({
      puzzleState: false,
      puzzleCount: 0,
      imageList: data,
      mergeLoading: true,
      puzzlePushData: []
    });
  },
  // 获取点赞照片信息
  getUserLikes: function() {
    app.utils.loading("加载中...");
    var url = "getUserLikesModel";
    var params = {
      weChatId: this.data.wechatId,
      pageNumber: 1,
      pageSize: 20
    };
    if (this.data.reloadState) {
      params.pageNumber = 1;
      app.request.requestPostApi(url, params, "LIKE_LIST", this.successFun, this.failFun);
    } else {
      if (this.data.imageList.length < this.data.PageTotal) {
        params.pageNumber = this.data.likePageNumber++;
        app.request.requestPostApi(url, params, "LIKE_LIST", this.successFun, this.failFun);
      } else {
        wx.hideLoading();
      }
    }
  },
  // 接口返回数据
  successFun: function(res, code) {
    var that = this;
    switch (code) {
      case "LIKE_LIST":
        if (res.code == 0) {
          console.log("LIKE_LIST:", res.data.photoList);
          let state = res.data.count > 0;
          let listArr = [];
          if (that.data.reloadState) {
            that.setData({
              likePageNumber: 2
            });
            listArr = res.data.photoList;
          } else {
            listArr = that.data.imageList.concat(res.data.photoList);
          }
          // if (listArr.length == 0) {
          //   this.setData({
          //     puzzleState: false
          //   })
          // }
          that.setData({
            hasInfo: state,
            reloadState: false,
            PageTotal: res.data.count,
            imageList: listArr,
            copyImageList: listArr
          });
        } else {
          this.setData({
            puzzleState: true
          })
        }

        wx.hideLoading();
        wx.stopPullDownRefresh();
        break;
      case "PHOTO_META":
        if (res.code == 0) {
          that.setData({
            photoMetaInfo: res.data
          });
          console.log("PHOTO_META:", res.data);
        } else {
          console.log(".....");
        }
        break;
      case "PHOTO_MERGE":
        wx.setStorageSync("photoMerge", res.data);
        console.log("PHOTO_MERGE:", res.data);
        // that.setData({
        //   imageList: that.data.copyImageList
        // })
        wx.navigateTo({
          url: '../merge/merge?type=user&&way=myLike',
        })
        // app.utils.go("merge/merge", "type=user");
        break;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    this.getUserLikes();
    wx.hideShareMenu();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      mergeLoading: false
    });
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
    this.setData({
      reloadState: true
    });
    this.getUserLikes();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getUserLikes();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(options) {
    // 返回用户标签
    wx.showShareMenu({
      withShareTicket: true
    });
    let title = '',
      path = '',
      imgUrl = '';
    // 来自页面内转发按钮
    title = "分享照片";
    path = "pages/picShare/picShare" + "?albumId=" + this.data.popupCurInfo.wechatMd5 + "&photoId=" + this.data.popupCurInfo.photoId;
    imgUrl = this.data.popupCurInfo.smallUrl;
    app.sensors.track('PictureClick', { album_wechatid: this.data.popupCurInfo.wechatMd5, picture_click: "分享"});
    return {
      title: title,
      path: path,
      imageUrl: imgUrl,
      success: function(res) {
        // 转发成功
        console.log("转发属性：", res)
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
})