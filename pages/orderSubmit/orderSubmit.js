//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    notVirtual: false,
    money:0,
    formGO:false,
    step:0,
    whereFrom:0,
    isIphoneX: app.globalData.isIphoneX,
    deductionOne:'',
    addressId:'',
    jifen:[],
    jifenMoney:[],
    marginTop:"",
    mima:"",
    amountJ:0,
    amountM:0,
    valueRatio:0,
    ratio:"",//抵押金
    Length: 6,    //输入框个数 
    isFocus: true,  //聚焦 
    Value: "",    //输入的内容 
    ispassword: true, //是否密文显示 true为密文， false为明文。 
    deduction:'',
    integralBalance:"",
    returnConfirm:true,//密码支付
    sureSafe:false,
    showAddress:true,
    goodsid:"",
    orderid:"",
    successOrderId: "",
    addressId:"",
    paySure:false,
    passWord:false,
    payConfirm:false,
    tipsConfirm:false,//提示框
    motto: 'Hello World',
    userInfo: {},
    activeClass:false,
    setPassword:true,
    nowActive:30,
    pageData:{},
    activeSelect: 1,
    imgUrls: '',
    currentIndex: 0,
    duration: 1000,
    value1: 1,
    shouInfo:{},
    mailFee: 0,
    isMoreAttr: false,
    attrText: '',
    choosedSku: {},
    maxStock: 99999
  },
  onLoad: function (options) {
    console.log(options,'options')
    this.setData({
      whereFrom: options.whereFrom,
      integralBalance: app.globalData.integralBalance,
      pageData: JSON.parse(wx.getStorageSync('pageData')),
      goodsid: app.globalData.goodsId,
      orderid: app.globalData.orderId,
      skuId: options.skuId,
      mailFee: options.mailFee || 0,
      notVirtual: options.commodityType == 10,
      value1: options.buyCount || 1
    })
    wx.setTabBarStyle({
      borderStyle: 'black'
    })
    wx.showLoading({
      title: '',
      mask: true
    })
    app.postReq('focus.goodsDetail/' + app.openId(), {
      mid: getApp().globalData.mid,
      goodsId: this.data.goodsid,
      openid: app.globalData.openId
    }, (res) => {
      console.log(res)
      if (res.status == 1) {
        console.log(res.data.rows[0].skuList[0].priceList[0].amount)

        console.log((JSON.parse(wx.getStorageSync('pageData')).accountBalance) / 100)
        let choosedSku = '';
        let skuText = ''
        res.data.rows[0].skuList.map((item) => {
          if (item.id == this.data.skuId) choosedSku = item
        })
        res.data.rows[0].productspecificationset.map((item, index) => {
          skuText += `${item.name}:${choosedSku.productspecificationset[index].name};`
        })
        this.setData({
          deductionOne: res.data.rows[0].skuList[0].priceList[0].amount,
          goodsDetail: res.data.rows[0],
          isMoreAttr: res.data.rows[0].productspecificationset.length > 0,
          imgUrls: choosedSku.skuimage || res.data.imageList[0].url,
          attrText: skuText,
          choosedSku: choosedSku,
          maxStock: choosedSku.quantity
        })
        let deductions = (this.data.deductionOne ) <= ((JSON.parse(wx.getStorageSync('pageData')).accountBalance) / 100) ? (this.data.deductionOne) : ((JSON.parse(wx.getStorageSync('pageData')).accountBalance) / 100)
        this.setData({
          deduction: deductions,
        })
        console.log(this.data.deductionOne)
        var resStyle = this.data.choosedSku.priceList
        for (var i = 0; i < resStyle.length; i++) {
          if (resStyle[i].paymenttype == "1030") {
            console.log(resStyle[i])
            this.setData({
              jifen: resStyle[i]
            })
          }
          if (resStyle[i].paymenttype == "10") {
            console.log(resStyle[i])
            this.setData({
              jifenMoney: resStyle[i]
            })
          }

        }
      }
      wx.hideLoading();
    })

    // if (app.globalData.systemInfo.model.indexOf("iPhone X") >= 0) {
    //   this.setData({
    //     marginTop: this.data.marginTop + 40,
    //     guideTop: this.data.guideTop + 40
    //   })
    // }
  },
  
  onShow () {
    var that = this;
    // wx.getStorageSync({
    //   key:'passWord',
    //   success: function (res) {
    //     console.log(res)//Object {errMsg: "getStorage:ok", data: "value1"}
    //     that.setData({
    //       passWord:res.data
    //     })
    //   }
    // })
    app.postReq('focus.mallPageData/' + app.openId(), {
      openid: app.globalData.openId,
      unionId: app.globalData.unionId,
      user: JSON.stringify(app.globalData.userInfo || this.data.userInfo),
    }, (res) => {
      console.log(res)
      wx.setStorageSync('pageData', JSON.stringify(res))
      this.setData({
        pageData: res,
        integralBalance: res.integralBalance
      })

      if (res.parPwd == 10) {
        this.setData({
          passWord: true
        })
      }
    })
    if (app.globalData.addressId) {
      this.setData({
        addressId: app.globalData.addressId
      })
    }
    if(this.data.addressId){
      console.log(this.data.addressId)
      app.postReq('focus.getAddress/' + app.openId(), {
        id: this.data.addressId,
        openid: app.globalData.openId
      },(res)=>{
        console.log(res)
        if(res.status==1 && res.data.rows.length > 0){
          this.setData({
            addressId:res.data.rows[0].id,
            showAddress:false,
            shouInfo:res.data.rows[0]
          })
        }
      })
    }
  },
  closeShow(){
    this.setData({
      payConfirm:false
    })
  },
  // 关闭提示框
  hideTipsConfirm(){
    this.setData({
      tipsConfirm:false
    })
  },
  // goPay () {
  //   // 提交订单时的统一方法
  //   let payType = this.data.nowActive;
  //   let goodsNumber = this.data.value1;
  //   let needJifen = goodsNumber * (payType == 30 ? this.data.jifen.integral : this.data.jifenMoney.integral);
  //   let useBalance = this.data.activeClass;
  //   let addressId = this.data.addressId || false
  //   if (!addressId) {
  //     wx.showToast({
  //       icon: 'none',
  //       title: '请选择收货地址'
  //     })
  //     return
  //   } else if (this.data.integralBalance < needJifen && this.data.whereFrom == 0) {
  //     wx.showToast({
  //       icon: 'none',
  //       title: '积分不足'
  //     })
  //     return
  //   } else if (this.data.integralBalance < needJifen && this.data.whereFrom == 1) {
  //   this.setData({
  //     formGO:true
  //   })
  //     this.getInfo()
  //     return
  //   }
  //   else {
  //     wx.showLoading({
  //       title: '',
  //       mask: true
  //     })
  //     app.postReq('focus.buyGoodsbak/' + app.openId(), {
  //       openid: app.globalData.openId,
  //       orderid: this.data.orderid,
  //       goodsId: this.data.goodsid,
  //       addressId: addressId,
  //       paytype: payType,
  //       mortgageamount: useBalance ? this.data.deduction * 100 : 0,
  //       quantity: goodsNumber
  //     }, (res) => {
  //       wx.hideLoading()
  //       console.log(JSON.parse(res).result)
  //       let data = JSON.parse(res);
  //       if (data.result == 'IntegralBalanceERR') {
  //         wx.showToast({
  //           icon: 'none',
  //           title: '积分不足'
  //         })
  //       } else if (data.result == 'mortgageamountERR') {
  //         wx.showToast({
  //           icon: 'none',
  //           title: '现金余额不足'
  //         })
  //       } else if (data.out_trade_no) {
  //         console.log('调用微信支付')
  //         this.wxPay(JSON.parse(decodeURIComponent(res)))
  //       } else if (data.result == 'SUCCESS') {
  //         console.log('成功，跳转至订单页')
  //         wx.showToast({
  //           icon: 'success',
  //           title: '提交成功'
  //         })
  //         setTimeout(() => {
  //           wx.redirectTo({
  //             url: '../orderDetail/orderDetail?id=' + data.order
  //           })
  //         } ,1000)
  //       }
  //     })
  //   }
  // },
  goPay() {
    // 提交订单时的统一方法
    let payType = 30;
    let goodsNumber = this.data.value1;
    let needJifen = goodsNumber * this.data.jifen.integral 
    let useBalance = this.data.activeClass;
    let addressId = this.data.addressId || false
    if (!addressId && this.data.notVirtual) {
      wx.showToast({
        icon: 'none',
        title: '请选择收货地址'
      })
      return
    } else if (this.data.integralBalance < needJifen && this.data.whereFrom==0) {
      wx.showToast({
        icon: 'none',
        title: '积分不足'
      })
      return
    } else if (this.data.integralBalance < needJifen && this.data.whereFrom == 1) {
    this.setData({
      formGO:true
    })
      this.getInfo()
      return
    }  
    else {
      wx.showLoading({
        title: '',
        mask: true
      })
      app.postReq('focus.buyGoodsByPoints/' + app.openId(), {
        openid: app.globalData.openId,
        orderid: this.data.orderid,
        goodsId: this.data.goodsid,
        addressId: addressId,
        paytype: 30,
        mortgageamount: 0,
        quantity: goodsNumber,
        skuId: this.data.skuId
      }, (res) => {
        wx.hideLoading()
        // console.log(JSON.parse(res).result)
        try{
          res = JSON.parse(res);
        } catch (err) {
          console.log(err)
        }
        let data = res;
        if (data.result == 'IntegralBalanceERR') {
          wx.showToast({
            icon: 'none',
            title: '积分不足'
          })
        }  else if (data.result == 'SUCCESS') {
          console.log('成功，跳转至订单页')
          wx.showToast({
            icon: 'success',
            title: '购买成功'
          })
          setTimeout(() => {
            wx.redirectTo({
              url: '../orderDetail/orderDetail?id=' + this.data.orderid
            })
          }, 1000)
        }
      })
    }
  },
  //选择余额抵押
  changeClass: function () {
    this.setData({
      activeClass: !this.data.activeClass,
      valueRatio: this.data.ratio
    })
  },
  //设置密码
  gosafeSet(){
    if(this.data.sureSafe==false){
      this.setData({
        payConfirm:true
      })
    }
   else{ wx.navigateTo({
      url: '../safeSet/safeSet',
    })}
  },
  sureSafeSet(){
    this.setData({
      payConfirm: false
    })
    wx.navigateTo({
      url:'../../pages/safeSet/safeSet',
    })
  },
  handleChange1 ({ detail }) {
    console.log(detail, this.data.maxStock)
    if (detail.value >  this.data.maxStock) {
      wx.showToast({
        title: '商品已达到上限',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
        success: (result)=>{
          
        },
        fail: ()=>{},
        complete: ()=>{}
      });
      return false
    }
    this.setData({
        value1: detail.value
    })
    let deductions = ((this.data.deductionOne) * (this.data.value1) ) <= ((JSON.parse(wx.getStorageSync('pageData')).accountBalance) / 100) ? ((this.data.deductionOne) * (this.data.value1) ) : ((JSON.parse(wx.getStorageSync('pageData')).accountBalance) / 100)
    this.setData({
      deduction: deductions,
    })
    console.log(this.data.deduction)
  },
  toPage: function (event) {
    let pageName = event.currentTarget.dataset.page
    let name = event.currentTarget.dataset.name
    wx.navigateTo({ url: '/pages/' + pageName + '/' + pageName })
  },
