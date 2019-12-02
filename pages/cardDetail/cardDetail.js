//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    code: '123123123',
    orderId: '',
    baseData: {

    }
  },
  onLoad: function (options) {
    wx.setTabBarStyle({
      borderStyle: 'black'
    })
    this.setData({
      orderId: options.id
    })
    this.getInfo()
  },
  onShow () {

  },
  getInfo () {
    let data = {
      orderId: this.data.orderId
    }
    app.postReq('focus.orderDetail/' + app.openId(), data, (res) => {
      this.setData({
        baseData: res.data.rows[0],
        code: res.data.rows[0].cdkey || ''
      })
      this.getGoodsDetail()
    }, (res) => {
      wx.showToast({ title: "请求出错", icon: 'none', duration: 2000 })
    })
  },
  getGoodsDetail () {
    let param = {
      mid: getApp().globalData.mid,
      goodsId: this.data.baseData.productId
    };
    app.postReq('focus.goodsDetail/' + app.openId(), param, (res) => {
      this.setData({
        content: res.data.rows[0].description.split(',').map((item) => {
          let obj = {}
          if (item.substr(0, 4) == 'http') {
            obj.url = app.common.decodeURL(item)
            obj.type = 20
          } else {
            obj.text = item
          }
          return obj
        })
      })
    }, (res) => {
      wx.showToast({ title: "请求出错", icon: 'none', duration: 2000 })
    })
  },
  copyCode () {
    wx.setClipboardData({
      data: this.data.code,
      success(res) {
        wx.showToast({
          title: '复制成功',
          icon: 'none',
          duration: 1500,
          mask: false,
          success: (result)=>{
            
          },
          fail: ()=>{},
          complete: ()=>{}
        });
      }
    })
  }
})
