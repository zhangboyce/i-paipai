let config = require('../../config.js');
let util = require('../../utils/util.js');
const app = getApp();

Component({
  behaviors: [],
  properties: {
    pageNum: { 
      type: Number, 
      value: 1, 
      observer: function (newVal, oldVal) { } 
    },
    pageSize: {
      type: Number,
      value: 9,
      observer: function (newVal, oldVal) { }
    },
    tag: {
      type: String,
      value: "",
      observer: function (newVal, oldVal) { }
    },
    location: {
      type: String,
      value: "",
      observer: function (newVal, oldVal) { }
    }
  },

  data: {
    total: 0,
    hasMore: false,
    photoList: [],
    photoUrlList: []
  }, 

  attached: function () {
    // 加载图片总数
    app.service({
      url: '/api/photo/count',
      data: {
        tag: this.data.tag,
        location: this.data.location
      },
      success: res => {
        this.setData({ total: res.data.count || 0 });
        this.__nextPage__();
      }
    });
  },

  methods: {
    onImgPreview: function (event) {
      var src = event.currentTarget.dataset.src;
      var photoUrlList = this.data.photoUrlList;
      wx.previewImage({
        current: src,
        urls: photoUrlList
      })
    },

    onLoadMore: function() {
      this.__nextPage__();
    },

    __loadData__: function() {
      app.service({
        url: '/api/photo/list',
        data: {
          pageSize: this.data.pageSize,
          pageNum: this.data.pageNum,
          tag: this.data.tag,
          location: this.data.location
        },
        success: (res) => {
          let results = res.data.photos;
          if (!results || results.length == 0) return;

          let photos = results.map(it => {
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

    __refresh__: function() {
      this.setData({
        photoList: [],
        photoUrlList: [],
        pageNum: 1
      });
      this.__loadData__();
    },

    __nextPage__: function () {
      let hasMore = this.data.total > (this.data.pageNum - 1) * this.data.pageSize;
      this.setData({ hasMore: hasMore });
      // 没有更多的数据
      if (!hasMore) return;
      
      this.__loadData__();
    },
  }
})