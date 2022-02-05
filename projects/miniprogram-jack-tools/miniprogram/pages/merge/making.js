// pages/merge/making.js
const app = getApp();

Page({
  data: {
    // 底部icon图标
    footImg: {
      defFrameUrl: "../../assets/icon/set-frame.png",
      defTextUrl: "../../assets/icon/set-text.png",
      saveUrl: "../../assets/icon/save.png",
      cancleUrl: "../../assets/icon/cancle.png",
      confirmUrl: "../../assets/icon/confirm.png",
      qrcodeUrl: "../../assets/img/qrcode.png",
      notBorder: "../../assets/icon/frame-none.png"
    },
    // 功能导航index
    currentIndex: null,
    // 相框选择index
    frameItemIndex: 2,
    // 文字内容
    textItemFonts: '',
    // 自定义文字
    userItemFonts: '',
    // 保存的操作
    processData: {
      borderIndex: 2,
      textFont: ''
    },
    verticalText: {
      one: '',
      two: ''
    },
    borderList: '', //边框列表
    currentInfo: '', //照片信息
    isHorizontal: true, //是否横版
    albumInfo: '' //相册信息
  },
  // 底部图标点击事件
  selectFun: function (e) {
    let index = e.currentTarget.dataset.num;
    if (index == 0) {
      this.setData({
        frameItemIndex: this.data.processData.borderIndex
      });
    } else {
      this.setData({
        frameItemIndex: this.data.processData.borderIndex > 1 ? 0 : this.data.processData.borderIndex
      }); 
      console.log("文字：",this.data.processData.textIndex);
      this.userControlWork();  
    };
    this.setData({ currentIndex: index });
  },
  // 取消
  cancle: function () {
    if (this.data.currentIndex == 0) {
      this.setData({
        frameItemIndex: this.data.processData.borderIndex
      });
    } else {
      if (this.data.isHorizontal) {
        this.setData({
          textItemFonts: this.data.processData.textFont,
        });
      }else{
        this.slicetextFont(this.data.processData.textFont);
      }
      this.setData({
        frameItemIndex: this.data.processData.borderIndex
      });
    }
    this.setData({ currentIndex: null });
  },
  // 确定
  confirm: function () {
    if (this.data.currentIndex == 0) {
      this.setData({
        'processData.borderIndex': this.data.frameItemIndex
      });      
    } else {
      let str = this.data.verticalText.one + this.data.verticalText.two;
      if (this.data.isHorizontal){
        this.setData({
          'processData.textFont': this.data.textItemFonts
        });           
      }else{
        this.setData({
          'processData.textFont': str
        });          
      }
      this.setData({
        'processData.borderIndex': this.data.frameItemIndex
      });       
    };
    this.setData({ currentIndex: null });
  },
  // 相框选择项
  frameChoose: function (e) {
    let index = e.currentTarget.dataset.current;
    this.setData({
      frameItemIndex: index
    })
  },
  // 文字选项逻辑处理
  userControlWork: function(index,action){
    this.setData({
      textItemFonts: this.data.userItemFonts
    });    
    if (!this.data.isHorizontal) {
      this.slicetextFont(this.data.userItemFonts);
    };
  },
  // 唤起输入弹层
  openInputLayou: function(){
    if (this.data.currentIndex == 1){
      this.layerInput.show(this.data.textItemFonts);
    }
  },
  // 输入完成
  userWriteFinish: function(e){
    this.setData({
      textItemFonts: e.detail.text,
      userItemFonts: e.detail.text
    });
    if (!this.data.isHorizontal) {
      this.slicetextFont(e.detail.text);
    };
  },
  // 保存图片
  saveImage: function () {
    let info = this.data.processData;
    if (info.borderIndex == 2) {
      let url = this.data.currentInfo.downloadSmallUrl;
      app.utils.download(url);
    } else {
      app.utils.loading("图片合成中...");
      let imgData = this.data.currentInfo;
      let albumData = this.data.albumInfo;
      let borderData = this.data.borderList[info.borderIndex];
      let url = "framedPhotoModel";
      let params = {
        weChatId: albumData.wechatMd5,
        photoId: imgData.photoId,
        frameId: borderData.id,
        sourceFrom: "OFFICE_MINI_APP",
        photoX: borderData.insideX,
        photoY: borderData.insideY,
        url: 'https://gallery.vphotos.cn/vphotosgallery/index.html?vphotowechatid=' + albumData.wechatMd5,
        titleType: 1,
        title: info.textFont
      };
      app.request.requestPostApi(url, params, "IMAGE_SAVE", this.successFun, this.failFun);
    };
  },
  // 请求边框资源
  getImageBorder: function () {
    let url = "findPhotoFrameListModel";
    let params = {
      photoId: this.data.currentInfo.photoId
    };
    app.request.requestPostApi(url, params, "IMAGE_BORDER", this.successFun, this.failFun);
  },
  // 接口成功返回数据
  successFun: function (res, code) {
    let that = this;
    switch (code) {
      case "IMAGE_BORDER":
        that.setData({
          borderList: res.data
        })
        app.utils.hideLoading();
        break;
      case "IMAGE_SAVE":
        app.utils.hideLoading();
        if (res.code == 0) {
          app.utils.download(res.data.url);
        } else {
          app.utils.toast("制作失败");
        }
        break;
    }
  },
  // 分割添加的文字
  slicetextFont: function(text){
    this.setData({
      'verticalText.one': text.slice(0, 10),
      'verticalText.two': text.slice(10, 20)
    });
  },
  // 初始化
  init: function () {
    app.utils.loading();
    let data = app.pageBetweenData.mergeMakeInfo;
    let albumInfo = app.pageBetweenData.currentAlbumInfo;
    albumInfo.userTitle = albumInfo.headTitle.slice(0, 19);
    this.setData({
      currentInfo: data,
      albumInfo: albumInfo,
      userItemFonts: albumInfo.userTitle,
      isHorizontal: data.smallWidth > data.smallHeight
    });
    this.getImageBorder();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    this.setData({ albumID: options.albumID });
    this.init();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获取组件实例
    this.layerInput = this.selectComponent("#single-border");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
  
})