Page({
  data: { tag: '', location: ''},

  onLoad: function (options) {
    this.setData({ tag: options.tag || '', location: options.location || '' })
  },
  closeInput: function (){
    console.log("close");
    wx.navigateBack({
      delta: 1
    })
  },
  reloadInput: function (){
      console.log("reload");
  }
})