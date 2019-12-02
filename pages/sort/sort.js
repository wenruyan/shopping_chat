//index.js
//获取应用实例
const app = getApp()
import {
  NumberAnimate
} from '../../utils/numberAnimate.js'
Page({
  data: {
    listData2:[],
    cid:'',
    typeIndex:0,
    goodsTypeList:[],
    singoRow:true,
    goodstype:'全部',
    inputVal:'',
    kong: false,
    indexActive: "默认排序",
    sorting: "",
    highlimit: "",
    lowlimit: "",
    accountArray: ['全部', '1-500', '500-1000', '1000-1500', '1500以上' ],
    actionIndex: 0,
    showChoice: false,
    defaultVal: "默认排序",
    showDisplay: false,
    tipsConfirm: false,
    activeSelect: 1,
    marginTop: '',
    integralBalance: "",
    integration: 0,
    returnConfirm: false,
    listData: [],
    showGuide: true, //指导页
    motto: 'Hello World',
    integral: 0, //积分
    userInfo: null,
    hasUserInfo: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showLoginPanel: false,
    isLogin: false,
    isNight: false,
    isRush: false,
    navbarConf: {
      color: "#FFFFFF",
      opacity: 0
    },
    tabbar: {},
    placeholder: '全球好礼运动换',
    oldRecordList: [],
    list: {
      page: 1,
      rows: 20,
      totalPage: 1
    },
    sortList: [

    ]
  },
  onLoad: function(options) {

    console.log(options)
    this.setData({
      integralBalance: app.globalData.integralBalance,
      placeholder: options.name
    })
    if(options.name){
      this.setData({
        inputVal:options.name 
      })
    }

    console.log(app.globalData.openId)

    this.checkUserInfo();
    this.search()
    // this.getGoodsType()
    // if (app.globalData.systemInfo.model.indexOf("iPhone X") >= 0) {
    //   this.setData({
    //     marginTop: this.data.marginTop + 40,
    //     guideTop: this.data.guideTop + 40
    //   })
    // }
  },
  onPullDownRefresh: function() {
    console.log(33)
    if (!this.data.isRush) {
      wx.showLoading({
        title: '',
        mask: true
      })
      this.setData({
        list: {
          page: 1,
          rows: 20,
          totalPage: 1
        },
        indexActive: "默认排序",
        sorting: "",
        highlimit: "",
        lowlimit: "",
        goodslike: "",
        openid: app.globalData.openId,
        sorting: "",
        highlimit: "",
        lowlimit: "",
        actionIndex: 0,
        inputVal:'',
      })
      this.search()

      this.setData({
        isRush: false
      })
      wx.hideLoading()
    } else {
      wx.hideLoading()
      wx.stopPullDownRefresh()
    }
  },
  goSoccerPage() {
    wx.navigateTo({
      url: '../../pages/accountBalance/accountBalance',

    })
  },
  //下拉刷新
  // onPullDownRefresh: function () {
  //   console.log(22)
  //   if (!this.data.isRush) {
  //     this.updateStepInfo(this.data.userInfo, true)
  //     this.setData({
  //       isRush: true
  //     })
  //   } else {
  //     wx.stopPullDownRefresh()
  //   }
  // },
  toSearch() {
    wx.navigateTo({
      url: '../../pages/searchPage/srearchPage',
    })
  },
  goMallCommodityDetail: function(e) {
    console.log(e)
    app.globalData.goodsId = e.detail.id
    wx.navigateTo({
      url: '../../pages/mallCommodityDetail/mallCommodityDetail'
    })

  },
  goMallCommodityDetail2: function(e) {
    console.log(e)
    app.globalData.goodsId = e.currentTarget.dataset.goodsid
    console.log(e.detail)
    wx.navigateTo({
      url: '../../pages/mallCommodityDetail/mallCommodityDetail'
    })

  },
  //获取商品类目
  getGoodsType(){
    app.postReq('focus.getGoodsType/' + app.openId(), {
      unionId: app.globalData.unionId,
      openid: app.globalData.openId,
      mid: app.globalData.mid
      }, (res) => {
        console.log(res)
        this.setData({
          goodsTypeList:res.response.categories,
        })
    })
  },
  // 单双排切换
  changeSignl(){
    console.log(2222)
    this.setData({
      singoRow: !this.data.singoRow
    })
  
  },
  hideTipsConfirm() {
    this.setData({
      returnConfirm: false
    })
  },
  onShow: function() {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  // 获取商品列表
  getListData() {
    console.log(2345)
    if ((this.data.list.page > this.data.list.totalPage) || this.data.loading) return false
    let data = {
      mid: getApp().globalData.mid,
      openid: app.globalData.openId || 'oytv940faZO2EEGsbiGUMXvzrNIY',
      page: this.data.list.page,
      rows: this.data.list.rows,
      goodstype: '全部'
    }
    wx.showLoading({
      title: '',
      mask: true
    })
    app.postReq('focus.showCommodityList/' + app.openId(), data, (res) => {
      wx.stopPullDownRefresh()
      let arr = this.data.listData
      arr = arr.concat(res.data.rows)
      if (arr.length == 0) {
        this.setData({
          noData: true
        })
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
      wx.hideLoading();
      this.setData({
        loading: false
      })
    }, (res) => {
      wx.showToast({
        title: "请求出错",
        icon: 'none',
        duration: 2000
      })
    })
  },
  //导航栏搜索
  getGoods(e) {
    console.log(e)
    let data = {
      mid: getApp().globalData.mid,
      openid: app.globalData.openId,
      page: 1,
      rows: this.data.list.rows,
      goodstype: String(e.currentTarget.dataset.cid)
    }
    wx.showLoading({
      title: '',
      mask: true
    })
    this.setData({
      loading: true
    })
    app.postReq('focus.commodityList/' + app.openId(), data, (res) => {
      console.log(res)
      if (res.data.total > 0) {
        this.setData({
          listData: res.data.rows
        })
        console.log(this.data.listData)
      } else {
        wx: wx.showToast({
          title: '暂无该商品',
          icon: 'none',
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      }
      wx.hideLoading();
      this.setData({
        loading: false
      })
    })
  },

  // 下拉加载
  onReachBottom() {

    this.search()

    wx.hideLoading()

  },
  //搜索商品
  search() {
    console.log(this.data.listData)
    if ((this.data.list.page > this.data.list.totalPage) || this.data.loading) return false
    wx.stopPullDownRefresh()
    let data = {
      page: this.data.list.page,
      rows: 20,
      mid: getApp().globalData.mid,
      goodslike: this.data.inputVal || "",
      openid: app.globalData.openId,
      sorting: this.data.sorting || "",
      highlimit: this.data.highlimit || "",
      lowlimit: this.data.lowlimit || "",
      goodstype: String(this.data.cid)||""
    }
    wx.showLoading({
      title: '',
      mask: true
    })
    app.postReq('focus.showCommodityList/' + app.openId(), data, (res) => {
      console.log(res)
      wx.stopPullDownRefresh()
      let arr = this.data.listData
      arr = arr.concat(res.data.rows)
      if (arr.length > 0) {
        this.setData({
          kong: false,
          listData: arr,
          lisData1:arr,
          list: {
            page: res.data.page + 1,
            rows: 20,
            totalPage: res.data.totalPage
          },

        })
        wx.hideLoading()
        console.log(this.data.listData)
      } else {
        this.setData({
          kong: true,
        })
        // wx: wx.showToast({
        //   title: '暂无该商品',
        //   icon: 'none',
        //   success: function(res) {},
        //   fail: function(res) {},
        //   complete: function(res) {},
        // })
        app.postReq('focus.getHotItems/' + app.openId(), {
          openid: app.globalData.openId,
          unionId: app.globalData.unionId,
        }, (res) => {
          console.log(res)
          if (res.status == 1) {
            this.setData({
              listData2: res.data.rows
            })
          } else {
            wx.showToast({
              title: '请求错误',
            })
          }
        })
        wx.hideLoading()
      }
      this.setData({
        showDisplay: false,
        tipsConfirm: false,
      })
    })
  },
  // inputTyping(e) {
  //   console.log(e.detail.value)
  //   this.setData({
  //     inputVal: e.detail.value
  //   })
  //   this.setData({
  //     list: {
  //       page: 1,
  //       rows: 20,
  //       totalPage: 1
  //     },
  //     listData:[]
  //   })
  // },
  // 商品详情页
  goSort: function(e) {
    console.log(e)
  },
  //用户登录
  checkUserInfo: function() {
    if (app.globalData.userInfo) {


      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        showLoginPanel: false
      })
    } else {
      if (this.data.canIUse) {
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.userInfoReadyCallback = res => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
            showLoginPanel: false
          })

        }
        app.getWxUserInfo(() => {
          this.setData({
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
  //排序
  changeSelect(e) {
    console.log(e.currentTarget.dataset.type, )
    this.setData({
      activeSelect: e.currentTarget.dataset.type,
      showDisplay: true,
      tipsConfirm: true,

      list: {
        page: 1,
        rows: 20,
        totalPage: 1,
       
      },
      // list2: {
      //   page: 1,
      //   rows: 20,
      //   totalPage: 1,
      // }
    })
    console.log(this.data.list)
  },
  choiceIndex(e) {
    
    console.log(e.currentTarget.dataset.value, e.currentTarget.dataset.sorting)
    this.setData({
      indexActive: e.currentTarget.dataset.value,
      sorting: e.currentTarget.dataset.sorting,
      defaultVal: e.currentTarget.dataset.value,
      showDisplay: false,
      tipsConfirm: false,
      listData: [],

    })
    this.search()
  },
  //类目查找
  changeType(e){
    console.log(e.currentTarget.dataset.index)
    this.setData({
      typeIndex: e.currentTarget.dataset.index,
      cid: e.currentTarget.dataset.cid,
      listData: [],
      list: {
        page: 1,
        rows: 20,
        totalPage: 1,

      }
    }
    )
    this.search()
  },
  //积分范围选择
  jifenChoice(e) {
    console.log(e.currentTarget.dataset.index)
    console.log(e)
    this.setData({
      tipsConfirm: false,
      showDisplay: false,
      actionIndex: e.currentTarget.dataset.index,
      lowlimit: e.currentTarget.dataset.lowlimit,
      highlimit: e.currentTarget.dataset.highlimit,
      listData: [],
    })
    this.search()
  },
  closebg() {
    this.setData({
      tipsConfirm: false,
      showDisplay: false
    })
  }
  // updateStepInfo(userInfo, noLoading) {
  //   if (!wx.getStorageSync('closeGuide')) {
  //     this.setData({
  //       showGuide: true
  //     })
  //   }

  //   clearTimeout(this.data.newPersonTimer)
  //   this.setData({
  //     hbTimeout: 60
  //   })
  //   console.log('firstIn' + app.globalData.firstIn)
  //   app.getRunData((data) => {
  //     let reqData = {
  //       openid: app.globalData.openId,
  //       encryptedData: data.encryptedData,
  //       iv: data.iv,
  //       sessionKey: app.globalData.session_key,
  //       user: JSON.stringify(userInfo.nickName ? userInfo : this.data.userInfo),
  //       check: app.globalData.firstIn ? '0' : '1'
  //     }})
  //   },
})