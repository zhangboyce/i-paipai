var config = require('../../config.js');
var util = require('../../utils/util.js');

const app = getApp();
Page({
  data: {
    dateTab: true,
    scrollTop: 0,
    hasFixed:false,
    categories: {  }
  },
  
  onLoad: function (options) {
    wx.getSystemInfo({
      success: res => {
        var hight = (res.windowHeight - 48) * (750 / res.windowWidth);
        this.setData({ scrollHeight: hight });
      }
    })
  },

  // 时间轴和分类列表tab切换
  showDateTab: function () {
    this.setData({ dateTab: true })
  },
  showCategoryTab: function (event) {
    app.service({
      url: '/api/photo/categories',
      success: res => {
        let listByLocation = res.data.listByLocation;
        [1,2,3,4].forEach(it => {
          listByLocation.push({
            "location": " ",
            "data": ["/images/home/icon_nopic.png"]
          });
        });
        res.data.listByLocation = listByLocation.slice(0, 4);
        this.setData({ categories: res.data || {} })
      }
    });
    this.setData({ dateTab: false })
  },

  toMine: function () {
    wx.navigateTo({
      url: '/pages/user/index',
      
    })
  },

  scroll: function (e) {
    var scrollTop = this.data.scrollTop;
    this.setData({ scrollTop: e.detail.scrollTop });
    var hasFixed = this.data.hasFixed;
    this.setData({ hasFixed: scrollTop >= 117 && !this.data.categoryTab && this.data.dateTab });
  },

  showPhoto: function () {
    wx.showActionSheet({
      itemList: ['拍照片', '相册照片'],
      success: (res) => {
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
        wx.setStorage({
          key: "uploadImageList",
          data: res.tempFilePaths
        })
        wx.navigateTo({
          url: "../upload/index"
        })
      }
    })
  }
})