// components/product-hero/index.js
// eslint-disable-next-line no-undef

Component({
  options: {
    styleIsolation: 'apply-shared',
  },
  /**
   * Component properties
   */
  properties: {
    heroContent: {
      type: Object,
      value: {}
    },
    heroOverlayOpacity: {
      type: Number,
      value: 0
    },
    blurScale: {
      type: Number,
      value: 0
    },
    windowHeight: {
      type: Number,
      value: 812
    }
  },

  /**
   * Component initial data
   */
  data: {
  },

  /**
   * Component methods
   */
  methods: {
  }
})
