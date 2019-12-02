// pages/safeSet/safeSet.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    freePay:false,
    marginTop:"",
    inputOldValue:"",
    oldMima:"",
    passWord:false,
    activeClass:false,
    inputNameValue:'',
    inputPhoneValue:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.globalData.freePay = wx.getStorageSync( 'freePay')
    app.globalData.passWord = wx.getStorageSync( 'passWord')
    that.setData({
      freePay:app.globalData.freePay,
      passWord: app.globalData.passWord,
    })
    console.log(app.globalData.passWord)
    wx.setTabBarStyle({
      borderStyle: 'black'
    })  
    // if (app.globalData.systemInfo.model.indexOf("iPhone X") >= 0) {
    //   that.setData({
    //     marginTop: that.data.marginTop + 40,
    //     guideTop: that.data.guideTop + 40
    //   })
    // }
  
  },
  changeClass: function () {
   this.setData({
      freePay: !this.data.freePay
    })
   
  },
  newSafe(){
    wx.navigateTo({
      url: '../newSafe/newSafe',
    })
  },
  bindPhoneInput(e){
    this.setData({
      inputPhoneValue: e.detail.value
    })
  },
  bindOldInput(e) {
    this.setData({
      inputOldValue: e.detail.value
    })
  },
  bindNameInput(e){
    this.setData({
      inputNameValue: e.detail.value
    })
  },
  //免密支付
  submitInfo3(){
    console.log(this.data.inputOldValue)
    console.log(this.data.oldMima)
      wx.showToast({
        icon:'none',
        title: '设置成功',
      })
      app.postReq('focus.noPWDPaySwitch/' + app.openId(), {
        openid: app.globalData.openId,
        unionId: app.globalData.unionId,

      }, (res) => {
        if(res.noPWDPaySwitch==0){
          wx.setStorageSync( 'freePay', false)
          }else{
          wx.setStorageSync( 'freePay', true
          )
        }
        setTimeout(() => {
          console.log(222)
          wx.navigateBack({
            delta:1
          })
        }, 500)
      })
  },
  //修改密码
 
  submitInfo() {
    // 提交信息
    console.log(this.data.inputNameValue, this.data.inputPhoneValue)
    if ( (this.data.inputNameValue != this.data.inputPhoneValue) || (this.data.inputNameValue.length != 6) || (this.data.inputPhoneValue.length != 6) ){
      wx.showToast({
        icon: 'none',
        title: '请填写6位数字正确信息',
      })
    }else{
     app.postReq('focus.refreshPWD/' + app.openId(), {
        openid: app.globalData.openId,
       NewPassWord: this.data.inputPhoneValue,
       unionId: app.globalData.unionId
      }, (res) => {
        wx.hideLoading()
        res=JSON.parse(res)
        console.log(res)
        if (res.result=="success") {
          this.setData({
            passWord:true
          })
          wx.setStorageSync("passWord",true,
         
          )
          wx.setStorageSync( "mima", this.data.inputNameValue
          )
          wx.showToast({
            title: '成功',

          })
          setTimeout(() => {
            console.log(222)
            wx.navigateBack({
              delta:1
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