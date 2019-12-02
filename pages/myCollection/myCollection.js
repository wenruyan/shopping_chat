//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    leftM:0,
    editIndex: 0,
    delBtnWidth: 150,//删除按钮宽度单位（rpx）
    marginTop: '',
    tuikuan: false,
    canshu: 0,
    tipsConfirm: false,
    motto: 'Hello World',
    userInfo: {},
    listData: [],
    returnConfirm: false,
    page: 1,
    rows: 10,
    totalPage: 1,
    noData: false,
  },
  onLoad: function (options) {
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
  onShow() {
    this.getOrderList()
  },

  getUserInfo(e) {
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo
    })
  },
  //查看订单详情
  toorderDetail(e) {
    console.log(e)
    wx.navigateTo({
      url: '../../pages/mallCommodityDetail/mallCommodityDetail?goodsId=' + e.currentTarget.dataset.goodsid,
    })
  },
  showConfirm(e) {
    var index = e.currentTarget.dataset.index;

    arr = arr.append(index)
    if (e.currentTarget.dataset.state == 1) {
    }
    this.setData({
      dates: this.data.dates,
    });
    this.setData({
      tuikuan: e.currentTarget.dataset.index,
    })
  },
  hideTipsConfirm() {
    this.setData({
      tipsConfirm: false,
      returnConfirm: false
    })
  },
  hideTipsConfirmT() {
    this.setData({
      tipsConfirm: false,
      returnConfirm: true,
      tuikuan: true
    })
  },
  //获取订单

  getOrderList() {
    if ((this.data.page > this.data.totalPage) || this.data.loading) return false
    // wx.showLoading({
    //   title: '',
    //   mask: true
    // })
    this.setData({
      loading: true
    })
    let data = {
      // orderTyp: '0',
      openid: app.globalData.openId,
      page: this.data.page,
      rows: this.data.rows,
      unionId: app.globalData.unionId
    }
    app.postReq('focus.showGoodsCollect/' + app.openId(), data, (res) => {
      let arr = this.data.listData
      arr = arr.concat(res.data.rows)
      if (arr.length == 0) {
        this.setData({
          noData: true
        })
      } else {
        console.log(arr)
        this.setData({
          listData: arr,
          // orderTyp: '0',
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

  //手指刚放到屏幕触发
  touchS: function (e) {
    console.log("touchS" + e);
    //判断是否只有一个触摸点
    if (e.touches.length == 1) {
      this.setData({
        //记录触摸起始位置的X坐标
        startX: e.touches[0].clientX
      });
    }
  },
  //触摸时触发，手指在屏幕上每移动一次，触发一次
  touchM: function (e) {
    console.log("touchM:" + e);
    var that = this
    if (e.touches.length == 1) {
      //记录触摸点位置的X坐标
      var moveX = e.touches[0].clientX;
      //计算手指起始点的X坐标与当前触摸点的X坐标的差值
      var disX = that.data.startX - moveX;
      //delBtnWidth 为右侧按钮区域的宽度
      var delBtnWidth = that.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "rpx";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "rpx";
        }
      }
      //获取手指触摸的是哪一个item
      var index = e.currentTarget.dataset.index;
      var list = that.data.listData;
      //将拼接好的样式设置到当前item中
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        listData: list
      });
    }
  },
  touchE: function (e) {
    console.log("touchE" + e);
    var that = this
    if (e.changedTouches.length == 1) {
      //手指移动结束后触摸点位置的X坐标
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = that.data.startX - endX;
      this.setData({
        leftM:disX
      })
      var delBtnWidth = that.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "rpx" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = that.data.listData;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      that.setData({
        listData: list
      });
     console.log(that.data.listData)
    }
  },
  delItem(e){

    console.log(e.currentTarget.dataset.goodsid)
    wx.showLoading({
      title: '正在删除',
    })
    app.postReq('focus.cancelGoods/' + app.openId(),
    {
      mid: getApp().globalData.mid,
      goodsId: e.currentTarget.dataset.goodsid,
      openid: app.globalData.openId
    }, (res) => {
      console.log(res.success)
      if(res.success==true){
        wx.hideLoading()
        console.log(this.data.listData)
        console.log(2345)
      // this.getOrderList()
        var newData = this.data.listData
        newData.splice(e.currentTarget.dataset.index, 1)
        if(newData==false){
          this.setData({
            noData:true
          })
        }
        this.setData({
          listData: newData
        })

      }
    })
   
  },
})
