const app = getApp();

const { now, throttle, debounce, delay, scrollViewPxToRpx } = require("./utils.js");

class Swiper {

  constructor(manager) {
    this.manager = manager;
    this.page = this.manager.page;
    this.page.data._gallery_swiper_photoList = [];

    this.page._swiper_touch_start = this._handleEventStart.bind(this);
    this.page._swiper_touch_move = this._handleEventMove.bind(this);
    this.page._swiper_touch_end = this._handleEventEnd.bind(this);
    this.page._swiper_item_taped = this._swiperItemTaped.bind(this);

    this.transform = {};
    this.drawImages = throttle(this.drawImages.bind(this), 15);
    this.focusToPosition = throttle(this.focusToPosition.bind(this), 15);
  }

  clear() {
    this.transform = {};
    this.touch = {};
    this.page.setData({
      _gallery_swiper_photoList: [],
    });
  }

  _handleEventStart(event) {
    this._clearAnimationToTransformTask();
    this.touch = {
      started: true,
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

    this._suitTransformAndCurrIndex(event);
    this.touch.lastX = currX;

    this.drawImages();
  }

  _handleEventEnd(event) {
    this._targetAnimationToIndex(this.touch.direction);
    this.touch = {};
  }

  _swiperItemTaped(event) {
    let index = event.currentTarget.dataset.imageidx;
    this.manager.imageTaped && this.manager.imageTaped(index);
  }

  focusToPosition(currentIndex, transRate) {
    this._clearAnimationToTransformTask();
    if (this.swiperWidth > 0) {
      this.transform.currentIndex = currentIndex;
      this.transform.x = parseInt(this.swiperWidth * transRate);
      this.drawImages();
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
      transX = -1 * (this.swiperWidth - this.transform.x);
    } else if (currentIndex < _currentIndex) {
      transX = this.swiperWidth + this.transform.x;
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
  }
  
  _animationToTransform() {
    this._clearAnimationToTransformTask();
    if (this.transform.x < 0) {
      this.transform.x = parseInt(this.transform.x + this.swiperWidth / 10);
      if (this.transform.x > 0) {
        this.transform.x = 0;
      }
    } else if (this.transform.x > 0) {
      this.transform.x = parseInt(this.transform.x - this.swiperWidth / 10);
      if (this.transform.x < 0) {
        this.transform.x = 0;
      }
    }

    this.drawImages();
    this.manager.thumbs.focusToPosition(this.transform.currentIndex, (this.transform.x / this.swiperWidth).toFixed(2));

    if (this.transform.x != 0) {
      this.animationToTransformTask = setTimeout(this._animationToTransform.bind(this), 5);
    }
  }

  _suitTransformAndCurrIndex(event) {
    if (this.swiperWidth > 0) {
      let currentIndex = this.transform.currentIndex || 0;

      if ((currentIndex == 0 && this.transform.x > 0) 
        || (currentIndex == this.manager.all_images_list.length - 1 && this.transform.x < 0)) {
        this.transform.x = 0;
      } else if (this.transform.x > this.swiperWidth / 2) {
        this.transform.currentIndex -= 1;
        this.transform.x = - 1 * (this.swiperWidth - this.transform.x);
      } else if (this.transform.x < this.swiperWidth / 2 * -1) {
        this.transform.currentIndex += 1;
        this.transform.x = this.swiperWidth + this.transform.x;
      }
      this.manager.thumbs.focusToPosition(this.transform.currentIndex, (this.transform.x / this.swiperWidth).toFixed(2));
    }
  }
  
  init(currentIndex) {
    wx.createSelectorQuery().select('.J_swiper_view').boundingClientRect().exec(function (resp) {
      this.swiperWidth = resp[0].width;
      this.transform = {
        currentIndex: currentIndex,
        lastIndex: currentIndex,
        x: 0
      };
      this.drawImages();
    }.bind(this));
  }

  drawImages(focus) {
    let _imageList = this.getNeedDrawImages(focus);
    let currentIndex = this.transform.currentIndex || 0;
    let transform = this.transform;
    let swiperWidth = this.swiperWidth || 0;
    
    _imageList.forEach(function(item) {
      item.transX = (item.idx - currentIndex) * (swiperWidth + 20) + (transform.x || 0);
    });

    this.manager.coreSend("_gallery_swiper_photoList", _imageList);
  }

  getNeedDrawImages(focus) {
    let currentIndex = this.transform.currentIndex || 0;
    let lastDrawedIndex = this.lastDrawedIndex;

    if (focus || currentIndex != lastDrawedIndex) {
      let all_images_list = this.manager.all_images_list;

      let startIndex = currentIndex - 5;
      let endIndex = currentIndex + 5;
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
      return [].concat(this.page.data._gallery_swiper_photoList || []);
    }
  }
}

module.exports = Swiper;