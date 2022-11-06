import request from "../../utils/request";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    codeword: "",
    btnData: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},
  async getCode() {
    let t = 60;
    var time = setInterval(() => {
      t--;
      let str = "";
      if (t == 0) {
        str = "重新发送";
        clearInterval(time);
      } else {
        str = t + "s后重新发送";
      }
      this.setData({
        btnData: str,
      });
      /* console.log(str); */
    }, 1000);
    let phoneReg = /^(?:(?:\+|00)86)?1\d{10}$/;
    if (!this.data.phone) {
      wx.showToast({
        title: "请输入手机号",
        icon: "error",
      });
    } else if (!phoneReg.test(this.data.phone)) {
      wx.showToast({
        title: "手机号格式错误",
        icon: "error",
      });
    } else {
      await request(`/captcha/sent?phone=${this.data.phone}`);
      wx.showToast({
        title: "获取验证码成功",
      });
    }
  },
  async login() {
    let result = await request(
      `/login/cellphone?phone=${this.data.phone}&captcha=${this.data.codeword}`,
      { isLogin: true }
    );
    if (result.code === 200) {
      wx.showToast({
        title: "登录成功",
      });
      wx.setStorageSync("userInfo", JSON.stringify(result.profile));
      /* console.log(result.profile); */

      //跳转至个人中心personal
      setTimeout(() => {
        wx.switchTab({
          url: "../personl/personl",
          success: function () {},
        });
      }, 1000);
    } else if (result.code == 503) {
      wx.showToast({
        title: "验证码错误",
        icon: "error",
        duration: 2000,
      });
      return;
    } else {
      wx.showToast({
        title: "登录失败",
        icon: "error",
        duration: 3000,
      });
      return;
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
