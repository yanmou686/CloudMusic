import request from "../../utils/request";
let startY = 0;
let moveY = 0;
let moveDistance = 0;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    coverTransForm: "translateY(0)",
    coverTransition: "",
    userInfo: {}, //用户个人信息
    recentPlayList: [], //用户播放记录  type=1(一周内) type=0(播放记录排行)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let userInfo = wx.getStorageSync("userInfo");
    if (userInfo) {
      this.setData({
        userInfo: JSON.parse(userInfo),
      });
      //获取用户播放记录
      this.getUserRecentPlayList(this.data.userInfo.userId);
    }
  },
  async getUserRecentPlayList(userId) {
    //获取用户播放记录封装方法
    let recentPlayListData = await request("/user/record/recent/song", {
      uid: userId,
      type: 1,
    });
    this.setData({
      recentPlayList: recentPlayListData.weekData.splice(0, 10),
    });
  },
  handleTouchStart(event) {
    //先将过渡效果去除
    this.setData({
      coverTransition: "",
    });
    //获取鼠标的起始坐标
    startY = event.touches[0].clientY;
  },
  handleTouchMove(event) {
    moveY = event.touches[0].clientY;
    moveDistance = moveY - startY;
    if (moveDistance <= 0) {
      return;
    }
    if (moveDistance >= 80) {
      moveDistance = 80;
    }
    //动态更新我们的数据
    this.setData({
      coverTransForm: `translateY(${moveDistance}rpx)`,
    });
  },
  handleTouchEnd() {
    this.setData({
      coverTransForm: `translateY(0)`,
      coverTransition: "transform 1s linear",
    });
  },
  goLogin() {
    wx.reLaunch({
      url: "../login/login",
    });
  },

  toSongDetail() {
    wx.navigateTo({
      url: "../songDetail/songDetail",
    });
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
