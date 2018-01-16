var QQMapWX = require('../../public/js/qqmap-wx-jssdk.min.js');
let config = require('../../config.js');

Page({
  data: {
    arroundList: [],
    total: 0,
    page_size: 20,
    page_index: 1,
  },

  onLoad: function (options) {
    wx.getSystemInfo({
      success: res => {
        var hight = (res.windowHeight - 48) * (750 / res.windowWidth);
        this.setData({ scrollHeight: hight });
      }
    })

    wx.getStorage({
      key: 'pois',
      success: res => { this.setData({ arroundList: res.data }); }
    });
    wx.getStorage({
      key: 'checkedlocation',
      success: res => { this.setData({ location: res.data }); }
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
      key: "checkedLocation",
      data: event.currentTarget.dataset.checkedlocation
    })
    wx.navigateBack({
      delta: 1
    })
  },

  onLoadMore: function () {
    this.nextPage();
  },

  loadData: function () {
    var qqMapService = new QQMapWX({ key: config.qqMapServiceKey });
    qqMapService.search({
      keyword: this.data.inputVal,
      page_size: this.data.page_size,
      page_index: this.data.page_index,
      success: (res) => {
        this.setData({
          arroundList: this.data.arroundList.concat(res.data || []),
          total: res.count || 0,
          page_index: this.data.page_index + 1,
        });
      }
    });
  },

  nextPage: function () {
    let hasMore = this.data.total > (this.data.page_index - 1) * this.data.page_size;
    if (!hasMore) return;
    this.loadData();
  }
})