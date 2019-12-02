//index.js
//获取应用实例
const app = getApp()
import {
  NumberAnimate
} from '../../utils/numberAnimate.js'
Page({
  data: {
    moonLink: [],
    showHistory: false,
    newList: [],
    searchList: [],
    haveSearch: false,
    isPhone: false,
    marginTop: '',
    placeholder: '全球好礼运动换',
    inputVal: '',
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
    tabbar: {},
    oldRecordList: [],
    list: {
      page: 1,
      rows: 10,
      totalPage: 1
    },
    hotSortList: [

    ]
  },
  onLoad: function() {
    //打印传值
    let that = this
    that.setData({
      searchList: that.unique(wx.getStorageSync('searchList') )|| []
    })
    console.log(that.data.searchList.length)
    if (that.data.searchList.lenght == 0) {
      console.log(that.data.searchList.length)
      that.setData({
        showHistory: false
      })
    } else {
      that.setData({
        showHistory: true
      })
    }
    console.log(that.data.searchList)
    var hotSortList = JSON.parse(wx.getStorageSync('pageData')).hotsearch
    var hotSortList = hotSortList.replace('[', '').replace(']', '').replace(/"/g, '')
    var hotSortList = hotSortList.split(",");
    that.setData({
      hotSortList: hotSortList
    })

    console.log(JSON.parse(wx.getStorageSync('pageData')).hotsearch)
    console.log(this.data.hotSortList)
    app.editTabbar();

    wx.hideTabBar();

    wx.showShareMenu({
      withShareTicket: false
    })
    console.log(app.globalData.systemInfo)
    // if (app.globalData.systemInfo.model.indexOf("iPhone X") >= 0) {
    //   that.setData({
    //     isPhone: true,
    //     marginTop: this.data.marginTop + 40,
    //     guideTop: this.data.guideTop + 40
    //   })
    // }
  },
  onShow: function() {
    // wx.pageScrollTo({
    //   scrollTop: 0
    // })
  },
  // 去重
  unique(arr){
    for(let i = 0, len = arr.length;i<len;i++){
      while (i !== arr.lastIndexOf(arr[i])) {
        // 如果不唯一，则把后面重复的一位去掉
        arr.splice(arr.lastIndexOf(arr[i]), 1)
        len--
      }
    }
return arr
},

  //联想搜索
  goLink(e) {
    console.log(e)
    console.log(this.data.inputVal)
    var newSearchList = this.data.searchList
    var length = newSearchList.length
    if (e.currentTarget.dataset.link!= '') {
      if (length <= 8) {
        newSearchList[length] = e.currentTarget.dataset.link
        wx.setStorageSync('searchList', newSearchList)
      } else {
        console.log(newSearchList)
        newSearchList.splice(1, 1)
        console.log(newSearchList)
        newSearchList[8] = e.currentTarget.dataset.link
        wx.setStorageSync('searchList', newSearchList)

      }
    }
    wx.navigateTo({
      url: '/pages/sort/sort?name=' + e.currentTarget.dataset.link
    })
  },
  //搜索商品
  inputTyping(e) {
    console.log(e.detail.value)

    this.setData({
      inputVal: e.detail.value
    })
    if (this.data.inputVal != '') {
      this.setData({
        haveSearch: true,
      })
    }
    if (this.data.inputVal) {
      console.log(this.data.inputVa)
      app.postReq('focus.search/' + app.openId(), {

        words: this.data.inputVal,
        openid: app.globalData.openId
      }, (res) => {
        console.log(res)
        this.setData({
          moonLink: res
        })
      })
    }
  },
  // 确认所搜
  search() {
    console.log(this.data.inputVal)
    var newSearchList = this.data.searchList
    var length = newSearchList.length
    if (this.data.inputVal != '') {
      if (length <= 8) {
        newSearchList[length] = this.data.inputVal
        wx.setStorageSync('searchList', newSearchList)
      } else {
        console.log(newSearchList)
        newSearchList.splice(1, 1)
        console.log(newSearchList)
        newSearchList[8] = this.data.inputVal
        wx.setStorageSync('searchList', newSearchList)

      }
    }
    console.log(this.data.inputVal)
    wx.navigateTo({
      url: '/pages/sort/sort?name=' + this.data.inputVal

    })
  },
  clickKeyWords (e) {
    console.log(e.currentTarget.dataset.word)
    this.setData({
      inputVal: e.currentTarget.dataset.word
    })
    this.search()
  },
  // 取消搜索
  canclesearch() {
    this.setData({
      inputVal: "",
      moonLink: [],
      haveSearch: false
    })
  },
  deleteall() {
    wx.setStorageSync('searchList', this.data.newList)
    if (wx.getStorageSync('searchList') == []) {
      wx.showToast({
        title: '已删除 '
      })
    }
    if (getCurrentPages().length != 0) {
      //刷新当前页面的数据
      getCurrentPages()[getCurrentPages().length - 1].onLoad()
    }
  }

})