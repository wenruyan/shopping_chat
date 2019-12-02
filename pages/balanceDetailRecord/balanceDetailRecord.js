//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    recordList: [],
    oldRecordList: [],
    list: {
      page: 1,
      rows: 10,
      totalPage: 1
    },
    noData: false,
    loading: false
  },
  onLoad: function () {
    wx.setTabBarStyle({
      borderStyle: 'black'
    })
    this.getListData()
  },
  getUserInfo (e) {
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo
    })
  },
  formatData (res) {
    let data = res
    let tmpArr = []
    for (let item of data) {
      let date = item.createDate.substr(0, 4) + '年' +item.createDate.substr(5, 2) + '月'
      let noR = true
      for(let item2 of tmpArr) {
        if (item2.date == date) {
          item2.record.push(item)
          noR = false
        }
      }
      if (noR) {
        tmpArr.push({
          date: date,
          record: [item]
        })
      }
    }
    console.log(tmpArr)
    return tmpArr
  },
  getListData () {
    if ((this.data.list.page > this.data.list.totalPage) || this.data.loading) return false
    wx.showLoading({
      title: '',
      mask: true
    })
    this.setData({
      loading: true
    })
    let data = {
      openid: app.globalData.openId,
      page: this.data.list.page,
      rows: this.data.list.rows,
      unionId: app.globalData.unionId,
    }
    app.postReq('focus.balanceDetail/' + app.openId(), data, (res) => {
      console.log(res)
      let arr = this.data.oldRecordList
      arr = arr.concat(res.data.rows)
      if (arr.length == 0) {
        this.setData({
          noData: true
        })
      } else {
        this.setData({
          oldRecordList: arr,
          list: {
            page: res.data.page + 1,
            rows: this.data.list.rows,
            totalPage: res.data.totalPage
          }
        })
        this.setData({
          recordList: this.formatData(this.data.oldRecordList)
        })
      }
      wx.hideLoading();
      this.setData({
        loading: false
      })
    }, (res) => {
      wx.showToast({ title: "请求出错", icon: 'none', duration: 2000 })
    })
  }
})
