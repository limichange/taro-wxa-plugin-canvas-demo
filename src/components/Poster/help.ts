const wechat = window['wx']

export default {
  /**
   * 下载图片并获取图片信息
   */
  _downloadImageAndInfo(image, index): Promise<{}> {
    return new Promise((resolve, reject) => {
      const { x, y, url, zIndex } = image
      const imageUrl = url
      // 下载图片
      this._downImage(imageUrl, index)
        // 获取图片信息
        .then(imgPath => this._getImageInfo(imgPath, index))
        .then(({ imgPath, imgInfo }) => {
          // 根据画布的宽高计算出图片绘制的大小，这里会保证图片绘制不变形
          let sx
          let sy
          const borderRadius = image.borderRadius || 0
          const setWidth = image.width
          const setHeight = image.height
          const width = this.toRpx(imgInfo.width)
          const height = this.toRpx(imgInfo.height)

          if (width / height <= setWidth / setHeight) {
            sx = 0
            sy = (height - (width / setWidth) * setHeight) / 2
          } else {
            sy = 0
            sx = (width - (height / setHeight) * setWidth) / 2
          }
          this.drawArr.push({
            type: 'image',
            borderRadius,
            borderWidth: image.borderWidth,
            borderColor: image.borderColor,
            zIndex: typeof zIndex !== 'undefined' ? zIndex : index,
            imgPath,
            sx,
            sy,
            sw: width - sx * 2,
            sh: height - sy * 2,
            x,
            y,
            w: setWidth,
            h: setHeight
          })
          resolve()
        })
        .catch(err => reject(err))
    })
  },
  /**
   * 下载图片资源
   * @param {*} imageUrl
   */
  _downImage(imageUrl) {
    return new Promise((resolve, reject) => {
      if (/^http/.test(imageUrl) && !new RegExp(wechat.env.USER_DATA_PATH).test(imageUrl)) {
        wechat.downloadFile({
          url: this._mapHttpToHttps(imageUrl),
          success: res => {
            if (res.statusCode === 200) {
              resolve(res.tempFilePath)
            } else {
              reject(res.errMsg)
            }
          },
          fail(err) {
            reject(err)
          }
        })
      } else {
        // 支持本地地址
        resolve(imageUrl)
      }
    })
  },
  /**
   * 获取图片信息
   * @param {*} imgPath
   * @param {*} index
   */
  _getImageInfo(imgPath, index) {
    return new Promise((resolve, reject) => {
      wechat.getImageInfo({
        src: imgPath,
        success(res) {
          resolve({ imgPath, imgInfo: res, index })
        },
        fail(err) {
          reject(err)
        }
      })
    })
  },
  toPx(rpx, int, factor) {
    if (int) {
      return parseInt((rpx * factor).toFixed(0))
    }
    return rpx * factor
  },
  toRpx(px, int, factor) {
    if (int) {
      return parseInt((px * factor).toFixed(0))
    }
    return px / factor
  },
  /**
   * 将http转为https
   * @param {String}} rawUrl 图片资源url
   */
  _mapHttpToHttps(rawUrl) {
    if (rawUrl.indexOf(':') < 0) {
      return rawUrl
    }
    const urlComponent = rawUrl.split(':')
    if (urlComponent.length === 2) {
      if (urlComponent[0] === 'http') {
        urlComponent[0] = 'https'
        return `${urlComponent[0]}:${urlComponent[1]}`
      }
    }
    return rawUrl
  }
}
