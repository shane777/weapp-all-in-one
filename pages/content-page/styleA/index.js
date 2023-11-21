const additionalData = {
}
const { systemInfo } = getApp().globalData;
// const rpxScale = 750 / systemInfo.windowWidth;
const windowHeight = systemInfo.windowHeight;
const blurMax = 50;

const testText = {
  title1: '测试文字',
  title2: '长一点的测试文字2',
  description: '随机的一个日期 2023/11/14',
  ctaCopy: '一个按钮',
  backgroundUrl: 'https://i.pinimg.com/564x/ab/86/f6/ab86f65b4277d97af19a5969db407d86.jpg'
}

const mockConcept = {
  __typename: 'ComponentVdpConcept',
  title1: '座间宽阔舒适',
  title2: '仿佛置身广袤天地',
  subTitle: '敞开心扉，连接万物',
  subTitle2: '第二段测试语句ß',
  background: 'https://dg-np.gm.com.cn/images-sit/storefront/uploads/mp/bg_dfdd4522bd.png'
}

const pageOptions = {
  // 页面数据
  data: {
    heroOverlayOpacity: 0,
    blurScale: 0,
    windowHeight,
    heroContent: testText,
    mockConcept,
  },
  isHeroOut: false,
  // 页面载入时
  onLoad(e) {
    this.init(e)
  },
  // 页面初始化
  init(e) {},
  // 页面准备好时
  onReady() {},
  // 页面显示时
  onShow() {
    const { isFirstOnShow } = this.data

    if (isFirstOnShow) {
      // 首次执行时
      this.setData({
        isFirstOnShow: false,
      })
      return
    }
  },
  // 页面隐藏时
  onHide() {},
  // 页面卸载时
  onUnload() {},
  // 下拉页面时
  onPullDownRefresh() {},
  // 到达页面底部时
  onReachBottom() {},
  // 页面滚动时
  onPageScroll({scrollTop}) {
    const {windowHeight} = this.data
    if (scrollTop > windowHeight + 100 && !this.isHeroOut) {
      this.isHeroOut = true
      this.setData({
        blurScale: 1,
        heroOverlayOpacity: 1
      })
    } else if (scrollTop <= windowHeight + 100) {
      this.isHeroOut = false
      if (scrollTop >= windowHeight) {
        this.setData({
          blurScale: 1,
          heroOverlayOpacity: 0.7 + (0.3 * (scrollTop - windowHeight)) / 100
        })
      } else if (scrollTop > 0) {
        this.setData({
          blurScale: (scrollTop / windowHeight) * blurMax,
          heroOverlayOpacity: 0.7
        })
      } else {
        this.setData({
          blurScale: 0,
          heroOverlayOpacity: 0
        })
      }
    }
    if (scrollTop > 100) {
      this.prevPosition = scrollTop
      if (!this.currentShowActionPanel) {
        this.currentShowActionPanel = true
        this.setData({
          showActionPanel: true
        })
      }
    } else if (this.currentShowActionPanel) {
      this.currentShowActionPanel = false
      this.setData({
        showActionPanel: false
      })
    }
  },
  // 分享时，注：onShareAppMessage不能为async异步函数，会导致不能及时取得返回值，使得分享设置无效
  onShareAppMessage() {
    /* const title = ''
    const path = ''
    const imageUrl = ``

    return {
      title,
      path,
      imageUrl,
    } */
  },
}

Page(pageOptions)
