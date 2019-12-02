//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    expressData: {
      
    }
  },
  onLoad: function () {
    wx.setTabBarStyle({
      borderStyle: 'black'
    })
  },
  onShow () {
    // this.getListData1()
  }
})
