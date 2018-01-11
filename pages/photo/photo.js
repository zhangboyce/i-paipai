// pages/photo/photo.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
        var mergeImageArr = util.unique(this.data.uploadImageList,res.tempFilePaths);
        this.setData({
          uploadImageList: mergeImageArr
        });
        wx.setStorage({
          key: "uploadImageList",
          data: mergeImageArr
        })
      }
    })
  }



})