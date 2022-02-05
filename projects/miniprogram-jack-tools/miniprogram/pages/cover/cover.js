// pages/cover/cover.js
//获取应用实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wechatInfo: {},
    albumID: "",
    // 封面类型（单or多）
    pageType: '',
    // 相册类型（直传or调图）
    albumType: '',
    // 封面内容(多相册包含详情内容)
    coverInfo: {},
    //横竖版开关
    coverStyle: '',
    // 详情显示
    isShowDetail: false,
    // 单相册精彩图
    singleList: {},
    //精选图片
    choiceList: {},
    // 多相册列表
    multiList: {},
    // 单相册详情列表
    singleDetailList: {},
    //活动流程下标
    curFlowIndex: 0,
    // 支持参数状态
    openState: false,
    loadingState: false,
    // 垂直样式控制
    verticalStyle: "vertical",
    //没返回banner时样式控制
    noBanner: "h-normal",
    // 分享传值scene
    sceneVal: '',
    // 分享图片
    imgUrl: '',
    // 分享传值id
    shareID: '',
    // 相册来源
    source: '2001'
  },
  // 进入对应相册
  goAlbum: function(event) {
    let albumID = this.data.albumID;
    if (!albumID) {
      albumID = event.currentTarget.dataset.url.split("?")[1].split("=")[1];
    };
    wx.navigateTo({
      url: '../album/album?albumID=' + albumID + '&source=' + this.data.source
    })
  },
  switchOpen: function() {
    let openState = this.data.openState;
    this.setData({
      openState: !openState
    })
  },
  // 正则筛选（二维码）
  getQueryValue: function(url, name) {
    var reg = new RegExp('(\\?|&)' + name + '=([^&?]*)', 'i');
    var arr = url.match(reg);
    if (arr) {
      return arr[2];
    }
    return null;
  },
  // 详情按钮切换显示
  showDetailModal: function() {
    let url = '',
      params = null;

    let isShowDetail = this.data.isShowDetail;
    this.setData({
      isShowDetail: !isShowDetail
    })
    if (this.data.pageType == 1) {
      if (this.data.isShowDetail) {
        url = "getActivityListModel";
        params = {
          weChatId: this.data.albumID
        };
        app.request.requestPostApi(url, params, "GET_SINGLE_DETAIL", this.successFun, this.failFun);
      }
    }
  },
  switchFlowList: function(e) {
    let index = e.currentTarget.dataset.current;
    this.setData({
      curFlowIndex: index
    })
  },

  // 解析参数
  analysisOption: function(options) {
    /**
     * v#c#u#ct#a#at(中间可能为空)
     * 保留位	 v	 预留协议解析类型	1:基础协议
     * 渠道ID	  c
     * 用户ID   u
     * 页面类型	ct	1：单相册，2：集合册
     * 页面ID	  a	  相册ID、集合页ID等
     * 相册类型	at	2：直传 4：调图
     */
    let arr = options.split('#');
    console.log("协议参数: ", arr);
    let baseType = parseInt(arr[0], 36);
    let id = parseInt(arr[4], 36);
    if (baseType == 1) {
      let pageType = parseInt(arr[3], 36);
      this.setData({
        pageType: pageType,
        albumType: parseInt(arr[5], 36),
        shareID: id
      });
      this.Classification(pageType, id);
    } else {
      // 非基础协议直接跳转首页
      app.utils.go('index/index');
    };
  },
  // 分类请求
  Classification: function(pageType, id) {
    if (pageType == 1) {
      // 单相册
      this.findSingleWeChat(id);
    } else {
      // 集合页
      this.findMultiWeChat(id);
    }
  },
  // 单相册请求请求id
  findSingleWeChat: function(id) {
    let url = 'findWeChatIdModel',
      params = {
        albumId: id
      }
    app.request.requestPostApi(url, params, "GET_WECHAT", this.successFun, this.failFun);
  },
  // 集合页请求id
  findMultiWeChat: function(id) {
    let url = 'findMultiAlbumCodeModel',
      params = {
        multiAlbumId: id
      }
    console.log("我的ID", id);
    app.request.requestPostApi(url, params, "GET_MULTIALBUM", this.successFun, this.failFun);
  },
  // 获取单相册封面信息
  getSingleCoverInfo: function(id) {
    let url = "findCoverInfoModel";
    let params = {
      weChatId: id,
      photoSizeType: this.data.albumType || "4"
    }
    app.request.requestPostApi(url, params, "SINGLE_INFO", this.successFun, this.failFun);
  },
  //获取单相册top10图片
  getSinglePic: function(id) {
    // let url = "getPhotoListByWeChatIdModel";
    // let params = {
    //   weChatId: id,
    //   pageSize: 7,
    //   rank: 1
    // }
    // app.request.requestPostApi(url, params, "SINGLE_PIC_INFO", this.successFun, this.failFun);
    let url = "getPhotoRankModel";
    let params = {
      isSaveNum: 1,
      weChatId: this.data.albumID
    };
    app.request.requestPostApi(url, params, "SINGLE_PIC_INFO", this.successFun, this.failFun);
  },
  // 获取多相册封面信息
  getMultiCoverInfo: function(id) {
    let url = "getMultiAlbumStyleHomePageModel";
    let params = {
      multiAlbumCode: id
    }
    console.log(id);
    app.request.requestPostApi(url, params, "MULTI_INFO", this.successFun, this.failFun)
  },
  // 获取相册信息
  getWechatInfo: function(id) {
    let url = "getWeChatInfoModel";
    let params = {
      weChatId: id,
      url: 'https://gallery.vphotos.cn/vphotosgallery/index.html?vphotowechatid=' + id
    };
    app.request.requestPostApi(url, params, "ALBUM_INFO", this.successFun, this.failFun);
  },
  //设置样式
  setStyle: function() {
    let phoneMes = wx.getStorageSync("systemInfo");
    if (phoneMes.screenHeight <= 568) {
      this.setData({
        verticalStyle: "vertical-IPhone5",
        noBanner: "h-IPhone5"
      })
    } else if (phoneMes.screenHeight >= 812) {
      this.setData({
        verticalStyle: "vertical-IPhoneX",
        noBanner: "h-IPhoneX"
      })
    }
  },
  // 计算多相册列表里总共有多少相册
  countMultiAlbumNum: function(arr) {
    let listArr = [];
    for (let item of arr) {
      if (app.utils.isArray(item.albumList)) {
        listArr.push(...item.albumList);
      }
    };
    return listArr.length
  },
  //正则替换&...;
  replaceTxt: function(val) {
    var regex = /\&.*?\;/g;
    val = val.replace(regex, "");
    return val;
  },
  //错误码
  codeError: function(prama) {
    app.utils.hideLoading();
    wx.switchTab({
      url: '/pages/index/index',
    })
    app.utils.toast(prama);
  },
  successFun: function(res, code) {
    let that = this;
    switch (code) {
      case "ALBUM_INFO":
        if (res.code == 0) {
          that.setData({
            wechatInfo: res.data
          })
          console.log("我的list状态", res.data.activityChoiceSwitch);
          if (!res.data.activityChoiceSwitch) {
            that.getSinglePic(that.data.albumID);
          } else {
            that.setData({
              singleList: that.data.choiceList
            })
          }
        }
        break;
      case "SINGLE_INFO":
        app.utils.hideLoading();
        if (res.code == 0) {
          let datalist = res.data;
          datalist.headTitle = app.utils.clearHeadString(datalist.headTitle);
          that.setData({
            choiceList: res.data.photoList,
            coverInfo: datalist,
            coverStyle: datalist.coverStyle,
            loadingState: true
          })
          this.getWechatInfo(that.data.albumID);
          this.setStyle();
          app.sensors.track('CollectionEnter', {
            collection_name: that.data.albumID,
            collection_count: 1
          });
        };
        break;
      case "SINGLE_PIC_INFO":
        if (res.code == 0) {
          //top10
          that.setData({
            // singleList: res.data.photos
            singleList: res.data
          })
        }
        break;
      case "MULTI_INFO":
        if (res.code == 0) {
          console.log("集合页信息", res);
          let multidatalist = res.data;
          let albumNumber = that.countMultiAlbumNum(multidatalist.groupList);
          let singleStr = multidatalist.sponsorContext;
          multidatalist.coverUrl = multidatalist.sportCoverUrl;
          multidatalist.sponsorContext = that.replaceTxt(singleStr);
          multidatalist.headTitle = app.utils.clearHeadString(multidatalist.headTitle);
          if (res.data.sportDeatilShowType == 1) {
            this.setData({
              isShowDetail: true
            })
          }
          that.setData({
            coverInfo: multidatalist,
            coverStyle: multidatalist.sportCoverStyle,
            multiList: multidatalist.groupList,
            loadingState: true
          })
          console.log("集合页信息", multidatalist);
          this.setStyle();
          app.sensors.track('CollectionEnter', {
            collection_name: that.data.albumID,
            collection_count: albumNumber
          });
        }
        app.utils.hideLoading();
        break;
      case "GET_WECHAT":
        if (res.code == 0) {
          let albumID = res.data.weChatId;
          that.setData({
            albumID: albumID
          });
          // 单相册
          that.getSingleCoverInfo(albumID);
        } else {
          that.codeError(res.message);
        }
        break;
      case "GET_MULTIALBUM":
        if (res.code == 0) {
          let albumID = res.data.multiAlbumCode;
          console.log("解析后id", albumID);
          //多相册
          that.getMultiCoverInfo(albumID);
        } else {
          that.codeError(res.message);
        }
        break;
      case "GET_SINGLE_DETAIL":
        if (res.code == 0) {
          let multiStr = res.data.organiser.contentOrTitle;
          res.data.organiser.contentOrTitle = that.replaceTxt(multiStr);
          res.data.organiser.contentOrTitle = that.replaceTxt(multiStr);
          this.setData({
            singleDetailList: res.data
          })
        }
        break;
    }
  },
  // 初始化
  init: function(options) {
    console.log("进入cover界面");
    if (options.q) {
      let url = decodeURIComponent(options.q);
      let scene = this.getQueryValue(url, "scene");
      if (!scene || scene.indexOf("#") == -1) {
        app.utils.toast("二维码参数错误");
        app.utils.go('index/index');
      } else {
        options.scene = scene;
      }
    };
    console.log("传值", options);
    if (options.scene) {
      console.log("进入scene", options.scene);
      // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
      this.setData({
        sceneVal: options.scene
      })
      app.utils.loading();
      let scene = decodeURIComponent(options.scene);
      this.analysisOption(scene);
    } else {
      this.setData({
        albumID: options.albumID,
        source: options.source,
        pageType: 1
      })
      this.getSingleCoverInfo(options.albumID);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.init(options);
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
  onShareAppMessage: function() {
    let that = this;
    let title = this.data.coverInfo.headTitle,
      path = '',
      imgUrl = this.data.coverInfo.coverUrl;
    if (this.data.sceneVal) {
      path = "pages/cover/cover" + "?pageType=" + this.data.pageType + "&shareID=" + this.data.shareID
    } else {
      path = "pages/cover/cover" + "?albumID=" + this.data.albumID
    }
    return {
      title: title,
      path: path,
      imageUrl: imgUrl,
      success: function(res) {
        // 转发成功
        console.log("scene", that.data.sceneVal);
        console.log("albumID", that.data.albumID);
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
})