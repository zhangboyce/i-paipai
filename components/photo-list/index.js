let config = require('../../config.js');
let util = require('../../utils/util.js');
const app = getApp();

Component({
  behaviors: [],
  properties: {
    pageNum: { 
      type: Number, 
      value: 1 
    },
    pageSize: {
      type: Number,
      value: 999999
    },
    tag: {
      type: String,
      value: ""
    },
    location: {
      type: String,
      value: ""
    }
  },

  data: {
    scrollHeight: 0,
    total: 0,
    hasMore: false,
    photoList: [],
    photoUrlList: []
  }, 

  ready: function () { 
    wx.getSystemInfo({
      success: res => {
        var hight = (res.windowHeight - 48) * (750 / res.windowWidth);
        this.setData({ scrollHeight: hight });
      }
    })

    this.flush();
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
      console.log('laod more');
      this.__nextPage__();
    },

    flush: function() {
      console.log(this.data);
      app.service({
        url: '/api/photo/count',
        data: {
          tag: this.data.tag,
          location: this.data.location
        },
        success: res => {
          this.setData({ total: res.data.count || 0 });
          this.__refresh__();
        }
      });
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
            photoList: this.data.photoList.concat(util.groupBy(photos, 'uploadedFormatDate')).sort((it1, it2) => it1.uploadedFormatDate - it2.uploadedFormatDate),
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
      if (!hasMore) return;
      
      this.__loadData__();
    },
  }
})