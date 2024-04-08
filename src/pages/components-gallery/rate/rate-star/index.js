const STAR_WIDTH = 56; // rpx
const STAR_SPACING = 0;

Component({
  properties: {
    currentValue: {
      type: Number,
      value: 0,
      observer: function (newValue) {
        this._refreshValues(newValue);
      },
    },
    allowHalf: {
      type: Boolean,
      value: true,
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    length: {
      type: Number, // 评选数量
      value: 5,
    },
  },
  data: {
    iconClassMap: {
      0: "empty",
      0.5: "half",
      1: "full",
    },
    POSITION: {
      LEFT: "LEFT",
      RIGHT: "RIGHT",
    },
    iconText: "star",
    values: [],
    placeholders: [],
  },
  ready: function () {
    this._getStarPosition();
    const test = undefined;
    console.log(test?.istest)
  },
  methods: {
    _refreshValues(value) {
      this.setData({
        values: this._generateArray(Number(value)),
      });
    },
    _generateArray(value) {
      let arr = [];
      let currentValue = value;
      if (currentValue <= 0) {
        return [0, 0, 0, 0, 0];
      }

      let isAppendHalf = false;
      if (this.data.allowHalf) {
        if (!isPositiveIntegerNumber(currentValue)) {
          currentValue = Math.floor(currentValue);
          isAppendHalf = true;
        }
      } else {
        currentValue = Math.ceil(currentValue);
      }

      // decide each position value
      for (let i = 0; i < this.data.length; i++) {
        if (i < currentValue) arr.push(1);
        else if (i === currentValue && isAppendHalf) arr.push(0.5);
        else arr.push(0);
      }

      return arr;
    },
    async _getStarPosition() {
      const { length } = this.data;
      let { screenWidth } = wx.getSystemInfoSync();
      let rate = screenWidth / 750;
      const query = this.createSelectorQuery();

      // Promise.all([
      //   promisefyBounding(query, `#star-0`),
      //   promisefyBounding(query, `#star-${length - 1}`),
      // ]).then((res) => {
      //   const [{ left: startX }, { right: endX }] = res;
      //   console.log(startX, endX, rate);
      // });
      const res = await Promise.all([
        promisefyBounding(query, `#star-0`),
        promisefyBounding(query, `#star-${length - 1}`),
      ])
        console.log(res);
    },
    clickOnStar(e) {
      const { disabled, POSITION, allowHalf, value } = this.data;
      const { index, position } = e.currentTarget?.dataset || {};
      console.log(typeof index)
      if (disabled || !position) {
        return;
      }

      const newValue =
        index + (allowHalf && position === POSITION.LEFT ? 0.5 : 1);
      if (newValue === value) {
        return;
      }
      this.setData({
        value: newValue,
      });
      this.triggerEvent("change", {
        value: newValue,
      });
    },
    moveOnStar(e) {
      const { startX, rate } = this.data;
      var touchX = e.touches[0].pageX;

      var starMinX = startX;
      var starWidth = STAR_WIDTH * rate;
      var starLen = STAR_SPACING * rate;

      let score = 0;
      let restLen = 0; //(当前触摸点距初始点距离)-整数倍*(星星宽+星星之间间距)的剩余距离
      let intMult = 0; //取余后的整星数量

      var starMaxX = starMinX + starWidth * 5 + starLen * 4; //最右侧星星最右侧的X坐标,需要加上5个星星的宽度和4个星星间距

      if (touchX >= starMinX && touchX <= starMaxX) {
        //点击及触摸的初始位置在星星所在空间之内

        //使用Math.ceil()方法取得当前触摸位置X坐标相对于(星星+星星间距)之比的整数,确定当前点击的是第几个星星

        intMult = Math.floor((touchX - starMinX) / (starWidth + starLen));

        restLen = touchX - starMinX - intMult * (starWidth + starLen);

        if (0 <= restLen && restLen < 0.5 * starWidth) {
          //空星

          score = intMult;
        } else if (0.5 * starWidth <= restLen && restLen < starWidth) {
          //显示半星

          score = intMult + 0.5;
        } else if (starWidth <= restLen) {
          //显示整星

          score = intMult + 1;
        }

        if (score != this.data.score) {
          //如果当前得分不等于刚设置的值,才赋值,因为touchmove方法刷新率很高,这样做可以节省点资源

          this.setData({
            score: score,
          });
        }
      } else if (touchX < starMinX) {
        //如果点击或触摸位置在第一颗星星左边,则恢复默认值,否则第一颗星星会一直存在

        this.setData({
          score: 0,
        });
      } else if (touchX > starMaxX) {
        this.setData({
          score: 5,
        });
      }
    },
  },
});

function rpxToPx(rpx) {
  let sysInfo = wx.getSystemInfoSync();
  return (rpx * sysInfo.windowWidth) / 750;
}

// 是否为整数
function isPositiveIntegerNumber(num) {
  let numStr = num.toString();
  return /(^[1-9]\d*$)/.test(numStr);
}

function promisefyBounding(query, selectedItem = "") {
  if (!selectedItem) return null;
  return new Promise((resolve) => {
    query
      .select(selectedItem)
      .boundingClientRect((res) => {
        resolve(res);
      })
      .exec();
  });
}
