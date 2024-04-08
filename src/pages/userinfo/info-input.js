// pages/userinfo/info-input.js
var plugin = requirePlugin("chatbot");

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: defaultAvatarUrl,
    theme: wx.getSystemInfoSync().theme,
    result: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log
    plugin.init({
      appid: "FF0kAfBvoNHezg2gN2QFq7JeZ4eiGf",
      openid: "oi73F01Dj10WJr5g-QRmyNEaiM9s", //用户的openid，必填项，可通过wx.login()获取code，然后通过后台接口获取openid
      userHeader: "", // 用户头像
      userName: "", // 用户昵称
      anonymous: false, // 是否允许匿名用户评价，默认为false，设为true时，未传递userName、userHeader两个字段时将弹出登录框
      success: () => {}, //非必填
      fail: (error) => {}, //非必填
  });
  this.testFunction();
  },
  testFunction(){
    console.log('test');
  },
  onBlurInput(e) {
    if(!e.detail?.value || " " ) this.setData({ result : []});
    console.log('e.detail?.value: ', e.detail?.value);
    plugin.api.nlp('sensitive', {q: e.detail.value, mode: 'cnn'}).then(res => {
      console.log('res: ', res);
    const validResult = Array.isArray(res?.result) && res.result.map( item => item? `${item[0]} : ${item[1]}` : '' )
    console.log(Array.isArray(res?.result) && res.result.some(resultItem => Array.isArray(resultItem) && resultItem[0] === 'other' && Number(resultItem[1]) === 1));
    this.setData({
      result: validResult || []
    })
  });
  },
  onSave(e){
    console.log('e: ', e);

  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    });
  }
});