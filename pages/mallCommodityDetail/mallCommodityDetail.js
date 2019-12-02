//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    whereFrom: 0,//判断是从哪里来的 '0'是商城,'1'是步步抽
    showLoginPanel: false,
    isIphoneX: app.globalData.isIphoneX,
    collection: false,
    stockCount: 0,
    numMax: 99999,
    jifenRange: '',
    jifen: [],
    jifenMoney: [],
    marginTop: "",
    appunionId: app.appunionId,
    motto: 'Hello World',
    userInfo: {},
    activeSelect: 1,
    loading: false,
    goodsDetail: {},
    skuDetail: {},
    imgUrlss: [],
    imgUrls: [
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1537420813002&di=7959f9bc834c489040b9003d93993c90&imgtype=0&src=http%3A%2F%2Fimgqn.koudaitong.com%2Fupload_files%2F2014%2F10%2F24%2FFs8qcnD4GpsOS2u3qDfzN8zyMvbn.jpg%2521580x580.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    currentIndex: 0,
    duration: 500,
    skuData: [{
      name: 123,
      id: 123,
      children: [{
        name: 11111,
        id: 1,
        choosed: true,
        hasStock: true
      }, {
        name: 22222,
        id: 2,
        choosed: false,
        hasStock: true
      }, {
        name: 33333,
        id: 3,
        choosed: false,
        hasStock: true
      }]
    }],
    buyCount: 1,
    choosedSku: {},
    choosedAttr: [],
    choosedAttrText: [],
    choosedAttrText2: '',
    panelVisible: false
  },
  onLoad: function(options) {
    var that = this;
    that.checkUserInfo()
    console.log(options)
    // 从步步抽来的才有unionId
    if (options.unionId) {
      app.globalData.unionId = options.unionId
      //设置来源是步步抽否则是商城
      this.setData({
        whereFrom:1
      })
    }
    if (options.goodsId) {
      app.globalData.goodsId = options.goodsId
      // this.getGoods()
    }
    console.log(app.globalData.goodsId)
    if (app.globalData.goodsId) {
      this.getGoods()
    }
    wx.setTabBarStyle({
      borderStyle: 'black'
    })
    if (app.globalData.systemInfo.model.indexOf("iPhone X") >= 0) {
      this.setData({
        marginTop: this.data.marginTop + 40,
        guideTop: this.data.guideTop + 40
      })
    }
  },
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function() {

  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function(options) {

  },
  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function() {

  },
  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function(msg) {

  },
  onShareAppMessage(res) {
    console.log(res)
    console.log(this.data.imgUrls)
    return {
      imageUrl: this.data.imgUrls[0].url,
      title: this.data.goodsDetail.mainTitle,
      //  desc: '分享页面的内容',
      path: '/pages/mallCommodityDetail/mallCommodityDetail?goodsId=' + app.globalData.goodsId // 路径，传递参数到指定页面。
    }
  },
  getGoods() {
    console.log(app.globalData.goodsId),
      wx.showLoading({
        title: '',
        mask: true
      })
    this.setData({
      loading: true
    })
    app.postReq('focus.goodsDetail/' + (app.openId() || "asda"), {
      mid: getApp().globalData.mid,
      goodsId: app.globalData.goodsId,
      openid: app.globalData.openId || 'oytv940faZO2EEGsbiGUMXvzrNIY'
    }, (res) => {
      console.log(res)
      if (res.status == 1) {
        //  var imgLength = res.data.imageList.slice(0, 3)
        // 判断数组的长度如果大于3就截取三个 如果小于3截取数组长度
        var imgLength = res.data.imageList
        var resStyle = res.data.rows[0].skuList[0].priceList
        console.log(res.data.rows[0].skuList[0].priceList)
        let skuData = res.data.rows[0].productspecificationset.map((item, index) => {
          // 判断筛选重复的属性名
          item.children = []
          res.data.rows[0].skuList.map((item2, index2) => {
            let spec = item2.productspecificationset[index]
            spec.hasStock = true
            spec.choosed = false
            let noThis = true
            item.children.map(item3 => {
              if (item3.id == spec.id) noThis = false
            })
            if (noThis) item.children.push(spec)
          })
          let tmpChoosedAttr = this.data.choosedAttr
          tmpChoosedAttr.push({})
          this.setData({
            choosedAttr: tmpChoosedAttr
          })
          return item
        })
        this.setData({
          goodsDetail: res.data.rows[0],
          imgUrls: imgLength,
          imgUrlss: res.data.rows[0].description.split(',').map((item) => {
            let obj = {}
            if (item.substr(0, 4) == 'http') {
              obj.url = app.common.decodeURL(item)
              obj.type = 20
            } else {
              obj.text = item
            }
            return obj
          }),
          skuDetail: res.data.rows[0].skuList[0],
          skuList: res.data.rows[0].skuList,
          isMoreAttr: res.data.rows[0].productspecificationset.length > 0,
          skuData: skuData
        })
        let maxPrice = 0;
        let minPrice = 99999999999;
        let stockCount = 0;
        res.data.rows[0].skuList.map(item => {
          stockCount += Number(item.quantity);
          let itemPrice = item.priceList[0].integral;
          if (itemPrice > maxPrice) {
            maxPrice = itemPrice;
          }
          if (itemPrice < minPrice) {
            minPrice = itemPrice;
          }
        });
        let jifenRange = ''
        if (maxPrice != minPrice) {
          // 对比最大及最小价格
          jifenRange = minPrice + "~" + maxPrice;
        } else {
          jifenRange = maxPrice;
        }
        this.setData({
          jifenRange: jifenRange,
          stockCount: stockCount
        })
        console.log(this.data.imgUrlss)
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
        if (res.data.rows[0].isCollect == 10) {
          this.setData({
            collection: true
          })
        } else {
          this.setData({
            collection: false
          })
        }
        if (!this.data.isMoreAttr) {
          this.setData({
            choosedSku: res.data.rows[0].skuList[0],
            numMax: res.data.rows[0].skuList[0].quantity
          })
        }
      }
      wx.hideLoading();
      this.setData({
        loading: false
      })
    })
  },
  swiperChange(event) {
    console.log(event)
    this.setData({
      currentIndex: event.detail.current
    })
  },
  //获得订单
  toPage: function() {
    wx.showLoading({
      icon: 'none',
      mask: true
    });
    var that = this
    app.postReq('focus.beforeBuyGoods/' + app.openId(), {
      goodsId: app.globalData.goodsId,
      openid: app.globalData.openId,
      skuId: this.data.choosedSku.id,
      quantity: this.data.buyCount
    }, (res) => {
      wx.hideLoading();
      // res = JSON.parse(res)
      app.globalData.addressId = res.addressId
      app.globalData.goodsId = res.goodsId
      app.globalData.orderId = res.orderid
      app.globalData.skuId = res.skuId
      wx.navigateTo({
        url: '../orderSubmit/orderSubmit?orderid=' + res.orderid + '&goodsId=' + res.goodsId + '&mailFee=' + (res.mailfee || 0) + '&whereFrom=' + that.data.whereFrom + '&skuId=' + res.skuId + '&commodityType=' + that.data.goodsDetail.commodityType + '&buyCount=' + that.data.buyCount
      })

    })
  },
  changeSelect: function(e) {
    console.log(e.currentTarget.dataset.type)
    this.setData({
      activeSelect: e.currentTarget.dataset.type
    })
    // if (this.data.realThingList.length == 0 && e.currentTarget.dataset.type == 1) {
    //    this.getListData1()
    // }
    // if (this.data.virtualThingList.length == 0 && e.currentTarget.dataset.type == 2) {
    //    this.getListData2()
    // }
  },
  // 收藏
  collectionSure() {
    console.log(11)
    console.log(this.data.collection)
    this.setData({
      collection: false
    })
    app.postReq('focus.cancelGoods/' + app.openId(), {
      mid: getApp().globalData.mid,
      goodsId: app.globalData.goodsId,
      openid: app.globalData.openId
    }, (res) => {
      console.log(res)
      if (res.success == true) {
        wx.showToast({
          title: '取消收藏',
        })
      }
    })
  },
  collectionSure2() {
    console.log(11)
    console.log(this.data.collection)
    this.setData({
      collection: true
    })
    app.postReq('focus.collectionGoods/' + app.openId(), {
      mid: getApp().globalData.mid,
      goodsId: app.globalData.goodsId,
      openid: app.globalData.openId
    }, (res) => {
      wx.showToast({
        title: '收藏成功',
      })
    })
  }
  , checkUserInfo: function () {
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
  getUserInfoSuccess: function (e) {
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
      // 如果有登陆一定是来自步步抽
      this.setData({
        whereFrom: 1
      })
      that.getGoods()
    })
  },
  getAttrText () {
    let text = []
    this.data.choosedAttr.map(item => {
      if (item.name) text.push(item.name)
    })
    console.log('text', text)
    return text
  },
  chooseAttr (event) {
    console.log(event)
    let cIndex = event.currentTarget.dataset.index
    let cIndex2 = event.currentTarget.dataset.index2
    let item = this.data.skuData[cIndex]
    console.log(item.children, cIndex2)
    if (item.children[cIndex2].choosed) {
      item.children[cIndex2].choosed = false
      let choosedAttr = this.data.choosedAttr
      choosedAttr[cIndex] = {}
      this.setData({
        choosedAttr: choosedAttr,
        choosedAttrText: this.getAttrText()
      })
    } else {
      item.children.map((item2) => {
        item2.choosed = false
      })
      item.children[cIndex2].choosed = true
      let choosedAttr = this.data.choosedAttr
      choosedAttr[cIndex] = item.children[cIndex2]
      this.setData({
        choosedAttr: choosedAttr,
        choosedAttrText: this.getAttrText()
      })
    }
    console.log('text', this.data.choosedAttrText)
    let skuData = this.data.skuData
    skuData.splice(cIndex, 1, item)
    this.setData({
      skuData: skuData
    })
    if (this.data.choosedAttrText.length == this.data.skuData.length) { // 此时所有规格全部选择，展示对应的价格
      let result = {}
      this.data.skuList.map(item => {
        // let tmpResult = {};
        let yes = true;
        item.productspecificationset.map((item2, index2) => {
          if (item2.id != this.data.choosedAttr[index2].id) yes = false
        })
        if (yes) result = item
      })
      this.setData({
        choosedSku: result,
        numMax: result.quantity
      })
      if (this.data.buyCount > result.quantity) {
        this.setData({
          buyCount: 1
        })
      }
      console.log('chooosedSku', result)
    }
    console.log(this.data.choosedAttr)
    if (this.data.choosedAttrText.length < this.data.skuData.length && this.data.choosedAttrText.length > 0) {
      let tmpSkuData = this.data.skuData
      tmpSkuData.map(item => {
        item.children.map(item2 => {
          item2.hasStock = false // 先将所有的都置为无库存
        })
      })
      this.setData({
        skuData: tmpSkuData
      })
    } else if (this.data.choosedAttrText.length == 0) {
      let tmpSkuData = this.data.skuData
      tmpSkuData.map(item => {
        item.children.map(item2 => {
          item2.hasStock = true
        })
      })
      this.setData({
        skuData: tmpSkuData
      })
    }
    this.changeStatus(cIndex, cIndex2) // 根据库存筛选显示属性
  },
  changeStatus (cIndex, cIndex2) {
    let skuData = this.data.skuData
    skuData.map((item, index) => {
      item.children.map((item2, index2) => { // 遍历每一个规格的每一条属性
        let tmpSkuList = []
        this.data.skuList.map((item3, index3) => { // 遍历每一条sku
          if (item3.productspecificationset[index].id == item2.id) { // 当该条sku对应的属性与正在遍历的相等时
            // let hasStock = false
            let choosedIndex = [] // 选中的规格索引
            this.data.choosedAttr.map((item4, index4) => {
              if (item4.id && index != index4) choosedIndex.push(index4)
            })

            let tmpO = true
            choosedIndex.map(item4 => {
              if (item3.productspecificationset[item4].id != this.data.choosedAttr[item4].id) {
                tmpO = false
              }
            })
            if (tmpO) {
              tmpSkuList.push(item3)
            }
          }
        })
        if (tmpSkuList.length > 0) {
          let hasStock = false
          tmpSkuList.map(item3 => {
            if (item3.quantity > 0) hasStock = true
          })
          if (hasStock) {
            item2.hasStock = true
          } else {
            item2.hasStock = false
          }
        }
      })
    })
    this.setData({
      skuData: skuData
    })
  },
  submit2 () {
    if(this.data.choosedAttrText.length == this.data.skuData.length) {
      this.toPage()
    } else {
      wx.showToast({
        icon: 'none',
        title: '请选择规格'
      })
    }
  },
  showPanel () {
    if (this.data.stockCount == 0) {
      wx.showToast({
        title: '该商品已无存货',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
        success: (result)=>{
          
        },
        fail: ()=>{},
        complete: ()=>{}
      });
      return false;
    }
    this.setData({
      panelVisible: true
    })
  },
  hidePanel () {
    this.setData({
      choosedAttrText2: this.data.choosedAttrText.join(','),
      panelVisible: false
    })
  },
  handleChange1 ({detail}) {
    if (detail.value > this.data.numMax) {
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
      buyCount: detail.value
    })
  }
})