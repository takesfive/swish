"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function () {
  var arr = [window.Element, window.CharacterData, window.DocumentType];
  var args = [];
  arr.forEach(function (item) {
    if (item) {
      args.push(item.prototype);
    }
  });

  (function (arr) {
    arr.forEach(function (item) {
      if (item.hasOwnProperty('remove')) {
        return;
      }

      Object.defineProperty(item, 'remove', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function remove() {
          this.parentNode.removeChild(this);
        }
      });
    });
  })(args);
})();
/**
 * // TODO fix pagination bug
 * if this.config.slides > 1
 * */

/* eslint-disable no-extra-semi */


var Swish =
/*#__PURE__*/
function () {
  function Swish(slider) {
    _classCallCheck(this, Swish);

    this.slider = slider;
    this.counter = 0;
    this.currentTransform = 0;
    this.preventMove = false;
    this.transformCss = this.supportTransformCss('transform');
    this.resizeTimeout = 0;
    this.cacheWindowSize = document.documentElement.clientWidth;
    this.touch = {
      delayAndDir: 0,
      isTouch: false,
      isTouchAction: null,
      startX: 0,
      startY: 0,
      moveX: 0,
      moveY: 0,
      move: 0,
      canMove: false,
      delay: 40
    };
    this.drag = {
      shiftX: 0,
      startX: 0,
      endX: 0,
      move: 0,
      prevent: false
    };
  }

  _createClass(Swish, [{
    key: "spreadHtmlArrayHelper",
    value: function spreadHtmlArrayHelper(itemsArray) {
      return Array.prototype.slice.call(itemsArray);
    }
  }, {
    key: "arrayFromLengthHelper",
    value: function arrayFromLengthHelper(length) {
      return Array.apply(null, Array(length));
    }
  }, {
    key: "supportTransformCss",
    value: function supportTransformCss(prop) {
      var support = false;
      if ('-moz-' + prop in document.body.style) support = 'mozTransform';
      if ('-webkit-' + prop in document.body.style) support = 'webkitTransform';
      if ('-ms-' + prop in document.body.style) support = 'msTransform';
      if ('-o-' + prop in document.body.style) support = 'oTransform';
      if (prop in document.body.style) support = 'transform';
      return support;
    }
  }, {
    key: "getSize",
    value: function getSize(containerWidth, quantity) {
      var shifted = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      return Math.ceil(containerWidth / quantity) - shifted;
    }
  }, {
    key: "setSize",
    value: function setSize(items, width) {
      this.spreadHtmlArrayHelper(items).forEach(function (item) {
        return item.style.width = "".concat(width, "px");
      });
    }
  }, {
    key: "getSizeContainer",
    value: function getSizeContainer(itemSize, itemLength) {
      return Math.ceil(itemSize * itemLength);
    }
  }, {
    key: "setSizeContainer",
    value: function setSizeContainer(container, width) {
      container.style.width = "".concat(width, "px");
    }
  }, {
    key: "activeSetter",
    value: function activeSetter(parentElem) {
      var _this = this;

      this.spreadHtmlArrayHelper(parentElem.children).forEach(function (item) {
        item.classList.remove('active');
        item.setAttribute('aria-hidden', true);
      });
      this.arrayFromLengthHelper(this.config.slides).forEach(function (item, idx) {
        parentElem.children[_this.counter + idx].classList.add('active');
        parentElem.children[_this.counter + idx].setAttribute('aria-hidden', false);
      });
    }
  }, {
    key: "isGrab",
    value: function isGrab() {
      var isActive = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      if (isActive) this.list.setAttribute('is-grab', true);else this.list.removeAttribute('is-grab');
    }
  }, {
    key: "paginationActiveSetter",
    value: function paginationActiveSetter(parentElem) {
      var _this2 = this;

      // TODO fix this.config.slides === 1
      if (this.config.pagination && this.config.slides === 1) {
        this.spreadHtmlArrayHelper(parentElem.children).forEach(function (item) {
          item.classList.remove('active');
        });

        if (this.config.infinity) {
          this.arrayFromLengthHelper(this.config.slides).forEach(function (item, idx) {
            if (parentElem.children[_this2.counter - _this2.config.slides + idx]) {
              parentElem.children[_this2.counter - _this2.config.slides + idx].classList.add('active');
            }
          });
        } else {
          this.arrayFromLengthHelper(this.config.slides).forEach(function (item, idx) {
            parentElem.children[_this2.counter + idx].classList.add('active');
          });
        }
      }
    }
  }, {
    key: "pagination",
    value: function pagination() {
      var _this3 = this;

      // TODO fix this.config.slides === 1
      if (this.config.pagination && this.config.slides === 1) {
        if (this.slider.querySelector('.swish-pagination')) {
          this.slider.querySelector('.swish-pagination').remove();
        }

        var paginationBlock = document.createElement('div');
        var paginationList = document.createElement('div');
        paginationBlock.classList.add('swish-pagination');
        paginationList.classList.add('swish-pagination__list');
        var paginationItems = this.arrayFromLengthHelper(this.listItemsNoCloned.length).map(function () {
          return '<button class="swish-pagination__list-item"></button>';
        });
        paginationList.innerHTML = paginationItems.join('');
        paginationBlock.appendChild(paginationList);
        this.slider.appendChild(paginationBlock);
        this.spreadHtmlArrayHelper(this.slider.querySelectorAll('.swish-pagination__list-item')).forEach(function (item, idx) {
          if (_this3.config.infinity) {
            item.addEventListener('click', _this3.handleClickPagination.bind(_this3, idx + 1));
          } else {
            item.addEventListener('click', _this3.handleClickPagination.bind(_this3, idx));
          }
        });
      } else {
        if (this.slider.querySelector('.swish-pagination')) {
          this.slider.querySelector('.swish-pagination').remove();
        }
      }
    }
  }, {
    key: "handleClickPagination",
    value: function handleClickPagination(index) {
      this.counter = index;
      this.move();
    }
  }, {
    key: "clearClonedItmes",
    value: function clearClonedItmes() {
      var _this4 = this;

      this.list = this.slider.querySelector('.swish-list');
      this.spreadHtmlArrayHelper(this.list.children).forEach(function (item) {
        if (item.classList.contains('cloned')) {
          _this4.list.removeChild(item);
        }
      });
    }
  }, {
    key: "infinity",
    value: function infinity() {
      var _this5 = this;

      this.list = this.slider.querySelector('.swish-list');
      this.sizeItem = this.getSize(this.slider.offsetWidth, this.config.slides, this.config.shifted);
      this.clearClonedItmes();
      this.spreadHtmlArrayHelper(this.list.children).filter(function (el) {
        return !el.classList.contains('cloned');
      }).slice(0, this.config.slides).map(function (node) {
        return node.cloneNode(true);
      }).forEach(function (node) {
        node.classList.add('cloned');

        _this5.list.insertAdjacentElement('beforeEnd', node);
      });
      this.spreadHtmlArrayHelper(this.list.children).filter(function (el) {
        return !el.classList.contains('cloned');
      }).slice(-this.config.slides).map(function (node) {
        return node.cloneNode(true);
      }).reverse().forEach(function (node) {
        node.classList.add('cloned');

        _this5.list.insertAdjacentElement('afterBegin', node);
      });
    }
  }, {
    key: "move",
    value: function move() {
      var _this6 = this;

      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$direction = _ref.direction,
          direction = _ref$direction === void 0 ? 0 : _ref$direction;

      if (direction > 0) this.counter--;else if (direction < 0) this.counter++;
      this.list.style.transition = "transform ".concat(this.speed, "ms ease 0s");

      if (this.config.infinity) {
        if (this.counter <= 0) {
          this.list.style.transition = "transform ".concat(this.speed, "ms ease 0s");
          this.currentTransform = -(this.sizeItem * this.counter) + this.config.shifted * this.config.slides / 2;
          this.list.style[this.transformCss] = "translate3d(".concat(this.currentTransform, "px, 0, 0)");
          this.counter = this.itemsLength - this.config.slides - this.config.slides;
          this.preventMove = true;
          setTimeout(function () {
            _this6.list.style.transition = 'transform 0s ease 0s';
            _this6.currentTransform = -(_this6.sizeItem * (_this6.itemsLength - _this6.config.slides - _this6.config.slides)) + _this6.config.shifted * _this6.config.slides / 2;
            _this6.list.style[_this6.transformCss] = "translate3d(".concat(_this6.currentTransform, "px, 0, 0)");
            _this6.counter = _this6.itemsLength - _this6.config.slides - _this6.config.slides;
            _this6.preventMove = false;
          }, this.speed);
        } else if (this.counter >= this.itemsLength - this.config.slides) {
          this.list.style.transition = "transform ".concat(this.speed, "ms ease 0s");
          this.currentTransform = -(this.sizeItem * this.counter) + this.config.shifted * this.config.slides / 2;
          this.list.style[this.transformCss] = "translate3d(".concat(this.currentTransform, "px, 0, 0)");
          this.counter = this.config.slides;
          this.preventMove = true;
          setTimeout(function () {
            _this6.list.style.transition = 'transform 0s ease 0s';
            _this6.currentTransform = -(_this6.sizeItem * _this6.config.slides) + _this6.config.shifted * _this6.config.slides / 2;
            _this6.list.style[_this6.transformCss] = "translate3d(".concat(_this6.currentTransform, "px, 0, 0)");
            _this6.counter = _this6.config.slides;
            _this6.preventMove = false;
          }, this.speed);
        } else {
          this.preventMove = true;
          this.list.style.transition = "transform ".concat(this.speed, "ms ease 0s");
          this.currentTransform = -(this.sizeItem * this.counter) + this.config.shifted * this.config.slides / 2;
          this.list.style[this.transformCss] = "translate3d(".concat(this.currentTransform, "px, 0, 0)");
          setTimeout(function () {
            _this6.preventMove = false;
          }, this.speed);
        }
      } else {
        this.preventMove = true;

        if (this.counter <= 0) {
          this.counter = 0;
          this.currentTransform = -(this.sizeItem * this.counter);
        } else if (this.counter >= this.itemsLength - this.config.slides) {
          this.counter = this.itemsLength - this.config.slides;
          this.currentTransform = -(this.sizeItem * (this.itemsLength - this.config.slides)) + this.config.shifted * this.config.slides;
        } else {
          this.currentTransform = -(this.sizeItem * this.counter) + this.config.shifted * this.config.slides / 2;
        }

        this.list.style[this.transformCss] = "translate3d(".concat(this.currentTransform, "px, 0, 0)");
        setTimeout(function () {
          _this6.preventMove = false;
        }, this.speed);
      }

      this.activeSetter(this.list);
      this.paginationActiveSetter(this.slider.querySelector('.swish-pagination__list'));
    }
  }, {
    key: "getCoords",
    value: function getCoords(elem) {
      var box = elem.getBoundingClientRect();
      var body = document.body;
      var docEl = document.documentElement;
      var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
      var clientLeft = docEl.clientLeft || body.clientLeft || 0;
      var left = box.left + scrollLeft - clientLeft;
      return {
        left: Math.round(left)
      };
    }
  }, {
    key: "handleConrolsClick",
    value: function handleConrolsClick(e) {
      if (this.preventMove) return;

      switch (e.currentTarget.getAttribute('data-swish-dir')) {
        case 'next':
          this.move({
            direction: -1
          });
          break;

        case 'prev':
          this.move({
            direction: 1
          });
          break;
      }
    }
  }, {
    key: "handleTouchStart",
    value: function handleTouchStart(e) {
      if (this.preventMove) return;
      e.stopPropagation();
      this.touch.isTouch = true;
      this.delayAndDir = 0;
      this.list.style.transition = 'transform 0s ease 0s';
      this.touch.startX = e.touches[0].clientX;
      this.touch.startY = e.touches[0].clientY;
    }
  }, {
    key: "handleTouchMove",
    value: function handleTouchMove(e) {
      e.stopPropagation();
      this.touch.moveX = e.touches[0].clientX;
      this.touch.moveY = e.touches[0].clientY;

      if (this.touch.isTouchAction === null) {
        this.touch.isTouchAction = Math.abs(this.touch.moveX - this.touch.startX) > Math.abs(this.touch.moveY - this.touch.startY);
      }

      if (this.touch.isTouchAction) {
        this.touch.canMove = true;
      } else {
        this.touch.isTouch = false;
        this.touch.canMove = false;
      }

      if (this.touch.canMove && this.touch.isTouch) {
        e.preventDefault();
        this.list.style.transition = 'transform 0s ease 0s';
        this.delayAndDir = Math.round(this.touch.move - this.touch.startX);
        this.touch.move = e.changedTouches[0].clientX;
        this.list.style[this.transformCss] = "translate3d(".concat(Math.round(this.touch.move - this.touch.startX) + this.currentTransform, "px, 0, 0)");
      }
    }
  }, {
    key: "handleTouchEnd",
    value: function handleTouchEnd(e) {
      e.stopPropagation();
      this.list.style.transition = "transform ".concat(this.speed, "ms ease 0s");
      if (Math.abs(this.delayAndDir) > this.touch.delay) this.move({
        direction: this.delayAndDir
      });else this.move({
        direction: 0
      });
      this.touch.isTouch = false;
      this.touch.isTouchAction = null;
    }
  }, {
    key: "handleMousedown",
    value: function handleMousedown(e) {
      if (this.preventMove) return;
      var coords = this.getCoords(this.list);
      e.preventDefault();
      e.stopPropagation();
      this.dragOffset = 0;
      this.drag.move = true;
      this.isGrab();
      this.drag.startX = e.pageX;
      this.drag.shiftX = e.pageX - coords.left;
    }
  }, {
    key: "handleMousemove",
    value: function handleMousemove(e) {
      if (this.preventMove) return;
      e.preventDefault();
      this.dragOffset = this.drag.endX - this.drag.startX;

      if (this.drag.move) {
        this.drag.endX = e.pageX;
        this.list.style.transition = 'transform 0s ease 0s';
        this.currentTransform = e.pageX - this.drag.shiftX - this.slider.getBoundingClientRect().left;
        this.list.style[this.transformCss] = "translate3d(".concat(this.currentTransform, "px, 0, 0)");
      }
    }
  }, {
    key: "handleMouseup",
    value: function handleMouseup() {
      if (this.preventMove) return;

      if (this.drag.move && Math.abs(this.dragOffset) > this.touch.delay) {
        this.move({
          direction: this.dragOffset
        });
      } else {
        this.move();
      }

      this.isGrab(false);
      this.list.style.transition = "transform ".concat(this.speed, "ms ease 0s");
      this.drag.move = false;
    }
  }, {
    key: "handleMouseleave",
    value: function handleMouseleave() {
      if (this.preventMove) return;
      if (this.drag.move) this.handleMouseup();
      this.list.removeAttribute('is-drag');
    }
  }, {
    key: "handleResize",
    value: function handleResize() {
      this.list.style.transition = 'transform 0s ease 0s';
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(this.updateAfterResize.bind(this), 100);
    }
  }, {
    key: "updateConfig",
    value: function updateConfig(settings) {
      if (settings) this.config = Object.assign({}, this.defaultConfig, settings);else this.config = Object.assign({}, this.defaultConfig); // if (settings) this.config = { ...this.defaultConfig, ...settings }
      // else this.config = { ...this.defaultConfig }

      this.init();
    }
  }, {
    key: "updateAfterResize",
    value: function updateAfterResize() {
      var _this7 = this;

      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref2$isCreated = _ref2.isCreated,
          isCreated = _ref2$isCreated === void 0 ? false : _ref2$isCreated;

      if (this.cacheWindowSize != document.documentElement.clientWidth || isCreated) {
        var point = this.responsivePoints.filter(function (point) {
          return point > document.documentElement.clientWidth;
        }).sort(function (a, b) {
          return a - b;
        });

        if (this.responsivePoints.length > 0) {
          var currentIndex = this.responsivePoints.indexOf(point[0]);
          var values = Object.keys(this.config.responsive).map(function (key) {
            return _this7.config.responsive[key];
          });
          this.updateConfig(values[currentIndex]);
        }

        this.cacheWindowSize = document.documentElement.clientWidth;
        this.sizeItem = this.getSize(this.slider.offsetWidth, this.config.slides, this.config.shifted);
        this.sizeList = this.getSizeContainer(this.sizeItem, this.listItems.length);
        this.setSize(this.listItems, this.sizeItem);
        this.setSizeContainer(this.list, this.sizeList);
        this.move();
        this.list.style.transition = "transform ".concat(this.speed, "ms ease 0s");
      }
    }
  }, {
    key: "addEvents",
    value: function addEvents() {
      var _this8 = this;

      window.addEventListener('resize', this.handleResize.bind(this));
      this.list.addEventListener('mousedown', this.handleMousedown.bind(this));
      this.list.addEventListener('mouseup', this.handleMouseup.bind(this));
      this.list.addEventListener('mouseleave', this.handleMouseleave.bind(this));
      this.list.addEventListener('mousemove', this.handleMousemove.bind(this));
      this.list.addEventListener('touchstart', this.handleTouchStart.bind(this));
      this.list.addEventListener('touchmove', this.handleTouchMove.bind(this));
      this.list.addEventListener('touchend', this.handleTouchEnd.bind(this));
      this.spreadHtmlArrayHelper(this.controls).forEach(function (control) {
        control.addEventListener('click', _this8.handleConrolsClick.bind(_this8));
      });
    }
  }, {
    key: "init",
    value: function init() {
      if (this.config.hasOwnProperty('shifted')) {
        this.config.shifted = Number(this.config.shifted);
      } else {
        this.config.shifted = 0;
      }

      if (this.config.hasOwnProperty('slides')) {
        this.config.slides = Number(this.config.slides);
      } else {
        this.config.slides = 1;
      }

      if (this.config.hasOwnProperty('infinity')) {
        if (this.config.infinity) {
          this.config.infinity = true;
          this.counter = this.config.slides;
        }
      }

      if (this.config.infinity) this.infinity();else this.clearClonedItmes();
      this.list = this.slider.querySelector('.swish-list');
      this.listItems = this.slider.querySelectorAll('.swish-list__item');
      this.listItemsNoCloned = this.spreadHtmlArrayHelper(this.slider.querySelectorAll('.swish-list__item')).filter(function (item) {
        return !item.classList.contains('cloned');
      });
      this.sizeItem = this.getSize(this.slider.offsetWidth, this.config.slides, this.config.shifted);
      this.sizeList = this.getSizeContainer(this.sizeItem, this.listItems.length);
      this.itemsLength = this.listItems.length;
      this.controls = this.slider.querySelectorAll('[data-swish-dir]');
      this.setSize(this.listItems, this.sizeItem);
      this.setSizeContainer(this.list, this.sizeList);
      this.pagination();
    }
  }, {
    key: "create",
    value: function create() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.config = this.slider.hasAttribute('config') ? JSON.parse(this.slider.getAttribute('config').replace(/'/g, '"')) : config;
      this.defaultConfig = this.slider.hasAttribute('config') ? JSON.parse(this.slider.getAttribute('config').replace(/'/g, '"')) : config;
      this.responsivePoints = this.config.responsive ? Object.keys(this.config.responsive).map(function (i) {
        return Number(i);
      }).sort(function (a, b) {
        return a - b;
      }) : [];
      this.init();
      this.speed = this.config.speed ? this.config.speed * 1000 : Number(window.getComputedStyle(this.list).transitionDuration.replace(/[^0-9.]/gim, '')) * 1000;
      this.list.style.transitionDuration = '0s';
      this.addEvents();
      this.pagination();
      this.activeSetter(this.list);
      this.paginationActiveSetter(this.slider.querySelector('.swish-pagination__list'));
      this.currentTransform = -(this.sizeItem * this.counter) + this.config.shifted / 2;
      this.list.style[this.transformCss] = "translate3d(".concat(this.currentTransform, "px, 0, 0)");
      this.updateAfterResize({
        isCreated: true
      });
    }
  }]);

  return Swish;
}(); // eslint-disable-next-line no-unused-vars


var swish = function swish() {
  var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      selectors = _ref3.selectors,
      _ref3$config = _ref3.config,
      config = _ref3$config === void 0 ? {} : _ref3$config;

  Array.prototype.slice.call(selectors).forEach(function (selector) {
    new Swish(selector).create(config);
  });
};
