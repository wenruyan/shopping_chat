//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    returnConfirm2: false,
    tipsConfirm:false,
    tuiOrde:0,
    allOrder:0,
    waitOrder:0,
    finishOrder:0,
    endOrder:0,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    showTabbar: false,
    tabbar: {},
    shareSucTipsConf: {
      title: '分享成功',
      content: ['分享成功，+1000步'],
      btnName: '',
      btnName2: '',
      close: true,
      align: 'center'
    },
    tipsConf: {
      title: '规则说明',
      content: [],
      btnName: '我知道了',
      close: false
    },

    baseData: {
      
    },
    cashBalance:5.6,
    Available:3000,
    contactPhone: '400800800',

    shareConfirmConf: {
      img: '../../images/share.png',
      content: '生命在于运动，运动始于跑步，跑步开启人生无限可能。',
      person: 0
    },
    erCodeTmpUrl: '',
    avatarTmpUrl: '',
    shareText1: '您的一小步',
    shareText2: '世界的一大步',
    saving: false
  },
  onLoad: function () {
    this.setData({
      baseData:(app.globalData.pageData)
    })
    app.postReq('focus.mallPageData/' + app.openId(), {
      openid: app.globalData.openId,
      unionId: app.globalData.unionId,
    }, (res) => {
      console.log(res)
      wx.setStorageSync('pageData', JSON.stringify(res))
     app.globalData.pageData=res
      this.setData({
        baseData : res
      })
    })
    this.setData({
      userInfo: app.globalData.userInfo,
      hasUserInfo: true
    })
    wx.hideTabBar();
    app.editTabbar();
    wx.setTabBarStyle({
      borderStyle: 'black'
    })
    this.setData({
      showTabbar: true
    })
    // this.getorder()
  },
  onShow () {
    this.init()
  },
  toPage: function (e) {
    console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: '../../pages/myOrder/myOrder?activeSelect=' + e.currentTarget.dataset.activeselect + '&type=' + e.currentTarget.dataset.type,
    
    })
  
  },
  aboutUs(){
    wx.navigateTo({
      url: '../../pages/aboutUs/aboutUs',
    })
  
},

  onShareAppMessage: function (res) {
    let that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    app.share((bol) => {
      console.log(bol)
      that.setData({
        returnConfirm2: bol
      })
    })
    return {
      title: '积分银行，让你的积分变废为宝',
      path: '/pages/index/index?guid=' + app.globalData.guid,
      imageUrl: '../../images/share.png'
    }
  },
  canclebg() {
    this.setData({
      returnConfirm2:false,
    })
    this.getBaseData()
  },
  showConfig(){
    this.setData({
      tipsConfirm:true
    })
  },
  goMycard () {
    wx.navigateTo({
      url: '../../pages/myCard/myCard',
    })
  },
  goAccountBalance(){
    wx.navigateTo({
      url: '../../pages/soccerDetailRecord/soccerDetailRecord',
    })
  },

  init: function () {
    this.getBaseData()
    // this.getorder()
    // this.getContactInfo()
    // this.getRuleInfo()
  },
  getUserInfo (e) {
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo
    })
  },
  goCollections(){
    wx.navigateTo({
      url: '../myCollection/myCollection'
    })
  },
  getContactInfo () {
    wx.showLoading({
      title: '',
      mask: true
    })
    app.postReq('focus.fendacontact/' + app.openId(), {
      openid: app.globalData.openId
    }, (res) => {
      this.setData({
        contactPhone: res
      })
      wx.hideLoading();
    }, (res) => {
      wx.showToast({ title: "请求出错", icon: 'none', duration: 2000 })
    })
  },
  getRuleInfo () {
    wx.showLoading({
      title: '',
      mask: true
    })

  },
  stopMove: function () {
    
  },
  callUs () {
    console.log('打电话')
 
    this.setData({
      tipsConfirm:false
    })
  },
  hideTipsConfirm(e) {
    console.log(e)
    if (this.data.tipsConf.btnFunc && e.currentTarget.dataset.btn == 'sure') {
      this[this.data.tipsConf.btnFunc]()
    }
    this.setData({
      tipsConfirm: false
    })
  },
  goLotteryRecord: function () {
    wx.navigateTo({
      url: '../lotteryRecord/lotteryRecord'
    })
  },
  goInviteRecord: function () {
    wx.navigateTo({
      url: '../invitationRecord/invitationRecord?rewardStep=' + this.data.baseData.inviteRewards + '&todayStep=' + this.data.baseData.totalquota + '&startDt=' + (this.data.baseData.startDt || '') + '&endDt=' + (this.data.baseData.endDt || '')
    })
  },
  goSoccerPage () {
    wx.navigateTo({
      url: '../accountBalance/accountBalance'
    })
  },
  goCashPage () {
    wx.navigateTo({
      url: '../cashBalance/cashBalance'
    })
  },
  goMyFlow () {
    wx.navigateTo({
      url: '../flow/flow?value=' + this.data.baseData.fluxBalance
    })
  },
  goMyWallet () {
    wx.navigateTo({
      url: '../accountBalance/accountBalance'
    })
  },
  goMyReward () {
    wx.navigateTo({
      url: '../myReward/myReward'
    })
  },
  goAddress() {
    wx.navigateTo({
      url: '../addressList/addressList?mine=true'
    })
  },
  goIndex () {
    app.globalData.toDraw = true
    wx.switchTab({
      url: '../index/index'
    })
  },
  getBaseData() {
    app.postReq('focus.mallPageData/' + app.openId(), {
      openid: app.globalData.openId
    }, (res) => {
      let shareInfo = this.data.shareConfirmConf
      shareInfo.person = res.invitedcount
      this.setData({
        shareConfirmConf: shareInfo,
        baseData: res
      })
      wx.hideLoading();
    }, (res) => {
      wx.showToast({ title: "请求出错", icon: 'none', duration: 2000 })
    })
  },

  //密码设置
  goSafe(){
    wx.navigateTo({
      url: '../safeSet/safeSet'
    })
  },

  //获取订单数量
 
  getorder() {
    app.postReq('focus.myOrder/' + app.openId(), {
      page: 1,
      rows: 10,
      orderTyp: "0",
      openid: app.globalData.openId,
    }, (res) => {
      this.setData({
        allOrder: res.data.total || 0
      })
    }),
      app.postReq('focus.myOrder/' + app.openId(), {
        page: 1,
        rows: 10,
        orderTyp:20,
        openid: app.globalData.openId,
      }, (res) => {
        this.setData({
          waitOrder: res.data.total || 0
        })
      }),
      app.postReq('focus.myOrder/' + app.openId(), {
        page: 1,
        rows: 10,
        orderTyp: 30,
        openid: app.globalData.openId,
      }, (res) => {
        this.setData({
          finishOrder: res.data.total || 0
        })
      }),
      app.postReq('focus.myOrder/' + app.openId(), {
        page: 1,
        rows: 10,
        orderTyp: 50,
        openid: app.globalData.openId,
      }, (res) => {
        this.setData({
         endOrde: res.data.total||0
        })
      })
  }
})
