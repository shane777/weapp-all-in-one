const componentOptions = {
  // 组件选项
  options: {
    styleIsolation: 'apply-shared',
  },
  behaviors: [],
  properties: {
    content: {
      type: Object,
      value: {},
      observer: function (v) {
        if(v?.title1 && (!this.textObserver || !this.imageObserver)){
          this.textObserver = this.createIntersectionObserver()
          this.textObserver.relativeToViewport({bottom: -40}).observe('#text', () => {
            this.setData({
              isTextShow: true
            })
            this.textObserver.disconnect()
          })
          this.imageObserver = this.createIntersectionObserver()
          this.imageObserver.relativeToViewport({bottom: -70}).observe('#image', () => {
            this.setData({
              isImageShow: true
            })
            this.imageObserver.disconnect()
          })
        }
      }
    }
  },
  textObserver: null,
  imageObserver: null,
  data: {
    isTextShow: false,
    isImageShow: false
  }
}

Component(componentOptions)
