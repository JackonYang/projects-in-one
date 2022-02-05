// pages/order/order.js
//获取应用实例
const app = getApp();
//倒计时定时器
let interval = null;
Page({
  data: {
    telphone: "400-806-5775",
    formName: '',
    formPlace: '',
    formTel: '',
    isSubmit: false,
    typeList: ['会务活动', '会展现场', '时尚派对', '品牌活动', '体育赛事', '娱乐演出', '婚礼庆典', '旅游跟拍', '年会晚会'],
    placeList: null,
    cityCodeList: null,
    isSelected: '',
    currentText: '娱乐演出',
    pickerIndex: null,
    imgList: ["../../assets/img/one.png", "../../assets/img/two.png", "../../assets/img/three.png", "../../assets/img/four.png", "../../assets/img/five.png"],
    // 介绍长图
    introduceUrl: null,
    currentIndex: 0
  },
  // 打电话
  call: function () {
    wx.makePhoneCall({
      phoneNumber: "4008065775"
    })
  },
  //选取拍摄类型
  chooseType: function (e) {
    console.log(e);
    this.setData({
      isSelected: e.target.dataset.index,
      currentText: e.target.dataset.text
    })
  },
  //绑手机号码
  bindTelNum: function (res) {
    this.setData({
      formTel: res.detail.value
    })
  },
  // 绑定地址
  bindPlace: function (e) {
    let list = this.data.placeList;
    this.setData({
      pickerIndex: e.detail.value,
      formPlace: list[e.detail.value]
    })
  },
  //绑姓名
  bindName: function (res) {
    this.setData({
      formName: res.detail.value
    })
  },

  // 提交表单
  formSubmit: function (e) {
    this.setData({
      isSubmit: true
    })
    let that = this;
    let code = this.data.cityCodeList[this.data.pickerIndex];
    let url = "createRequirementModel";
    let params = {
      name: this.data.formName,
      cityCode: code,
      phone: this.data.formTel,
      shootingScene: this.data.currentText,
      sourceFrom: 'OFFICE_MINI_APP'
    };
    // 两小时内算摄影师带单
    let photographer = wx.getStorageSync('photographer');
    if (photographer){
      let diff = app.dates.getTimeDifference(photographer.date);
      let timeOut = 1000 * 60 * 60 * 2; // 时限2小时  
      if (diff < timeOut) {
        params.sourceFrom = "other";
        params.weChatId = photographer.weChatId;
      } else {
        wx.removeStorageSync("photographer");
      }
    }
    // 提交字段检查
    if (!params.phone) {
      app.utils.toast("手机号不能为空");
    } else {
      if (!(/^[1][3,4,5,7,8,9][0-9]{9}$/.test(params.phone))) {
        app.utils.toast("请输入正确的手机号");
        this.setData({
          isSubmit: false
        })
        return;
      }
    };
    if (!params.cityCode) {
      app.utils.toast("地址不能为空");
    };
    if (!params.name) {
      app.utils.toast("姓名不能为空");
    };
    if (!!params.name && !!params.cityCode && !!params.phone) {
      app.request.requestPostApi(url, params, "SUBMIT_INFO", that.successFUN);
    } else {
      this.setData({
        isSubmit: false
      })
    }
  },
  // 获取城市列表
  getAllCity: function () {
    let url = "getAllCityListModel",
      params = {};
    app.request.requestPostApi(url, params, "CITY_INFO", this.successFUN);
  },
  // 获取文字内容
  getTextContent: function () {
    let url = 'getAllColumnContentsModel',
      params = {
        columnCode: 'weapptry',
        pageIndex: 0,
        pageSize: 10
      }
    app.request.requestPostApi(url, params, "PIC_DETAILS", this.successFUN, this.failFun);
  },
  successFUN: function (res, code) {
    let that = this;
    switch (code) {
      case "SUBMIT_INFO":
        if (res.code == 0) {
          app.sensors.track('ReservationClick', {
            reservation_result: true,
            fail_type: ''
          });
          wx.navigateTo({
            url: '../submitSuccess/submitSuccess',
          })
          that.setData({
            formName: '',
            formTel: '',
            formPlace: '',
            pickerIndex: null,
            isSelected: ''
          });
        } else {
          if (res.message) {
            app.sensors.track('ReservationClick', {
              reservation_result: false,
              fail_type: res.message
            });
            app.utils.toast(res.message);
          }
        }
        that.setData({
          isSubmit: false
        })
        break;
      case "CITY_INFO":
        if (res.code == 0) {
          let list = res.data.citysService;
          let placeList = [];
          let cityCodeList = [];
          list.forEach(function (item, index) {
            placeList.push(item.split("|")[0]);
            cityCodeList.push(item.split("|")[1]);
          })
          this.setData({
            placeList: placeList,
            cityCodeList: cityCodeList
          })
        }
        break;
      case "PIC_DETAILS":
        if (res.code == 0) {
          let url = res.data.pageData[0].thumbnailUrl;
          console.log(url);
          that.setData({
            introduceUrl: url
          })
        }
        break;
    }
  },
  // 重置表单
  formReset: function () {
    console.log('form发生了reset事件')
  },

  telCall: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.telphone
    })
  },
  changeSwiper: function (e) {
    console.log(e);
    if (e.detail.source == "touch") {
      this.setData({
        currentIndex: e.detail.current
      })
    }
  },
  //前后切换
  goPrev: function () {
    let index = this.data.currentIndex;
    if (index > 0) {
      index--;
    }
    this.setData({
      currentIndex: index
    })
  },
  goNext: function () {
    let index = this.data.currentIndex;
    if (index < this.data.imgList.length - 1) {
      index++;
    }
    this.setData({
      currentIndex: index
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAllCity();
    this.getTextContent();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    let title = '',
      path = '',
      imgUrl = '';
    if (options.from === 'menu') {
      // 来自页面内转发按钮
      title = "拍摄预约";
      path = app.utils.getCurrentPageUrlWithArgs();
    };
    return {
      title: title,
      path: path,
      success: function (res) {
        // 转发成功
        app.sensors.track('SharePage', {
          share_page: '预约'
        });
        console.log("转发属性：", res)
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }

})