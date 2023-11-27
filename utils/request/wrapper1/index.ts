import ajax from "./axiosUtil.js";

const CommonApi = {
  loginOrRegisterApi: (data: any) => ajax.post(`/userInfo/api/v1/loginOrRegister`, data), // 登录注册一体化
  getloginOrRegisterSmsApi: (data: any) => ajax.post(`/userInfo/api/v1/loginOrRegisterSms`, data), // 登录注册动码获取
  logoutApi: () => ajax.post(`/userInfo/api/v1/logout`), // 注销
};
export default CommonApi;