const app = getApp();

const { now, throttle, debounce, delay, scrollViewPxToRpx } = require("./utils.js");

class Thumbs {

  constructor(manager) {
    this.manager = manager;
    this.page = this.manager.page;

    this.page._thumbs_touch_start = this._handleEventStart.bind(this);
    this.page._thumbs_touch_move = this._handleEventMove.bind(this);
    this.page._thumbs_touch_end = this._handleEventEnd.bind(this);
    this.page._swipe_item_tap = this._thumbsItemTaped.bind(this);

    this.transform = {};
    this.touch = {};

    this.page.data._gallery_thumbs_photoList = [];

    this.drawThumbImages = throttle(this.drawThumbImages.bind(this), 15);
    this.focusToPosition = throttle(this.focusToPosition.bind(this), 15);
  }

  clear() {
    this.transform = {};
    this.touch = {};
    this.page.setData({
      _gallery_thumbs_photoList: [],
    });
  }

  init(currentIndex) {
    let post1 = new Promise((reslove) => {
      wx.createSelectorQuery().select('.J_thumbs_view').boundingClientRect().exec(reslove);
    })
    let post2 = new Promise((reslove) => {
      wx.createSelectorQuery().select('.J_thumb_choosed').boundingClientRect().exec(reslove);
    });

    Promise.all([post1, post2]).then(function ([resp1, resp2]) {
      this.thumbsWidth = resp1[0].width;

      this.transform = {
        currentIndex: currentIndex,
        lastIndex: currentIndex,
        x: 0
      };
      this.choosedItem = {
        left: (resp1[0].width - resp2[0].width) / 2,
        width: resp2[0].width
      };
      this.drawThumbImages();
    }.bind(this));

  }

  _handleEventStart(event) {
    this._clearAnimationToTransformTask();
    this.touch = {
      lastX: event.changedTouches[0].clientX,
      lastY: event.changedTouches[0].clientY,
    };
    this.transform = {
      x: 0,
      ...this.transform || {},
    }
    this.transform.lastIndex = this.transform.currentIndex;
  }

  _handleEventMove(event) {
    this._clearAnimationToTransformTask();
    let currX = event.changedTouches[0].clientX;
    let currY = event.changedTouches[0].clientY;
    let lastX = this.touch.lastX;
    let lastY = this.touch.lastY;

    if (currX < lastX) {
      this.touch.direction = "left";
      this.transform.x = this.transform.x - (lastX - currX);
    } else if (currX > lastX) {
      this.touch.direction = "right";
      this.transform.x = this.transform.x + (currX - lastX);
    }
    if (Math.abs(currX - lastX) < 3) {
      delete this.touch.direction;
    }

    this._suitTransformAndCurrIndex();
    this.touch.lastX = currX;

    this.drawThumbImages();
  }

  _handleEventEnd(event) {
    this._targetAnimationToIndex(this.touch.direction);
    this.touch = {};
  }

  _thumbsItemTaped(event) {
    let index = event.currentTarget.dataset.imageidx;
    if (index < this.transform.currentIndex) {
      this._animationToPosition(index, 'right');
    } else if (index > this.transform.currentIndex) {
      this._animationToPosition(index, 'left');
    }
  }

  _animationToPosition(targetIndex, direction) {
    this._clearAnimationToTransformTask();
    if (direction == 'right') {
      this.transform.x += 10;
      this._suitTransformAndCurrIndex();
      if (this.transform.currentIndex == targetIndex && this.transform.x > 0) {
        this.transform.x = 0;
        this._suitTransformAndCurrIndex();
      }
    } else if (direction == 'left') {
      this.transform.x -= 10;
      this._suitTransformAndCurrIndex();
      if (this.transform.currentIndex == targetIndex && this.transform.x < 0) {
        this.transform.x = 0;
        this._suitTransformAndCurrIndex();
      }
    }

    this.drawThumbImages();
    if (targetIndex != this.transform.currentIndex || (targetIndex == this.transform.currentIndex && this.transform.x != 0)) {
      this.animationToPositionTask = setTimeout(function() {
        this._animationToPosition(targetIndex, direction);
      }.bind(this), 15);
    } else {
      this.manager.imageChoosed(this.transform.currentIndex);
    }
  }

  focusToPosition(currentIndex, transRate) {
    this._clearAnimationToTransformTask();
    if (this.choosedItem.width > 0) {
      this.transform.currentIndex = currentIndex;
      this.transform.x = parseInt(this.choosedItem.width * transRate);
      this.drawThumbImages();
    }
  }

