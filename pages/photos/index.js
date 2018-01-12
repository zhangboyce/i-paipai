Page({
  data: { tag: '', location: '' },

  onLoad: function (options) {
    this.setData({ tag: options.tag || '', location: options.location || '' })
  }
})