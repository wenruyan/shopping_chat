//app.js
import { checkLogin, getRunData, getWxUserInfo} from './utils/wxCommon.js'
import { postReq, postBufferReq, getReq, toPage  } from './utils/http.js'
import { uuid, common } from './utils/util.js'


App({
  appunionId: "",
  onLaunch: function (options) {
    
    this.appunionId = options 
    wx.hideTabBar();
    this.globalData.openId = wx.getStorageSync("openId")
    this.globalData.session_key = wx.getStorageSync("sessionKey")
    if (options.referrerInfo.extraData && options.referrerInfo.extraData.unionId) {
      this.globalData.unionId = options.referrerInfo.extraData.unionId
      wx.setStorageSync("unionId", options.referrerInfo.extraData.unionId)
    } else {
      this.globalData.unionId = wx.getStorageSync("unionId") || ''
    }
    checkLogin()
    this.getSystemInfo();
    // getWxUserInfo()
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       this.globalData.hasUserInfo = true
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo
    //           this.globalData.hasUserInfo = true
    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     } else {
    //       this.globalData.hasUserInfo = false
    //     }
    //   }
    // })
    wx.hideTabBar();
  },
  onShow: function (options) {
    console.log('步步抽传值：' + JSON.stringify(options))

    if (options.referrerInfo.extraData && options.referrerInfo.extraData.goodsId && options.referrerInfo.extraData.unionId) {
      console.log(options.referrerInfo.extraData)
      this.globalData.unionId = options.referrerInfo.extraData.unionId
      this.globalData.goodsId = options.referrerInfo.extraData.goodsId
      wx.setStorageSync("unionId", options.referrerInfo.extraData.unionId)
    } else if (options.referrerInfo.extraData && options.referrerInfo.extraData.unionId) {
      this.globalData.unionId = options.referrerInfo.extraData.unionId
      wx.setStorageSync("unionId", options.referrerInfo.extraData.unionId)
      console.log(options.referrerInfo.extraData)
    } else {
      this.globalData.unionId = wx.getStorageSync("unionId") || ''

    }
    wx.hideTabBar();
  },
  toPage: function (event) {
    let pageName = event.currentTarget.dataset.page

    wx.navigateTo({ url: '/pages/' + pageName + '/' + pageName })
  },
  getSystemInfo: function () {
    let t = this;
    wx.getSystemInfo({
      success: function (res) {
        t.globalData.systemInfo = res;
        t.globalData.isIphoneX = (res.model.indexOf('iPhone X') > -1  || res.screenHeight == 812) ? true : false
      }
    });
  },
  editTabbar: function () {
    let tabbar = this.globalData.tabBar;
    let currentPages = getCurrentPages();
    console.log(currentPages)
    let _this = currentPages[currentPages.length - 1];
    let pagePath = _this.route;
    // (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (let i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].confPath == pagePath) && (tabbar.list[i].selected = true);
      console.log(tabbar.list[i].confPath, pagePath)
    }
    _this.setData({
      tabbar: tabbar
    });
  },
  openId () {
    let str = ''
    if (this.globalData.openId) {
      str = this.globalData.openId.substr(this.globalData.openId.length - 4, 4)
    }
    return str
  },
  share (cb) {
    this.globalData.guid = this.uuid(16, 16)
    this.postReq('focus.sendShareInfo/' + this.openId(), {
      openid: this.globalData.openId,
      guid: this.globalData.guid,
      sharingType: 10,
      mid: this.globalData.mid
    }, (res) => {
      // res.getAward -> 10 有奖励  -> 20 没有奖励
      typeof cb == 'function' && cb(res.getAward == 10)
    })
  },
  globalData: {
    guid: '',
    pageData:"",
    addressId:'',
    freePay:'',//免密码支付
    addressId: '',
    unionId:"",
    uiv:"",
    encryptedData:'',
    integralBalance:'',//积分
    goodsId:'',
    orderId: '',
    userInfo: null,
    mid: '2510005310970000',
    firstIn:  true,
    openId: "",
    passWord:false,//是否设置密码
    session_key: "",
    inviteRules: [],
    toLottery: false,
    tabBar: {
      "backgroundColor": "#ffffff",
      "color": "#CCCCCC",
      "selectedColor": "#396EFF",
      "list": [
        {
          "pagePath": "../index/index",
          "confPath": "pages/index/index",
          "iconPath": "../../images/tabbar/index.png",
          "selectedIconPath": "../../images/tabbar/index-active.png",
          "text": "首页"
        },
        {
          "pagePath": "",
          "iconPath": "../../images/tabbar/shop.png",
          "selectedIconPath": "../../images/tabbar/shop.png",
          "isSpecial": true,
          "funcName": 'showTipsConfirm',
          "text": "步步抽"
        },
        {
          "pagePath": "../mine/mine",
          "confPath": "pages/mine/mine",
          "iconPath": "../../images/tabbar/my.png",
          "selectedIconPath": "../../images/tabbar/my-active.png",
          "text": "我的"
        }
      ]
    },
    
  },

  checkLogin,
  postReq,
  postBufferReq,
  getReq,
  getWxUserInfo,
  getRunData,
  uuid,
  toPage,
  common
})