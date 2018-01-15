Page({
  data: { tag: '', location: ''},

  onLoad: function (options) {
    this.setData({ tag: options.tag || '', location: options.location || '' })
  },
  closeInput: function (){
    // wx.navigateTo({
    //   url: '/pages/search/index',
    // })
    wx.redirectTo({
      url: '/pages/search/index',
    })
    
  },
  reloadInput: function (){
      console.log("reload");
      wx.redirectTo({
        url: "/pages/search/index?location=" + this.data.location+"&tag="+this.data.tag,
      })

      // wx.navigateTo({
      //   url: "/pages/search/index?location=" + this.data.location + "&tag=" + this.data.tag,
      // })
  }
})