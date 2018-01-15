const app = getApp();

Page({
  data: {
    tags: ['吃饭', '旅游', '食物', '风景', 'uiux', '食物'],
    locations: ['北京', '上海', '三亚', '亚丁','河南'],
    showMainWords:'', // 显示标签，地点的关键搜索词开关
    inputValue:'',  // 输入框 默认值
    suggestList:['上海','上火','上山']  // 模拟数据，猜词列表
  },

  onLoad: function(option) {
      console.log("option lacation:"+option.location);
      console.log("option tag:"+option.tag);
      this.setData({
        inputValue: option.tag || option.location || ''
      })
      this.setData({
        showMainWords: this.data.inputValue
      })
  },
 
  /**
   * input 获取焦点
   */
  inputFocus: function() {
    console.log(app);
  },
  /**
   * input 获取输入内容
   */
  inputTyping: function(e) {
    this.setData({
      showMainWords: e.detail.value
    })
    console.log("正在输入:" + this.data.showMainWords);
  }
})