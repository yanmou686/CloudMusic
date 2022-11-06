import request from "../../utils/request";
import PubSub from "pubsub-js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    day: "",
    month: "",
    recommendSongs: [],
    index: 0,
    perMusicId: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getRecommendSongs();
    let userInfo = wx.getStorageSync("userInfo");
    if (!userInfo) {
      wx.showToast({
        title: "请先登录",
        icon: "none",
        success: () => {
          wx.reLaunch({
            url: "/pages/login/login",
          });
        },
      });
    }
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1,
    });
    /* 订阅来自songDetail的type数据 */
    PubSub.subscribe("switchType", this.getSongDetailType);
  },

  /* 订阅的回调 */
  getSongDetailType(msgname, data) {
    let { recommendSongs, index } = this.data; //将歌曲列表从data中解构出来
    if (data === "pre") {
      //上一首
      if (index <= 0) {
        index = 32;
      } else {
        index = index - 1;
      }
      /* index == 0 && (index = recommendSongs.length);
      index -= 1; */
    } else {
      //下一首
      if (index >= 32) {
        index = 0;
      } else {
        index = index + 1;
      }
      /*  index == recommendSongs.length && (index = -1);
      index += 1; */
    }
    this.setData({
      index,
    });
    /* 将musicId回传给songDetail中 */
    let musicId = recommendSongs[index].id;
    //发布信息
    PubSub.publish("recommendMusicId", musicId);
  },

  /* 获取推荐歌曲的歌曲 */
  async getRecommendSongs() {
    let recommendSongs = await request("/recommend/songs");
    this.setData({
      recommendSongs: recommendSongs.data.dailySongs,
    });
  },

  /* 将点击元素的音乐id发送至songDetail */
  toSongDetail(event) {
    let { song, index } = event.currentTarget.dataset; //获取当前点击元素所携带的参数
    this.setData({
      index,
    });
    // console.log(musicId);
    wx.navigateTo({
      url: `../songDetail/songDetail?musicId=` + JSON.stringify(song.id),
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
