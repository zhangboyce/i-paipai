Page({
  data: { tag: '', location: '', keyword: '' },

  onLoad: function (options) {
    this.setData({
      tag: options.tag || '', location: options.location || '', keyword: options.keyword || ''})
  },
  closeInput: function () {
    wx.navigateBack()
  },
  reloadInput: function () {
    wx.navigateBack()
    // wx.redirectTo({
    //   url: "/pages/search/index?location=" + this.data.location + "&tag=" + this.data.tag + "&keyword=" + this.data.keyword,
    // })
  }
})