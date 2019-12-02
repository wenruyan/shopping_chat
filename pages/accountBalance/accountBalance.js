//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    balance: 0.88,
    canWidthdraw: false,
    canGoShop: false
  },
  onLoad: function () {
    var that=this
    wx.setTabBarStyle({
      borderStyle: 'black'
    })
    that.setData({
      balance: JSON.parse(wx.getStorageSync('pageData')).integralBalance
    }) 
  },
  goDetail () {
    wx.navigateTo({
      url: '../soccerDetailRecord/soccerDetailRecord',
    });
  },
  goShop () {
    // wx.navigateTo({
    //   url: '../balanceDetailRecord/balanceDetailRecord',
    // });
    wx.navigateTo({
      url: '../../pages/sort/sort'
    })
  },
  // submit() {
  //   if (this.data.canWidthdraw) {
  //     // 提交信息
  //     if (!this.data.inputNameValue || !this.data.inputPhoneValue || !this.data.inputAddressValue) {
  //       wx.showToast({
  //         icon: 'none',
  //         title: '请填写完整信息',
  //       })
  //     } else {
  //       wx.showLoading({
  //         title: '',
  //         mask: true
  //       })
  //       app.postReq('focus.updateUserAddress/' + app.openId(), {
  //         openid: app.globalData.openId,
  //         address: JSON.stringify({
  //           "province": this.data.region[0],
  //           "city": this.data.region[1],
  //           "area": this.data.region[2],
  //           "addressdetail": this.data.inputAddressValue,
  //           "name": this.data.inputNameValue,
  //           "phone": this.data.inputPhoneValue
  //         })
  //       }, (res) => {
  //         wx.hideLoading()
  //         console.log(res)
  //         if (JSON.parse(res).success) {
  //           wx.showToast({
  //             title: '成功',
  //           })
  //           setTimeout(() => {
  //             wx.navigateBack({
  //               delta: 1
  //             })
  //           }, 1000)
  //         } else {
  //           wx.showToast({
  //             icon: 'none',
  //             title: '错误，请重试！',
  //           })
  //         }
  //       })
  //     }
  //   }
  // }
})
