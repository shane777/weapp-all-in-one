Page({
    data: {
      markers: [{
        id: 0,
        latitude: 31.229792,
        longitude: 121.451697,
        width: 50,
        height: 50
      }]
    },
    regionchange(e) {
      console.log(e.type)
    },
    markertap(e) {
      console.log(e.markerId)
      const {markers} = this.data;
      const marker = markers.find( marker => marker.id === e.markerId);
      wx.openLocation({
        latitude: marker.latitude,
        longitude: marker.longitude,
        scale: 28
      })
    },
    controltap(e) {
      console.log(e.controlId)
    }
  })