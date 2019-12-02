// components/login/login.js
let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    listData: Array,
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },
  ready () {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    goDetail (e) {
      
      var that  = this
      var id = e.currentTarget.dataset.id
      var goodsId = {
        id: id
      }
      this.triggerEvent('draw', goodsId)
    },
   
  }
})
