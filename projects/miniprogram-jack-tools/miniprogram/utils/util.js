let systemInfo = wx.getSystemInfoSync();

/**
 * @desc    公共方法
 * @author  crab.xie
 * @date    2018-04-17
 */
module.exports = {
  // 获取当前页url
  getCurrentPageUrl: function() {
    var pages = getCurrentPages(); //获取加载的页面
    var currentPage = pages[pages.length - 1]; //获取当前页面的对象
    var url = currentPage.route; //当前页面url
    return url;
  },
  // 获取当前页带参数的url
  getCurrentPageUrlWithArgs: function() {
    var pages = getCurrentPages(); //获取加载的页面
    var currentPage = pages[pages.length - 1]; //获取当前页面的对象
    var url = currentPage.route; //当前页面url
    var options = currentPage.options; //如果要获取url中所带的参数可以查看options

    //拼接url的参数
    var urlWithArgs = url + '?';
    for (var key in options) {
      var value = options[key];
      urlWithArgs += key + '=' + value + '&';
    }
    urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1);
    return urlWithArgs;
  },
  // 文本提示弹窗
  toast: function(str, img) {
    wx.showToast({
      title: str || "",
      icon: img || "none",
      mask: true,
      duration: 1500
    })
  },
  // 关闭文本提示弹层
  hideToast: function() {
    wx.hideToast();
  },
  // 带按钮的提示层
  showModal: function(title, content) {
    let that = this;
    wx.showModal({
      title: title || '',
      content: content || '网络异常，请检查网络设置！',
      showCancel: false,
      success: function(res) {
        if (res.confirm) {
          that.back();
          console.log('一切正常');
        } else if (res.cancel) {
          console.log('Android用户点击遮罩层 =-=');
        }
      }
    })
  },
  // 打开 loading
  loading: function(str) {
    wx.showLoading({
      title: str || "加载中",
      mask: true
    });
  },
  // 关闭 loading
  hideLoading: function() {
    wx.hideLoading();
  },
  // 页面跳转 不关闭当前page
  go: function(path, param) {
    if (param) {
      wx.navigateTo({
        url: '../' + path + '?' + param
      })
    } else {
      wx.navigateTo({
        url: '../' + path
      })
    };
  },
  // 页面跳转 关闭当前page
  to: function(path, param) {
    if (param) {
      wx.redirectTo({
        url: '../' + path + '?' + param
      })
    } else {
      wx.redirectTo({
        url: '../' + path
      })
    };
  },
  // 跳转tabBar页面
  goTab: function(path) {
    wx.switchTab({
      url: '/' + path
    })
  },
  // 返回首页
  goIndex: function(pram) {
    let that = this;
    wx.switchTab({
      url: '../index/index',
      success: function() {
        if (!!pram) {
          that.toast(pram);
        }
      }
    });
  },
  // 返回上一页
  back: function(num) {
    wx.navigateBack({
      delta: num || 1
    });
  },
  // 查询微信授权
  checkAuth: function(scope) {
    let status = null;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          status = true;
        } else {
          status = false;
        }
      }
    });
    return status;
  },
  // 下载图片
  download: function(url) {
    let that = this;
    wx.getImageInfo({
      src: url,
      success: function(res) {
        let url = res.path;
        wx.saveImageToPhotosAlbum({
          filePath: url,
          success: function(info) {
            that.toast("保存成功", "success");
          },
          fail: function(info) {
            that.openAlbumAuth("关闭相册权限获取会导致无法下载图片，去打开？", "scope.writePhotosAlbum");
          }
        });
      },
      fail: function(res) {
        that.toast("保存失败", "none");
      }
    })
  },
  //引导设置
  openAlbumAuth: function(tips, scope) {
    wx.showModal({
      title: "授权引导",
      content: tips,
      success: function(res) {
        if (res.confirm) {
          wx.openSetting({
            //打开微信设置
            success: function(res) {
              //获取设置状态
              wx.getSetting({
                success: function(res) {
                  if (res.authSetting[scope]) {
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
  // 计算图片缩放
  getImageSize: function(e) {
    //获取图片的原始长宽
    let originalWidth = e.detail.width;
    let originalHeight = e.detail.height;
    let results = {};
    let winSize = wx.getStorageSync('systemInfo');
    //判断长边
    if (originalWidth > originalHeight) {
      results.imageWidth = winSize.windowWidth;
      results.imageheight = (originalHeight / originalWidth) * winSize.windowWidth;
    } else {
      results.imageheight = winSize.windowHeight - 200;
      results.imageWidth = (originalWidth / originalHeight) * winSize.windowHeight;;
    }
    return results;
  },
  // 判断是否为数组
  isArray: function(arg) {
    if (typeof arg === 'object') {
      return Object.prototype.toString.call(arg) === '[object Array]';
    }
    return false;
  },
  // 返回当前网络状态
  getBackNetWorkStatus: function() {
    wx.onNetworkStatusChange(function(res) {
      if (res.isConnected) {
        this.toast("没有网络连接，请检查！");
      } else {
        this.toast("网络繁忙，请稍后再试！");
      }
      this.back();
    });
  },
  // console
  console: (...args) => {
    if (systemInfo.platform == "devtools") {
      console.log.apply(null, args);
    }
  },
  //清除标题内含有的 图片直播，换行标签 string
  clearHeadString: function (arg) {
    if (typeof arg == "string"){
      arg = arg.replace(/图片直播：|图片直播:|图片直播-/, "");
      arg = arg.replace(/<\/br>/, "-");
      return arg;
    }else{
      arg.map(function (item) {
        item.headTitle = item.headTitle.replace(/图片直播：|图片直播:|图片直播-/, "");
        item.headTitle = item.headTitle.replace(/<\/br>/, "-");
      });
      return arg;
    }
  },
  
}

