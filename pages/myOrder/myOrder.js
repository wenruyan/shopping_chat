//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    marginTop:'',
    tuikuan:false,
    canshu:0,
    tipsConfirm:false,
    motto: 'Hello World',
    userInfo: {},
    listData1: [],
    listData2: [],
    listData3: [],
    listData5: [],
    returnConfirm:false,
   
    activeSelect: 1,
      page2:1,
      page3:1,
      page5:1,
      page: 1,
      rows: 10,
      totalPage: 1,
      totalPage2: 1,
      totalPage3: 1,
      totalPage5: 1,
      noData: false,
      noData2: false,
      noData3: false,
      noData5: false,
      loading: false
  },
  onLoad: function (options) {
    console.log(options)
    console.log(options.type)
    this.setData({
      activeSelect: options.activeSelect,
      canshu: options.type
    })
    if (options.type==0){
      this.getOrderList()
    } else if (options.type ==20){
      this.getOrderList2()
    } else if (options.type ==30){
      this.getOrderList3()
    }else{
      this.getOrderList5()
    }
   
    wx.setTabBarStyle({
      borderStyle: 'black'
    })
    // if (app.globalData.systemInfo.model.indexOf("iPhone X") >= 0) {
    //   this.setData({
    //     marginTop: this.data.marginTop + 40,
    //     guideTop: this.data.guideTop + 40
    //   })
    // }
  },
  onShow () {

  },
  changeSelect: function (e) {
    this.getOrderList()
    console.log(e.currentTarget.dataset.tab)
    
    this.setData({
      activeSelect: e.currentTarget.dataset.type,
      canshu: e.currentTarget.dataset.tab
    })
   
  },
  changeSelect3: function (e) {
    this.getOrderList3()
    console.log(e.currentTarget.dataset.tab)

    this.setData({
      activeSelect: e.currentTarget.dataset.type,
      canshu: e.currentTarget.dataset.tab
    })

  },
  changeSelect5: function (e) {
    this.getOrderList5()
    console.log(e.currentTarget.dataset.tab)

    this.setData({
      activeSelect: e.currentTarget.dataset.type,
      canshu: e.currentTarget.dataset.tab
    })

  },
  changeSelect2: function (e) {
    this.getOrderList2()
    console.log(e.currentTarget.dataset.tab)
    this.setData({
      activeSelect: e.currentTarget.dataset.type,
      canshu: e.currentTarget.dataset.tab
    })
   
  },
  getUserInfo (e) {
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo
    })
  },
  //查看订单详情
  toorderDetail(e){
    console.log(e)
    wx.navigateTo({
      url: '../../pages/orderDetail/orderDetail?goodsId=' + e.currentTarget.dataset.goodsid,
    })
  },
  showConfirm(e){
    var index = e.currentTarget.dataset.index;
    
    arr=arr.append(index)
    if (e.currentTarget.dataset.state == 1) {     
    }
     this.setData({
       dates: this.data.dates,
      });
    this.setData({
      tuikuan: e.currentTarget.dataset.index,     
    })
  },
  hideTipsConfirm(){
    this.setData({
      tipsConfirm:false,
      returnConfirm:false
    })
  },
  hideTipsConfirmT(){
    this.setData({
      tipsConfirm: false,
      returnConfirm:true,
      tuikuan:true
    })
  },
  //获取订单
  getOrderList3() {

    if ((this.data.page3 > this.data.totalPage3) || this.data.loading) return false
    wx.showLoading({
      title: '',
      mask: true
    })
    this.setData({
      loading: true
    })
    let data = {
      orderTyp: 30,
      openid: app.globalData.openId,
      page:this.data.page3,
      rows: this.data.rows,
      unionId: app.globalData.unionId,
      productIsVirtual: '10'
    }
    app.postReq('focus.myOrder/' + app.openId(), data, (res) => {
      let arr = this.data.listData3
      arr = arr.concat(res.data.rows)
      if (arr.length == 0) {
        this.setData({
          noData3: true
        })
      } else {
        console.log(arr)
        this.setData({
          listData3: arr,
          orderTyp: 30,
          page3: res.data.page + 1,
          rows: this.data.rows,
          totalPage3: res.data.totalPage

        })

      }
     wx.hideLoading();
      this.setData({
        loading: false
      })
    }, (res) => {
      wx.showToast({ title: "请求出错", icon: 'none', duration: 2000 })
    })
  },
  getOrderList5() {

    if ((this.data.page5 > this.data.totalPage5) || this.data.loading) return false
    wx.showLoading({
      title: '',
      mask: true
    })
    this.setData({
      loading: true
    })

    let data = {
      orderTyp:50,
      openid: app.globalData.openId,
      page: this.data.page5,
      rows: this.data.rows,
      unionId: app.globalData.unionId,
      productIsVirtual: '10'
    }
    app.postReq('focus.myOrder/' + app.openId(), data, (res) => {
      let arr = this.data.listData5
      arr = arr.concat(res.data.rows)
      if (arr.length == 0) {
        this.setData({
          noData5: true
        })
      } else {
        console.log(arr)
        this.setData({
          listData5: arr,
          orderTyp: 50,
          page5: res.data.page + 1,
          rows: this.data.rows,
          totalPage5: res.data.totalPage
        })
      }
      wx.hideLoading();
      this.setData({
        loading: false
      })
    }, (res) => {
      wx.showToast({ title: "请求出错", icon: 'none', duration: 2000 })
    })
  },
  getOrderList2() {
    if ((this.data.page2 > this.data.totalPage2) || this.data.loading) return false
    wx.showLoading({
      title: '',
      mask: true
    })
    this.setData({
      loading: true
    })
    let data = {
      orderTyp: 20,
      openid: app.globalData.openId,
      page: this.data.page2,
      rows: this.data.rows,
      unionId: app.globalData.unionId,
      productIsVirtual: '10'
    }
    app.postReq('focus.myOrder/' + app.openId(), data, (res) => {
      let arr = this.data.listData2
      arr = arr.concat(res.data.rows)
      if (arr.length == 0) {
        this.setData({
          noData2: true
        })
      } else {
        console.log(arr)
        this.setData({
          listData2: arr,
          orderTyp:20,
          page2: res.data.page + 1,
          rows: this.data.rows,
          totalPage2: res.data.totalPage
        })
      }
      wx.hideLoading();
      this.setData({
        loading: false
      })
    }, (res) => {
      wx.showToast({ title: "请求出错", icon: 'none', duration: 2000 })
    })
  },
  getOrderList() {
    if ((this.data.page > this.data.totalPage) || this.data.loading) return false
    wx.showLoading({
      title: '',
      mask: true
    })
    this.setData({
      loading: true
    })
    let data = {
      orderTyp:'0',
      openid: app.globalData.openId,
      page: this.data.page,
      rows: this.data.rows,
      unionId: app.globalData.unionId,
      productIsVirtual: '10'
    }
    app.postReq('focus.myOrder/' + app.openId(), data, (res) => {
      let arr = this.data.listData1
      arr = arr.concat(res.data.rows)
      if (arr.length == 0) {
        this.setData({
          noData: true
        })
      } else {
        console.log(arr)
        this.setData({
          listData1: arr,
          orderTyp:'0',
          page: res.data.page + 1,
          rows: this.data.rows,
          totalPage: res.data.totalPage
        })
      }
      wx.hideLoading();
      this.setData({
        loading: false
      })
    }, (res) => {
      wx.showToast({ title: "请求出错", icon: 'none', duration: 2000 })
    })
  }, 
})
