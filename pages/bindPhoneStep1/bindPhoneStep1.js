//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    inputPhoneValue: ''
  },
  onLoad: function (options) {
    
  },
  bindPhoneInput(e) {
    this.setData({
      inputPhoneValue: e.detail.value
    })
  },
  getCode (cb) {
    let param = {
      phone: this.data.inputPhoneValue
    }
    app.postReq("focus.getPhoneVcode/" + app.openId(), param, (res) => {
      // console.log(res.data)
      cb && cb(res)
    })
  },
  submitInfo() {
    // 提交信息
    console.log(this.data.inputPhoneValue)
    if (!this.data.inputPhoneValue) {
      wx.showToast({
        icon: 'none',
        title: '请输入手机号',
      })
    } else {
      this.getCode((res) => {
        if (res.success) {
          wx.navigateTo({
            url: '../../pages/bindPhoneStep2/bindPhoneStep2?phone=' + this.data.inputPhoneValue,
            success: (result)=>{
              
            },
            fail: ()=>{},
            complete: ()=>{}
          });
        }
      })
    //   wx.showLoading({
    //     title: '',
    //     mask: true
    //   })
      
    //   app.postReq('focus.addUserAddress/' + app.openId(), {
    //     openid: app.globalData.openId,
    //     unionId: app.globalData.unionId
    //   }, (res) => {
    //     wx.hideLoading()
    //     console.log(res)
    //     if (JSON.parse(res).id) {
    //       wx.showToast({
    //         title: '成功',
    //       })
    //       setTimeout(() => {
    //         wx.navigateBack({
    //           delta:1
    //         })
    //       },200)
    //     } else {
    //       wx.showToast({
    //         icon: 'none',
    //         title: '错误，请重试！',
    //       })
    //     }
    //   })
    // }
    }
  }
})