const app = getApp();

let scrollViewRpx = 80;
let scrollViewPxToRpx = 1;
let thumbImageWidth = 122;

const { now, throttle, debounce, delay } = require("./utils.js"); 
const Swiper = require("./swiper.js");
const Thumbs = require("./thumbs.js");

class VGalleryViewer {

  constructor(pageContext, options = {}) {
    this.loadMoreFunc = options.loadMore;
    this.indexChanged = options.indexChanged;
    this.imageTaped = options.imageTaped;
    this.onBeforeOpen = options.onBeforeOpen;
    this.onAfterOpened = options.onAfterOpened;
    this.onBeforeClose = options.onBeforeClose;
    this.onAfterClosed = options.onAfterClosed;

    this.page = pageContext;
    this.page.data._gallery_view_show_status = false;

    this.swiper = new Swiper(this);
    this.thumbs = new Thumbs(this);

    this.all_images_list = [];
  }

  addImagesList(imagesList, updateUI = true) {
    let allIdx = (this.all_images_list || []).length;
    let _imageList = (imagesList || []).map(function (item, index) {
      let idx = allIdx + index;
      return {
        ...item,
        idx: idx
      };
    });
    this.all_images_list = [].concat(this.all_images_list, _imageList);
    this.isLoadingMoreOp = false;

    if (updateUI) {
      this.swiper.drawImages(true);
      this.thumbs.drawThumbImages(true);
    }
  }

  imageChoosed(index) {
    this.currentIndex = index;
    this.indexChanged && setTimeout(function() {
      this.indexChanged(index);
    }.bind(this), 15);
  }

  _galleryDraw(index = 0) {
    this.delaySender = null;
    this.coreSendTask = setInterval(function() {
      if (!!this.delaySender) {
        this.page.setData({
          ...this.delaySender,
        })
        this.delaySender = null;
      }
    }.bind(this), 25);
    this.swiper.init(index);
    this.thumbs.init(index);
    this.imageChoosed(index);

    this.onAfterOpened && this.onAfterOpened();
  }

  coreSend(key, value) {
    this.delaySender = this.delaySender || {};
    this.delaySender[key] = value;
  }

  _clear() {
    this.swiper.clear();
    this.thumbs.clear();

    this.delaySender = null;
    if (this.coreSendTask) {
      clearInterval(this.coreSendTask);
      this.coreSendTask = null;
    }
    this.all_images_list = [];
    this.currentIndex = null;
  }

  requireGallery(currentIndex) {
    if (currentIndex > this.all_images_list.length - 10) {
      if (!this.isLoadingMoreOp) {
        this.isLoadingMoreOp = true;
        this.loadMoreFunc && this.loadMoreFunc();
      }
    }
  }

  _toOpen(imagesList, index) {
    this.addImagesList(imagesList, false);
    this._galleryDraw(index);
  }

  openGallery(imagesList, index) {
    this.page.setData({
      _gallery_view_show_status: true,
    }, function() {
      let promise = this.onBeforeOpen && this.onBeforeOpen();
      if (!!promise && !!promise.then) {
        promise.then(function () {
          this._toOpen(imagesList, index);
        }.bind(this));
      } else {
        this._toOpen();
      };
    }.bind(this));
  }

  _toClose() {
    this.page.setData({
      _gallery_view_show_status: false,
    });
    this._clear();
    this.onAfterClosed && this.onAfterClosed();
  }

  closeGallery() {
    let promise = this.onBeforeClose && this.onBeforeClose(this.currentIndex);
    if (!!promise && !!promise.then) {
      promise.then(function() {
        this._toClose();
      }.bind(this));
    } else {
      this._toClose();
    }
  }
}


module.exports = VGalleryViewer