//  去付款
  payment:function(){
    console.log(333)
  },
  changeActive(e){
    console.log(e.currentTarget.dataset.active)
    this.setData({
      nowActive: e.currentTarget.dataset.active
    })
    console.log(this.data.nowActive)
  },
  swiperChange (event) {
    console.log(event)
    this.setData({
      currentIndex: event.detail.current
    })
  },
  //关闭设置密码
  closeMima(){
    console.log(33)
    this.setData({
      payConfirm: false,
      formGO:false
    })
  },
  //关闭支付框
  closeShow(){
    console.log(22)
    this.setData({
      paySure:false,
      Value:"",
    })
  },

  //获取输入密码
  Focus(e) {
    var that = this;
    console.log(e.detail.value);
    var inputValue = e.detail.value;
    that.setData({
      Value: e.detail.value,
    })
  },
  Tap() {
    var that = this;
    that.setData({
      isFocus: true,
    })
  },
  formSubmit(e) {
    console.log(e.detail.value.password);
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
  },
  wxPay: function (data) {
    let that = this;
    let tmpData = {
      timeStamp: data.timeStamp.toString(),
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType,
      paySign: data.paySign,
      success: (res) => {
        console.log('支付成功', res)
        wx.showToast('支付成功')
        that.setData({
          successOrderId: data.order
        })
        that.cashPaySuccess()
      },
      fail: (res) => {
        console.log('支付失败', res)
        wx.showToast({
          icon: 'none',
          title: '取消支付'
        })
      }
    }
    console.log(tmpData)
    wx.requestPayment(tmpData)
  },
  //获取可以兑换的积分
  getInfo() {
    app.postReq('focus.mallPageData/' + app.openId(), {
      openid: app.globalData.openId,
      unionId: app.globalData.unionId,
      user: JSON.stringify(app.globalData.userInfo || this.data.userInfo),
    }, (res) => {
      console.log(res)
      if (!res.error && !res.errorMsg) {
        wx.setStorageSync('pageData', JSON.stringify(res))
        this.setData({
          step: parseInt(res.step / 100),
       
        })
      }
    })
  },
  // 兑换积分并购买
  goSure() {
    var that = this
    if ((that.data.step * 100) == 0) {
      wx.showToast({
        title: '步数不足',
        icon:"none"
      })
      return
    }
    app.postReq('focus.stepToIntegral/' + app.openId(), {
      openid: app.globalData.openId,
      unionId: app.globalData.unionId,
      step: this.data.step * 100,
      money: this.data.money || '0'
    }, (res) => {
      res = JSON.parse(res)
      
      if (res.result == 'SUCCESS' ) {
        let payType = 30;
        let goodsNumber = this.data.value1;
        let needJifen = goodsNumber * this.data.jifen.integral
        let useBalance = this.data.activeClass;
        let addressId = this.data.addressId || false
        if (!addressId) {
          wx.showToast({
            icon: 'none',
            title: '请选择收货地址'
          })
          return
        }
        console.log(123)
        wx.showLoading({
          title: '',
          mask: true
        })
   
        app.postReq('focus.buyGoodsByPoints/' + app.openId(), {
          openid: app.globalData.openId,
          orderid: this.data.orderid,
          goodsId: this.data.goodsid,
          addressId: addressId,
          paytype: 30,
          mortgageamount: 0,
          quantity: goodsNumber
        }, (res) => {
          wx.hideLoading()
          console.log(JSON.parse(res).result)
          let data = JSON.parse(res);
          if (data.result == 'IntegralBalanceERR') {
            wx.showToast({
              icon: 'none',
              title: '积分不足'
            })
          } else if (data.result == 'SUCCESS') {
            console.log('成功，跳转至订单页')
            wx.showToast({
              icon: 'success',
              title: '购买成功'
            })
            setTimeout(() => {
              wx.redirectTo({
                url: '../orderDetail/orderDetail?id=' + this.data.orderid
              })
            }, 1000)
          }
        })
      }

    })
 
  },
  // 兑换积分并且支付
  goExchange(){
    this.goSure()
  },
  cashPaySuccess: function () {
    app.postReq('focus.afterBuyGoods/' + app.openId(), {
      openid: app.globalData.openId,
      orderid: this.data.successOrderId,
      orderstatus: 1,
      paytype: this.data.nowActive
    }, (res) => {
      wx.redirectTo({
        url: '../orderDetail/orderDetail?id=' + this.data.successOrderId
      })
    })
  }
})
