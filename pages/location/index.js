// pages/location/location.js
var QQMapWX = require('../../lib/qqmap-wx-jssdk.min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arroundList: [],
    total: 0,
    hasMore: false,
    page_size: 20,
    page_index: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.getSystemInfo({
      success: res => {
        var hight = (res.windowHeight - 48) * (750 / res.windowWidth);
        this.setData({ scrollHeight: hight });
      }
    })

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
      inputShowed: true,
      arroundList: []
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
      inputVal: "",
      page_size: 20,
      page_index: 1,
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
    this.loadData();
  },
  chooseLocation: function (event) {
    wx.setStorage({
      key: "locationChoosed",
      data: event.currentTarget.dataset.checkedlocation
    })
    wx.navigateBack({
      delta: 1
    })
  },
  onLoadMore: function () {
    this.setData({
      hasMore: true
    });
    this.nextPage();
    this.setData({
      hasMore: false
    });

  },
  loadData: function () {

    var qqMapService = new QQMapWX({
      key: 'VPWBZ-ETKRP-B75D5-LO3GI-W4HYQ-RCFLH'
    });
    qqMapService.search({
      keyword: this.data.inputVal,
      page_size: this.data.page_size,
      page_index: this.data.page_index,
      success: (res) => {

        if (res.count < 1) {
          this.setData({
            arroundList: [],
            hasMore: false
          });
        } else if (res.count == 1) {
          this.setData({
            arroundList: res.data,
            total: res.count,
            page_index: this.data.page_index + 1,
          });

        } else {
          this.setData({
            arroundList: this.data.arroundList.concat(res.data),
            total: res.count,
            page_index: this.data.page_index + 1,
          });

        }
      },
      fail: function (res) {
      },
      complete: function (res) {
      }
    });
  },
  nextPage: function () {
    let hasMore = this.data.total > (this.data.page_index - 1) * this.data.page_size;
    this.setData({ hasMore: hasMore });
    // 没有更多的数据
    if (!hasMore) return;
    this.loadData();
  },

})