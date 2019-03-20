export default {
  /**
   * 画圆角矩形
   */
  _drawRadiusRect(x, y, w, h, r) {
    const br = r / 2
    this.ctx.beginPath()
    this.ctx.moveTo(this.toPx(x + br), this.toPx(y)) // 移动到左上角的点
    this.ctx.lineTo(this.toPx(x + w - br), this.toPx(y))
    this.ctx.arc(
      this.toPx(x + w - br),
      this.toPx(y + br),
      this.toPx(br),
      2 * Math.PI * (3 / 4),
      2 * Math.PI * (4 / 4)
    )
    this.ctx.lineTo(this.toPx(x + w), this.toPx(y + h - br))
    this.ctx.arc(
      this.toPx(x + w - br),
      this.toPx(y + h - br),
      this.toPx(br),
      0,
      2 * Math.PI * (1 / 4)
    )
    this.ctx.lineTo(this.toPx(x + br), this.toPx(y + h))
    this.ctx.arc(
      this.toPx(x + br),
      this.toPx(y + h - br),
      this.toPx(br),
      2 * Math.PI * (1 / 4),
      2 * Math.PI * (2 / 4)
    )
    this.ctx.lineTo(this.toPx(x), this.toPx(y + br))
    this.ctx.arc(
      this.toPx(x + br),
      this.toPx(y + br),
      this.toPx(br),
      2 * Math.PI * (2 / 4),
      2 * Math.PI * (3 / 4)
    )
  },
  /**
   * 计算文本长度
   * @param {Array|Object}} text 数组 或者 对象
   */
  _getTextWidth(text) {
    let texts: {
      fontSize: number
      text: string
      marginLeft: number
      marginRight: number
    }[] = []

    if (Object.prototype.toString.call(text) === '[object Object]') {
      texts.push(text)
    } else {
      texts = text
    }
    let width = 0
    texts.forEach(({ fontSize, text, marginLeft = 0, marginRight = 0 }) => {
      this.ctx.setFontSize(this.toPx(fontSize))
      width += this.ctx.measureText(text).width + marginLeft + marginRight
    })

    return this.toRpx(width)
  },
  /**
   * 渲染一段文字
   */
  _drawSingleText({
    x,
    y,
    fontSize,
    color,
    baseLine,
    textAlign = 'left',
    text,
    opacity = 1,
    textDecoration = 'none',
    width,
    lineNum = 1,
    lineHeight = 0,
    fontWeight = 'normal',
    fontStyle = 'normal',
    fontFamily = 'sans-serif'
  }) {
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.font =
      fontStyle + ' ' + fontWeight + ' ' + this.toPx(fontSize, true) + 'px ' + fontFamily
    this.ctx.setGlobalAlpha(opacity)
    // this.ctx.setFontSize(this.toPx(fontSize));
    this.ctx.setFillStyle(color)
    this.ctx.setTextBaseline(baseLine)
    this.ctx.setTextAlign(textAlign)
    let textWidth = this.toRpx(this.ctx.measureText(text).width)
    const textArr: string[] = []
    if (textWidth > width) {
      // 文本宽度 大于 渲染宽度
      let fillText = ''
      let line = 1
      for (let i = 0; i <= text.length - 1; i++) {
        // 将文字转为数组，一行文字一个元素
        fillText = fillText + text[i]
        if (this.toRpx(this.ctx.measureText(fillText).width) >= width) {
          if (line === lineNum) {
            if (i !== text.length - 1) {
              fillText = fillText.substring(0, fillText.length - 1) + '...'
            }
          }
          if (line <= lineNum) {
            textArr.push(fillText)
          }
          fillText = ''
          line++
        } else {
          if (line <= lineNum) {
            if (i === text.length - 1) {
              textArr.push(fillText)
            }
          }
        }
      }
      textWidth = width
    } else {
      textArr.push(text)
    }

    textArr.forEach((item, index) => {
      this.ctx.fillText(item, this.toPx(x), this.toPx(y + (lineHeight || fontSize) * index))
    })

    this.ctx.restore()

    // textDecoration
    if (textDecoration !== 'none') {
      let lineY = y
      if (textDecoration === 'line-through') {
        // 目前只支持贯穿线
        lineY = y
      }
      this.ctx.save()
      this.ctx.moveTo(this.toPx(x), this.toPx(lineY))
      this.ctx.lineTo(this.toPx(x) + this.toPx(textWidth), this.toPx(lineY))
      this.ctx.setStrokeStyle(color)
      this.ctx.stroke()
      this.ctx.restore()
    }

    return textWidth
  }
}
