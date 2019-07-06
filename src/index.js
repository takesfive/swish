;(function() {
  var arr = [window.Element, window.CharacterData, window.DocumentType]
  var args = []

  arr.forEach(function(item) {
    if (item) {
      args.push(item.prototype)
    }
  })
  ;(function(arr) {
    arr.forEach(function(item) {
      if (item.hasOwnProperty('remove')) {
        return
      }
      Object.defineProperty(item, 'remove', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function remove() {
          this.parentNode.removeChild(this)
        },
      })
    })
  })(args)
})()

/**
 * // TODO fix pagination bug
 * if this.config.slides > 1
 * */
/* eslint-disable no-extra-semi */
class Swish {
  constructor(slider) {
    this.slider = slider
    this.counter = 0
    this.currentTransform = 0

    this.preventMove = false
    this.transformCss = this.supportTransformCss('transform')

    this.resizeTimeout = 0
    this.cacheWindowSize = document.documentElement.clientWidth

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
      delay: 40,
    }

    this.drag = {
      shiftX: 0,
      startX: 0,
      endX: 0,
      move: 0,
      prevent: false,
    }
  }

  spreadHtmlArrayHelper(itemsArray) {
    return Array.prototype.slice.call(itemsArray)
  }

  arrayFromLengthHelper(length) {
    return Array.apply(null, Array(length))
  }

  supportTransformCss(prop) {
    let support = false
    if ('-moz-' + prop in document.body.style) support = 'mozTransform'
    if ('-webkit-' + prop in document.body.style) support = 'webkitTransform'
    if ('-ms-' + prop in document.body.style) support = 'msTransform'
    if ('-o-' + prop in document.body.style) support = 'oTransform'
    if (prop in document.body.style) support = 'transform'
    return support
  }

  getSize(containerWidth, quantity, shifted = 0) {
    return Math.ceil(containerWidth / quantity) - shifted
  }

  setSize(items, width) {
    this.spreadHtmlArrayHelper(items).forEach(item => (item.style.width = `${width}px`))
  }

  getSizeContainer(itemSize, itemLength) {
    return Math.ceil(itemSize * itemLength)
  }

  setSizeContainer(container, width) {
    container.style.width = `${width}px`
  }

  autoplay() {
    if (this.config.hasOwnProperty('autoplay')) {
      let tick = () => {
        this.move({ direction: -1 })
        this.autoPlayTimerId = setTimeout(tick, this.config.autoplay)
      }
      this.autoPlayTimerId = setTimeout(tick, this.config.autoplay)
    }
  }

  activeSetter(parentElem) {
    this.spreadHtmlArrayHelper(parentElem.children).forEach(item => {
      item.classList.remove('active')
      item.setAttribute('aria-hidden', true)
    })
    this.arrayFromLengthHelper(this.config.slides).forEach((item, idx) => {
      parentElem.children[this.counter + idx].classList.add('active')
      parentElem.children[this.counter + idx].setAttribute('aria-hidden', false)
    })
  }

  isGrab(isActive = true) {
    if (isActive) this.list.setAttribute('is-grab', true)
    else this.list.removeAttribute('is-grab')
  }

  paginationActiveSetter(parentElem) {
    // TODO fix this.config.slides === 1
    if (this.config.pagination && this.config.slides === 1) {
      this.spreadHtmlArrayHelper(parentElem.children).forEach(item => {
        item.classList.remove('active')
      })
      if (this.config.infinity) {
        this.arrayFromLengthHelper(this.config.slides).forEach((item, idx) => {
          if (parentElem.children[this.counter - this.config.slides + idx]) {
            parentElem.children[this.counter - this.config.slides + idx].classList.add('active')
          }
        })
      } else {
        this.arrayFromLengthHelper(this.config.slides).forEach((item, idx) => {
          parentElem.children[this.counter + idx].classList.add('active')
        })
      }
    }
  }

  pagination() {
    // TODO fix this.config.slides === 1
    if (this.config.pagination && this.config.slides === 1) {
      if (this.slider.querySelector('.swish-pagination')) {
        this.slider.querySelector('.swish-pagination').remove()
      }
      const paginationBlock = document.createElement('div')
      const paginationList = document.createElement('div')
      paginationBlock.classList.add('swish-pagination')
      paginationList.classList.add('swish-pagination__list')
      const paginationItems = this.arrayFromLengthHelper(this.listItemsNoCloned.length).map(
        () => '<button class="swish-pagination__list-item"></button>'
      )
      paginationList.innerHTML = paginationItems.join('')
      paginationBlock.appendChild(paginationList)
      this.slider.appendChild(paginationBlock)
      this.spreadHtmlArrayHelper(this.slider.querySelectorAll('.swish-pagination__list-item')).forEach((item, idx) => {
        if (this.config.infinity) {
          item.addEventListener('click', this.handleClickPagination.bind(this, idx + 1))
        } else {
          item.addEventListener('click', this.handleClickPagination.bind(this, idx))
        }
      })
    } else {
      if (this.slider.querySelector('.swish-pagination')) {
        this.slider.querySelector('.swish-pagination').remove()
      }
    }
  }

  handleClickPagination(index) {
    clearInterval(this.autoPlayTimerId)
    this.counter = index
    this.move()
    this.autoplay()
  }

  clearClonedItmes() {
    this.list = this.slider.querySelector('.swish-list')
    this.spreadHtmlArrayHelper(this.list.children).forEach(item => {
      if (item.classList.contains('cloned')) {
        this.list.removeChild(item)
      }
    })
  }

  infinity() {
    this.list = this.slider.querySelector('.swish-list')
    this.sizeItem = this.getSize(this.slider.offsetWidth, this.config.slides, this.config.shifted)

    this.clearClonedItmes()

    this.spreadHtmlArrayHelper(this.list.children)
      .filter(el => !el.classList.contains('cloned'))
      .slice(0, this.config.slides)
      .map(node => node.cloneNode(true))
      .forEach(node => {
        node.classList.add('cloned')
        this.list.insertAdjacentElement('beforeEnd', node)
      })
    this.spreadHtmlArrayHelper(this.list.children)
      .filter(el => !el.classList.contains('cloned'))
      .slice(-this.config.slides)
      .map(node => node.cloneNode(true))
      .reverse()
      .forEach(node => {
        node.classList.add('cloned')
        this.list.insertAdjacentElement('afterBegin', node)
      })
  }

  move({ direction = 0 } = {}) {
    if (direction > 0) this.counter--
    else if (direction < 0) this.counter++

    this.list.style.transition = `transform ${this.speed}ms ease 0s`

    if (this.config.infinity) {
      if (this.counter <= 0) {
        this.list.style.transition = `transform ${this.speed}ms ease 0s`
        this.currentTransform = -(this.sizeItem * this.counter) + (this.config.shifted * this.config.slides) / 2
        this.list.style[this.transformCss] = `translate3d(${this.currentTransform}px, 0, 0)`
        this.counter = this.itemsLength - this.config.slides - this.config.slides
        this.preventMove = true
        setTimeout(() => {
          this.list.style.transition = 'transform 0s ease 0s'
          this.currentTransform =
            -(this.sizeItem * (this.itemsLength - this.config.slides - this.config.slides)) +
            (this.config.shifted * this.config.slides) / 2
          this.list.style[this.transformCss] = `translate3d(${this.currentTransform}px, 0, 0)`
          this.counter = this.itemsLength - this.config.slides - this.config.slides
          this.preventMove = false
        }, this.speed)
      } else if (this.counter >= this.itemsLength - this.config.slides) {
        this.list.style.transition = `transform ${this.speed}ms ease 0s`
        this.currentTransform = -(this.sizeItem * this.counter) + (this.config.shifted * this.config.slides) / 2
        this.list.style[this.transformCss] = `translate3d(${this.currentTransform}px, 0, 0)`
        this.counter = this.config.slides
        this.preventMove = true
        setTimeout(() => {
          this.list.style.transition = 'transform 0s ease 0s'
          this.currentTransform = -(this.sizeItem * this.config.slides) + (this.config.shifted * this.config.slides) / 2
          this.list.style[this.transformCss] = `translate3d(${this.currentTransform}px, 0, 0)`
          this.counter = this.config.slides
          this.preventMove = false
        }, this.speed)
      } else {
        this.preventMove = true
        this.list.style.transition = `transform ${this.speed}ms ease 0s`
        this.currentTransform = -(this.sizeItem * this.counter) + (this.config.shifted * this.config.slides) / 2
        this.list.style[this.transformCss] = `translate3d(${this.currentTransform}px, 0, 0)`
        setTimeout(() => {
          this.preventMove = false
        }, this.speed)
      }
    } else {
      this.preventMove = true
      if (this.counter <= 0) {
        this.counter = 0
        this.currentTransform = -(this.sizeItem * this.counter)
      } else if (this.counter >= this.itemsLength - this.config.slides) {
        this.counter = this.itemsLength - this.config.slides
        this.currentTransform =
          -(this.sizeItem * (this.itemsLength - this.config.slides)) + this.config.shifted * this.config.slides
      } else {
        this.currentTransform = -(this.sizeItem * this.counter) + (this.config.shifted * this.config.slides) / 2
      }
      this.list.style[this.transformCss] = `translate3d(${this.currentTransform}px, 0, 0)`
      setTimeout(() => {
        this.preventMove = false
      }, this.speed)
    }

    this.activeSetter(this.list)
    this.paginationActiveSetter(this.slider.querySelector('.swish-pagination__list'))
  }

  getCoords(elem) {
    let box = elem.getBoundingClientRect()
    let body = document.body
    let docEl = document.documentElement
    let scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft
    let clientLeft = docEl.clientLeft || body.clientLeft || 0
    let left = box.left + scrollLeft - clientLeft
    return { left: Math.round(left) }
  }

  handleConrolsClick(e) {
    if (this.preventMove) return
    clearTimeout(this.autoPlayTimerId)
    switch (e.currentTarget.getAttribute('data-swish-dir')) {
      case 'next':
        this.move({ direction: -1 })
        break
      case 'prev':
        this.move({ direction: 1 })
        break
    }
    this.autoplay()
  }

  handleTouchStart(e) {
    if (this.preventMove) return
    e.stopPropagation()
    clearTimeout(this.autoPlayTimerId)
    this.touch.isTouch = true
    this.delayAndDir = 0
    this.list.style.transition = 'transform 0s ease 0s'
    this.touch.startX = e.touches[0].clientX
    this.touch.startY = e.touches[0].clientY
  }

  handleTouchMove(e) {
    e.stopPropagation()
    clearTimeout(this.autoPlayTimerId)
    this.touch.moveX = e.touches[0].clientX
    this.touch.moveY = e.touches[0].clientY
    if (this.touch.isTouchAction === null) {
      this.touch.isTouchAction =
        Math.abs(this.touch.moveX - this.touch.startX) > Math.abs(this.touch.moveY - this.touch.startY)
    }

    if (this.touch.isTouchAction) {
      this.touch.canMove = true
    } else {
      this.touch.isTouch = false
      this.touch.canMove = false
    }

    if (this.touch.canMove && this.touch.isTouch) {
      e.preventDefault()
      this.list.style.transition = 'transform 0s ease 0s'
      this.delayAndDir = Math.round(this.touch.move - this.touch.startX)
      this.touch.move = e.changedTouches[0].clientX
      this.list.style[this.transformCss] = `translate3d(${Math.round(this.touch.move - this.touch.startX) +
        this.currentTransform}px, 0, 0)`
    }
  }

  handleTouchEnd(e) {
    e.stopPropagation()
    this.list.style.transition = `transform ${this.speed}ms ease 0s`
    if (Math.abs(this.delayAndDir) > this.touch.delay) this.move({ direction: this.delayAndDir })
    else this.move({ direction: 0 })
    this.touch.isTouch = false
    this.touch.isTouchAction = null
    this.autoplay()
  }

  handleMousedown(e) {
    if (this.preventMove) return
    clearTimeout(this.autoPlayTimerId)
    let coords = this.getCoords(this.list)
    e.preventDefault()
    e.stopPropagation()
    this.dragOffset = 0
    this.drag.move = true
    this.isGrab()
    this.drag.startX = e.pageX
    this.drag.shiftX = e.pageX - coords.left
  }

  handleMousemove(e) {
    if (this.preventMove) return
    e.preventDefault()
    this.dragOffset = this.drag.endX - this.drag.startX
    if (this.drag.move) {
      this.drag.endX = e.pageX
      this.list.style.transition = 'transform 0s ease 0s'
      this.currentTransform = e.pageX - this.drag.shiftX - this.slider.getBoundingClientRect().left
      this.list.style[this.transformCss] = `translate3d(${this.currentTransform}px, 0, 0)`
    }
  }

  handleMouseup() {
    if (this.preventMove) return
    if (this.drag.move && Math.abs(this.dragOffset) > this.touch.delay) {
      this.move({ direction: this.dragOffset })
    } else {
      this.move()
    }
    this.isGrab(false)
    this.list.style.transition = `transform ${this.speed}ms ease 0s`
    this.drag.move = false
    clearTimeout(this.autoPlayTimerId)
    this.autoplay()
  }

  handleMouseleave() {
    if (this.preventMove) return
    if (this.drag.move) this.handleMouseup()
    this.list.removeAttribute('is-drag')
  }

  handleResize() {
    this.list.style.transition = 'transform 0s ease 0s'
    clearTimeout(this.resizeTimeout)
    this.resizeTimeout = setTimeout(this.updateAfterResize.bind(this), 100)
  }

  updateConfig(settings) {
    if (settings) this.config = Object.assign({}, this.defaultConfig, settings)
    else this.config = Object.assign({}, this.defaultConfig)
    // if (settings) this.config = { ...this.defaultConfig, ...settings }
    // else this.config = { ...this.defaultConfig }
    this.init()
  }

  updateAfterResize({ isCreated = false } = {}) {
    if (this.cacheWindowSize != document.documentElement.clientWidth || isCreated) {
      let point = this.responsivePoints
        .filter(point => point > document.documentElement.clientWidth)
        .sort((a, b) => a - b)

      if (this.responsivePoints.length > 0) {
        let currentIndex = this.responsivePoints.indexOf(point[0])
        let values = Object.keys(this.config.responsive).map(key => this.config.responsive[key])
        this.updateConfig(values[currentIndex])
      }

      this.cacheWindowSize = document.documentElement.clientWidth

      this.sizeItem = this.getSize(this.slider.offsetWidth, this.config.slides, this.config.shifted)
      this.sizeList = this.getSizeContainer(this.sizeItem, this.listItems.length)

      this.setSize(this.listItems, this.sizeItem)
      this.setSizeContainer(this.list, this.sizeList)

      this.move()

      this.list.style.transition = `transform ${this.speed}ms ease 0s`
    }
  }

  addEvents() {
    window.addEventListener('resize', this.handleResize.bind(this))
    this.list.addEventListener('mousedown', this.handleMousedown.bind(this))
    this.list.addEventListener('mouseup', this.handleMouseup.bind(this))
    this.list.addEventListener('mouseleave', this.handleMouseleave.bind(this))
    this.list.addEventListener('mousemove', this.handleMousemove.bind(this))
    this.list.addEventListener('touchstart', this.handleTouchStart.bind(this))
    this.list.addEventListener('touchmove', this.handleTouchMove.bind(this))
    this.list.addEventListener('touchend', this.handleTouchEnd.bind(this))
    this.spreadHtmlArrayHelper(this.controls).forEach(control => {
      control.addEventListener('click', this.handleConrolsClick.bind(this))
    })
  }

  init() {
    if (this.config.hasOwnProperty('shifted')) {
      this.config.shifted = Number(this.config.shifted)
    } else {
      this.config.shifted = 0
    }

    if (this.config.hasOwnProperty('slides')) {
      this.config.slides = Number(this.config.slides)
    } else {
      this.config.slides = 1
    }

    if (this.config.hasOwnProperty('infinity')) {
      if (this.config.infinity) {
        this.config.infinity = true
        this.counter = this.config.slides
      }
    }

    if (this.config.hasOwnProperty('autoplay')) {
      this.autoplay()
    }

    if (this.config.infinity) this.infinity()
    else this.clearClonedItmes()

    this.list = this.slider.querySelector('.swish-list')
    this.listItems = this.slider.querySelectorAll('.swish-list__item')
    this.listItemsNoCloned = this.spreadHtmlArrayHelper(this.slider.querySelectorAll('.swish-list__item')).filter(
      item => !item.classList.contains('cloned')
    )

    this.sizeItem = this.getSize(this.slider.offsetWidth, this.config.slides, this.config.shifted)
    this.sizeList = this.getSizeContainer(this.sizeItem, this.listItems.length)
    this.itemsLength = this.listItems.length
    this.controls = this.slider.querySelectorAll('[data-swish-dir]')
    this.setSize(this.listItems, this.sizeItem)
    this.setSizeContainer(this.list, this.sizeList)

    this.pagination()
  }

  create(config = {}) {
    this.config = this.slider.hasAttribute('config')
      ? JSON.parse(this.slider.getAttribute('config').replace(/'/g, '"'))
      : config

    this.defaultConfig = this.slider.hasAttribute('config')
      ? JSON.parse(this.slider.getAttribute('config').replace(/'/g, '"'))
      : config

    this.responsivePoints = this.config.responsive
      ? Object.keys(this.config.responsive)
          .map(i => Number(i))
          .sort((a, b) => a - b)
      : []

    this.init()

    this.speed = this.config.speed
      ? this.config.speed * 1000
      : Number(window.getComputedStyle(this.list).transitionDuration.replace(/[^0-9.]/gim, '')) * 1000
    this.list.style.transitionDuration = '0s'

    this.addEvents()
    this.pagination()

    this.activeSetter(this.list)
    this.paginationActiveSetter(this.slider.querySelector('.swish-pagination__list'))

    this.currentTransform = -(this.sizeItem * this.counter) + this.config.shifted / 2
    this.list.style[this.transformCss] = `translate3d(${this.currentTransform}px, 0, 0)`

    this.updateAfterResize({ isCreated: true })
  }
}

// eslint-disable-next-line no-unused-vars
const swish = ({ selectors: selectors, config = {} } = {}) => {
  Array.prototype.slice.call(selectors).forEach(selector => {
    new Swish(selector).create(config)
  })
}
