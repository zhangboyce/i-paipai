// pages/home/home.js
var photoList = require('../../data/photoInfo-data.js');
var app = getApp();
Page({
  data: {
    hasData: true,
    dateTab: true,
    categoryTab: false,
    scrollTop: 0,
    hasFixed: false,
    showLoadMore: false,
    showNoMore: false,
    page: 1,
    total: 70
  },
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
    var that = this;
    var scrollTop = that.data.scrollTop;
    that.setData({
      scrollTop: e.detail.scrollTop
    })
    var hasFixed = that.data.hasFixed;
    if (scrollTop >= 117 && !that.data.categoryTab && that.data.dateTab) {
      that.setData({
        hasFixed: true
      })
    } else {
      that.setData({
        hasFixed: false
      })
    }
  },
  refresh: function (e) {
    console.log("refresh");
  },
  loadMore: function (e) {
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
      itemList: ['拍照片', '相册照片'],
      success: (res) => {
        console.log(res.tapIndex);
        console.log(this);
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            this.chooseWxImage('camera');
          } else if (res.tapIndex == 1) {
            this.chooseWxImage('album');
          }
        }
      },
      fail: function (res) {
      }
    })
  },
  chooseWxImage: function (type) {
    wx.chooseImage({
      sizeType: ['compressed'],
      sourceType: [type],
      success: (res) => {
        console.log("res:"+res);
        wx.setStorage({
          key: "uploadImages",
          data: res
        })
        wx.navigateTo({
          url: "../photo/photo"
        })

      }
    })
  }


})