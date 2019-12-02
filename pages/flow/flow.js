//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    balance: 0,
    inputPhoneValue: '',
    canRecharge: true,
    flowSelectList: [
      {
        value: 100,
        checked: true,
        disabled: true
      }, {
        value: 200,
        checked: false,
        disabled: true
      }, {
        value: 300,
        checked: false,
        disabled: true
      }, {
        value: 400,
        checked: false,
        disabled: true
      }
    ],
    selectFlow: 100,
    tipsConfirm: false,
    tipsConf: {
      title: '已提交',
      content: ['我们将会在24小时内为您处理，具体到账时间以当地运营商短信通知为准，如有任何疑问请联系客服咨询。'],
      btnName: ''
    }
  },
  onLoad: function (options) {
    wx.setTabBarStyle({
      borderStyle: 'black'
    })
    if (options.value) {
      this.setData({
        balance: options.value
      })
    } else {
      this.getFlowBalance()
    }
    // let tmpData = this.data.flowSelectList
    // for (let item of tmpData) {
    //   if (item.value <= this.data.balance) {
    //     item.disabled = false
    //   } 
    // }
    // this.setData({
    //   flowSelectList: tmpData
    // })
  },
  getFlowBalance () {
    wx.showLoading({
      mask: true
    })
    app.postReq('focus.pageData/' + app.openId(), {
      openid: app.globalData.openId
    }, (res) => {
      this.setData({
        balance: res.fluxBalance
      })
      wx.hideLoading();
    }, (res) => {
      wx.showToast({ title: "请求出错", icon: 'none', duration: 2000 })
    })
  },
  goDetail () {
    wx.navigateTo({
      url: '../flowDetailRecord/flowDetailRecord',
    });
  },
  goShop () {
    // wx.navigateTo({
    //   url: '../balanceDetailRecord/balanceDetailRecord',
    // });
  },
  bindPhoneInput(e) {
    this.setData({
      inputPhoneValue: e.detail.value
    })
  },
  selectFlow (e) {
    let tmpArr = this.data.flowSelectList
    for (let item of tmpArr) {
      item.checked = false
    }
    tmpArr[e.currentTarget.dataset.idx].checked = true
    this.setData({
      flowSelectList: tmpArr,
      selectFlow: tmpArr[e.currentTarget.dataset.idx].value
    })
  },
  closeTipsConfirm () {
    this.setData({
      tipsConfirm: false
    })
    wx.navigateBack({
      delta: 1
    })
  },
  submit() {
    if (this.data.canRecharge) {
      // 提交信息
      if ((!this.data.inputPhoneValue) || this.data.inputPhoneValue.length != 11) {
        wx.showToast({
          icon: 'none',
          title: '请填写正确的手机号码',
        })
      } else {
        wx.showLoading({
          title: '',
          mask: true
        })
        app.postReq('focus.fillInformation/' + app.openId(), {
          openid: app.globalData.openId,
          AFlow: this.data.selectFlow,
          tel: this.data.inputPhoneValue
        }, (res) => {
          wx.hideLoading()
          console.log(res)
          if (res.status == 2) {
            wx.showToast({
              icon: 'none',
              title: res.msg,
            })
          } else {
            this.setData({
              tipsConfirm: true
            })
          }
        })
      }
    }
  }
})
