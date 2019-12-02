//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    inputCodeValue: '',
    phone: '',
    time: 60
  },
  onLoad: function (options) {
    this.setData({
      phone: options.phone
    })
    this.intervalTime()
  },
  intervalTime () {
    if (this.data.time > 0) {
      this.setData({
        time: this.data.time - 1
      })
      setTimeout(() => {
        this.intervalTime()
      }, 1000)
    } else {
      this.setData({
        time: 60
      })
    }
  },
  bindCodeInput(e) {
    this.setData({
      inputCodeValue: e.detail.value
    })
    if (this.data.inputCodeValue.length == 4) {
      wx.showLoading({
        title: '',
        mask: true,
        success: (result)=>{
          
        },
        fail: ()=>{},
        complete: ()=>{}
      });
      this.submitInfo()
    }
  },
  resendCode () {
    this.intervalTime()
    this.getCode()
  },
  submitInfo() {
    // 提交信息
    console.log(this.data.inputPhoneValue)
    if (!this.data.inputCodeValue) {
      wx.showToast({
        icon: 'none',
        title: '请输入验证码',
      })
    } else {
      this.getLoginInfo((res) => {
        wx.hideLoading();
        if (res.code == 200) {
          wx.reLaunch({
            url: '../../pages/index/index'
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.msg,
          })
        }
      })
    }
  },
  getLoginInfo (cb) {
    let param = {
      mid: app.globalData.mid,
      openid: app.globalData.openId,
      phone: this.data.phone,
      vCode: this.data.inputCodeValue,
      user: JSON.stringify(app.globalData.userInfo)
    }
    app.postReq("focus.savePointsMiniLogin/" + app.openId(), param, (res) => {
      // console.log(res.data)
      cb && cb(res)
    })
  },
  getCode (cb) {
    let param = {
      phone: this.data.phone
    }
    app.postReq("focus.getPhoneVcode/" + app.openId(), param, (res) => {
      // console.log(res.data)
      cb && cb(res)
    })
  }
})