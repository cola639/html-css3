// 单元信息model
class MaskIntroduceItem {
  // 需要引导的dom的ID
  id
  // 需要引导的dom功能描述
  warming
  constructor(id, warming) {
    this.id = id
    this.warming = warming
  }
}

// 遮罩操作类
class MaskIntroduceManage {
  // 消息展示类集合
  maskIntroduceItems
  // 遮罩层
  el
  // 遮罩层提示框
  warmingEl
  // 指引肩头
  guidanceEl
  // 展示的第几个
  currentShowIndex = 0
  // 记录window事件
  windowEvent = null

  constructor(maskIntroduceItems) {
    this.maskIntroduceItems = maskIntroduceItems
  }

  // 添加消息展示类
  addIntroduceItem(introduceItem) {
    this.maskIntroduceItems.push(introduceItem)
  }

  // body增加遮罩
  addMaskToBody() {
    //添加遮罩框
    this.el = document.createElement("div")
    this.el.style.cssText =
      "position: fixed;background: transparent;outline:rgba(0, 0, 0, 0.5) 3500px solid;"
    let body = document.getElementsByTagName("body")[0]
    body.appendChild(this.el)
    //添加提示框
    this.warmingEl = document.createElement("div")
    this.warmingEl.style.cssText =
      "position:fixed;width:100px;background:white;border-radius: 10px;padding: 30px;font-size: 14px;"
    body.appendChild(this.warmingEl)
    //添加指引箭头
    this.guidanceEl = document.createElement("div")
    this.guidanceEl.style.cssText =
      "position:fixed;width: 14px; height: 13px; background-color: white;clip-path: polygon(50% 0,100% 100%,0 100%);"
    body.appendChild(this.guidanceEl)
    //设置body禁止滚动
    body.style.overflow = "hidden"
    //保留window事件
    if (window.onclick) {
      this.windowEvent = window.onclick
    }
    window.onclick = () => {
      this.nextIntroduce()
    }
  }

  // 开始引导
  benginIntroduce() {
    this.addMaskToBody()
    this.nextIntroduce()
  }

  // 下一步
  nextIntroduce() {
    let maskIntroduceItem =
      this.maskIntroduceItems.length > 0
        ? this.maskIntroduceItems[this.currentShowIndex]
        : null
    if (!maskIntroduceItem) {
      return
    }
    let needIntroduceEl = document.getElementById(maskIntroduceItem.id)
    //遮罩层的镂空位置
    this.el.style.width = needIntroduceEl.offsetWidth + "px"
    this.el.style.height = needIntroduceEl.offsetHeight + "px"
    this.el.style.top = this.getElementPosition(needIntroduceEl).top + "px"
    this.el.style.left = this.getElementPosition(needIntroduceEl).left + "px"
    //设置对应倒角，但是由于背景颜色是透明的，所以，没有效果（😅😅😅）
    //this.el.style.borderRadius = window.getComputedStyle(needIntroduceEl,null)['border-radius']
    this.currentShowIndex++
    //指引箭头位置
    let guidanceElLeft =
      this.getElementPosition(needIntroduceEl).left +
      needIntroduceEl.offsetWidth / 2.0
    this.guidanceEl.style.top =
      this.getElementPosition(needIntroduceEl).top +
      needIntroduceEl.offsetHeight +
      20 +
      "px"
    this.guidanceEl.style.left = guidanceElLeft + "px"
    //提示框的位置
    this.warmingEl.style.top =
      this.getElementPosition(this.guidanceEl).top +
      this.guidanceEl.offsetHeight -
      4 +
      "px"
    let warmingElLeft =
      this.getElementPosition(needIntroduceEl).left -
      (this.warmingEl.offsetWidth - needIntroduceEl.offsetWidth) / 2.0
    if (warmingElLeft < 0) {
      warmingElLeft = this.getElementPosition(needIntroduceEl).left + 10
    }
    if (
      warmingElLeft + this.warmingEl.offsetWidth >
      document.getElementsByTagName("body")[0].offsetWidth
    ) {
      warmingElLeft =
        warmingElLeft -
        10 -
        (this.warmingEl.offsetWidth - needIntroduceEl.offsetWidth) / 2.0
    }
    this.warmingEl.style.left = warmingElLeft + "px"
    this.warmingEl.innerHTML = maskIntroduceItem.warming
    //最后一个展示完恢复window点击事件
    if (this.currentShowIndex >= this.maskIntroduceItems.length) {
      setTimeout(() => {
        //移除当前遮罩
        this.el.remove()
        //移除当前提示框
        this.warmingEl.remove()
        //移除箭头
        this.guidanceEl.remove()
        //设置body可以滚动
        document.getElementsByTagName("body")[0].style.overflow = "auto"
        //恢复window事件
        if (this.windowEvent) {
          window.onclick = this.windowEvent
        }
      }, 2000)
    }
  }

  // 获取元素在屏幕的位置
  getElementPosition(element) {
    var top = element.offsetTop
    var left = element.offsetLeft
    var currentParent = element.offsetParent
    while (currentParent !== null) {
      top += currentParent.offsetTop
      left += currentParent.offsetLeft
      currentParent = currentParent.offsetParent
    }
    return { top, left }
  }
}
