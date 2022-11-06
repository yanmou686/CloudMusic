import request from "../../utils/request";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [], //导航标签数据
    navId: "", //导航的标识，来判断我点击的是哪个导航
    vedio: [], //播放的视频
    videoUpdataTime: [], //记录video的播放时长
    isTriggered: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getVideoGroupListData();
  },

  //获取视频导航数据
  async getVideoGroupListData() {
    let videoGroupListData = await request("/video/group/list");
    this.setData({
      navId: videoGroupListData.data[0].id,
      videoGroupList: videoGroupListData.data.splice(0, 14),
    });
    /* console.log(this.data.navId); */
    //获取视频列表数据
    this.getVideoList(this.data.navId);
  },

  //获取视频的Url
  async getVideoUrl(vid) {
    /* console.log(vid); */
    let vedioUrl = await request("/video/url", { id: vid });
    /* console.log(vedioUrl.urls[0].url); */
    return vedioUrl.urls[0].url;
  },

  //获取视频信息数据
  async getVideoList(navId) {
    /*  console.log(navId); */
    let videoListData = await request(`/video/group?id=${navId}`);
    //关闭加载提示框
    wx.hideLoading();
    //关闭下拉刷新
    this.setData({
      isTriggered: false,
    });

    let vedioUrl = videoListData.datas.map((item) => {
      let index = 0;
      item.id = index++;
      this.getVideoUrl(item.data.vid).then((res) => {
        item["vedioUrl"] = res;
        /* console.log(res); */
        this.setData({
          /*   vedioUrl: res, */
        });
      });
      return item;
    });
    this.setData({
      vedio: vedioUrl, //数组
    });

    /*  if (this.data.vedio == []) {
   wx.showToast({
     title: "请先登录",
     icon: "error",
     duration: 2000,
   });
   setTimeout(() => {
     wx.navigateTo({
       url: "../login/login",
     });
   }, 2000);
 } */

    /*  console.log(this.data.vedio); */
  },

  //点击切换导航
  changeNav(event) {
    let navId = event.target.id;
    this.setData({
      //位移运算符主要是先将数字转化为二进制，再进行位移
      navId: navId >>> 0,
      vedio: [], //右移零位会将非number类型强制转换为number类型
    });
    //显示正在加载
    wx.showLoading({
      title: "正在加载",
    });
    //动态获取当前导航的视频数据
    this.getVideoList(navId);
  },

  //点击 播放/暂停 的回调
  handlePlay(event) {
    /* console.log(event); */
    let vid = event.target.id;
    //关闭上一个播放的视频
    if (this.vid !== vid && this.videoContext) this.videoContext.stop(); //这里是上一个的视频，因为刚进来是没有创建实例对象的
    this.vid = vid;
    //创建控制video标签的实例对象
    this.videoContext = wx.createVideoContext(vid);
  },

  //自定义刷新回调  下拉 ---scrollview
  handleRefresh() {
    //获取最新的视频请求
    this.getVideoList(this.data.navId);
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
  onShareAppMessage({ from }) {
    console.log(from);
    if (from == "button") {
      return {
        title: "来自严某的button转发",
        page: "/pages/video/video",
        imageUrl: "/static/images/sl.jpg",
      };
    } else {
      return {
        title: "来自严某的menu转发",
        page: "/pages/video/video",
        imageUrl: "/static/images/sl.jpg",
      };
    }
  },
});
