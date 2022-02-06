// pages/album/video.js
//获取应用实例
const app = getApp();
Page({
  data: {
    token: '', //token
    isShare: false, //是否转发
    isShowVideo: false, //播放视频
    albumID: '', //相册id
    photoId: '', //对应视频id
    permitLike: true, //点赞状态(防重复点击)
    albumInfo: null, //相册信息
    videoList: null, //对应视频相册总信息
    recentVideoInfo: null, //最近视频列表
    currentVideoData: null //当前视频信息
  },
  stopScrollEvent: function() {

  },
  //去相册
  goAlbum: function() {
    let param = "albumID=" + this.data.albumID + "&source=2009";
    app.utils.go("album/album", param);
  },
  // 获取视频列表
  getVideoList: function(id) {
    let url = "getPhotoListByWeChatIdModel";
    let params = {
      weChatId: id,
      photoId: '',
      pageSize: 999
    };
    app.request.requestPostApi(url, params, "PHOTO_LIST", this.successFun, this.failFun);
  },
  //根据id获取当前视频详情信息
  getCurrentVideoInfo: function(list) {
    let that = this;
    let photoId = this.data.photoId;
    list.forEach(function(val, index) {
      if (val.photoId == photoId) {
        val.labelName = app.utils.clearHeadString(val.labelName);
        val.duration = app.dates.formatSeconds(val.duration);
        that.setData({
          currentVideoData: val
        })
      }
    })
  },
  //获取最近的视频列表
  getRecentVideoList: function(id) {
    let url = "getSimplePhotoListByWeChatIdModel",
      params = {
        weChatId: this.data.albumID,
        photoId: id,
        pageSize: 6
      };
    app.request.requestPostApi(url, params, "RECENT_INFO", this.successFun, this.failFun);
  },
  //点击切换当前视频信息
  switchCurrentVideoInfo: function(e) {
    let index = e.currentTarget.dataset.index;
    let curId = this.data.recentVideoInfo[index].photoId;
    this.setData({
      photoId: curId
    })
    this.getVideoList(this.data.albumID);
    this.getRecentVideoList(curId);
  },
  // 登录授权
  getUserInfoStatus: function() {
    let that = this;
    app.getLoginFun().then(function(info) {
      console.log("回调：", info);
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
  // 点赞
  wechatLike: function() {
    if (this.data.token) {
      let data = this.data.currentVideoData;
      let url = "likePhotoModel";
      let params = {
        weChatId: this.data.albumID,
        photoId: this.data.photoId
      };
      if (!data.likeStatus && this.data.permitLike) {
        this.setData({
          permitLike: false
        });
        app.request.requestPostApi(url, params, this, this.userSetLikeData, this.failFun);
        app.sensors.track('PictureClick', {
          album_wechatid: this.data.albumID,
          picture_click: "点赞"
        });
      } else {
        console.log("不能重复点赞啊~亲")
      }
    };
  },
  userSetLikeData: function(res, source) {
    // 请求成功返回数据
    if (res.code == 0) {
      let data = source.data.currentVideoData;
      let id = this.data.albumID;
      data.likeStatus = 1;
      data.likeNum = data.likeNum + 1;
      source.setData({
        currentVideoData: data,
        permitLike: true
      });
    } else {
      this.setData({
        permitLike: true
      });
      app.utils.toast("网络繁忙，请稍后再试");
    };
  },
  // 浏览量收集
  getAnalysePhotos: function(data) {
    let url = "analysePhotosModel";
    let params = {
      weChatId: this.data.albumID,
      photoName: JSON.stringify([data.photoName]),
      photoId: data.photoId,
      type: 2
    };
    app.request.requestPostApi(url, params, "ANALYSE_PHOTO", this.successFun, this.failFun);
  },
  //观看记录访问次数
  playVideo: function(e) {
    let id = e.currentTarget.dataset.id,
      name = e.currentTarget.dataset.name;
    let params = {
      photoName: name,
      photoId: id
    }
    this.getAnalysePhotos(params);
  },
  startPlay: function(e) {
    this.playVideo(e);
    this.setData({
      isShowVideo: true
    })
    let videoDom = wx.createVideoContext('myVideo');
    videoDom.play();
  },
  //获取wechatInfo
  getWechatInfo: function() {
    let url = "getWeChatInfoModel";
    let params = {
      weChatId: this.data.albumID,
      url: 'https://gallery.vphotos.cn/vphotosgallery/index.html?vphotowechatid=' + this.data.albumID
    };
    app.request.requestPostApi(url, params, "ALBUM_INFO", this.successFun, this.failFun);
  },
  successFun: function(res, code) {
    let that = this;
    switch (code) {
      case "PHOTO_LIST":
        if (res.code == 0) {
          let videoList = res.data.photos;
          this.setData({
            videoList: videoList
          })
          that.getCurrentVideoInfo(videoList);
        }
        break;
      case "ALBUM_INFO":
        if (res.code == 0) {
          let info = res.data;
          info.headTitle = app.utils.clearHeadString(info.headTitle);
          this.setData({
            albumInfo: info
          })
        }
        break;
      case "RECENT_INFO":
        if (res.code == 0) {
          let recentList = res.data.photos;
          recentList.forEach(function(val, index) {
            recentList[index].duration = app.dates.formatSeconds(val.duration);
          })
          this.setData({
            recentVideoInfo: recentList,
            isShowVideo: false
          })
        }
        break;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu();
    if (options.photoId) {
      this.setData({
        photoId: options.photoId
      })
    }
    if (options.albumID) {
      this.setData({
        albumID: options.albumID
      })
      this.getVideoList(options.albumID);
      this.getWechatInfo();
      this.getRecentVideoList(options.photoId);
    }
    if (options.source == 2009) {
      this.setData({
        isShare: true
      })
    }
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
      token: wx.getStorageSync('token')
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
    let albumID = this.data.albumID;
    let photoId = this.data.photoId;
    let title = this.data.currentVideoData.headTitle;
    let url = this.data.currentVideoData.thumbUrl;
    if (options.from == "button") {
      return {
        title: title,
        path: "pages/album/videoDetail" + "?albumID=" + albumID + "&photoId=" + photoId + "&source=2009",
        // imageUrl: url        
      }
    }
  }
})