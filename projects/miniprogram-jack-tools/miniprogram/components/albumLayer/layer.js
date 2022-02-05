//获取应用实例
const app = getApp();
// 定时器
let timeOut = null;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    photoListData: {
      // 相册列表
      type: Array,
      value: null
    },
    albumInfoData: {
      // 相册信息
      type: Object,
      value: null
    },    
  },

  /**
   * 组件的初始数据
   */
  data: {
    albumID: '',
    token: '',
    albumData: null,
    popupCurInfo: null,
    photoListUrls: [],
    photoMetaInfo: null,
    permitLike: true,  //点赞status
    popupInfo: {
      current: 0,
      currentId: '',
      switchState: true,
      picInfoState: false
    }
  },
  /**
   * 组件布局完
   */
  ready: function () {
    let token = wx.getStorageSync('token');
    this.setData({ token: token });
  },
  /**
   * 组件的方法列表
   */
  methods: {
    show: function (index, albumId, data, type) {
      // type 0:普通大图 1：时间线大图
      this.setData({
        albumID: albumId,
        albumData: data
      });
      // 获取缩放大图url列表
      this.getPhotoListUrls();
      // 何种来源类型
      if (!type) {
        this.openBigPic(index);
      } else {
        this.TimeLineOpenBigPic(index);
      };
    },
    close: function () {
      this.setData({
        'popupInfo.switchState': true
      });
    },
    // 打开大图弹层
    openBigPic: function (index) {
      let data = this.data.albumData[index];
      let curID = "id" + data.photoId;
      this.openPopupUpdate(index, data, curID);
      console.log("Current:", index);
    },
    // 打开时间线大图
    TimeLineOpenBigPic: function (id) {
      let that = this;
      let photoList = this.data.albumData;
      photoList.findIndex(function (item, index) {
        if (item.photoId == id) {
          let curID = "id" + item.photoId;
          that.openPopupUpdate(index, item, curID);
        }
      });
    },
    // 打开弹层缩略图,大图数据更新
    openPopupUpdate: function (index, data, curID) {
      console.log("photoId:", curID);
      this.setData({
        popupCurInfo: data,
        'popupInfo.current': index,
        'popupInfo.currentId': curID,
        'popupInfo.switchState': false
      });
    },
    // 打开图片元信息
    openPicInfo: function () {
      let state = this.data.popupInfo.picInfoState;
      if (!state) {
        this.getPhotoMeta();
      }
      this.setData({
        'popupInfo.picInfoState': !state
      });
    },
    // 大图滑动事件
    bindSlideChange: function (e) {
      let index = e.detail.current;
      let data = this.data.albumData[index];
      let curID = "id" + data.photoId;
      this.getAnalysePhotos(data);
      console.log("Current:", e.detail);
      if (e.detail.source == "touch") {
        this.popupInfoUpdate(index, data, curID);
      }
    },
    // 缩略图点击事件
    swichPopupImg: function (e) {
      let index = e.currentTarget.dataset.current;
      let data = this.data.albumData[index];
      let curID = "id" + data.photoId;
      // this.getAnalysePhotos(data);
      this.popupInfoUpdate(index, data, curID);
    },
    // 切换缩略图,大图数据更新
    popupInfoUpdate: function (index, data, curID) {
      console.log("scroll ID:", curID);
      this.setData({
        popupCurInfo: data,
        'popupInfo.current': index,
        'popupInfo.currentId': curID
      });
    },
    // 打开缩放弹层
    openZoomPic: function (e) {
      let url = this.data.popupCurInfo.smallUrl;
      wx.previewImage({
        current: url, // 当前显示图片的http链接
        urls: this.data.photoListUrls // 需要预览的图片http链接列表
      });
    },
    // 保存图片
    userSave: function () {
      let that = this;
      let data = this.data.popupCurInfo;
      app.utils.download(data.downloadSmallUrl);
    },
    //引导设置
    openAlbumAuth: function () {
      wx.showModal({
        content: '关闭相册权限获取会导致无法下载图片，去打开？',
        success: function (res) {
          if (res.confirm) {
            wx.openSetting({
              //打开微信设置
              success: function (res) {
                //获取设置状态
                wx.getSetting({
                  success: function (res) {
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
    // 获取用户信息并进行授权
    getUserInfoStatus: function () {
      let that = this;
      app.getLoginFun().then(function (info) {
        console.log("回调：", info);
        if (info) {
          app.checkIsToken();
          that.getAuthCallBack();
        }else{
          app.utils.toast("未授权无法点赞=-=");
        };
      })
    },
    // 获取授权接口返回状态
    getAuthCallBack: function () {
      let that = this;
      app.utils.loading("授权中");
      timeOut = setInterval(function () {
        let token = wx.getStorageSync('token');
        if (token) {
          that.setData({ token: token});
          that.wechatLike();
          clearInterval(timeOut);
        }
      }, 500);
    },
    // 点赞
    wechatLike: function () {
      if (this.data.token){
        let data = this.data.popupCurInfo;
        let url = "likePhotoModel";
        let params = {
          weChatId: this.data.albumID,
          photoId: this.data.popupCurInfo.photoId
        };
        if (!data.likeStatus && this.data.permitLike) {
          this.setData({ permitLike: false});
          app.request.requestPostApi(url, params, this, this.userSetLikeData, this.failFun);
        } else {
          console.log("不能重复点赞啊~亲")
        }
      };
    },
    userSetLikeData: function (res, source) {
      // 请求成功返回数据
      if( res.code == 0 ){
        let index = source.data.popupInfo.current;
        let data = source.data.albumData;
        data[index].likeStatus = 1;
        data[index].likeNum = data[index].likeNum + 1;
        source.setData({
          albumData: data,
          popupCurInfo: data[index],
          permitLike: true
        });
      }else{
        this.setData({ permitLike: true });
        app.utils.toast("网络繁忙，请稍后再试"); 
      } ;

    },
    // 获取图片列表数据url
    getPhotoListUrls: function () {
      let photoList = this.data.albumData;
      let urls = [];
      photoList.findIndex(function (item, index) {
        urls.push(item.smallUrl);
      });
      this.setData({ photoListUrls: urls });
    },
    // 阻止滚动穿透
    stopScrollEvent: function () {
      // stop user scroll it!
    },
    // 大图浏览量收集
    getAnalysePhotos: function (data) {
      let url = "analysePhotosModel";
      let params = {
        weChatId: this.data.albumID,
        photoName: JSON.stringify([data.photoName]),
        photoId: data.photoId,
        type: 0
      };
      app.request.requestPostApi(url, params, "ANALYSE_PHOTO", this.successFun, this.failFun);
    },
    // 请求图元信息
    getPhotoMeta: function () {
      let url = "getPhotoMetaDetailModel";
      let params = {
        weChatId: this.data.albumID,
        photoName: this.data.popupCurInfo.photoName
      };
      app.request.requestPostApi(url, params, this, this.UserSetPhotoMeta, this.failFun);
    },
    UserSetPhotoMeta: function (res, source) {
      // 请求成功返回数据
      source.setData({ photoMetaInfo: res.data });
      console.log("PHOTO_META:", res.data);
    }
  }
})
