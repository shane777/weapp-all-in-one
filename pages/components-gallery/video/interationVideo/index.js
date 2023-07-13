const originVideoStatus = {
  showContinueButton: false,
  showControl: true,
  alreadyContinueBefore: false,
};

const PAUSE_TIME = 15;

const componentOptions = {
  options: {
    multipleSlots: true,
    styleIsolation: "apply-shared",
  },
  behaviors: [],
  properties: {
    videoItem: {
      type: Object,
      value: null,
    },
    isHidden: {
      type: Boolean,
      value: false
    }
  },
  data: {
    videoDisplay: originVideoStatus,
  },
  methods: {
    async init() {
      const { screenHeight } = wx.getSystemInfoSync();
      this.screenHeight = screenHeight;
      const { id } = this.properties.videoItem;
      const query = this.createSelectorQuery();
      const contextPromise = new Promise((resolve) => {
        query
          .select(`#${id}`)
          .context((res) => {
            resolve(res.context);
          })
          .exec();
      });

      this.context = await contextPromise;
      this.middleObserer = this.createIntersectionObserver();
      this.leaveObserver = this.createIntersectionObserver();
      this.middleObserer
        .relativeToViewport({ bottom: 0, top: 0 })
        .observe(`#wrapper${id}`, (res) => {
          const { intersectionRatio } = res;
          if(this.properties.isHidden) return;
          if (intersectionRatio > 0) {
            // Get into viewport
            console.log(`#wrapper${id} get in`);
            // this.timeout ??
            if(!this.timeout)
              this.timeout = setTimeout(() => {
                //TODO:  current playing video deel emit to parent
                // if (this.currentPlayingVideoId) {
                //   this.context.pause();
                // }
                // this.currentPlayingVideoId = id;
                if (this.currentPlayingTime || 0 < PAUSE_TIME) {
                  this.context.play();
                  this.setData({
                    [`videoDisplay.showControl`]: false,
                  });
                }
              }, 500);
          } else {
            console.log(`#wrapper${id} middle get out`);
            clearTimeout(this.timeout);
            this.timeout = null;
            this.context.pause();
            //TODO:  current playing video deel emit to parent
            // this.currentPlayingVideoId = "";
          }
        });
      this.leaveObserver
        .relativeToViewport({ top: 0 })
        .observe(`#${id}`, (res) => {
          if(this.properties.isHidden) return;
          const { boundingClientRect = {}, intersectionRatio } = res;
          console.log(`#wrapper${id} full`, res)
          if (intersectionRatio === 0) {
            console.log(`#wrapper${id} get out`);
            this.setData({
              [`videoDisplay`]: {
                ...originVideoStatus,
                showControl: false,
              },
            });
            this.context.seek(0);
            // this.currentPlayingVideoId = "";
          }
        });
    },
    onVideoEnd() {
    },
    onVideoTimeUpdate(e) {
      const { detail, currentTarget } = e;
      this.currentPlayingTime = detail?.currentTime;
      if (
        detail?.currentTime >= PAUSE_TIME &&
        currentTarget?.id &&
        !this.data.videoDisplay.alreadyContinueBefore
      ) {
        this.context.pause();
        this.setData({
          [`videoDisplay.showContinueButton`]: true,
        });
      }
    },
    onVideoScreenChange(e) {
      const { detail, currentTarget } = e;
      if (!currentTarget?.id) return;
      if (detail?.fullScreen) {
        this.setData({
          [`videoDisplay.showContinueButton`]: false,
          [`videoDisplay.showControl`]: true,
          [`videoDisplay.alreadyContinueBefore`]: true,
        });
        this.context.play();
      }else {
        setTimeout(()=> {
          console.log('remove hide page')
          this.updatePageHidden(false);   
        },800)
      }
    },
    onContinueVideoClick(e) {
      const { currentTarget } = e;
      if (!currentTarget?.id) return;
      console.log('hide page')
      this.updatePageHidden(true);
      this.context.requestFullScreen();
    },
    updatePageHidden(pageHidden){
      this.triggerEvent('screenChange', {
        pageHidden
      })
    }
  },
  lifetimes: {
    created() {
      // All filed init
      this.context = null;
      this.currentPlayingTime = 0;
      this.timeout = null;
      this.middleObserer = null;
      this.leaveObserver = null;
      this.firstTimeLoad = true;
    },
    async ready() {
      if(!this.firstTimeLoad) return;
      this.firstTimeLoad = false;
      this.init();
    },
    moved() {},
    detached() {},
  }
};

Component(componentOptions);
