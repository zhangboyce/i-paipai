// pages/home/home.js
var photoList = require('../../data/photoInfo-data.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasData: true,
    dateTab: true,
    categoryTab: false,
    scrollTop: 0,
    hasFixed:false,
    showLoadMore: false,
    showNoMore: false,
    page: 1,
    total:70
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      photoList: photoList.photoList,
      urlLists: photoList.photoListUrl
    });

    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var hight = (res.windowHeight - 48) * (750 / res.windowWidth);
        that.setData({
          scrollHeight: hight
        });
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // wx.pageScrollTo({
    //   scrollTop: 117
    // })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  showDateTab: function () {
    this.setData({
      dateTab: true,
      categoryTab: false
    })
  },
  showCategoryTab: function (event) {
    this.setData({
      dateTab: false,
      categoryTab: true,
    })
  },
  imgPreview: function (event) {
    var src = event.currentTarget.dataset.src;
    var urlLists = this.data.urlLists;
    wx.previewImage({
      current: src,
      urls: urlLists
    })
  },
  scroll: function (e) {
    var that =this;
    var scrollTop = that.data.scrollTop;
    that.setData({
      scrollTop: e.detail.scrollTop
    })
    var hasFixed = that.data.hasFixed;
    if (scrollTop >= 117 && !that.data.categoryTab && that.data.dateTab){
      that.setData({
        hasFixed: true
      })
    }else{
      that.setData({
        hasFixed: false
      })
    }
  },
  refresh: function (e) {
    console.log("refresh");
  },
  loadmore: function (e) {
    console.log("load more");
    if (this.data.page * 20 > this.data.total) {
      this.setData({
        showLoadMore: false,
        showNoMore: true
      });
    } else {
      var p = this.data.page;
      p++;
      this.setData({
        page: p,
        showLoadMore: true
      })
    }
  },
  toMine: function (event) {
    wx.navigateTo({
      url: "../index/index"
    })
  },
  showPhoto: function () {
    wx.showActionSheet({
      itemList: ['拍照', '从相册选择'],
      success: function (res) {
      },
      fail: function (res) {
      }
    })
  }
})