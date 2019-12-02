// pages/safeSet/safeSet.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    marginTop:'',
    freePay:false,
    oldMima: "",
    activeClass: false,
    inputNameValue: '',
    inputPhoneValue: '',
     inputOldValue:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setTabBarStyle({
      borderStyle: 'black'
    })
    var that = this
    that.setData({
      freePay: wx.getStorageSync('freePay'
      ),
    })
    that.setData({
      oldMima: wx.getStorageSync( 'mima'
    )
    })
    // if (app.globalData.systemInfo.model.indexOf("iPhone X") >= 0) {
    //   this.setData({
    //     marginTop: this.data.marginTop + 40,
    //     guideTop: this.data.guideTop + 40
    //   })
    // }
  },
  changeClass: function () {
    console.log(23)
    this.setData({
      freePay: !this.data.freePay
    })
    console.log(this.data.activeClass)
    app.postReq('focus.noPWDPaySwitch/' + app.openId(), {
      openid: app.globalData.openId,
      unionId: app.globalData.unionId,

    }, (res) => {
      if (res.noPWDPaySwitch == 0) {
        wx.setStorageSync('freePay', false,
        )
      } else {
        wx.setStorageSync('freePay', true,
        )
      }
    })
  },
  bindPhoneInput(e) {
    this.setData({
      inputPhoneValue: e.detail.value
    })
  },
  bindNameInput(e) {
    this.setData({
      inputNameValue: e.detail.value
    })
  },
  bindOldInput(e) {
    this.setData({
      inputOldValue: e.detail.value
    })
  },
  //免密支付

  submitInfo() {
    // 提交信息
    console.log(this.data.inputNameValue, this.data.inputPhoneValue, this.data.inputOldValue)
 
    if (this.data.inputNameValue != this.data.inputPhoneValue || (!this.data.inputPhoneValue)) {
      wx.showToast({
        icon: 'none',
        title: '请填正确信息',
      })
    } 
    else {
      app.postReq('focus.refreshPWD/' + app.openId(), {
        OldPassWord: this.data.inputOldValue,
        openid: app.globalData.openId,
        NewPassWord: this.data.inputPhoneValue,
        unionId: app.globalData.unionId
      }, (res) => {
        wx.hideLoading()
        // console.log(res)
        // res=JSON.parse(res)
        console.log(res)
        res=JSON.parse(res)
        console.log(res)
        if (res.result=='success') {
          wx.setStorageSync("passWord", true,
          )
          wx.setStorageSync( "mima", this.data.inputNameValue
          )
          setTimeout(() => {
            wx.navigateBack({
              delta: 2
            })
          }, 500)
          wx.showToast({
            title: '成功',

          })
         
        }else{
          wx.showToast({
            icon: 'none',
            title: '错误，请重试！',
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})