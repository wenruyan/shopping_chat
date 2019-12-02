//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    endTimeDesc: {},
    returnConfirm: false,
    noData: false,
    showAdress: false,
    marginTop: "",

    motto: 'Hello World',
    userInfo: {},
    showTabbar: false,
    tabbar: {},
    userAdress: [],
    region: ['', '', ''],
    fromeMine: false
  },
  onLoad: function(options) {
    console.log(options)
    this.setData({
      showAdress: app.globalData.addressId || "",
       fromeMine: options.mine
    })
    wx.setTabBarStyle({
      borderStyle: 'black'
    })
    this.getHistoryAddress()
    // if (app.globalData.systemInfo.model.indexOf("iPhone X") >= 0) {
    //   this.setData({
    //     marginTop: this.data.marginTop + 40,
    //     guideTop: this.data.guideTop + 40
    //   })
    // }

  },
  onShow: function() {
    this.getHistoryAddress()
  },
  // 重新设置默认地址
  radioChange(e) {
    console.log(e.currentTarget.dataset.id)
    if (this.data.showAdress!= e.currentTarget.dataset.id){
    this.setData({
      showAdress: e.currentTarget.dataset.id
    })}else{
      this.setData({
        showAdress: 500
      })
    }
    if (e.currentTarget.dataset.isdefault==10){
      var isDefault=20
    }else{
      var isDefault = 10
    }
    app.globalData.addressId = e.currentTarget.dataset.id;
    app.postReq('focus.setDefaultAddress/' + app.openId(), {
      openid: app.globalData.openId,
      addressId: e.currentTarget.dataset.id,
      isDefault: isDefault
    }, (res) => {
      this.getHistoryAddress()
    })

  },
  changeAddress(e) {
    wx.navigateTo({
      url: '../../pages/address/address?id=' + e.currentTarget.dataset.id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 删除地址
  deletEadress(e) {
    console.log(e.currentTarget.dataset.id, e.currentTarget.dataset.index)
    app.postReq('focus.delAddress/' + app.openId(), {
      openid: app.globalData.openId,
      id: e.currentTarget.dataset.id
    }, (res) => {
      console.log(res)
      if (res.status == 1) {
        wx.showToast({
          title: '删除成功',
        })
      }
      this.getHistoryAddress()
    })
  },
  //创建收货地址
  goEstablish() {
    this.setData({
      returnConfirm: false
    })
    wx.navigateTo({
      url: '../../pages/address/address',
    })
  },

  goBack(e) {
    this.setData({
      showAdress: e.currentTarget.dataset.id
    })
    app.globalData.addressId = e.currentTarget.dataset.id;
    wx.navigateBack({
      delta: 1
    })
  },
  bindNameInput(e) {
    this.setData({
      inputNameValue: e.detail.value
    })
  },
  toPage: function(event) {
    let pageName = event.currentTarget.dataset.page

    wx.navigateTo({
      url: '/pages/' + pageName + '/' + pageName
    })

  },
  bindPhoneInput(e) {
    this.setData({
      inputPhoneValue: e.detail.value
    })
  },


  bindAddressInput(e) {
    this.setData({
      inputAddressValue: e.detail.value
    })
  },
  bindRegionChange(e) {
    console.log(e.detail.value)
    this.setData({
      region: [e.detail.value[0], e.detail.value[1], e.detail.value[2]]
    })
  },
  getHistoryAddress(cb) {
    let that = this;
    wx.showLoading({
      title: '',
      mask: true
    })
    app.postReq('focus.userAddress/' + app.openId(), {
      openid: app.globalData.openId,
      unionId: app.globalData.unionId,
    }, (res) => {
      wx.hideLoading()
      if (res.data.rows.length) {
        this.setData({
          noData: true,

        })
      }
      if (res.data.rows.length > 0 && res.data.rows[0].name) {
        console.log(res)
        this.setData({
          userAdress: res.data.rows,

        })
        for (var i = 0; i < res.data.rows.length; i++) {
          console.log(res.data.rows[i])
          if (res.data.rows[i]['isDefault'] == 10) {
            this.setData({
              showAdress: res.data.rows[i]['id']
            })
          }
        }
      } else {
        this.setData({
          userAdress: [],
          noData: false,

        })
      }
      typeof cb == 'function' && cb()
    })
  }
})