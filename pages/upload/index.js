// pages/photo/photo.js
var util = require('../../utils/util.js');
var QQMapWX = require('../../lib/qqmap-wx-jssdk.min.js');
let config = require('../../config.js');
let app = getApp();

Page({
  data: {
    uploadImageList: [],
    uploadProgress: {  },
    tagList: [],
    showTagList: [],
    tagExpand: false,
    checkedLocation: { title: "所在位置" },
  },

  onLoad: function (options) {
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        this.getLoaction(res.latitude, res.longitude);
      }
    })

    wx.getStorage({
      key: 'uploadImageList',
      success: res => {
        this.setData({ uploadImageList: res.data || [] });
      }
    });

    app.service({
      url: '/api/photo/tags',
      success: res => {
        this.setData({ tagList: (res.data.tags || []).map(it => { return { name: it, selected: false } }) });
        this.setData({ showTagList: this.data.tagExpand ? this.data.tagList : this.data.tagList.slice(0, 4) });
      }
    })
  },

  onShow: function () {
    wx.getStorage({
      key: 'checkedLocation',
      success: res => {
        this.setData({ checkedLocation: res.data });
      }
    });
  },

  imgPreview: function (event) {
    var src = event.currentTarget.dataset.src;
    var urlList = this.data.uploadImageList;
    wx.previewImage({
      current: src,
      urls: urlList
    })
  },

  deleteImage: function (event) {
    wx.showModal({
      title: '',
      content: '确定要删除吗？',
      success: (res) => {
        if (res.confirm) {
          var imageIndex = event.currentTarget.dataset.index;
          this.data.uploadImageList.splice(imageIndex, 1);
          this.setData({ uploadImageList: this.data.uploadImageList });
          wx.setStorage({
            key: "uploadImageList",
            data: this.data.uploadImageList
          })
        }
      }
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
      }
    })
  },

  chooseWxImage: function (type) {
    wx.chooseImage({
      sizeType: ['compressed'],
      count: 9 - this.data.uploadImageList.length,
      sourceType: [type],
      success: (res) => {
        this.setData({ uploadImageList: this.data.uploadImageList.concat(res.tempFilePaths)});
        wx.setStorage({
          key: "uploadImageList",
          data: this.data.uploadImageList
        })
      }
    })
  },

  getLoaction: function (latitude, longitude) {
    var qqMapService = new QQMapWX({ key: config.qqMapServiceKey });
    qqMapService.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      coord_type: 5,   //5 [默认]腾讯、google、高德坐标
      get_poi: 1,      //是否返回周边POI列表：
      success: (res) => {
        if (res.status == 0) {
          var poisList = res.result.pois;
          var noLocation = { title: "所在位置" };
          var province = { title: res.result.ad_info.province };
          poisList.unshift(noLocation, province);
          wx.setStorage({
            key: "pois",
            data: poisList
          })
          wx.setStorage({
            key: "checkedLocation",
            data: noLocation
          })
        }
      }
    });
  },

  toLocation: function () {
    wx.navigateTo({
      url: "../location/index"
    })
  },
   
  onChangeTagExpand: function () {
    this.setData({ tagExpand: !this.data.tagExpand });
    this.setData({ showTagList: this.data.tagExpand ? this.data.tagList : this.data.tagList.slice(0, 4) });
  },

  onClickTag: function (event){
    let tagName = event.currentTarget.dataset.name;
    let index = this.data.tagList.findIndex(it => it.name == tagName);
    this.data.tagList[index].selected = !this.data.tagList[index].selected;
    this.setData({ tagList: this.data.tagList });

    this.setData({ showTagList: this.data.tagExpand ? this.data.tagList : this.data.tagList.slice(0, 4) });
  },

  onAddTag: function (event) {
    
  },

  onUpload: function() {
    if (this.data.uploadImageList.length == 0) return;
    
    let uploaded = 0;
    let uploadProgress = {  };

    this.data.uploadImageList.forEach((it, index) => {
      let uploadTask = wx.uploadFile({
        url: config.server + '/api/photo/upload', 
        header: { sessionId: app.globalData.sessionId },
        filePath: it,
        name: 'file',
        formData: {
          'tags': this.data.tagList.map(it => it.selected ? it.name : '').filter(it => it).join(','),
          'location': ((this.data.checkedLocation.ad_info || {}).province) || '',
          'address': this.data.checkedLocation.address
        },
        success: res => {
          uploaded ++;
          if (uploaded == this.data.uploadImageList.length) {
            wx.removeStorageSync("pois")
            wx.removeStorageSync("checkedLocation")
            wx.removeStorageSync("uploadImageList")

            wx.navigateTo({
              url: "../index/index"
            })
          }
        }
      })

      uploadTask.onProgressUpdate((res) => {
        uploadProgress[index] = res.progress;
        this.setData({ uploadProgress: uploadProgress })
      })
    });
  }
})