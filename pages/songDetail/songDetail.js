import request from "../../utils/request";
import PubSub from "pubsub-js";
import dayJs, { Dayjs } from "dayjs";
import dayjs from "dayjs";
/* 获取APP实例 */
const appInstance = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, //标识音乐是否播放
    musicId: "",
    songDetail: [],
    songUrl: "",
    musicLink: "",
    currentTime: "00:00",
    durationTime: "00:00", //总音乐时长
    currentWidth: 0, //实时进度条的宽度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //传递过来的参数有限制，超出则截取
    let musicId = options.musicId;
    this.setData({
      musicId,
    });
    this.getSongDetail(musicId);
    this.getSongUrl(musicId);
    /*
    用于监听音频的
    播放/
    暂停/
    停止 
     */
    this.backAudioManager = wx.getBackgroundAudioManager();
    /* 音乐播放的状态 */
    this.backAudioManager.onPlay(() => {
      /* 修改音乐播放的状态 */
      this.changePlayState(true);
      /* 修改全局播放的状态 */
      // appInstance.globalData.isMusicPlay = true;
      appInstance.globalData.musicId = musicId;
    });
    /* 音乐暂停的状态; */
    this.backAudioManager.onPause(() => {
      this.changePlayState(false);
      // appInstance.globalData.isMusicPlay = false;
      // appInstance.globalData.musicId = musicId;  有播放才会有暂停，播放的时候获取一次音乐ID就可以
    });
    /* 音乐停止的状态; */
    this.backAudioManager.onPause(() => {
      this.changePlayState(false);
      // appInstance.globalData.isMusicPlay = false;
      // appInstance.globalData.musicId = musicId;
    });
    /* 音乐自然结束 */
    this.backAudioManager.onEnded(() => {
      // 自动切换至下一首音乐并且自动播放
      PubSub.publish("switchType", "next");
      // 将实时进度条长度还原为0
      this.setData({
        currentWidth: 0,
        currentTime: "00:00",
      });
    });

    /* 监听音乐实时播放的进度 */
    this.backAudioManager.onTimeUpdate(() => {
      // console.log("总时长:", this.backAudioManager.duration);
      // console.log("实时播放时长:", this.backAudioManager.currentTime);
      // 因为返回的数据都是秒，所以我们还要进行格式化(dayjs中的单位为ms)
      let currentTime = dayjs(this.backAudioManager.currentTime * 1000).format(
        "mm:ss"
      );
      let currentWidth =
        (this.backAudioManager.currentTime / this.backAudioManager.duration) *
        450;
      this.setData({
        currentTime,
        currentWidth,
      });
    });
    if (
      /* 当退出音乐播放页面时，判断再次进入页面时的音乐ID和播放状态 */
      appInstance.globalData.musicId === musicId &&
      appInstance.globalData.isMusicPlay
    ) {
      this.setData({
        isPlay: true, //如果再次点击的音乐ID和当时点击播放时的音乐ID相同，那么我们将isPlay修改为ture
      });
    }

    /* 订阅来自recommendSong的上一首和下一首的音乐ID */
    PubSub.subscribe("recommendMusicId", this.getRecommendSongsMusicId);
  },

  //订阅消息（上一首和下一首的音乐ID）的回调
  getRecommendSongsMusicId(msgname, data) {
    /* console.log(data); */
    this.setData({
      musicId: data,
    });
    this.getSongDetail(data);
    this.getSongUrl(data);
    /*  自动播放音乐（点击上一首或者下一首时） */
    this.musicControl(true, data);
  },

  //修改播放状态（减少代码重复）
  changePlayState(isPlay) {
    this.setData({
      isPlay,
    });
    appInstance.globalData.isMusicPlay = isPlay;
  },

  //获取音乐详情
  async getSongDetail(musicId) {
    let song = await request(`/song/detail?ids=${musicId}`);
    let durationTime = dayjs(song.songs[0].dt).format("mm:ss");
    this.setData({
      songDetail: song.songs[0],
      durationTime,
    });
    /* 动态修改窗口的标题 */
    wx.setNavigationBarTitle({
      title: "正在播放" + this.data.songDetail.name,
    });
  },

  //获取到歌曲的url
  async getSongUrl(musicId) {
    let songUrl = await request(`/song/url?id=${musicId}`);
    /* console.log(songUrl); */
    this.setData({
      songUrl: songUrl.data,
    });
  },

  //点击播放/暂停的回调
  handleMusicPlay() {
    let isPlay = !this.data.isPlay;
    let musicId = this.data.musicId;
    this.setData({
      isPlay,
    });
    this.musicControl(isPlay, musicId);
  },

  //控制音乐播放/暂停的回调
  async musicControl(isPlay, musicId, musicLink) {
    // 创建背景音频的实例
    /*  let backAudioManager = wx.getBackgroundAudioManager();  
     已经在load生命周期中定义了
     将backAudioManager赋予到了this身上
     */
    if (isPlay) {
      let musicLinkData = await request(`/song/url?id=${musicId}`);
      let musicLink = musicLinkData.data[0].url;
      this.setData({
        musicLink,
      });
      this.backAudioManager.src = musicLink;
      this.backAudioManager.title = this.data.songDetail.name;
    } else {
      /* 音乐暂停 */
      this.backAudioManager.pause();
    }
  },

  //点击切歌的回调
  handleSwitch(event) {
    let type = event.currentTarget.id;
    this.backAudioManager.stop();
    /* 发布消息 */
    PubSub.publish("switchType", type);
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
  onUnload() {
    PubSub.unsubscribe("recommendMusicId");
  },

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
