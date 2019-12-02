import { config } from '../config.js'

const apiHost = config.apiHost
// const apiHost = config.testApiHost

const getReqConf = (header, apiUrl, data, sucCb, errCb) => {
  let reqConf = {}
  if (typeof header == "string") {
    errCb = sucCb
    sucCb = data
    data = apiUrl
    apiUrl = header
    header = ""
  }
  if (typeof data == "function") {
    errCb = sucCb
    sucCb = data
    data = ""
  }
  if (apiUrl.substr(0, 4) == 'http') {
    reqConf.url = apiUrl
  } else {
    reqConf.url = apiHost + apiUrl
  }
  header && (reqConf.header = header)
  data && (reqConf.data = data)
  
  reqConf.success = function (res) {
    console.log(apiUrl + '返回报文', res);
    (typeof sucCb == "function") && sucCb(res.data)
  }
  reqConf.fail = function (res) {
    console.log(apiUrl + '请求出错', res);
    wx.showToast({
      icon: 'none',
      title: '接口出错'
    });
    (typeof errCb == "function") && errCb(res)
  }
  // console.log(JSON.stringify(reqConf))
  reqConf.data.unionId = getApp().globalData.unionId;
  reqConf.data.openid = getApp().globalData.openId;
  reqConf.data.mid = getApp().globalData.mid
  console.log(apiUrl + '请求参数', reqConf.data);
  return reqConf
}

const postReq = (header, apiUrl, data, sucCb, errCb) => {
  let reqConf = getReqConf(header, apiUrl, data, sucCb, errCb)
  reqConf.method = "POST"
  wx.request(reqConf)
}
const postBufferReq = (header, apiUrl, data, sucCb, errCb) => {
  let reqConf = getReqConf(header, apiUrl, data, sucCb, errCb)
  reqConf.method = "POST"
  reqConf.responseType = 'arraybuffer'
  wx.request(reqConf)
}
const getReq = (header, apiUrl, data, sucCb, errCb) => {
  let reqConf = getReqConf(header, apiUrl, data, sucCb, errCb)
  reqConf.method = "GET"
  wx.request(reqConf)
}


module.exports = {
  postReq,
  postBufferReq,
  getReq
}
