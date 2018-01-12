var config = require('../../config.js');
var util = require('../../utils/util.js');
const app = getApp();

Page({
  data: {
    dateTab: true,
    scrollTop: 0,
    hasFixed:false,
    pageNum: 1,
    pageSize: 12,
    total: 0,
    hasMore: false,
    photoList: [],
    photoUrlList: []
  },

  // 加载更多
  loadPage: function () {
    let hasMore = this.data.total > (this.data.pageNum - 1) * this.data.pageSize;
    this.setData({ hasMore: hasMore });
    // 没有更多的数据
    if (!hasMore) return;

    // 查询一页数据
    app.service({
      url: '/api/photo/list',
      data: { pageSize: this.data.pageSize, pageNum: this.data.pageNum },
      success: (res) => {
        let results = res.data.photos;
        if (!results || results.length == 0) return;

        let photos = results.map(it => {
          it && (it.url = config.qiniu.outLink + it.key);
          it && (it.uploadedFormatDate = util.formatDate(new Date(it.uploadedDate)));
          return it
        });
        this.setData({
          photoList: this.data.photoList.concat(util.groupBy(photos, 'uploadedFormatDate')),
          photoUrlList: this.data.photoUrlList.concat(photos.map(it => it.url)),
          pageNum: this.data.pageNum + 1
        });
      }
    });
  },

  onLoad: function (options) {
    // 加载图片总数
    app.service({
      url: '/api/photo/count',
      success: res => {
        this.setData({ total: res.data.count || 0 });
        this.loadPage();
      }
    });

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
    this.setData({ dateTab: false })
  },

  // 图片预览
  imgPreview: function (event) {
    var src = event.currentTarget.dataset.src;
    var photoUrlList = this.data.photoUrlList;
    wx.previewImage({
      current: src,
      urls: photoUrlList
    })
  },

  scroll: function (e) {
    var scrollTop = this.data.scrollTop;
    this.setData({ scrollTop: e.detail.scrollTop });
    var hasFixed = this.data.hasFixed;
    this.setData({ hasFixed: scrollTop >= 117 && !this.data.categoryTab && this.data.dateTab });
  },

  loadMore: function (e) {
    this.loadPage();
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
          url: "../photo/photo"
        })
      }
    })
  }


})