//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    marginTop:'',
    motto: 'Hello World',
    userInfo: {},
    showTabbar: false,
    tabbar: {},
    inputNameValue: '',
    inputAddressValue: '',
    inputPhoneValue: '',
    region: ['', '', ''],
    setDefault: false
  },
  onLoad: function (options) {
    console.log(options)
    if (options.id) {
      this.setData({
        addressId: options.id
      })
    }
    wx.setTabBarStyle({
      borderStyle: 'black'
    })
    if(options.id){
    console.log(options)
    app.postReq('focus.getAddress/' + app.openId(), {
      openid: app.globalData.openId,
      id:options.id,
      unionId: app.globalData.unionId,
    }, (res)=>{
      console.log(res)
      this.setData({
        inputNameValue:res.data.rows[0]['name'],
        inputAddressValue: res.data.rows[0]['addressdetail'],
        inputPhoneValue: res.data.rows[0]['phone'],
        region: [res.data.rows[0]['province'], res.data.rows[0]['city'], res.data.rows[0]['area']],
        setDefault: res.data.rows[0].isDefault == 10
      })
    })}else{
      this.getHistoryAddress()
    }
    // if (app.globalData.systemInfo.model.indexOf("iPhone X") >= 0) {
    //   this.setData({
    //     marginTop: this.data.marginTop + 40,
    //     guideTop: this.data.guideTop + 40
    //   })
    // }
  },
  getWxAddress() {
    let that = this
    wx.authorize({
      scope: 'scope.address',
      success() {
        console.log('授权成功')
        wx.chooseAddress({
          success: function (res) {
            // 获取收货地址成功
            console.log(res.userName)
            console.log(res.postalCode)
            console.log(res.provinceName)
            console.log(res.cityName)
            console.log(res.countyName)
            console.log(res.detailInfo)
            console.log(res.nationalCode)
            console.log(res.telNumber)
            that.setData({
              inputNameValue: res.userName,
              inputAddressValue: res.detailInfo,
              inputPhoneValue: res.telNumber,
              region: [res.provinceName, res.cityName, res.countyName]
            })
          }
        })
      },
      fail(res) {
        console.log('授权失败', res)
      }
    })
  },
  //删除地址
  delateAddress(){
    app.postReq('focus.delAddress/' + app.openId(), {
      openid: app.globalData.openId,
      id: this.data.addressId
    },(res)=>{
      console.log(res)
     wx.showToast({
       title: '删除成功',
     })
      setTimeout(() => {
        console.log(22)
       wx.navigateBack({
         delta:1
       })
      }, 200)
    })
  },
  bindNameInput(e) {
    this.setData({
      inputNameValue: e.detail.value
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
  switch1Change (e) {
    this.setData({
      setDefault: e.detail.value
    })
  },
  submitInfo() {
    // 提交信息
    console.log(this.data.inputNameValue, this.data.inputPhoneValue)
    if (!this.data.inputNameValue || !this.data.inputPhoneValue || !this.data.inputAddressValue) {
      wx.showToast({
        icon: 'none',
        title: '请填写完整信息',
      })
    } else {
      wx.showLoading({
        title: '',
        mask: true
      })
      
      app.postReq('focus.addUserAddress/' + app.openId(), {
        openid: app.globalData.openId,
        unionId: app.globalData.unionId,
        address: JSON.stringify({
          "id": this.data.addressId||'',
          "province": this.data.region[0],
          "city": this.data.region[1],
          "area": this.data.region[2],
          "addressdetail": this.data.inputAddressValue,
          "name": this.data.inputNameValue,
          "phone": this.data.inputPhoneValue,
          "isDefault": this.data.setDefault ? 10 : 20
        })
      }, (res) => {
        wx.hideLoading()
        console.log(res)
        if (JSON.parse(res).id) {
          wx.showToast({
            title: '成功',
          })
          setTimeout(() => {
            wx.navigateBack({
              delta:1
            })
          },200)
        } else {
          wx.showToast({
            icon: 'none',
            title: '错误，请重试！',
          })
        }
      })
    }
  },
  getHistoryAddress() {
    let that = this;
    wx.showLoading({
      title: '',
      mask: true
    })
    app.postReq('focus.userAddress/' + app.openId(), {
      openid: app.globalData.openId
    }, (res) => {
      wx.hideLoading()
      if (res.data.rows.length > 0 && res.data.rows[0].name) {
        console.log(res)
        this.setData({
          userAdress: res.data.rows
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '暂无地址信息，是否使用微信收货地址？',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              that.getWxAddress()
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    })
  }
  
})