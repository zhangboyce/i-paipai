// pages/location/location.js
var QQMapWX = require('../../lib/qqmap-wx-jssdk.min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arroundList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log("options: " + options);

    wx.getStorage({
      key: 'pois',
      success: res => {
        this.setData({ arroundList: res.data });
      },
      fail: () => {

      }
    });

    wx.getStorage({
      key: 'location',
      success: res => {
        this.setData({ location: res.data });
      },
      fail: () => {

      }
    });



    var qqMapService = new QQMapWX({
      key: 'VPWBZ-ETKRP-B75D5-LO3GI-W4HYQ-RCFLH'
    });
    var location = {
      latitude: options.latitude,
      longitude: options.longitude
    };

    qqMapService.search({
      keyword: '程迈文化',
      location: location,
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });

    qqMapService.getSuggestion({
      keyword: '地铁',
      region:'上海市',
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  }

})