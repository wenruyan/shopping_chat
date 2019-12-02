// pages/Redeem/Redeem.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    returnConfirm:false,
    Exchange:false,
    money:"",
    step:'',
    fromMine: false,
    showLoginPanel: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
   that.checkUserInfo();
    this.setData({
      fromMine: options.from == 'mine' || false
    })
  },
  // 积分兑换
  goChange(){
    console.log(this.data.Exchange)
    this.setData({
      Exchange:true
    })
   
  },
  getInfo () {
    app.postReq('focus.mallPageData/' + app.openId(), {
      openid: app.globalData.openId,
      unionId: app.globalData.unionId,
      user: JSON.stringify(app.globalData.userInfo || this.data.userInfo),
    }, (res) => {
      console.log(res)
      if(!res.error && !res.errorMsg) {
        wx.setStorageSync('pageData', JSON.stringify(res))
        this.setData({
          step: parseInt(res.step / 100),
          Exchange: !this.data.fromMine
        })
      }
    })
  },
  goSure(){
    app.postReq('focus.stepToIntegral/' + app.openId(), {
      openid: app.globalData.openId,
      unionId: app.globalData.unionId,
      step:this.data.step * 100,
      money: this.data.money || '0'
    }, (res) => {
      res=JSON.parse(res)
      if(res.result=='SUCCESS'){
        console.log(123)
        app.postReq('focus.mallPageData/' + app.openId(), {
          openid: app.globalData.openId,
          unionId: app.globalData.unionId,
          user: JSON.stringify(app.globalData.userInfo || this.data.userInfo),
        }, (res) => {
          console.log(res,231)
          wx.setStorageSync('pageData', JSON.stringify(res))
          this.setData({
            step:res.step / 100,
            money:res.money
          })
        })
      }
   
    })
    this.setData({
      Exchange:false,
      returnConfirm:true
    })
  },
  noSure(){
    if (this.data.fromMine) {
      this.setData({
        Exchange:false
      })
    } else {
      wx.switchTab({
        url: '../index/index'
      })
    }
  },
  endChange(){
    if (this.data.fromMine) {
      this.setData({
        returnConfirm:false
      })
    } else {
      wx.switchTab({
        url: '../index/index'
      })
    }
  },
  onShow: function () {
    this.getInfo()
  },
  checkUserInfo: function() {
    let that = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        showLoginPanel: false
      })
    } else {
      if (wx.canIUse('button.open-type.getUserInfo')) {
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.userInfoReadyCallback = res => {
          console.log("have")
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
            showLoginPanel: false
          })
        }
        app.getWxUserInfo((res) => {
          that.setData({
            showLoginPanel: true
          })
        })
      } else {
        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo
            app.globalData.hasUserInfo = true
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true,
              showLoginPanel: false
            })

          }
        })
      }
    }
  },
  getUserInfoSuccess: function(e) {
    let that = this;
    console.log('获取用户信息成功', e)
    app.globalData.userInfo = e.detail.userInfo
    app.globalData.hasUserInfo = true
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
      showLoginPanel: false
    })

    let udata = {
      mid: app.globalData.mid,
      openid: app.globalData.openId,
      uiv: e.detail.iv,
      uencryptedData: e.detail.encryptedData,
      sessionKey: app.globalData.session_key
    }
    app.postReq("focus.decodeUnionId/" + app.openId(), udata, (res) => {
      res.data = JSON.parse(res.data)
      app.globalData.unionId = res.data.data[0].unionId
      this.setData({
        unionId: res.data.data[0].unionId
      })
      wx.setStorageSync('unionId',
        res.data.data[0].unionId
      )
      that.getInfo()
    })
  }
})