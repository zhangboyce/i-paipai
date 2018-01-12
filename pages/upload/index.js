// pages/photo/photo.js
var util = require('../../utils/util.js');
var QQMapWX = require('../../lib/qqmap-wx-jssdk.min.js');
Page({

  /**
   * 页面的初始数据
   *   VPWBZ-ETKRP-B75D5-LO3GI-W4HYQ-RCFLH
   */
  data: {
    latitude: 0, //纬度，浮点数，范围为-90~90，负数表示南纬
    longitude: 0, //经度，浮点数，范围为-180~180，负数表示西经
    currentLocation: "所在位置"  //当前地理位置
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    /**
     * 获取当前位置的纬度，经度
     */
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
        this.getLoaction();
      }
    })

    /**
     * 获取本地图片缓存列表
     */
    wx.getStorage({
      key: 'uploadImageList',
      success: res => {
        if (res.data.length > 0) {
          this.setData({
            uploadImageList: res.data
          });
        }
      },
      fail: () => {
      }
    });
  },

  /**
  * 预览图片
  */
  imgPreview: function (event) {
    var src = event.currentTarget.dataset.src;
    var urlList = this.data.uploadImageList;
    wx.previewImage({
      current: src,
      urls: urlList
    })
  },

  /**
   * 删除图片
   */
  deleteImage: function (event) {
    wx.showModal({
      title: '',
      content: '确定要删除吗？',
      success: (res) => {
        if (res.confirm) {
          var imageIndex = event.currentTarget.dataset.index;
          this.data.uploadImageList.splice(imageIndex, 1);
          this.setData({
            uploadImageList: this.data.uploadImageList
          });
          wx.setStorage({
            key: "uploadImageList",
            data: this.data.uploadImageList
          })
        } else if (res.cancel) {
        }
      }
    })
  },

  /**
    * 添加图片－－选择添加图片方式
    */
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

  /**
  * 添加图片 添加图片后结果处理，最多9张，截取前9张
  */
  chooseWxImage: function (type) {
    wx.chooseImage({
      sizeType: ['compressed'],
      sourceType: [type],
      success: (res) => {
        var mergeImageArr = util.unique(this.data.uploadImageList, res.tempFilePaths);
        if (mergeImageArr.length > 9) {
          mergeImageArr = mergeImageArr.splice(0, 9);
        }
        this.setData({
          uploadImageList: mergeImageArr
        });
        wx.setStorage({
          key: "uploadImageList",
          data: mergeImageArr
        })
      }
    })
  },

  /**
  * 获取当前地理位置
  */
  getLoaction: function () {
    var qqMapService = new QQMapWX({
      key: 'VPWBZ-ETKRP-B75D5-LO3GI-W4HYQ-RCFLH'
    });
    qqMapService.reverseGeocoder({
      location: {
        latitude: this.data.latitude,
        longitude: this.data.longitude
      },
      coord_type: 5,   //5 [默认]腾讯、google、高德坐标
      get_poi: 1,      //是否返回周边POI列表：
      success: (res) => {
        if (res.status == 0) {
          // this.setData({
          //   currentLocation: res.result.address
          // });
          //  res.result.ad_info.province
          var poisList = res.result.pois;
          var noLocation = {title:"所在位置"};
          var province = { title: res.result.ad_info.province};
          poisList.unshift(noLocation, province);
          wx.setStorage({
            key: "pois",
            data: poisList
          })
          wx.setStorage({
            key: "location",
            data: noLocation.title
          })
        }
      },
      fail: function (res) {
      },
      complete: function (res) {
      }
    });
  },

  /**
   * 跳转页面到 地理位置列表和搜索页面
   */
  toLocation: function () {
    wx.navigateTo({
      url: "../location/index?latitude=" + this.data.latitude + "&longitude=" + this.data.longitude
    })
  }

})