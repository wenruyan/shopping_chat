// components/navbar.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    canBack: {
      type: Boolean,
      value: true
    },
    fontColor: {
      type: String,
      value: '#333333'
    },
    bgColor: {
      type: String,
      value: '#FFF'
    },
    bgOp: {
      type: Number,
      value: 1
    },
    goPage: {
      type: Number,
      value: 1
    },
    bgurl:{
      type:String,
      value:""
    },
    border: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goBack: function () {
      console.log(getCurrentPages().length)
      console.log(this.data.title)
      console.log(this.data.bgurl)
      let i = this.data.goPage
      console.log(`返回上${i}页`)
      if (this.data.title=='订单详情'){
        //步步抽跳转过来
        if (getCurrentPages().length==2){
          console.log(222)
          wx.navigateBack({
            delta: 1
          })
        } else if (getCurrentPages().length ==1){
          wx.switchTab({
            url: '../index/index',
            success: function (e) {
              console.log('123', e)
            },
            fail: function (e) {
              console.log(2222, e)
            }
          })
        } else if (getCurrentPages().length == 3){
          wx.navigateBack({
            delta: 1
          })
        } 
        else {
          wx.navigateBack({
            delta: i
          })
        }
       
      } else if (this.data.title == '商品详情'){
        wx.switchTab({
          url: '../index/index',
          success: function (e) {
            console.log('123', e)
          },
          fail: function (e) {
            console.log(2222, e)
          }
        })
      } else {
        wx.navigateBack({
          delta: i
        })
      }
    
    }
  },

  ready: function() {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          statusBarHeight: res.statusBarHeight
        })
      }
    })
  },
  
})
