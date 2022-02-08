// pages/album/album.js
// 模拟数据
var mockdata = require('../../../models/mock');

const VGalleryView = require('../../../components/galleryview/galleryview.js');

//获取应用实例
const app = getApp();
// 定时器
let timeOut = null;

Page({
  videoDom: '', //视频组件
  data: {
    albumID: null,
    sourceType: "", //进入类型
    sourceName: '', //当前场景名称
    token: null,
    blankData: true, //是否空相册
    isVideo: false, //是否为视频相册
    lastPhotoId: '',
    currentTagId: 'all', //相册类型
    currentTagName: '', // tag名称
    settingState: false, //设置按钮
    reloadState: false, // 刷新
    albumState: false, //tag切换
    onTopState: false, // 返回顶部
    isShowVideo: false,
    showIndex: false, //返回首页 --分享进入显示
    columnState: 'three', //两列三列切换 默认three
    columnStateName: '两列',
    puzzleCount: 0, //拼图选中数量
    puzzlePushData: [], //拼图选中数据
    puzzleUrl: [], //拼图选中url
    puzzleState: false, //拼图参数
    mergeLoading: false,
    mergeList: null,
    timeLineState: false, //时间线
    showAlbumList: true,
    rankState: false, //top10
    isShow: 'animate-show',
    setSwitchInfo: {
      autoplay: true, //自动播放
      circular: true, //循环      
      indicatorDots: false,
      indicatorColor: '#fff',
      indicatorActiveColor: '#000',
      interval: 2000,
      duration: 300,
      currentItem: 0,
      mode: 'widthFix',
      load: true
    },
    photoListInfo: {
      mode: 'aspectFill',
      load: true,
      total: 0,
      photoList: []
    },
    wechatToken: '', // 密码相册鉴权码
    albumInfo: {
      'headTitle': '下载的图片列表',
    }, //相册属性
    coverInfo: {}, //相册封面
    photoListData: [], //相册data
    videoListData: [], //视频data
    choiceInfo: '', // 活动精选数据
    choiceBannerData: '', // 活动精选banner
    choiceInfoStatus: false, //活动精选状态
    CurrentSwiperData: [], // 当前显示三张图片数据
    swiperIndex: 0, // 当前
    startPoint: {}, // 起点
    selfSwiper: {
      swiperVec: '',
      swiperStat: false
    },
    isShowMore: '', //显示更多
    photoListTotal: 1,
    timeLIneData: [],
    popupCurInfo: null, //当前大图data
    popupCurData: '', // 当前相册弹层图片数据
    photoMetaInfo: null,
    photoListUrls: [],
    permitLike: true, //点赞status
    popupInfo: {
      current: 0,
      tagCurrent: 0,
      currentId: '',
      positionId: '',
      switchState: true,
      picInfoState: false
    },
    layouImages: {
      top: '/assets/icon/top.png',
      timeline: '/assets/icon/timeline.png',
      setting: '/assets/icon/setting.png',
      select: '/assets/icon/select.png',
      selected: '/assets/icon/select-white.png',
      loadingUrl: '/assets/icon/photo.png',
      save: '/assets/icon/save.png',
    },
    localSrc: {
      noList: '/assets/img/no-pic.png'
    },
    photoListUrls: [], //照片列表url数组
    tagList: []
  },

  // 人脸识别 -- 找我
  findMe: function() {
    app.utils.go("findFace/findFace", "albumID=" + this.data.albumID);
  },
  // 制作图片
  userMaking: function() {
    app.pageBetweenData.mergeMakeInfo = this.data.popupCurInfo;
    app.utils.go("merge/making", "albumID=" + this.data.albumID);
  },
  // 选中图片
  selectPic: function(e) {
    let index = e.currentTarget.dataset.current;
    console.log("选中图片:", index);
    this.setData({
      settingState: false
    });
    // this.openBigPic(index);
  },
  // 设置页面title
  setPageTitle: function() {
    let title = this.data.albumInfo.headTitle || "图片查看";
    wx.setNavigationBarTitle({
      title: title
    })
  },
  //  回到顶部
  onTop: function() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 500
    });
    app.sensors.track('AlbumClick', {
      album_wechatid: this.data.albumID,
      album_click: '回到顶部'
    });
  },
  // 返回首页
  goIndex: function() {
    wx.switchTab({
      url: '../index/index'
    });
    app.sensors.track('AlbumClick', {
      album_wechatid: this.data.albumID,
      album_click: '返回首页'
    });
  },
  //去视频详情
  goVideoDetail: function(e) {
    let id = e.currentTarget.dataset.id;
    let param = "albumID=" + this.data.albumID + "&&" + "photoId=" + id;
    app.utils.go("album/videoDetail", param);
  },
  // 设置按钮状态
  onSaveToDisk: function() {

  },
  // 拼图模式
  switchPuzzle: function() {
    this.getPuzzleData();
    this.setData({
      puzzleState: true,
      settingState: false
    });
    app.sensors.track('AlbumClick', {
      album_wechatid: this.data.albumID,
      album_click: '拼图'
    });
  },
  // 关闭拼图
  closePuzzle: function() {
    this.setData({
      puzzleState: false,
      puzzleCount: 0,
      puzzlePushData: [],
      puzzleUrl: []
    });
  },
  // 增加拼图参数
  getPuzzleData: function() {
    let data = this.data.photoListData;
    let puzzleData = [];
    data.map(function(item) {
      item.selected = false;
    });
    this.setData({
      photoListData: data
    });
  },
  // 处理拼图选中
  setPhotoListData: function(index) {
    let data = this.data.photoListData;
    let puzzle = this.data.puzzlePushData;
    let urls = this.data.puzzleUrl;
    let seq = this.data.puzzleCount;
    if (data[index].selected) {
      --seq;
      let cur = puzzle.indexOf(data[index].photoId);
      puzzle.splice(cur, 1);
      urls.splice(cur, 1);
      data[index].selected = !data[index].selected;
      this.setData({
        photoListData: data,
        puzzlePushData: puzzle,
        puzzleUrl: urls,
        puzzleCount: seq
      });
    } else {
      if (seq < 10) {
        ++seq;
        puzzle.push(data[index].photoId);
        urls.push(data[index].smallUrl);
        data[index].selected = !data[index].selected;
        this.setData({
          photoListData: data,
          puzzlePushData: puzzle,
          puzzleUrl: urls,
          puzzleCount: seq
        });
      } else {
        app.utils.toast("最大可选10张");
      }
    }
    this.getTimeLineData(this.data.photoListData);
    console.log("拼图选中数据： ", this.data.puzzlePushData);
  },
  // 开始拼图
  goPuzzleFun: function() {
    let that = this;
    if (this.data.puzzleCount > 1) {
      let puzzle = this.data.puzzlePushData;
      let urls = this.data.puzzleUrl;
      let list = [];
      puzzle.map(function(item, index) {
        let obj = {};
        obj.photoId = item;
        obj.index = index + 1;
        obj.smallUrl = urls[index];
        list.push(obj);
      });
      this.setData({
        mergeList: list
      })
      app.utils.go("merge/merge", "type=user&albumID=" + that.data.albumID);
      this.mergeLoadFun();
    } else {
      app.utils.toast("请选择至少两张照片");
    }
  },
  // 拼图loading
  mergeLoadFun: function() {
    this.setData({
      puzzleState: false,
      puzzleCount: 0,
      puzzlePushData: [],
      puzzleUrl: [],
      mergeLoading: true
    });
  },
  // 两列/三列切换
  switchColumns: function() {
    let state = '';
    let name = '';
    this.data.columnState == 'three' ? state = 'two' : state = 'three';
    this.data.columnState == 'three' ? name = '三列' : name = '两列';
    this.setData({
      columnState: state,
      columnStateName: name,
      settingState: false
    });
    app.sensors.track('AlbumClick', {
      album_wechatid: this.data.albumID,
      album_click: name
    });
  },
  // 关闭大图弹层
  closePicInfo: function() {
    if (this.galleryView) {
      this.galleryView.closeGallery();
      this.galleryView = null;
      delete this.galleryView;
      delete this.currentChoiceLabelPhotosList;
    }
    this.setData({
      'popupInfo.switchState': true
    });
  },
  // 计算缩略图定位ID
  getPositionImgId: function(index, data) {
    let posID = '';
    if (index > 3) {
      let positionData = data[index - 4];
      posID = "id" + positionData.photoId;
    } else {
      console.log(data)
      posID = "id" + data[0].photoId;
    };
    return posID;
  },
  // 计算当前大图轮播data（3）
  getCurrentSwiperData: function(index) {
    let data = this.data.photoListData;
    let arr = [],
      current = 0;
    if (index + 3 > this.data.photoListTotal) {
      arr = data.slice(index - 1);
    } else {
      console.log(index - 1 < 0 ? 0 : index - 1, index + 2);
      arr = data.slice(index - 1 < 0 ? 0 : index - 1, index + 2);
    };
    console.log("CurrentSwiperData", arr);
    this.setData({
      CurrentSwiperData: arr
    });
  },

  // 打开大图弹层
  openBigPic: function(index) {
    let data, picIndex, item;
    if (this.data.choiceInfoStatus) {
      picIndex = index[1];
      this.currentChoiceLabelPhotosList = index[0];
      data = this.data.choiceInfo.choiceLabelPhotosList[this.currentChoiceLabelPhotosList].photoList;
    } else {
      picIndex = index;
      data = this.data.photoListData || [];
    }
    let that = this;
    that.galleryView = new VGalleryView(that, {
      loadMore: that.data.choiceInfoStatus || that.data.rankState ? null : that.loadMoreBigPics.bind(that),
      indexChanged: that.bigPicIndexChanged.bind(that),
      imageTaped: that.openZoomPic.bind(that),
      onBeforeOpen: function() {
        app.utils.loading();
        return new Promise(function(reslove) {
          wx.createSelectorQuery().selectViewport().scrollOffset().exec(function(res) {
            that.currentPageScrollTop = res[0].scrollTop;
            that.setData({
              showAlbumList: false,
            }, function() {
              reslove();
            });
          });
        });
      },
      onAfterOpened: function() {
        app.utils.hideLoading();
      },
      onBeforeClose: function(index) {
        app.utils.loading();
        return new Promise(function(reslove) {
          that.setData({
            showAlbumList: true,
          }, function() {
            let top = that.currentPageScrollTop || 0;
            if (picIndex == index) {
              wx.pageScrollTo({
                scrollTop: top,
                duration: 0
              });
              delete that.currentPageScrollTop;
              setTimeout(reslove, 100);
            } else {
              wx.createSelectorQuery().selectAll('.J_image_item').boundingClientRect().exec(function(res) {
                let resDataBase = res[0] && res[0][0];
                let resData = res[0] && res[0][index];

                let top = that.currentPageScrollTop || 0;
                if (resDataBase && resData) {
                  let windowHeight = wx.getSystemInfoSync().windowHeight;
                  top = resData.top - windowHeight / 2;
                }

                if (top < 0) {
                  top = 0;
                }

                wx.pageScrollTo({
                  scrollTop: top,
                  duration: 0
                });
                delete that.currentPageScrollTop;
                setTimeout(reslove, 100);
              });
            }
          });
        });
      },
      onAfterClosed: function() {
        app.utils.hideLoading();
      },
    });

    this.galleryView.openGallery(data, picIndex);
    this.openPopupUpdate(index, data, data[picIndex])
  },
  // 打开时间线大图
  TimeLineOpenBigPic: function(id) {
    let that = this;
    let data = this.data.photoListData;
    data.findIndex(function(item, index) {
      if (item.photoId == id) {
        that.openBigPic(index);
      }
    });
  },
  // 打开弹层缩略图,大图数据更新
  openPopupUpdate: function(index, data, item, curID = "", posID = "") {
    app.utils.console("photoId:", curID);
    app.utils.console(item);
    this.setData({
      popupCurData: data,
      popupCurInfo: item,
      'popupInfo.current': index,
      'popupInfo.currentId': curID,
      'popupInfo.positionId': posID,
      'popupInfo.switchState': false,
      'popupInfo.tagCurrent': this.currentChoiceLabelPhotosList || 0,
    });
  },

  bigPicIndexChanged: function(index) {
    let item;
    if (this.data.choiceInfoStatus) {
      item = this.data.choiceInfo.choiceLabelPhotosList[this.currentChoiceLabelPhotosList].photoList[index];
    } else {
      item = this.data.photoListData[index];
    }
    this.popupInfoUpdate(index, item);
  },

  //滑动移动事件
  handleTouchMove: function(event) {
    let currentX = event.touches[0].pageX;
    this.setData({
      endPoint: currentX
    });
    let tx = currentX - this.data.startPoint;
    let index = this.data.popupInfo.current;
    let total = this.data.popupCurData.length - 1;
    //左右方向滑动
    if (Math.abs(tx) > 100) {
      if (tx < 0) {
        this.setData({
          'selfSwiper.swiperVec': "right",
          'selfSwiper.swiperStat': true
        });
        console.log("向左滑动");
        if (index != total) {
          this.setData({
            isShow: "animate-hide"
          });
        }
      } else if (tx > 0) {
        this.setData({
          'selfSwiper.swiperVec': "left",
          'selfSwiper.swiperStat': true
        });
        console.log("向右滑动");
        if (index != 0) {
          this.setData({
            isShow: "animate-hide"
          });
        }
      };
    };
  },
  //滑动开始事件
  handleTouchStart: function(event) {
    console.log("startX:", event.touches[0].pageX);
    this.setData({
      startPoint: event.touches[0].pageX
    });
  },
  //滑动结束事件
  handleTouchEnd: function(event) {
    console.log("endX:", event.changedTouches[0].pageX);
    let self = this.data.selfSwiper;
    let index = this.data.popupInfo.current;
    let total = this.data.popupCurData.length - 1;
    console.log("current", index, "total:", total);
    if (self.swiperStat) {
      if (self.swiperVec == "left") {
        if (index > 0) {
          index = --this.data.popupInfo.current;
        } else {
          app.utils.toast("没有更多图片啦");
        }
      }
      if (self.swiperVec == "right") {
        if (index < total) {
          index = ++this.data.popupInfo.current;
        } else {
          app.utils.toast("没有更多图片啦");
        }
      };
      let data = this.data.popupCurData;
      let item = data[index];
      let curID = "id" + item.photoId;
      let posID = this.getPositionImgId(index, data);
      this.popupInfoUpdate(index, item, curID, posID);
      this.setData({
        'selfSwiper.swiperVec': "",
        'selfSwiper.swiperStat': false
      });
    }
  },
  // 大图滑动事件
  bindSlideChange: function(e) {
    if (e.detail.source == "touch") {
      let index = e.detail.current;
      console.log("touch", index);
      if (index == 0) {
        index = --this.data.popupInfo.current;
      } else {
        index = ++this.data.popupInfo.current;
      }
      console.log("current", index);
      let data = this.data.photoListData;
      let item = this.data.photoListData[index];
      let curID = "id" + item.photoId;
      let posID = this.getPositionImgId(index, data);
      console.log("Current:", e.detail);
      this.popupInfoUpdate(index, item, curID, posID);
    }
  },
  // 缩略图点击事件
  swichPopupImg: function(e) {
    let index = e.currentTarget.dataset.current;
    let data = this.data.popupCurData;
    let item = data[index];
    let curID = "id" + item.photoId;
    let posID = this.getPositionImgId(index, data);
    if (index != this.data.popupInfo.current) {
      this.setData({
        isShow: "animate-hide"
      });
      this.popupInfoUpdate(index, item, curID, posID);
    }
  },
  // 切换缩略图,大图数据更新
  popupInfoUpdate: function(index, data, curID = "", posID = "") {
    console.log("scroll ID:", index, data, curID);
    this.setData({
      isShow: "animate-show",
      popupCurInfo: data,
      'popupInfo.current': index,
      'popupInfo.currentId': curID,
      'popupInfo.positionId': posID
    });
    this.getAnalysePhotos(data);
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
    app.sensors.track('PictureClick', {
      album_wechatid: this.data.albumID,
      picture_click: "信息"
    });
  },
  // 打开缩放弹层
  openZoomPic: function(e) {
    console.log("openZoomPic called");
    let url = this.data.popupCurInfo.smallUrl;
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: [url] // 需要预览的图片http链接列表
    });
    app.sensors.track('PictureClick', {
      album_wechatid: this.data.albumID,
      picture_click: "查看大图"
    });
  },
  // 保存图片
  userSave: function() {
    let data = this.data.popupCurInfo;
    app.utils.download(data.downloadSmallUrl);
    app.sensors.track('PictureClick', {
      album_wechatid: this.data.albumID,
      picture_click: "下载"
    });
  },
  //引导设置
  openAlbumAuth: function() {
    wx.showModal({
      content: '关闭相册权限获取会导致无法下载图片，去打开？',
      success: function(res) {
        if (res.confirm) {
          wx.openSetting({
            //打开微信设置
            success: function(res) {
              //获取设置状态
              wx.getSetting({
                success: function(res) {
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
  // 登录授权
  getUserInfoStatus: function() {
    let that = this;
    app.getLoginFun().then(function(info) {
      console.log("回调：", info)
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
      let data = this.data.popupCurInfo;
      let url = "likePhotoModel";
      let params = {
        weChatId: this.data.albumID,
        photoId: this.data.popupCurInfo.photoId
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
      let index = source.data.popupInfo.current;
      if (this.data.choiceInfoStatus) {
        let tag = source.data.popupInfo.tagCurrent;
        let origin = source.data.choiceInfo;
        let data = source.data.popupCurData;
        data[index].likeStatus = 1;
        data[index].likeNum = data[index].likeNum + 1;
        origin.choiceLabelPhotosList[tag].photoList = data;
        source.setData({
          choiceInfo: origin,
          popupCurInfo: data[index],
          permitLike: true
        });
      } else {
        let data = source.data.photoListData;
        data[index].likeStatus = 1;
        data[index].likeNum = data[index].likeNum + 1;
        source.setData({
          photoListData: data,
          popupCurInfo: data[index],
          permitLike: true
        });
      }
    } else {
      this.setData({
        permitLike: true
      });
      app.utils.toast("网络繁忙，请稍后再试");
    };
  },
  // 获取图片列表数据url
  getPhotoListUrls: function() {
    let photoList = this.data.photoListData;
    let urls = [];
    photoList.findIndex(function(item, index) {
      urls.push(item.smallUrl);
    });
    this.setData({
      photoListUrls: urls
    });
  },
  // 阻止滚动穿透
  stopScrollEvent: function() {
    // stop user scroll it!
  },
  // 大图浏览量收集
  getAnalysePhotos: function(data) {
    let isVideo = this.data.isVideo;
    let url = "analysePhotosModel";
    let params = {
      weChatId: this.data.albumID,
      photoName: JSON.stringify([data.photoName]),
      photoId: data.photoId,
      type: isVideo ? 2 : 0
    };
    console.log(data.photoId);
    app.request.requestPostApi(url, params, "ANALYSE_PHOTO", this.successFun, this.failFun);
  },
  //播放视频
  playVideo: function(e) {
    let that = this,
      id = e.currentTarget.dataset.id,
      name = e.currentTarget.dataset.name,
      params = {
        photoName: name,
        photoId: id
      }
    this.getAnalysePhotos(params); //记录播放次数

    let index = e.currentTarget.dataset.current,
      list = this.data.videoListData;
    list[index].isShowVideo = true;
    that.videoDom = wx.createVideoContext('myVideo' + index, this);
    list.forEach(function(val, id) {
      if (id == index) {
        val.isShowVideo = true;
        that.videoDom.play();
      } else {
        val.isShowVideo = false;
      }
    })
    this.setData({
      videoListData: list
    })
  },
  // 请求图元信息
  getPhotoMeta: function() {
    let url = "getPhotoMetaDetailModel";
    let params = {
      weChatId: this.data.albumID,
      photoName: this.data.popupCurInfo.photoName
    };
    app.request.requestPostApi(url, params, this, this.UserSetPhotoMeta, this.failFun);
  },
  UserSetPhotoMeta: function(res, source) {
    // 请求成功返回数据
    source.setData({
      photoMetaInfo: res.data
    });
    console.log("PHOTO_META:", res.data);
  },

  // 对显示时间进行格式化
  formatTimeTitle: function(hour) {
    Number(hour) < 23 ? hour = hour + ":00-" + (Number(hour) + 1) + ":00" : hour = hour + ":00-" + "00:00";
    return hour;
  },
  // 相册数据清洗重组
  getYearArr: function(arr) {
    let that = this;
    let yearArr = [];
    arr.map(function(item) {
      let arr = item.photoTime.split(" ");
      let year = arr[0];
      let hour = arr[1].substr(0, 2);
      let first = yearArr.findIndex(function(item) {
        return item.title == year
      })
      if (first == -1) {
        yearArr.push({
          title: year,
          dayList: []
        });
        let index = yearArr.findIndex(function(item) {
          return item.title == year
        });
        let hh = that.formatTimeTitle(hour);
        yearArr[index].dayList.push({
          time: hour,
          timeTitle: hh,
          hourList: [item]
        });
      } else {
        let index = yearArr[first].dayList.findIndex(function(item) {
          return item.time == hour
        });
        if (index == -1) {
          let hh = that.formatTimeTitle(hour);
          yearArr[first].dayList.push({
            time: hour,
            timeTitle: hh,
            hourList: [item]
          })
        } else {
          yearArr[first].dayList[index].hourList.push(item);
        }
      }
    });
    // console.log(yearArr);
    return yearArr;
  },
  // 时间线数据清洗
  getTimeLineData: function(arr) {
    let that = this;
    let datas = this.getYearArr(arr);
    this.setData({
      timeLIneData: datas
    });
  },

  // 请求相册tag
  getAlbumTag: function() {
    let url = "getAlbumTagModel";
    let params = {
      weChatId: this.data.albumID
    };
    app.request.requestPostApi(url, params, "ALBUM_TAG", this.successFun, this.failFun);
  },
  // 获取相册信息
  getPhotoList: function() {
    let url = "getPhotoList";
    let params = {
      task_id: this.data.albumID,
    };
    app.request.requestRestGetApi(url, params, "PHOTO_LIST", this.successFun, this.failFun);
  },

  // 请求成功返回数据
  successFun: function(res, code) {
    var that = this;
    switch (code) {
      case "PHOTO_LIST":
        let ListArr = [],
          lastId = '';
        if (res.errno == 0) {
          ListArr = res.data.photos;

          let albumInfo = that.data.albumInfo;
          let photoListTotal = res.data.total;
          albumInfo['subHeadTitle'] = `共 ${photoListTotal} 张图`;
          that.setData({
            photoListData: ListArr,
            photoListTotal: photoListTotal,
            albumInfo: albumInfo,
          });
        } else {
          app.utils.toast(res.message);
        }
        app.utils.hideLoading();
        wx.stopPullDownRefresh();
        break;
    }
  },
  // 页面初始化
  init: function() {
    app.utils.loading();
    this.getPhotoList();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("相册参数：", options);
    wx.hideShareMenu();
    options = {
      albumID: '1',
    }
    if (options.albumID) {
      this.setData({
        albumID: options.albumID
      });
      // this.passwordLayer = this.selectComponent("#pass-layer");
      this.init();
    } else {
      app.utils.toast("呀，发生错误啦！");
      this.goIndex();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // 获取组件实例
    // this.albumLayer = this.selectComponent("#module-layer");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 每次切换页面 更新初始设置
    this.setData({
      token: wx.getStorageSync('token'),
      mergeLoading: false
    });
    console.log('token：', this.data.token);
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
    if (this.data.popupInfo.switchState && !this.data.puzzleState) {
      this.setData({
        reloadState: true
      });
      console.log("下拉刷新：", this.data.reloadState);
      this.init();
    } else {
      wx.stopPullDownRefresh();
      console.log("大图弹层不触发刷新");
    }
  },

  /**
   * 页面相关事件处理函数--用户滑动
   */
  onPageScroll: function(res) {
    let state = this.data.videoListData.length > 1 || this.data.photoListData.length > 12;
    if (res.scrollTop > 120 && state) {
      this.setData({
        onTopState: true
      })
    } else {
      this.setData({
        onTopState: false
      })
    };
    this.setData({
      settingState: false
    });
    // console.log(res.scrollTop);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (!this.data.choiceInfoStatus && !this.data.rankState) {
      this.getPhotoList();
    } else {
      console.log("此处不刷新=-=");
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(options) {
    let popupCurInfo = this.data.popupCurInfo;
    let title = '',
      path = '',
      imgUrl = '';
    if (options.from === 'menu') {
      // 来自右上角转发按钮
      title = "图片直播-" + this.data.albumInfo.headTitle;
      path = "pages/cover/cover" + "?albumID=" + this.data.albumID + "&source=2009";
      imgUrl = this.data.coverInfo.coverUrl;
      console.log(imgUrl);
    } else {
      title = "分享照片";
      path = "pages/picShare/picShare" + "?albumID=" + this.data.albumID + "&photoId=" + popupCurInfo.photoId;
      console.log(this.data.albumID);
      imgUrl = popupCurInfo.smallUrl;
      app.sensors.track('PictureClick', {
        album_wechatid: this.data.albumID,
        picture_click: "分享"
      });
    }
    return {
      title: title,
      path: path,
      imageUrl: imgUrl,
      success: function(res) {
        // 转发成功
        app.sensors.track('SharePage', {
          share_page: '相册'
        });
        console.log("转发属性：", res)
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
})