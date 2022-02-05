// pages/findFace/findFace.js
const app = getApp();
var start_position = {}; //移动图片时手指起始坐标
var tempFilePath; //图片路径
var tempWidth; //图片初始宽度
var tempHeight; //图片初始高度
var old_x = 0; //图片初始x坐标
var old_y = 0; //图片初始y坐标
var _touches = 1; //触屏的手指数
var old_scale = 1; //原始放大倍数
var new_scale = 1; //新的放大倍数
var is_move = false; //是否移动
var bg_url;
import getModel from '../../models/api.js';
import WeCropper from '../../components/we-cropper/we-cropper.js';
const device = wx.getSystemInfoSync();
const width = device.windowWidth;
const height = device.windowHeight - 100;
// 计时器
let countdown = null;
Page({
  data: {
    cropperOpt: {
      id: 'cropper',
      width, // 画布宽度
      height, // 画布高度
      scale: 2, // 最大缩放倍数
      zoom: 8, // 缩放系数
      cut: {
        x: (width - 258) / 2, // 裁剪框x轴起点
        y: (height - 300) / 2, // 裁剪框y轴期起点 tips: 略微偏上
        width: 258, // 裁剪框宽度
        height: 258 // 裁剪框高度
      }
    },
    swipeInfo: {
      indicatorDots: false, //指示点
      autoplay: false,
      circular: true, //循环
      interval: 3000,
      duration: 500,
      nextMargin: '176rpx',
    },
    imgUrl: {
      cancelBlack: '../../assets/icon/cancle.png',
      cancleWhite: '../../assets/icon/close.png',
      blackBorder: '../../assets/img/black-border.png',
      defPhoto: '../../assets/img/def-photo.png',
      blueBorder: '../../assets/img/blue-border.png',
      seraching: '../../assets/img/seraching.png'
    },
    albumID: '',
    cropStatus: false,
    searchStatus: false,
    isShowHistory: false,
    apiStatus: true, // 接口返回状态
    currentIndex: 0, //历史记录选中索引
    faceHistory: '', //历史记录
    currentPhoto: '', // 最终图片
    currentFile: '' //最后文件
  },
  // 返回上一页
  goBack: function() {
    app.utils.back();
  },
  // 选择历史记录
  swichFaceHistory: function(e) {
    if (e.detail.source == "touch") {
      let index = e.detail.current;
      if (index != this.data.index) {
        this.setData({
          currentIndex: index
        });
      };
    }
  },
  // 取消裁剪
  cancelCrop: function() {
    this.setData({
      cropStatus: false
    });
  },
  // 确认裁剪
  confirmCrop: function() {
    let that = this;
    this.wecropper.getCropperImage((src) => {
      if (src) {
        that.setData({
          cropStatus: false,
          searchStatus: true,
          currentPhoto: src
        });
        that.submitFaceData();
      } else {
        console.log('获取图片地址失败，请稍后重试')
      }
    })
  },
  // 确认使用历史记录查找
  confirmFind: function() {
    let data = this.data.faceHistory[this.data.currentIndex];
    this.setData({
      searchStatus: true,
      currentPhoto: data.imageUrl
    });
    this.switchHaveImage();
  },
  // 上传照片
  uploadImage: function() {
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        tempFilePath = res.tempFilePaths[0];
        let tempFile = res.tempFiles[0];
        console.log(res);
        that.setData({
          cropStatus: true,
          currentPhoto: tempFilePath,
          currentFile: tempFile
        });
        wx.getImageInfo({
          src: tempFilePath,
          success: function(res) {
            console.log("上传图片：", res.width, res.height);
            that.wecropper.pushOrign(tempFilePath);
          }
        })
      }
    })
  },
  // wx.uploadFile 超时处理 30s
  uploadFileTimeout: function(){
    let that = this;
    countdown = setTimeout(function () {
      if (that.data.apiStatus){
        app.utils.showModal();
      }else{
        clearTimeout(countdown);
      }
    }, 30000);
  },
  // 提交图片
  submitFaceData: function() {
    let that = this;
    let token=wx.getStorageSync("token");
    let baseUrl = getModel.modelConfig.getModelConfig("findFaceInAlbumModel");
    let params = {
      weChatId: this.data.albumID,
      token: token
    };
    let contentType = 'multipart/form-data';
    // 超时监控
    this.uploadFileTimeout();
    wx.uploadFile({
      url: baseUrl,
      filePath: that.data.currentPhoto,
      header: {
        'Content-Type': contentType
      },
      name: 'headFile',
      formData: params,
      success: function(res) {
        if (res) {
          that.setData({ apiStatus: false });
          app.pageBetweenData.FindFaceInfo = res.data;
          app.utils.to("findFace/findSuccess", "albumID=" + that.data.albumID);
        }
      },
      fail: function(res) {
        that.setData({ apiStatus: false });
        app.utils.showModal();
      }
    })
  },
  // 选择已有图片搜索
  switchHaveImage: function() {
    let url = "findFaceInAlbumModel";
    let id = this.data.faceHistory[this.data.currentIndex].id;
    let params = {
      weChatId: this.data.albumID,
      historyId: id
    };
    app.request.requestPostApi(url, params, "FACE_SUBMIT", this.successFun, this.failFun);
  },
  // 获取历史数据
  getfaceHistory: function() {
    app.utils.loading("加载中...");
    let url = "findFaceHistoryModel";
    app.request.requestPostApi(url, {}, "FACE_HISTORY", this.successFun, this.failFun);
  },
  successFun: function(res, code) {
    let that = this;
    switch (code) {
      case "FACE_HISTORY":
        if (res.code == 0) {
          let historyList = res.data;
          if (historyList) {
            that.setData({
              faceHistory: historyList,
              isShowHistory: historyList.length > 0 || false
            })
          }
        }
        app.utils.hideLoading();
        break;
      case "FACE_SUBMIT":
        app.pageBetweenData.FindFaceInfo = res;
        app.utils.to("findFace/findSuccess", "albumID=" + that.data.albumID);
        break;
    }
  },
  touchStart(e) {
    this.wecropper.touchStart(e)
  },
  touchMove(e) {
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e)
  },
  // 初始化裁剪模块
  initWeCropper: function() {
    const {
      cropperOpt
    } = this.data
    new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        console.log(`wecropper is ready for work!`)
      })
      .on('beforeImageLoad', (ctx) => {
        console.log(`before picture loaded, i can do something`)
        console.log(`current canvas context:`, ctx)
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        console.log(`picture loaded`)
        console.log(`current canvas context:`, ctx)
        wx.hideToast()
      })
      .on('beforeDraw', (ctx, instance) => {
        console.log(`before canvas draw,i can do something`)
        console.log(`current canvas context:`, ctx)
      })
      .updateCanvas();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      albumID: options.albumID
    });
    this.getfaceHistory();
    this.initWeCropper();
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

  }
})