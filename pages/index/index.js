var config = require('../../config.js');
var util = require('../../utils/util.js');

const app = getApp();
Page({
  data: {
    dateTab: true,
    scrollTop: 0,
    hasFixed: false,
    categories: {}
  },

  onLoad: function (options) {
    wx.getSystemInfo({
      success: res => {
        var hight = res.screenHeight * 2;  // 转化成rpx
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
        [1, 2, 3, 4].forEach(it => {
          listByLocation.push({
            "location": " ",
            "data": ["/public/images/icon_nopic.png"]
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
    this.setData({ hasFixed: scrollTop >= 118 && !this.data.categoryTab && this.data.dateTab });
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
  },
    /**
   * 用户滚动到顶部 
   */
  upper: function (){
    this.setData({ hasFixed: false });
  },
  /**
* 用户点击右上角分享
*/
  onShareAppMessage: function (res) {
    return {
      title: '脑洞随手拍',
      path: '/pages/index/index',
      //imageUrl:"/public/icons/logo.png",
      success: function (res) {
        if (res.errMsg == "shareAppMessage:ok") {
          wx.showToast({
            title: '转发成功',
            icon: 'success',
            duration: 2000
          })
        }
      },
      fail: function (res) {
        if (res.errMsg == "shareAppMessage:fail cancel") {
          wx.showToast({
            title: '转发取消',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '转发失败',
            duration: 2000
          })
        }
      }
    }

  }
  


 

})