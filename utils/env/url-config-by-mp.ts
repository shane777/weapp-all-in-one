interface IConfigType {
    backendBaseUrl: string;
    traceUrl: string;
  }
  
  // 开发环境地址
  const urlDev: IConfigType = {
    backendBaseUrl: 'https://后台地址/dev', // 后台地址
    traceUrl: 'https:/埋点接口地址/dev', // 埋点接口地址
  };
  // uat环境地址
  const urlUat: IConfigType = {
    backendBaseUrl: 'https://后台地址/uat', // 后台地址
    traceUrl: 'https:/埋点接口地址/uat', // 埋点接口地址
  };
  // 生产环境地址
  const urlProd: IConfigType = {
    backendBaseUrl: 'https://后台地址/prod', // 后台地址
    traceUrl: 'https:/埋点接口地址/prod', // 埋点接口地址
  };
  
  let env = (wx.getAccountInfoSync()).miniProgram.envVersion || '';
  
  if (wx.getAccountInfoSync) {
    env = (wx.getAccountInfoSync()).miniProgram.envVersion || '';
  }
  
  const urlConfig = (): IConfigType => {
    // 通过环境赋值baseURL
    if (env === "release" || !env) { // 正式环境
      return urlProd;
    } else if (env === "trial") { // 体验环境
      return urlUat;
    } else { // 开发环境
      return urlDev;
    }
  };
  
  export default urlConfig;