//index.js
//获取应用实例
const app = getApp()
import {
  NumberAnimate
} from '../../utils/numberAnimate.js'
Page({
  data: {
    showTopInput:false,
    guid: '',
    tipsConfirm:false,//分享以后的弹窗
    limitInfo: "",
    limitGoodsList: [],
    newGoodsList: [],
    xsGoodsList: [],
    newInfo: '',
    menuTop: 0,
    sureSho: true, //固定搜索框
    scrollTop: 0,
    topTopScroll:false,
    endTimeDesc: {},
    isPhone: false,
    marginTop: '',
    appunionId: app.appunionId,
    placeholder: '全球好礼运动换',
    integralBalance: '',
    sign: 1, //签到判断已签到 
    inputVal: '',
    integration: 0,
    returnConfirm: false,
    returnConfirm2:false,
    listData: [],
    showGuide: false, //指导页
    motto: 'Hello World',
    integral: 1222, //积分
    userInfo: null,
    hasUserInfo: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'), //能不能通过btn按钮
    showLoginPanel: false,
    isLogin: false,
    isNight: false,
    isRush: false,
    navbarConf: {
      color: "#FFFFFF",
      opacity: 0
    },
    tipsConf: {
      title: '规则说明',
      content: [],
      btnName: '我知道了'
    },
    tabbar: {},

    oldRecordList: [],
    list: {
      page: 1,
      rows: 10,
      totalPage: 1
    },
    sortList: [

    ]
  },
  onLoad: function(options) {
    wx.loadFontFace({
      family: 'DIN Pro Cond',
      source: 'url("https://dietcoke.focus-base.com/font/DINPro-CondensedBold.ttf")',
      success: console.log
    })
    //打印传值
    let that = this
    this.checkUserInfo();
    console.log(111111, options)
    if (options.unionId) {
      app.globalData.unionId = options.unionId
      that.setData({
        unionId: app.globalData.unionId,

      })
      wx.getStorageSync('unionId',
        options.unionId,
      )
    } else {
      app.globalData.unionId = wx.getStorageSync('unionId')
      that.setData({
        unionId: app.globalData.unionId,
      })

    }
    console.log(app.globalData.openId)
    app.editTabbar();
   
    // that.getListData()
    wx.hideTabBar();
    if (!wx.getStorageSync('closeGuide')) {
      this.setData({
        showGuide: true
      })
    }
    that.getHotGoods()
    // that.getMessage()
    that.getLoginInfo()
    wx.showShareMenu({
      withShareTicket: false
    })
    wx.setBackgroundTextStyle({
      textStyle: 'dark', // 下拉背景字体、loading 图的样式为dark
    })

    console.log(app.globalData.systemInfo)
    // if (app.globalData.systemInfo.model.indexOf("iPhone X") >= 0) {
    //   this.setData({
    //     isPhone: true,
    //     marginTop: this.data.marginTop + 40,
    //     guideTop: this.data.guideTop + 40
    //   })
    // }
    that.getAllStyleGoods()

    console.log(
      5665655, this.data.limitInfo, this.data.newInfo
    )
    // 倒计时
    //获得开奖时间
    //2018-06-01 00:00:00.000
    var endTime = "2018-11-29 00:00:00.000"
  },
  canclebg() {
    this.setData({
      returnConfirm: false,
      returnConfirm2:false,
    })
    this.getMessage()
  },
  toSearch() {
    wx.navigateTo({
      url: '../../pages/searchPage/srearchPage',
    })
  },
  //分享
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
  onPageScroll: function(e) {
    var that = this;
    // console.log(e.scrollTop); //{scrollTop:99}
    that.setData({
      scrollTop: e.scrollTop,
    
    })
    // console.log(that.data.scrollTop)
    if(that.data.scrollTop>=128){
      this.setData({
        showTopInput:true
      })
    }else{
      this.setData({
        showTopInput:false
      })
    }
    if (that.data.scrollTop>=900){ 
      this.setData({
        topTopScroll: true
      })  
    }else{
      this.setData({
        topTopScroll: false
      })  
    }
    // let query = wx.createSelectorQuery()
    // query.select('#selectId').boundingClientRect((rect) => {
    //   let top = rect.top
    //   if (e.scrollTop >= that.data.menuTop) { //临界值，根据自己的需求来调整
    //     that.setData({
    //       sureSho: false, //是否固定导航栏

    //     })
    //   } else {
    //     that.setData({
    //       sureSho: true

    //     })
    //   }
    // }).exec()
 
  },
  // 回到顶部
  backTop (e) {  // 一键回到顶部
      if (wx.pageScrollTo) {
        wx.pageScrollTo({
          scrollTop: 0
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
        })
      }
  },
  closeGuide() {
    this.setData({
      showGuide: false
    })
    wx.setStorageSync("closeGuide", true)
  },
  goMallCommodityDetail: function(e) {
    app.globalData.goodsId = e.detail.id
    console.log(e.detail)
    wx.navigateTo({
      url: '../../pages/mallCommodityDetail/mallCommodityDetail'
    })

  },
  toSousuo() {
    wx.navigateTo({
      url: '../../pages/Redeem/Redeem?from=mine',
    })
  },
  //热门商品查询
  getHotGoods() {
    app.postReq('focus.getHotItems/' + (app.openId() || '1111'), {
      openid: app.globalData.openId || '1111',
      unionId: app.globalData.unionId,
    }, (res) => {
      console.log(res)
      if (res.status == 1) {
        this.setData({
          listData: res.data.rows
        })
      } else {
        wx.showToast({
          title: '请求错误',
        })
      }
    })
  },
  //获取个人信息
  getMessage: function() {
    wx.stopPullDownRefresh()
    console.log(app.globalData.openId, app.globalData.unionId, this.data.userInfo)
    app.postReq('focus.mallPageData/' + app.openId(), {
      openid: app.globalData.openId,
      unionId: app.globalData.unionId,
      user: JSON.stringify(app.globalData.userInfo || this.data.userInfo),
    }, (res) => {
      console.log(res)
      wx.setStorageSync('pageData', JSON.stringify(res))
      app.globalData.integralBalance = res.integralBalance
      app.globalData.freePay = res.noPwdSwitch
      app.globalData.pageData = res
      wx.setStorageSync("freePay",
        res.noPwdSwitch,
      )
      this.setData({
        integralBalance: res.integralBalance,
        sign: res.sign
      })
      if (res.parPwd == '20') {
        app.globalData.passWord = false
        wx.setStorageSync("passWord",
          false,
        )
      }
      if (res.parPwd == '10') {
        app.globalData.passWord = true
        wx.setStorageSync("passWord", true, )
      }
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
  },
  //查看商品详情
  godetail(e) {
    console.log(e)
    wx.navigateTo({
      url: '../../pages/mallCommodityDetail/mallCommodityDetail?goodsId=' + e.currentTarget.dataset.id,
    })
  },
  signIn() {
    var that = this
    if (that.data.sign == 0) {
      app.postReq('focus.signIn/' + app.openId(), {
        openid: app.globalData.openId,
        unionId: app.globalData.unionId,
        mid: app.globalData.mid
      }, (res) => {
        console.log(res)
        if (res.success == true) {
          that.setData({
            returnConfirm: true,
            sign: 1
          })
        }
        setTimeout(() => {
          that.setData({
            returnConfirm: false
          })
        }, 3000)
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '今日已签到',
      })
    }
    that.getMessage()
  },
  hideTipsConfirm() {
    this.setData({
      returnConfirm: false
    })
  },
  goSort() {
    wx.navigateTo({
      url: '../../pages/sort/sort',
    })
  },
  onShow: function() {
    // var that = this;
    // that.getMessage()
  },
  //搜索商品
  search(e) {
    this.toPage(e)
  },
  inputTyping(e) {
    console.log(e.detail.value)

    this.setData({
      inputVal: e.detail.value
    })
  },
  //商品列表页
  toPage: function() {

    wx.navigateTo({
      url: '../../pages/sort/sort?name=' + this.data.inputVal,

    })

  },

  goSoccerPage() {
    wx.navigateTo({
      url: '../../pages/soccerDetailRecord/soccerDetailRecord',

    })
  },
  //获取新人福利 限时换购 热门商品
  getAllStyleGoods() {
    var that = this
    // if ((this.data.list.page > this.data.list.totalPage) || this.data.loading) return false
    let data = {
      mid: getApp().globalData.mid,
      openid: app.globalData.openId,
      // page: this.data.list.page,
      // rows: this.data.list.rows,
      // goodsTyp: "全部"
    }

    app.postReq('focus.moduleInfomation/' + app.openId(), data, (res) => {
      console.log(res.data, Array.isArray(res.data.rows))
      var promotionGoods = res.data.rows
      for (var i = 0; i < promotionGoods.length; i++) {
        if (promotionGoods[i]['moudlename'] == '限时换购') {
          console.log(promotionGoods[i]['promotionname'])
          that.setData({
            newInfo: promotionGoods[i]['promotionname']
          })
          console.log(i)
          console.log(promotionGoods[i]['offlinetime'])
          var endTime = promotionGoods[i]['offlinetime']
          let t = endTime.split(/-|T|Z|:|\./);
          console.log(t)
          t = (new Date(t[0], parseInt(t[1]), t[2], t[3], t[4], t[5], t[6]));
          console.log(new Date(t[0], parseInt(t[1]), t[2], t[3], t[4], t[5], t[6]))
          var endMillTime = t.getTime();
          console.log(endMillTime, 66666)
          setInterval(() => {
            let now = new Date().getTime();
            let desc = [];

            desc = {};
            let leftTime = endMillTime - now;
            let day = parseInt(leftTime / 86400000);
            leftTime = leftTime % 86400000; //剩下的是几个小时
            let hour = parseInt(leftTime / (60 * 60 * 1000));
            leftTime = leftTime % (60 * 60 * 1000); //剩下的是几分钟
            let minute = parseInt(leftTime / (60 * 1000));
            leftTime = leftTime % (60 * 1000); //剩下的是几秒
            let second = parseInt(leftTime / 1000);

            if (day < 10) {
              desc.day = '0' + day;
            } else {
              desc.day = day;
            }
            if (hour < 10) {
              desc.hour = '0' + hour;
            } else {
              desc.hour = hour;
            }
            if (minute < 10) {
              desc.minute = '0' + minute;
            } else {
              desc.minute = minute;
            }
            if (second < 10) {
              desc.second = '0' + second;
            } else {
              desc.second = second;
            }


            //row.endTimeDesc = desc.join('');
            //this.setData({ awardList: awardList });
            that.setData({
              endTimeDesc: desc
            });
          }, 1000)
          console.log(that.data.endTimeDesc)
          that.getPromotionInfo(promotionGoods[i].promotionInfo, 2)
        } else {
          console.log('sorry')
          that.setData({
            limitInfo: promotionGoods[i]['promotionname']
          })
          that.getPromotionInfo(promotionGoods[i].promotionInfo, 1)
        }
      }
      
      // that.getPromotionInfo(limitInfo)
    })
  },
  // 封装通过promotionInfo获取商品
  getPromotionInfo(id, type) {
    var that = this
    app.postReq('focus.showPromotionItemList/' + app.openId(), {
      promotionInfo: id,
      openid: app.globalData.openId,
    }, (res) => {
      console.log(res.data.rows)
      if (res.status == 1) {
        if (type == 1) {
          that.setData({
            newGoodsList: res.data.rows
          })
        } else {
          that.setData({
            xsGoodsList: res.data.rows
          })
        }
      }
      console.log(that.data.newGoodsList)
    })
  },
  // 获取商品列表
  getListData() {
    if ((this.data.list.page > this.data.list.totalPage) || this.data.loading) return false
    let data = {
      mid: getApp().globalData.mid,
      openid: "aaaaaaaaaaaaaaaaa",
      page: this.data.list.page,
      rows: this.data.list.rows,
      goodsTyp: "全部"
    }
    app.postReq('focus.commodityList/' + app.openId(), data, (res) => {
      let arr = this.data.listData
      arr = arr.concat(res.data.rows)
      if (res.status == 1) {
        this.setData({
          listData: res.data.rows
        })
        console.log(this.data.listData)
      } else {
        this.setData({
          listData: arr,
          list: {
            page: res.data.page + 1,
            rows: this.data.list.rows,
            totalPage: res.data.totalPage
          }
        })

      }
    }, (res) => {
      wx.showToast({
        title: "请求出错",
        icon: 'none',
        duration: 2000
      })
    })
  },
  toSort() {
    wx.navigateTo({
      url: '../../pages/sort/sort',
    })
  },
  // 商品详情页
  goSort: function(e) {
    console.log(e)
  },
  //用户登录
  checkUserInfo: function() {
    console.log(344)
    if (app.globalData.userInfo && this.data.unionId) {
      console.log("you")

      // this.getListData()
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        showLoginPanel: false
      })
      // this.getMessage()
    } else {
      if (this.data.canIUse) {
        console.log('old')
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.userInfoReadyCallback = res => {
          console.log("have")
          if (this.data.unionId) {
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true,
              showLoginPanel: false
            })
          } else {
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: false,
              showLoginPanel: true
            })
          }


        }
        app.getWxUserInfo((res) => {
          console.log(1, res)
          this.setData({
            showLoginPanel: true
          })

        })

      } else {

        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
          success: res => {
            connsole.log(2, res)
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
      console.log(res.data)
      app.globalData.unionId = res.data.data[0].unionId
      console.log(app.globalData.unionId, 22222)
      this.setData({
        unionId: res.data.data[0].unionId
      })
      wx.setStorageSync('unionId',
        res.data.data[0].unionId
      )
      // this.getMessage()
      this.getLoginInfo()
      // this.getListData()
    })
  },

  onPullDownRefresh: function() {
    console.log(33)
    if (!this.data.isRush) {
      wx.showLoading({
        title: '',
        mask: true
      })
      this.getMessage()
      this.setData({
        isRush: false
      })
    } else {
      wx.hideLoading()
      wx.stopPullDownRefresh()
    }
  },
  getLoginInfo (cb) {
    let param = {
      mid: app.globalData.mid,
      openid: app.globalData.openId
    }
    app.postReq("focus.savePointsMiniLogin/" + app.openId(), param, (res) => {
      // console.log(res.data)
      if (res.code == 200) {
        this.getMessage()
      } else if (res.code == '1001') {
        wx.showToast({ title: "请绑定手机号", icon: 'none', duration: 1000 })
        setTimeout(() => {
          wx.redirectTo({ url: '/pages/bindPhoneStep1/bindPhoneStep1' })
        }, 1000)
      }
    })
  }

})