//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    balance: "",
    canWidthdraw: false,

  },
  onLoad: function () {
  
    var that = this
    wx.setTabBarStyle({
      borderStyle: 'black'
    })
    console.log((wx.getStorageSync('pageData')))
    that.setData({
      canWidthdraw: JSON.parse(wx.getStorageSync('pageData')).accountBalance,
      balance: (JSON.parse(wx.getStorageSync('pageData'))).accountBalance
    })
  },
  goDetail() {
    wx.navigateTo({
      url: '../balanceDetailRecord/balanceDetailRecord',
    });
  },
  goShop() {
    // wx.navigateTo({
    //   url: '../balanceDetailRecord/balanceDetailRecord',
    // });
  },
  submit() {
    if (this.data.canWidthdraw >= 1000) {
      // 提交信息
      wx.showLoading({
        title: '',
        mask: true
      })
      app.postReq('focus.withdrawal/' + app.openId(), {
        openid: app.globalData.openId,

      }, (res) => {
        wx.hideLoading()
        console.log(JSON.parse(res))
        if (JSON.parse(res).result == 'SUCCESS') {
          wx.showToast({
            title: '成功',
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 500)
        } else {
          wx.showToast({
            icon: 'none',
            title: '错误，请重试！',
          })
        }
      })
    }
  }
})