  _suitTransformAndCurrIndex() {
    if (this.choosedItem.width > 0) {
      let currentIndex = this.transform.currentIndex || 0;

      if ((currentIndex == 0 && this.transform.x > 0)
        || (currentIndex == this.manager.all_images_list.length - 1 && this.transform.x < 0)) {
        this.transform.x = 0;
      } else if (this.transform.x > this.choosedItem.width / 2) {
        this.transform.currentIndex -= 1;
        this.transform.x = - 1 * (this.choosedItem.width - this.transform.x);
      } else if (this.transform.x < this.choosedItem.width / 2 * -1) {
        this.transform.currentIndex += 1;
        this.transform.x = this.choosedItem.width + this.transform.x;
      }

      this.manager.swiper.focusToPosition(this.transform.currentIndex, (this.transform.x / this.choosedItem.width).toFixed(2));
      this.manager.requireGallery(this.transform.currentIndex);
    }
  }

  _targetAnimationToIndex(direction) {
    let currentIndex = this.transform.currentIndex || 0;
    let _currentIndex = currentIndex;

    if (direction == "left" && this.transform.x < 0) {
      _currentIndex += 1;
    } else if (direction == "right" && this.transform.x > 0) {
      _currentIndex -= 1;
    }

    if (_currentIndex < 0) {
      _currentIndex = 0;
    } else if (_currentIndex > this.manager.all_images_list.length - 1) {
      _currentIndex = this.manager.all_images_list.length - 1;
    }

    let transX = this.transform.x;
    if (currentIndex > _currentIndex) {
      transX = -1 * (this.choosedItem.width - this.transform.x);
    } else if (currentIndex < _currentIndex) {
      transX = this.choosedItem.width + this.transform.x;
    }
    
    if (_currentIndex != this.transform.lastIndex) {
      this.manager.imageChoosed(_currentIndex);
    }

    this.transform.currentIndex = _currentIndex;
    this.transform.lastIndex = currentIndex;
    this.transform.x = transX;
    this._animationToTransform();

    this.manager.requireGallery(this.transform.currentIndex);
  }

  _clearAnimationToTransformTask() {
    if (this.animationToTransformTask) {
      clearTimeout(this.animationToTransformTask);
      this.animationToTransformTask = null;
    }

    if (this.animationToPositionTask) {
      clearTimeout(this.animationToPositionTask);
      this.animationToPositionTask = null;
    }
  }

  _animationToTransform() {
    this._clearAnimationToTransformTask();
    if (this.transform.x < 0) {
      this.transform.x = parseInt(this.transform.x + this.choosedItem.width / 4);
      if (this.transform.x > 0) {
        this.transform.x = 0;
      }
    } else if (this.transform.x > 0) {
      this.transform.x = parseInt(this.transform.x - this.choosedItem.width / 4);
      if (this.transform.x < 0) {
        this.transform.x = 0;
      }
    }

    this.drawThumbImages();
    this.manager.swiper.focusToPosition(this.transform.currentIndex, (this.transform.x / this.choosedItem.width).toFixed(2));

    if (this.transform.x != 0) {
      this.animationToTransformTask = setTimeout(this._animationToTransform.bind(this), 5);
    }
  }

  drawThumbImages(focus) {
    let _imageList = this.getNeedDrawThumbImages(focus);
    let currentIndex = this.transform.currentIndex || 0;
    let transform = this.transform;
    let swiperWidth = this.swiperWidth || 0;

    _imageList.forEach(function (item) {
      item.transX = (item.idx - currentIndex) * (this.choosedItem.width + 4) + (transform.x || 0) + this.choosedItem.left;
    }.bind(this));

    this.manager.coreSend("_gallery_thumbs_photoList", _imageList);
  }

  getNeedDrawThumbImages(focus) {
    let currentIndex = this.transform.currentIndex || 0;
    let lastDrawedIndex = this.lastDrawedIndex;
    if (focus || currentIndex != lastDrawedIndex) {
      let all_images_list = this.manager.all_images_list;
      let preLoads = Math.ceil(this.thumbsWidth / 2 / this.choosedItem.width * 2);
      let startIndex = currentIndex - preLoads;
      let endIndex = currentIndex + preLoads;

      if (startIndex < 0) {
        startIndex = 0;
      }
      
      if (endIndex > all_images_list.length) {
        endIndex > all_images_list.length;
      }

      let _imageList = [];
      for (let i = startIndex; i < endIndex; ++i) {
        _imageList.push({
          ...all_images_list[i]
        });
      }
      this.lastDrawedIndex = currentIndex;
      return _imageList;

    } else {
      return [].concat(this.page.data._gallery_thumbs_photoList || []);
    }
  }
}

module.exports = Thumbs;