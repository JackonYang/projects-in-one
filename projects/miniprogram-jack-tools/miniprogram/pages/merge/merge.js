//获取应用实例
const app = getApp();
//定时器
let interval = null;
// 文本框值
let textareaVal = '';

Page({
  data: {
    albumID: '',
    mergeUrl: null,
    mergeData: null,
    largerPic: false,
    currentIndex: null, //底部功能按钮
    textItemIndex: null, //文字选项下标
    textVal: '', //文字值
    isEmpty: false, //标题是否设置为空
    isDefault: true, //标题是否为默认
    textareaVal: '', //自定义值
    cloneTextareaVal: '', //备份自定义值
    headTitle: '', //相册标题
    pageType: '', //页面跳转类型，1是点赞拼图，默认是相册拼图
    // margin值
    marginVal: 0,
    cloneMarginVal: 0,
    // 滚动到底部的高度
    scrollH: 0,
    // 拼图信息列表
    photoMergeList: [],
    // 底部icon图标
    footImg: {
      defFrameUrl: "../../assets/icon/set-frame.png",
      defTextUrl: "../../assets/icon/set-text.png",
      saveUrl: "../../assets/icon/save.png",
      cancleUrl: "../../assets/icon/cancle.png",
      confirmUrl: "../../assets/icon/confirm.png",
      codeUrl: "../../assets/img/qrcode.png"
    },
    textList: ["默认", "不加文字", "自定义"]
  },
  // 轮询本地数据
  getMergeData: function() {
    let that = this;
    let data = wx.getStorageSync("photoMerge");
    if (data) {
      this.setData({
        mergeData: data
      });
    } else {
      interval = setInterval(function() {
        data = wx.getStorageSync("photoMerge");
        if (data) {
          clearInterval(interval);
          that.setData({
            mergeData: data
          });
        }
      }, 1000);
    }
  },
  // 查看大图
  getLargerPic: function() {
    this.setData({
      largerPic: true
    });
  },
  // 下载大图
  savePic: function(param) {
    app.utils.download(param);
    app.sensors.track('SpliceDown', {
      album_wechatid: this.data.albumID,
      splice_url: this.data.mergeUrl
    });
  },
  // 分享数据获取
  getShareData: function(res) {
    let obj = {};
    let urls = decodeURIComponent(res.url);
    obj.size = res.size;
    obj.url = urls;
    obj.thumbUrl = urls.replace("_thumb", "");
    this.setData({
      mergeData: obj
    });
  },
  // 底部图标点击事件
  selectFun: function(e) {
    let index = e.currentTarget.dataset.num;
    if (index == 2) {
      // 请求并保存图片
      this.getMerging();
    }
    this.setData({
      currentIndex: index
    });
    this.getAllRects(".JS-Img");
    console.log(this.data.currentIndex);
  },
  // 获取所有图片高度总和
  getAllRects: function(val) {
    let that = this;
    wx.createSelectorQuery().selectAll(val).boundingClientRect(function(info) {
      let totalH = 0;
      info.forEach(function(val, index) {
        totalH += val.height;
      })
      that.setData({
        scrollH: totalH
      })
      console.log("总高度", info, totalH);
    }).exec();
  },
  // 拖动条改变margin
  changeMargin: function(e) {
    this.setData({
      marginVal: e.detail.value
    })
  },
  //显示弹层
  showTextModal: function() {
    let curIndex = this.data.currentIndex;
    if (curIndex == 1) {
      let val = this.data.textVal,
        title = this.data.headTitle;
      this.layerInput.show(val || title);
    }
  },
  // 自定义确定
  userWriteFinish: function(e) {
    textareaVal = e.detail.text;
    textareaVal = textareaVal == "" ? " " : textareaVal;
    this.setData({
      textVal: textareaVal
    })
  },
  // 文字确定
  textConfirm: function() {
    let textVal = this.data.textVal;
    if (textVal == " ") {
      this.setData({
        isEmpty: true,
        isDefault: false
      })
    } else if (textVal == this.data.headTitle) {
      this.setData({
        isEmpty: false,
        isDefault: true
      })
    } else {
      this.setData({
        isEmpty: false,
        isDefault: false
      })
    }

    this.setData({
      textareaVal: textareaVal,
      currentIndex: null
    })
  },
  // 相框确定
  frameConfirm: function() {
    this.setData({
      cloneMarginVal: this.data.marginVal,
      currentIndex: null
    })
  },
  // 取消
  cancle: function() {
    let value = this.data.textareaVal;
    // 相框重置margin
    if (this.data.currentIndex == 0) {
      this.setData({
        marginVal: this.data.cloneMarginVal
      })
    }
    // 重置文字
    if (this.data.currentIndex == 1) {
      // 是否为空
      if (!this.data.isEmpty) {
        // 是否默认
        if (this.data.isDefault) {
          this.setData({
            textVal: this.data.headTitle
          })
        } else {
          this.setData({
            textVal: value || this.data.headTitle
          })
        }
      } else {
        this.setData({
          textVal: ' '
        })
      }
    }
    this.setData({
      currentIndex: null,
      textItemIndex: null
    })
  },
  // 请求拼图
  getMerging: function() {
    app.utils.loading("正在保存");
    let textVal = this.data.textVal,
      headTitle = this.data.headTitle,
      isEmpty = this.data.isEmpty,
      isDefault = this.data.isDefault,
      titleType = 1;
    if (isEmpty) {
      titleType = -1;
    } else if (isDefault) {
      titleType = 0;
    } else {
      titleType = 1;
    }
    let codeUrl = 'https://gallery.vphotos.cn/vphotosgallery/index.html?vphotowechatid=' + this.data.albumID;
    let url = "mergeMultiPhotoModel",
      params = {
        margin: this.data.marginVal,
        merge: JSON.stringify(this.data.photoMergeList),
        titleType: titleType,
        sourceFrom:"OFFICE_MINI_APP",
        // titleType == 1 ? textareaVal || textVal : ''
        title: textVal
      };
    if (!this.data.pageType) {
      params.weChatId = this.data.albumID;
      params.url = codeUrl;
    }
    app.request.requestPostApi(url, params, "MERGE_IMG", this.successFun, this.failFun);
  },

  // 获取上一页面数据
  getPrePage: function() {
    let pageInfo = [];
    let pages = getCurrentPages();
    let photoMergeList = pages[pages.length - 2].data.mergeList || [];
    photoMergeList.forEach(function(val, index) {
      let itemInfo = {};
      itemInfo.photoId = val.photoId;
      itemInfo.index = index + 1;
      itemInfo.smallUrl = val.smallUrl;
      pageInfo.push(itemInfo);
    })
    this.setData({
      photoMergeList: pageInfo
    })
    console.log("页面栈", pages, photoMergeList);
  },
  successFun: function(res, code) {
    let that = this;
    switch (code) {
      case "MERGE_IMG":
        let list = this.data.photoMergeList,
          puzzlePushData = [];
        list.map(function(item, index) {
          puzzlePushData.push(item.photoId);
        })
        this.setData({
          currentIndex: null
        })
        if (res.code == 0) {
          console.log("拼图结果", res);
          that.setData({
            mergeUrl: res.data.url
          })
          app.sensors.track('PictureSplice', {
            album_wechatid: that.data.albumID,
            select_count: list.length,
            picture_ids: puzzlePushData
          });
          that.savePic(res.data.url);
        } else {
          app.utils.toast(res.message);
        }
        app.utils.hideLoading();
        break;
    }
  },

  // 页面初始化
  init: function(param) {
    if (param.albumID) {
      this.setData({
        albumID: param.albumID
      });
    }
    if (param.type == "user") {
      this.getMergeData();
    } else {
      this.getShareData(param);
    }
    if (param.way == "myLike") {
      let textList = this.data.textList;
      textList.shift(0);
      this.setData({
        pageType: 1,
        textList: textList
      })
    } else {
      let headTitle = wx.getStorageSync("headTitle");
      if (headTitle.length > 20) {
        headTitle = headTitle.slice(0, 20);
      }
      this.setData({
        textVal: headTitle,
        headTitle: headTitle
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu();
    this.init(options);
    this.getPrePage();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.layerInput = this.selectComponent("#single-border");
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
    wx.removeStorageSync("photoMerge");
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

  }


})