import config from "./config";
//封装ajax请求函数
export default (url, data = {}, method = "GET") => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.host + url,
      data,
      method,
      header: {
        cookie: wx.getStorageSync("cookies")
          ? wx
              .getStorageSync("cookies")
              .find((item) => item.indexOf("MUSIC_U") !== -1)
          : "",
      },
      success: (res) => {
        /* console.log(res); */
        /* console.log("请求成功"); */
        if (data.isLogin) {
          //判断是否为登录请求
          wx.setStorage({
            key: "cookies",
            data: res.cookies,
          });
        }
        resolve(res.data);
      },
      fail: (err) => {
        console.log("请求失败");
        reject(err);
      },
    });
  });
};
