const mepal: any = {
  _id: 1,
  _requestList: {},
  _eventListeners: {},
  _triggerList: {},
  // 是否在App中
  isInApp() {
    return !!(window as any).MepalRequest
  },
  request(action: any, data = {}) {
    const id = mepal.getId()
    if ((window as any).MepalRequest) {
      ;(window as any).MepalRequest.postMessage(
        JSON.stringify({
          action: action,
          id,
          message: data
        })
      )
      return new Promise((resolve, reject) => {
        mepal._requestList[id] = (data: any) => {
          console.log('mepal response', action, data)
          if (data.success) {
            console.log('success')
            resolve(data.data)
          } else {
            console.log('error')
            reject(data.data)
          }
        }
      })
    } else {
      return new Promise((resolve) => {
        resolve(null)
      })
    }
  },
  requestCallback(_data: any) {
    const data = JSON.parse(_data)
    if (mepal._requestList[data.id]) {
      mepal._requestList[data.id](data)
      mepal._requestList[data.id] = null
    }
    return _data
  },
  eventCallback(_data: any) {
    const data = JSON.parse(_data)
    if (mepal._eventListeners[data.event]) {
      mepal._eventListeners[data.event].forEach((item: any) => {
        try {
          item(data.data)
        } catch (ex) {
          console.error(ex)
        }
      })
    }
  },
  triggerCallback(_data: any) {
    const data = JSON.parse(_data)
    if (mepal._triggerList[data.id]) {
      mepal._triggerList[data.id](data)
    }
  },
  onEvent(event: any, callback: any) {
    mepal._eventListeners[event] = mepal._eventListeners[event] || []
    mepal._eventListeners[event].push(callback)
    return () => {
      const index = mepal._eventListeners[event].findIndex(
        (item: any) => item === callback
      )
      mepal._eventListeners[event].splice(index, 1)
    }
  },
  setAction(name: any, callback: any) {
    return mepal.onTrigger('action', callback, {
      name: name
    })
  },
  onPageBack(callback: any) {
    return mepal.onTrigger('pageBack', callback)
  },
  onClose(callback: any) {
    return mepal.onTrigger('onClose', callback)
  },
  onTrigger(event: any, callback: any, arg: any) {
    const id = mepal.getId()
    mepal.request('addTrigger', {
      event,
      id: id,
      ...arg
    })
    mepal._triggerList[id] = callback
    return () => {
      mepal._triggerList[id] = null
      return mepal.request('removeTrigger', {
        event,
        id: id
      })
    }
  },
  getId() {
    return this._id++
  },
  // 设置页面标题
  setTitle(data: any) {
    return mepal.request('setTitle', data)
  },
  // 获取用户信息
  getUserInfo(data: any) {
    return mepal.request('getUserInfo', data)
  },
  // 获取token
  getToken(data: any) {
    return mepal.request('getToken', data)
  },
  getDefaultData(data: any) {
    return mepal.request('getDefaultData', data)
  },
  getButtonPermission(data: any) {
    return mepal.request('getButtonPermission', data)
  },
  getSubmitFuncName(data: any) {
    return mepal.request('getSubmitFuncName', data)
  },
  onDetail(data: any) {
    return mepal.request('onDetail', data)
  },
  onLoaded(data: any) {
    return mepal.request('onLoaded', data)
  },
  onPageChange(data: any) {
    return mepal.request('onPageChange', data)
  },
  // 预览pdf
  pdfViewer(data: any) {
    return mepal.request('pdfViewer', data)
  },
  imageViewer(data: any) {
    return mepal.request('imageViewer', data)
  },
  // 文件上传
  uploadFile(data: any) {
    return mepal.request('uploadFile', data)
  },
  getImage(data: any) {
    return mepal.request('getImage', data)
  },
  getFile(data: any) {
    return mepal.request('getFile', data)
  },
  loaded(data: any) {
    return mepal.request('loaded', data)
  },
  close(data: any) {
    return mepal.request('close', data)
  },
  pageBack(data: any) {
    return mepal.request('pageBack', data)
  },
  addTrigger(data: any) {
    return mepal.request('addTrigger', data)
  },
  removeTrigger(data: any) {
    return mepal.request('removeTrigger', data)
  },
  getCamera(data: any) {
    return mepal.request('getCamera', data)
  },
  setDetailContext(context: any) {
    mepal._detailContext = context
  },
  setBottomPanel(v: any) {
    if (mepal._detailContext && mepal._detailContext.setBottomPanel) {
      mepal._detailContext.setBottomPanel(v)
    }
  },
  // 二维码扫描
  scanQRCode(data: any) {
    return mepal.request('scanQRCode', data)
  },
  // 获取语言项
  getLocal(data: any) {
    return mepal.request('getLocal', data)
  },
  login() {
    return mepal.request('login', {
      url: window.location.href
    })
  },
  preEntryLogout() {
    return mepal.request('preEntryLogout', {
      url: window.location.href
    })
  },
  // 文件下载
  downloadFile(data: any) {
    return mepal.request('downloadFile', data)
  },
  // 播放视频
  playVideo(data: any) {
    return mepal.request('playVideo', data)
  },
  // 打开钉钉分享
  openShare(data: any) {
    return mepal.request('openShare', data)
  },
  // 关闭钉钉分享
  closeShare() {
    return mepal.request('closeShare', {})
  },
  // 上报事件统计
  sendStatisticEvent(data: any) {
    return mepal.request('sendStatisticEvent', data)
  },
  getGptAnswerId(data: any) {
    return mepal.request('getGptAnswerId', data)
  },
  jumpToAppWebView(data: any) {
    return mepal.request('jumpToAppWebView', data)
  }
}
mepal.isApp = !!(window as any).MepalRequest
;(window as any).mepal = mepal
export default mepal
