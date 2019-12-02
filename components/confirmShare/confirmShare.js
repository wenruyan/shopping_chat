// components/login/login.js
let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    conf: {
      type: Object,
      value: {
        img: '../../images/shareConfirm.png',
        content: '生命在于运动，运动始于跑步，跑步开启人生无限可能。',
        person: 0
      }
    },
    show: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    erCodeTmpUrl: '',
    avatarTmpUrl: ''
  },
  ready() {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    stopMove() {

    },
    closeInfoConfirm(e) {
      this.triggerEvent('close', e.detail)
    },
    goPoster(e) {
      this.triggerEvent('draw', e.detail)
      // this.getErcode()
      // wx.navigateTo({
      //   url: '../../pages/poster/poster',
      //   success: (result)=>{

      //   },
      //   fail: ()=>{},
      //   complete: ()=>{}
      // });
    }
  }
})
