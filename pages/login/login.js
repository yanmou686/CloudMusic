import request from "../../utils/request";
// pages/login/login.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    password: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},
  handleInput(event) {
    let type = event.target.id;
    this.setData({
      [type]: event.detail.value, //获取账户密码的实时数据，双向绑定，也可以使用model:value实现
    });
  },
  async login() {
    let { phone, password } = this.data;
    //前端验证
    if (!phone) {
      wx.showToast({
        title: "手机号不能为空",
        icon: "error",
      });
      return;
    }
    let phoneReg = /^(?:(?:\+|00)86)?1\d{10}$/;
    if (!phoneReg.test(phone)) {
      wx.showToast({
        title: "手机号格式错误",
        icon: "error",
      });
      return;
    }
    if (!password) {
      wx.showToast({
        title: "密码不能为空",
        icon: "error",
      });
      return;
    }

    //后端验证
    let result = await request(
      `/login/cellphone?phone=${phone}&password=${password}`,
      { isLogin: true }
    );
    if (result.code === 200) {
      wx.showToast({
        title: "登录成功",
      });
      console.log(result);
      //将用户信息存储至本地,让之后的每个页面都能够读取到用户信息
      wx.setStorageSync("userInfo", JSON.stringify(result.profile));
      //跳转至个人中心personal
      setTimeout(() => {
        wx.switchTab({
          url: "../personl/personl",
          success: function () {},
        });
      }, 1000);
    } else if (result.code === 502) {
      wx.showToast({
        title: "帐号或密码错误",
        icon: "error",
      });
    } else if (result.code === 400) {
      wx.showToast({
        title: "手机号错误",
        icon: "error",
      });
    } else {
      wx.showToast({
        title: "登录失败",
        icon: "error",
      });
    }
  },

  codeLogin() {
    wx.reLaunch({
      url: "/pages/codeLogin/codeLogin",
    });
  },

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
