// pages/index/index.js
import request from "../../utils/request.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [], //轮播图数据
    recommendList: [], //推荐歌单数据
    topList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    //获取轮播图数据
    let bannerListData = await request("/banner", { type: 2 });
    //获取推荐歌单滚动数据
    let recommendListData = await request("/personalized", { limit: 15 });
    //获取榜单数据
    let index = 0;
    let resultArr = [];
    while (index < 3) {
      let topListData = await request("/toplist/detail", { idx: index++ });
      let topListItem = {
        coverImgUrl: topListData.list[index].coverImgUrl,
        name: topListData.list[index].name,
        tracks: topListData.list[index].tracks,
      };
      resultArr.push(topListItem);
    }

    this.setData({
      bannerList: bannerListData.banners,
      recommendList: recommendListData.result,
      topList: resultArr, //如果放在while循环中用户体验会更好，但是请求次数变多
    });
  },

  toRecommendSongs() {
    wx.navigateTo({
      url: "/pages/recommendSongs/recommendSongs",
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
