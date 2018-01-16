const app = getApp();

Page({
  data: {
    tags: ['吃饭', '旅游', '食物', '风景', 'uiux', '食物'],
    locations: ['北京', '上海', '三亚', '亚丁','河南'],
    inputValue:'',  // 输入框 默认值 也是搜索关键词
    suggestList:['上海','上火','上山']  // 模拟数据，猜词列表
  },

  onLoad: function(option) {
      this.setData({
        inputValue: option.tag || option.location || option.keyword || ''
      })
  },
 

  /**
   * input 获取输入内容
   */
  inputTyping: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  }
})