const app = getApp();

Page({
  data: {
    tags: ['吃饭', '旅游', '食物', '风景', 'uiux', '食物'],
    locations: ['北京', '上海', '三亚', '亚丁','河南'],
    showMainWords:true, // 显示标签，地点的关键搜索词开关
    inputValue:'',  // 输入框 默认值
    suggestList:['上海','上火','上山']  // 模拟数据，猜词列表
  },

  onLoad: function() {

  },
  /**
   * input 获取焦点
   */
  inputFocus: function() {
   
  },
  /**
   * input 获取输入内容
   */
  inputTyping: function(e) {
    this.setData({
      showMainWords: false
    })
    console.log("正在输入:"+e.detail.value);
  }
})