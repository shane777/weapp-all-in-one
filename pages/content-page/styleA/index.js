const additionalData = {};
const { systemInfo } = getApp().globalData;
// const rpxScale = 750 / systemInfo.windowWidth;
const windowHeight = systemInfo.windowHeight;
const blurMax = 50;

const testText = {
  title1: "测试文字",
  title2: "长一点的测试文字2",
  description: "随机的一个日期 2023/11/14",
  ctaCopy: "一个按钮",
  backgroundUrl:
    "https://i.pinimg.com/564x/ab/86/f6/ab86f65b4277d97af19a5969db407d86.jpg",
};

const mockConcept = {
  __typename: "ComponentVdpConcept",
  title1: "座间宽阔舒适",
  title2: "仿佛置身广袤天地",
  subTitle: "敞开心扉，连接万物",
  subTitle2: "第二段测试语句ß",
  background:
    "https://dg-np.gm.com.cn/images-sit/storefront/uploads/mp/bg_dfdd4522bd.png",
};

const getDeepBackground = (item) => item?.data?.attributes?.url

const formateImageContent = (item) => {
  if(!item) return null
  const { title, subTitle, highlights, cta, carousel, background } = item;
  const content = {
    type: 'imageContent',
    title,
    subTitle,
    backgroundUrl: getDeepBackground(background),
    highlights,
    cta
  }
  if(Array.isArray(carousel)){
    content.carousel = carousel.map((item) => ({
      ...item,
      backgroundUrl: getDeepBackground(item.background)
    }))
  }
  return content
}

const imageContent = [
  {
    __typename: "ComponentVdpContentImage",
    title: "v8发动机",
    subTitle:
      "以495的可用马力，在短短11.2秒内即可旋转四分之一英里，Stingray的LT2 V8发动机被设计得足以惊艳所有水平的驾驶员。",
    highlights: [],
    background: {
      data: {
        attributes: {
          url: "https://dg-np.gm.com.cn/images-sit/storefront/uploads/rabbit/overview_04_0830_2448b377b4.jpg",
        },
      },
    },
    cta: {
      link: "/pages/detail/somewhere",
      text: "了解更多",
    },
  },
  {
    __typename: "ComponentVdpContentImage",
    title: "动力充沛",
    subTitle: "融合科技理念和奢华的什么",
    background: {
      data: {
        attributes: {
          url: "https://dg-np.gm.com.cn/images-sit/storefront/uploads/rabbit/overview_04_0830_2448b377b4.jpg",
        },
      },
    },
    highlights: [
      {
        title: "3.3秒加速",
        body: "享受驾驶速度 改善转向感",
      },
      {
        title: "420 HP",
        body: "6.2L V8 引擎最大马力 ",
      },
      {
        title: "赛级调校",
        body: "四轮独立电磁悬架",
      },
    ],
    cta: null,
  },
  {
    __typename: "ComponentVdpContentGallery",
    title: "家用越野 面面俱到",
    subTitle: "全面考量 为全家出游保驾护航",
    carousel: [
      {
        background: {
          data: {
            attributes: {
              url: "https://dg-np.gm.com.cn/images-sit/storefront/uploads/rabbit/overview_04_0830_2448b377b4.jpg",
            },
          },
        },
        title: "来自旷野",
        body: "无论是长途旅行还是日常代步，都能让您感受到无与伦比的舒适，让每一次驾乘都成为愉悦体验！让每一次驾乘都成为愉悦体验！",
      },
      {
        background: {
          data: {
            attributes: {
              url: "https://dg-np.gm.com.cn/images-sit/storefront/uploads/mp/402_649dp_209dpi_d96f554f4e.jpg",
            },
          },
        },
        title: "耐心服务",
        body: "只为了给你最好最好最好最好最好最好最好最好的体验",
      },
      {
        background: {
          data: {
            attributes: {
              url: "https://dg-np.gm.com.cn/images-sit/storefront/uploads/mp/bg_dfdd4522bd.png",
            },
          },
        },
        title: "耐心服务",
        body: "只为了给你最好最好最好最好最好最好最好最好的体验",
      },
    ],
  },
  {
    __typename: "ComponentVdpContentImage",
    title: "只有图的content",
    subTitle: "很短的描述",
    background: {
      data: {
        attributes: {
          url: "https://dg-np.gm.com.cn/images-sit/storefront/uploads/rabbit/overview_04_0830_2448b377b4.jpg",
        },
      },
    },
    highlights: [],
    cta: null,
  },
];

const pageOptions = {
  // 页面数据
  data: {
    heroOverlayOpacity: 0,
    blurScale: 0,
    windowHeight,
    heroContent: testText,
    mockConcept,
    imageContent: imageContent.map( item => formateImageContent(item) )
  },
  isHeroOut: false,
  // 页面载入时
  onLoad(e) {
    this.init(e);
  },
  // 页面初始化
  init(e) {},
  // 页面准备好时
  onReady() {},
  // 页面显示时
  onShow() {
    const { isFirstOnShow } = this.data;

    if (isFirstOnShow) {
      // 首次执行时
      this.setData({
        isFirstOnShow: false,
      });
      return;
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
  onPageScroll({ scrollTop }) {
    const { windowHeight } = this.data;
    if (scrollTop > windowHeight + 100 && !this.isHeroOut) {
      this.isHeroOut = true;
      this.setData({
        blurScale: 1,
        heroOverlayOpacity: 1,
      });
    } else if (scrollTop <= windowHeight + 100) {
      this.isHeroOut = false;
      if (scrollTop >= windowHeight) {
        this.setData({
          blurScale: 1,
          heroOverlayOpacity: 0.7 + (0.3 * (scrollTop - windowHeight)) / 100,
        });
      } else if (scrollTop > 0) {
        this.setData({
          blurScale: (scrollTop / windowHeight) * blurMax,
          heroOverlayOpacity: 0.7,
        });
      } else {
        this.setData({
          blurScale: 0,
          heroOverlayOpacity: 0,
        });
      }
    }
    if (scrollTop > 100) {
      this.prevPosition = scrollTop;
      if (!this.currentShowActionPanel) {
        this.currentShowActionPanel = true;
        this.setData({
          showActionPanel: true,
        });
      }
    } else if (this.currentShowActionPanel) {
      this.currentShowActionPanel = false;
      this.setData({
        showActionPanel: false,
      });
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
};

Page(pageOptions);
