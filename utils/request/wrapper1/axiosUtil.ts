import urlConfig from '../../env/url-config-by-mp';

const baseUrl = urlConfig().backendBaseUrl;
const traceUrl = urlConfig().traceUrl;

let initHeader: any = {
  'content-type': 'application/json',
  'Accept': 'application/json',
};

// 处理登录失效
let handleLoginInvalid = (): void => {
  // 清除登录信息
  wx.removeStorageSync('token');
  wx.removeStorageSync('mobile');
  wx.removeStorageSync('userId');
  wx.removeStorageSync('ownerInvateCode');
  wx.removeStorageSync('openId');
  // 跳转去登录
  // 防止同一页面调用多个接口，导致重复跳转/login
  const pages = getCurrentPages();
  console.log(pages)
  
  if ((pages && pages.length > 1 && ((pages[1].route).indexOf('/login') === -1)) || (pages && pages.length ===1 && ((pages[0].route).indexOf('/login') === -1))) {
    wx.showModal({
      title: '温馨提示',
      content: '请登录',
      showCancel: true,
      success(showModalRes) {
        if (showModalRes.confirm) {
          // console.log('用户点击确定')
          wx.navigateTo({
            url: '/pages/login/login'
          });
        } else if (showModalRes.cancel) {
          // console.log('用户点击取消')
          // wx.reLaunch({
          //   url: '/pages/index/index'
          // })
        }
      }
    })
  } else {
    setTimeout(() => {
      wx.showToast({
        title: '请登录',
        icon: 'error',
        duration: 2000
      })
    }, 500)
  }
}

// 请求拦截
const ajaxInterceptorsRequest = () => {
  // 展示loading
  wx.showLoading({
    title: '加载中',
    mask: true,
  })
  initHeader.token = wx.getStorageSync('token') || '';
}

// 响应拦截
const ajaxInterceptorsResponse = (response: any) => {
  // 隐藏loading
  wx.hideLoading();
  // 隐藏Toast
  // wx.hideToast();
  // 处理错误
  const res = response.data || null;

  if (res && res.code === 0 && response.statusCode === 200) { // 请求成功
    return {
      result: true,
      status: 0
    };
  } else if (res && res.code === 1 && response.statusCode === 200) { // 请求失败
    // 提示错误
    setTimeout(() => {
      wx.showToast({
        title: res.msg,
        icon: 'none',
        duration: 2000
      })
    }, 500)
    return {
      result: false,
      status: 1
    };
  } else if (response.statusCode === 401 || response.statusCode === 403 || response.statusCode === 409) { // 处理token失效的情况,401.token为空或校验失败 403.无权访问其他用户信息 409. 多设备登录被挤下线
    handleLoginInvalid(); // 处理登录失效
    return {
      result: false,
      status: 2
    };
  } else { // 其他错误
    // 提示错误
    setTimeout(() => {
      wx.showToast({
        title: '系统错误,请联系管理员',
        icon: 'none',
        duration: 2000
      })
    }, 500)
    return {
      result: false,
      status: 3
    };
  }
}

class Ajax { // 创建一个类，相当于是创建一个构造函数

  get(url: string, data?: any) { // get方法
    ajaxInterceptorsRequest();

    return new Promise((resolve, reject) => { // 返回一个Promise对象
      wx.request({ // 配合微信的wx.request方法
        url: baseUrl + url, // 默认拼接baseUrl
        data: data || {}, // 如果没有传data，默认为一个空对象
        header: initHeader,
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: (response) => {
          const res: any = response.data;

          const ajaxInterceptorsResponseData = ajaxInterceptorsResponse(response);

          if (ajaxInterceptorsResponseData.result) {
            resolve(res); // 请求成功，执行resolve
          } else if (ajaxInterceptorsResponseData.status === 1) {
            reject(res.msg);
          } else {
            reject(res);
          }
        },

        fail: (res) => { // 请求失败，执行reject
          console.log('请求失败', res)
          reject(res);
        },

        complete: () => { // 请求完成
          wx.hideLoading(); // 隐藏loading
        },
      });
    })
  }

  post(url: string, data?: any) { // post方法
    ajaxInterceptorsRequest();

    return new Promise((resolve, reject) => { // 返回一个Promise对象

      wx.request({ // 配合微信的wx.request方法
        url: baseUrl + url, // 默认拼接baseUrl
        data: data || {}, // 如果没有传data，默认为一个空对象
        header: initHeader,
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: (response) => {
          const res: any = response.data;

          const ajaxInterceptorsResponseData = ajaxInterceptorsResponse(response);

          if (ajaxInterceptorsResponseData.result) {
            resolve(res); // 请求成功，执行resolve
          } else if (ajaxInterceptorsResponseData.status === 1) {
            reject(res.msg);
          } else {
            reject(res);
          }
        },

        fail: (res) => { // 请求失败，执行reject
          console.log('请求失败', res)
          reject(res);
        },

        complete: () => { // 请求完成
          wx.hideLoading(); // 隐藏loading
        },
      })
    })
  }

  trace(data?: any) { // 数据埋点
    let eventId = '';

    // 获取随机数
    const guid = () => {
      let str = '';
      for (; str.length < 19; str += Math.random().toString(36).substr(2)) {
        //
      }
      return str.substr(0, 19);
    }

    eventId = new Date().getTime() + guid();

    const params = {
      type: 'applet',
      tailId: wx.getStorageSync('tailId') || '',
      globalUserId: wx.getStorageSync('userId') || '',
      systemName: 'xgn',
      mobile: wx.getStorageSync('mobile') || '',
      time: new Date().getTime(),
      generateId: wx.getStorageSync('generateId') || '', // 设备标识，md5(openid + systemInfo.brand + systemInfo.model)
      eventId,
      event: data.event || '', // 事件id
      page: data.page || '', // 当前page名
      unionId: wx.getStorageSync('unionId') || '',
      openId: wx.getStorageSync('openId') || '',
      content: data.content || '', // 输入内容
      // fbdId: '', // 不需要
      // systemId: '', // 设备标识
      // applyId: '', // 不需要
      // deviceId: '', // 小程序获取不到
      // browserId: '', // 浏览器指纹，小程序获取不到
      // userAgent: '', // 小程序获取不到
    }

    return new Promise((resolve, reject) => { // 返回一个Promise对象
      wx.request({ // 配合微信的wx.request方法
        url: traceUrl, // 默认拼接traceUrl
        data: [params] || {}, // 如果没有传params，默认为一个空对象
        header: initHeader,
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: (response) => {
          const res = response.data;
          resolve(res)
        },

        fail: (res) => { // 请求失败，执行reject
          console.log('埋点请求失败', res)
          reject(res);
        },

        complete: () => { // 请求完成
        },
      })
    })
  }
}

const ajax = new Ajax() // 创建一个Ajax的实例

export default ajax // 如果想在page中使用Ajax的实例，则写这一句，new Ajax()返回的是一个Ajax实例，是promise对象