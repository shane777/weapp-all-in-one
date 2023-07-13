const testImage =
  "https://images.pexels.com/photos/2931915/pexels-photo-2931915.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

const videoList = [
    {
      id: "test1",
      poster: testImage,
      url: "https://dg-test.gm.com.cn/images-sit/storefront/uploads/mp/linus_video_6c8d861ef1.mp4",
    },
    {
      id: "test2",
      poster: testImage,
      url: "https://www.durantguild.com/images/storefront/uploads/mp/_73d91ce451.mp4",
    },
  ];
  

const pageOptions = {
  data: {
    testImage,
    videoFullScreenHidden: false,
  },
  onLoad() {
    this.setData({
      videoList,
    });
  },
  async onReady() {
  },
  // 页面显示时
  onShow() {},
  // 页面隐藏时
  onHide() {},
  // 页面卸载时
  onUnload() {},
  // 下拉页面时
  onPullDownRefresh() {},
  // 到达页面底部时
  onReachBottom() {},
  // 页面滚动时
  onPageScroll() {},
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
  onVideoScreenChange({detail: { pageHidden = false }} = {}){
    if(pageHidden !== this.data.videoFullScreenHidden){
      this.setData({
        videoFullScreenHidden: pageHidden
      });
    }
  }
};

Page(pageOptions);
