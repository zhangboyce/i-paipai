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
    wx.getStorage({
      key: 'pois',
      success: res => {
        this.setData({ arroundList: res.data });
      },
      fail: () => {
      }
    });

    wx.getStorage({
      key: 'locationChoosed',
      success: res => {
        this.setData({ location: res.data });
      },
      fail: () => {
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
    wx.getStorage({
      key: 'pois',
      success: res => {
        this.setData({ arroundList: res.data });
      },
      fail: () => {
      }
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

    var qqMapService = new QQMapWX({
      key: 'VPWBZ-ETKRP-B75D5-LO3GI-W4HYQ-RCFLH'
    });
    qqMapService.search({
      keyword: this.data.inputVal,
      success: (res) => {
        if (res.count<1){
          this.setData({
            arroundList:[]
          });
        }else{
          this.setData({
            arroundList: res.data
          });
        }
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },
  chooseLocation: function (event){
    wx.setStorage({
      key: "locationChoosed",
      data: event.currentTarget.dataset.checkedlocation
    })
    wx.navigateBack({
      delta: 1
    })
  }

})