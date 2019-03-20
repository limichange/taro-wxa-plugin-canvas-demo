import help from "./help";

export default {
  /**
   * 渲染块
   * @param {Object} params
   */
  drawBlock({
    text,
    width = 0,
    height,
    x,
    y,
    paddingLeft = 0,
    paddingRight = 0,
    borderWidth,
    backgroundColor,
    borderColor,
    borderRadius = 0,
    opacity = 1
  }) {
    // 判断是否块内有文字
    let blockWidth = 0 // 块的宽度
    let textX = 0
    let textY = 0
    if (typeof text !== 'undefined') {
      // 如果有文字并且块的宽度小于文字宽度，块的宽度为 文字的宽度 + 内边距
      const textWidth = this._getTextWidth(typeof text.text === 'string' ? text : text.text)
      blockWidth = textWidth > width ? textWidth : width
      blockWidth += paddingLeft + paddingLeft

      const { textAlign = 'left', text: textCon } = text
      textY = height / 2 + y // 文字的y轴坐标在块中线
      if (textAlign === 'left') {
        // 如果是右对齐，那x轴在块的最左边
        textX = x + paddingLeft
      } else if (textAlign === 'center') {
        textX = blockWidth / 2 + x
      } else {
        textX = x + blockWidth - paddingRight
      }
    } else {
      blockWidth = width
    }

    if (backgroundColor) {
      // 画面
      this.ctx.save()
      this.ctx.setGlobalAlpha(opacity)
      this.ctx.setFillStyle(backgroundColor)
      if (borderRadius > 0) {
        // 画圆角矩形
        this._drawRadiusRect(x, y, blockWidth, height, borderRadius)
        this.ctx.fill()
      } else {
        this.ctx.fillRect(this.toPx(x), this.toPx(y), this.toPx(blockWidth), this.toPx(height))
      }
      this.ctx.restore()
    }
    if (borderWidth) {
      // 画线
      this.ctx.save()
      this.ctx.setGlobalAlpha(opacity)
      this.ctx.setStrokeStyle(borderColor)
      this.ctx.setLineWidth(this.toPx(borderWidth))
      if (borderRadius > 0) {
        // 画圆角矩形边框
        this._drawRadiusRect(x, y, blockWidth, height, borderRadius)
        this.ctx.stroke()
      } else {
        this.ctx.strokeRect(this.toPx(x), this.toPx(y), this.toPx(blockWidth), this.toPx(height))
      }
      this.ctx.restore()
    }

    if (text) {
      this.drawText(Object.assign(text, { x: textX, y: textY }))
    }
  },

  /**
   * 渲染文字
   * @param {Object} params
   */
  drawText(params) {
    const {
      x,
      y,
      fontSize,
      color,
      baseLine,
      textAlign,
      text,
      opacity = 1,
      width,
      lineNum,
      lineHeight
    } = params
    if (Object.prototype.toString.call(text) === '[object Array]') {
      let preText = { x, y, baseLine }
      text.forEach(item => {
        preText.x += item.marginLeft || 0
        const textWidth = this._drawSingleText(
          Object.assign(item, {
            ...preText
          })
        )
        preText.x += textWidth + (item.marginRight || 0) // 下一段字的x轴为上一段字x + 上一段字宽度
      })
    } else {
      this._drawSingleText(params)
    }
  },

  /**
   * 渲染图片
   */
  drawImage(data) {
    const {
      imgPath,
      x,
      y,
      w,
      h,
      sx,
      sy,
      sw,
      sh,
      borderRadius = 0,
      borderWidth = 0,
      borderColor
    } = data
    this.ctx.save()
    if (borderRadius > 0) {
      this._drawRadiusRect(x, y, w, h, borderRadius)
      this.ctx.clip()
      this.ctx.drawImage(
        imgPath,
        this.toPx(sx),
        this.toPx(sy),
        this.toPx(sw),
        this.toPx(sh),
        this.toPx(x),
        this.toPx(y),
        this.toPx(w),
        this.toPx(h)
      )
      if (borderWidth > 0) {
        this.ctx.setStrokeStyle(borderColor)
        this.ctx.setLineWidth(this.toPx(borderWidth))
        this.ctx.stroke()
      }
    } else {
      this.ctx.drawImage(
        imgPath,
        this.toPx(sx),
        this.toPx(sy),
        this.toPx(sw),
        this.toPx(sh),
        this.toPx(x),
        this.toPx(y),
        this.toPx(w),
        this.toPx(h)
      )
    }
    this.ctx.restore()
  },
  /**
   * 渲染线
   * @param {*} param0
   */
  drawLine({ startX, startY, endX, endY, color, width }) {
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.setStrokeStyle(color)
    this.ctx.setLineWidth(this.toPx(width))
    this.ctx.moveTo(this.toPx(startX), this.toPx(startY))
    this.ctx.lineTo(this.toPx(endX), this.toPx(endY))
    this.ctx.stroke()
    this.ctx.closePath()
    this.ctx.restore()
  },
  downloadResource(images = []) {
    const drawList: Promise<{}>[] = []
    this.drawArr = []
    images.forEach((image, index) => drawList.push(help._downloadImageAndInfo(image, index)))
    return Promise.all(drawList)
  },
  initCanvas(w, h, debug) {
    return new Promise(resolve => {
      this.setData(
        {
          pxWidth: this.toPx(w),
          pxHeight: this.toPx(h),
          debug
        },
        resolve
      )
    })
  }
}
