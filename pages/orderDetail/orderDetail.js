//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    id:"",
    marginTop:'',
    motto: 'Hello World',
    userInfo: {},
    activeSelect: 1,
    loading: false,
    imageUrl: '',
    amount:"",//订单金额
    mortgageAmount:"",//订单抵金
    integral:"",//订单积分
    orderStatus:10,//订单状态
    imgUrl:"",//商品图片
    mainTitle:"",//商品主题标
    gitPhone: "",  //   收件人电话
    gitName: "",//收件人姓名 
    addressDetail:"",
    currentIndex: 0,
    duration: 1000,
    value1: 1,
    pagination:1,
    notVirtual: false
  },
  onLoad: function (options) {
    console.log(options)
    wx.setTabBarStyle({
      borderStyle: 'black'
    })
    app.postReq('focus.orderDetail/' + app.openId(), {
      mid: getApp().globalData.mid,
      orderId: options.id || options.goodsId,
      openid: app.globalData.openId 
    },(res)=>{
      var row = res.data.rows[0]
      console.log(row)
      if(res.status==1){
        this.setData({
          amount:row.amount,
          mortgageAmount: row.mortgageAmount,
          integral: row.integral,
          gitPhone:row.phone,
          gitName:row.name,
          imgUrl:row.url,
          id:row.id,
          mainTitle:row.mainTitle,
          orderStatus: row.orderStatus,
          addressDetail: row.addressDetail,
          quantity: row.quantity,
          notVirtual: row.productIsVirtual == 10
        })
      }
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
  goOrder:function(e){

  },
  handleChange1 ({ detail }) {
    this.setData({
        value1: detail.value
    })
  },
  swiperChange (event) {
    console.log(event)
    this.setData({
      currentIndex: event.detail.current
    })
  },
  changeSelect: function (e) {
    this.setData({
      activeSelect: e.currentTarget.dataset.type
    })
    if (this.data.realThingList.length == 0 && e.currentTarget.dataset.type == 1) {
      // this.getListData1()
    }
    if (this.data.virtualThingList.length == 0 && e.currentTarget.dataset.type == 2) {
      // this.getListData2()
    }
  }
})
