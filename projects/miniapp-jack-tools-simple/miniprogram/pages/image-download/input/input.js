// 获取应用实例
const app = getApp();

Page({
  data: {
    // for debug
    // formUrl: 'https://mp.weixin.qq.com/s/dbIccKt5YczwS44XHKazJQ',
    formUrl: '',
    formTag: '',
    isSubmit: false,
  },
  // 绑 URL
  bindUrl: function (res) {
    // console.log('input: ', res.detail.value);
    this.setData({
      formUrl: res.detail.value
    })
  },
  // 绑 tag
  bindTag: function (res) {
    // console.log('input: ', res.detail.value);
    this.setData({
      formTag: res.detail.value
    })
  },

  // 提交表单
  formSubmit: function (e) {
    this.setData({
      isSubmit: true
    })
    let that = this;
    let urlName = "submit_image_download";
    let params = {
      url: this.data.formUrl,
      tag: this.data.formTag,
    };
    // 提交字段检查
    if (!params.url) {
      app.utils.toast("URL 不能为空");
    } else {
      if (!(/^[http].*$/.test(params.url))) {
        app.utils.toast("请输入正确的 URL ");
        this.setData({
          isSubmit: false
        })
        return;
      }
    };
    // if (!params.tag) {
    //   app.utils.toast("tag 不能为空");
    // };
    if (!!params.url) {
      app.request.requestRestPostApi(urlName, params, 'IMAGE_DOWNLOAD', that.successFUN);
    } else {
      this.setData({
        isSubmit: false
      })
    }
  },
  successFUN: function (res, code) {
    let that = this;
    console.log(code, res)
    switch (code) {
      case "IMAGE_DOWNLOAD":
        if (res.errno == 0) {
          // console.log('success', res);
          // app.sensors.track('ReservationClick', {
          //   reservation_result: true,
          //   fail_type: ''
          // });
          wx.navigateTo({
            url: `../album/album?albumID=${res.data.task_id}`,
          })
          // that.setData({
          //   formUrl: '',
          //   formTag: '',
          // });
        } else {
          if (res.message) {
            // app.sensors.track('ReservationClick', {
            //   reservation_result: false,
            //   fail_type: res.message
            // });
            app.utils.toast(res.message);
          }
        }
        that.setData({
          isSubmit: false
        })
        break;
    }
  },

  // 重置表单
  formReset: function () {
    console.log('form发生了reset事件')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    let title = '公众号图片批量下载';
    let path =  'pages/image-download/input/input';
    return {
      title: title,
      path: path,
      success: function (res) {
        // 转发成功
        console.log("转发属性：", res)
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})
